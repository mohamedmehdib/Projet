-- Allow inserts/updates for initial seeding or authenticated users
CREATE POLICY "Allow public insert to departements" ON public.departements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to classes" ON public.classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to salles" ON public.salles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to matieres" ON public.matieres FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to seances" ON public.seances FOR INSERT WITH CHECK (true);

-- Also allow reading without auth if needed for public schedules
CREATE POLICY "Allow public read departements" ON public.departements FOR SELECT USING (true);
CREATE POLICY "Allow public read classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Allow public read salles" ON public.salles FOR SELECT USING (true);
CREATE POLICY "Allow public read matieres" ON public.matieres FOR SELECT USING (true);
CREATE POLICY "Allow public read seances" ON public.seances FOR SELECT USING (true);

-- Fix trigger for handle_new_user if it had any issue:
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nom, prenom, role, matricule, grade, specialite, bureau)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'nom', ''),
    COALESCE(new.raw_user_meta_data->>'prenom', ''),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'Etudiant'::user_role),
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
