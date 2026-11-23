-- Drop old broken function
DROP FUNCTION IF EXISTS public.create_new_user(text,text,text,text,text,text,text,text,text);

-- Recreate with auth.identities insertion
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

  -- 1. Insert into auth.users with all required token placeholders
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
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    lower(trim(p_email)),
    v_encrypted_pw,
    NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
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
    NOW(),
    '',
    '',
    '',
    ''
  );

  -- 2. MANDATORY FOR GOTRUE: Insert corresponding identity record
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    v_user_id::text,
    v_user_id,
    jsonb_build_object('sub', v_user_id::text, 'email', lower(trim(p_email))),
    'email',
    lower(trim(p_email)),
    NOW(),
    NOW(),
    NOW()
  );

  -- 3. Insert or update public.profiles
  INSERT INTO public.profiles (
    id,
    email,
    nom,
    prenom,
    role,
    matricule,
    grade,
    specialite,
    bureau,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    lower(trim(p_email)),
    p_nom,
    p_prenom,
    p_role::public.user_role,
    p_matricule,
    p_grade,
    p_specialite,
    p_bureau,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    nom = EXCLUDED.nom,
    prenom = EXCLUDED.prenom,
    role = EXCLUDED.role,
    matricule = EXCLUDED.matricule,
    grade = EXCLUDED.grade,
    specialite = EXCLUDED.specialite,
    bureau = EXCLUDED.bureau;

  RETURN jsonb_build_object(
    'id', v_user_id,
    'email', lower(trim(p_email)),
    'role', p_role,
    'nom', p_nom,
    'prenom', p_prenom
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.create_new_user TO anon, authenticated, service_role;
