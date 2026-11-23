-- Helper to create users directly without hitting SMTP rate limit in development
CREATE OR REPLACE FUNCTION public.create_new_user(
  p_email TEXT,
  p_password TEXT,
  p_nom TEXT DEFAULT '',
  p_prenom TEXT DEFAULT '',
  p_role TEXT DEFAULT 'Etudiant',
  p_matricule TEXT DEFAULT NULL,
  p_grade TEXT DEFAULT NULL,
  p_specialite TEXT DEFAULT NULL,
  p_bureau TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_encrypted_pw TEXT;
BEGIN
  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = lower(trim(p_email))) THEN
    RAISE EXCEPTION 'Cet utilisateur existe déjà.';
  END IF;

  v_user_id := gen_random_uuid();
  v_encrypted_pw := crypt(p_password, gen_salt('bf'));

  -- Insert directly into auth.users (email_confirmed_at set to NOW so no email limit is hit)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    lower(trim(p_email)),
    v_encrypted_pw,
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object(
      'nom', p_nom,
      'prenom', p_prenom,
      'role', p_role,
      'matricule', p_matricule,
      'grade', p_grade,
      'specialite', p_specialite,
      'bureau', p_bureau
    ),
    NOW(),
    NOW()
  );

  RETURN jsonb_build_object(
    'id', v_user_id,
    'email', lower(trim(p_email)),
    'role', p_role,
    'nom', p_nom,
    'prenom', p_prenom
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution to anon and authenticated
GRANT EXECUTE ON FUNCTION public.create_new_user TO anon, authenticated;
