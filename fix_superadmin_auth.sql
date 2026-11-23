-- =========================================================================
-- Script de réparation pour l'utilisateur superadmin@gmail.com
-- À exécuter dans la console Supabase SQL Editor :
-- https://supabase.com/dashboard/project/rsfdfagvoagmrfppkbtn/sql/new
-- =========================================================================

-- 1. Supprimer l'entrée orpheline / corrompue dans auth.users
DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'superadmin@gmail.com');
DELETE FROM public.profiles WHERE email = 'superadmin@gmail.com';
DELETE FROM auth.users WHERE email = 'superadmin@gmail.com';

-- 2. Créer les politiques RLS nécessaires pour la table profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Allow public select on profiles'
  ) THEN
    CREATE POLICY "Allow public select on profiles" ON public.profiles FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Allow insert and update for authenticated on profiles'
  ) THEN
    CREATE POLICY "Allow insert and update for authenticated on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 3. Insérer proprement l'utilisateur SuperAdmin avec auth.users ET auth.identities
DO $$
DECLARE
  v_user_id UUID := 'a0000000-0000-0000-0000-000000000001'::uuid;
  v_encrypted_pw TEXT;
BEGIN
  -- Mot de passe: admin123
  v_encrypted_pw := crypt('admin123', gen_salt('bf'));

  -- Insertion dans auth.users
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
    'superadmin@gmail.com',
    v_encrypted_pw,
    NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"nom": "Admin", "prenom": "Système", "role": "SuperAdmin"}'::jsonb,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

  -- Insertion indispensable dans auth.identities (pour que GoTrue puisse requêter sans crash)
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    v_user_id::text,
    v_user_id,
    jsonb_build_object('sub', v_user_id::text, 'email', 'superadmin@gmail.com'),
    'email',
    NOW(),
    NOW(),
    NOW()
  );

  -- Insertion dans public.profiles
  INSERT INTO public.profiles (
    id,
    nom,
    prenom,
    email,
    role,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'Admin',
    'Système',
    'superadmin@gmail.com',
    'SuperAdmin',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'SuperAdmin',
    nom = 'Admin',
    prenom = 'Système';

END $$;
