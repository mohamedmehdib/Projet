-- Run this in Supabase SQL Editor:
DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'directeur_added_student@gmail.com');
DELETE FROM public.profiles WHERE email = 'directeur_added_student@gmail.com';
DELETE FROM auth.users WHERE email = 'directeur_added_student@gmail.com';
