-- ==============================================================================
-- FIX RLS: Permettre aux administrateurs (DirecteurEtablissement, SuperAdmin, Secretaire)
-- de mettre à jour et gérer tous les profils dans Supabase
-- Exécutez ce script dans votre Supabase Dashboard -> SQL Editor (sur le projet rsfdfagvoagmrfppkbtn)
-- ==============================================================================

-- 1. Supprimer les anciennes politiques UPDATE / DELETE restrictives sur profiles
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow all for profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public select on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;

-- 2. Politique de lecture : tous les utilisateurs authentifiés peuvent voir les profils
CREATE POLICY "Public profiles are viewable by authenticated users"
ON public.profiles FOR SELECT TO authenticated
USING (true);

-- 3. Politique d'insertion : création de profil
CREATE POLICY "Allow authenticated insert profiles"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (true);

-- 4. Politique de mise à jour (UPDATE) :
-- Permet à l'utilisateur de mettre à jour son propre profil
-- ET permet aux administrateurs (DirecteurEtablissement, SuperAdmin, Secretaire) de modifier n'importe quel profil !
CREATE POLICY "Allow update profiles"
ON public.profiles FOR UPDATE TO authenticated
USING (
    auth.uid() = id
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('DirecteurEtablissement', 'SuperAdmin', 'Secretaire')
    )
    OR (auth.jwt()->'user_metadata'->>'role') IN ('DirecteurEtablissement', 'SuperAdmin', 'Secretaire')
)
WITH CHECK (
    auth.uid() = id
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('DirecteurEtablissement', 'SuperAdmin', 'Secretaire')
    )
    OR (auth.jwt()->'user_metadata'->>'role') IN ('DirecteurEtablissement', 'SuperAdmin', 'Secretaire')
);

-- 5. Politique de suppression (DELETE) :
-- Permet aux administrateurs de supprimer un profil
CREATE POLICY "Allow delete profiles"
ON public.profiles FOR DELETE TO authenticated
USING (
    auth.uid() = id
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('DirecteurEtablissement', 'SuperAdmin', 'Secretaire')
    )
    OR (auth.jwt()->'user_metadata'->>'role') IN ('DirecteurEtablissement', 'SuperAdmin', 'Secretaire')
);

-- 6. Accorder tous les privilèges sur la table profiles
GRANT ALL ON TABLE public.profiles TO authenticated, anon, service_role;
