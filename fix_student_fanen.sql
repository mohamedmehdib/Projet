-- ==============================================================================
-- REPAIR SCRIPT: Fix Student 'admin@fanen.tn' with Password = Matricule
-- Execute in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rsfdfagvoagmrfppkbtn/sql/new
-- ==============================================================================

-- 1. Nettoyer les enregistrements corrompus pour 'admin@fanen.tn'
DO $$
DECLARE
    target_id UUID;
BEGIN
    SELECT id INTO target_id FROM auth.users WHERE lower(email) = 'admin@fanen.tn';
    
    IF target_id IS NOT NULL THEN
        DELETE FROM auth.identities WHERE user_id = target_id;
        DELETE FROM public.profiles WHERE id = target_id;
        DELETE FROM auth.users WHERE id = target_id;
        RAISE NOTICE 'Ancien compte supprimé.';
    ELSE
        DELETE FROM auth.identities WHERE lower(provider_id) = 'admin@fanen.tn';
        DELETE FROM public.profiles WHERE lower(email) = 'admin@fanen.tn';
    END IF;
END $$;

-- 2. Recréer l'étudiant avec Mot de Passe = Matricule
DO $$
DECLARE
    new_id UUID := gen_random_uuid();
    identity_id UUID := gen_random_uuid();
    student_matricule TEXT := 'ETU-2026-001';
    -- Le mot de passe est EXACTEMENT le matricule de l'étudiant
    hashed_pwd TEXT := crypt(student_matricule, gen_salt('bf'));
BEGIN
    -- Création dans auth.users
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
        new_id,
        'authenticated',
        'authenticated',
        'admin@fanen.tn',
        hashed_pwd,
        NOW(),
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        jsonb_build_object(
            'nom', 'Fanen',
            'prenom', 'Etudiant',
            'role', 'Etudiant',
            'matricule', student_matricule
        ),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    );

    -- Création dans auth.identities
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
        identity_id,
        new_id,
        jsonb_build_object('sub', new_id::text, 'email', 'admin@fanen.tn'),
        'email',
        'admin@fanen.tn',
        NOW(),
        NOW(),
        NOW()
    );

    -- Création du profil public
    INSERT INTO public.profiles (
        id,
        email,
        nom,
        prenom,
        role,
        matricule,
        created_at,
        updated_at
    ) VALUES (
        new_id,
        'admin@fanen.tn',
        'Fanen',
        'Etudiant',
        'Etudiant'::public.user_role,
        student_matricule,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'Etudiant'::public.user_role,
        nom = EXCLUDED.nom,
        prenom = EXCLUDED.prenom,
        matricule = student_matricule;

    RAISE NOTICE 'Compte étudiant admin@fanen.tn créé avec succès ! Mot de passe = %', student_matricule;
END $$;
