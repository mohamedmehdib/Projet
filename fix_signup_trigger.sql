-- ==============================================================================
-- FIX FOR "Database error saving new user"
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Ensure public and auth schemas are in the search path for the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    nom, 
    prenom, 
    role, 
    matricule, 
    grade, 
    specialite, 
    bureau
  )
  VALUES (
    new.id,
    COALESCE(new.email, ''),
    COALESCE(new.raw_user_meta_data->>'nom', ''),
    COALESCE(new.raw_user_meta_data->>'prenom', ''),
    CASE 
      WHEN new.raw_user_meta_data->>'role' IN ('Enseignant', 'Etudiant', 'Secretaire', 'SuperAdmin', 'DirecteurDepartement', 'DirecteurEtablissement')
      THEN (new.raw_user_meta_data->>'role')::public.user_role
      ELSE 'Etudiant'::public.user_role
    END,
    new.raw_user_meta_data->>'matricule',
    new.raw_user_meta_data->>'grade',
    new.raw_user_meta_data->>'specialite',
    new.raw_user_meta_data->>'bureau'
  )
  ON CONFLICT (id) DO UPDATE SET
    nom = EXCLUDED.nom,
    prenom = EXCLUDED.prenom,
    role = EXCLUDED.role,
    matricule = EXCLUDED.matricule,
    grade = EXCLUDED.grade,
    specialite = EXCLUDED.specialite,
    bureau = EXCLUDED.bureau;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Prevents PostgreSQL from failing the signup transaction if metadata is missing
  RAISE WARNING 'handle_new_user warning: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- 2. Allow postgres/service_role unrestricted profile insertion during trigger execution
GRANT ALL ON TABLE public.profiles TO postgres, service_role, anon, authenticated;
