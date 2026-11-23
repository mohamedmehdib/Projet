-- ==============================================================================
-- FIX: Safe Deletion of Orphaned or Broken Users in Supabase Auth
-- Run this in your Supabase Dashboard -> SQL Editor
-- (https://supabase.com/dashboard/project/rsfdfagvoagmrfppkbtn/sql/new)
-- ==============================================================================

DO $$
DECLARE
    target_email TEXT := 'test@test.tes';
    target_user_id UUID;
BEGIN
    SELECT id INTO target_user_id FROM auth.users WHERE lower(email) = lower(target_email);

    IF target_user_id IS NOT NULL THEN
        -- Delete from auth.identities first
        DELETE FROM auth.identities WHERE user_id = target_user_id;

        -- Delete from public.profiles if exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
            DELETE FROM public.profiles WHERE id = target_user_id;
        END IF;

        -- Delete from auth.users
        DELETE FROM auth.users WHERE id = target_user_id;
        
        RAISE NOTICE 'Utilisateur % (%) supprimé avec succès !', target_email, target_user_id;
    ELSE
        -- In case target_user_id is not in auth.users but in identities or profiles
        DELETE FROM auth.identities WHERE lower(provider_id) = lower(target_email);
        DELETE FROM public.profiles WHERE lower(email) = lower(target_email);
        RAISE NOTICE 'Utilisateur % nettoyé des profils/identités.', target_email;
    END IF;
END $$;
