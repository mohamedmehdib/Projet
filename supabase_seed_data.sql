-- Direct SQL Seeding for UniPlan / ISET

-- 1. Policies update
DO $$ BEGIN
    CREATE POLICY "Allow anon insert departements" ON public.departements FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow anon insert classes" ON public.classes FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow anon insert salles" ON public.salles FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow anon insert matieres" ON public.matieres FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow anon insert seances" ON public.seances FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Departements
INSERT INTO public.departements (id, nom, code) VALUES
(1, 'Technologies de l''Informatique', 'TI'),
(2, 'Génie Mécanique', 'GM'),
(3, 'Génie Électrique', 'GE'),
(4, 'Sciences Économiques et Gestion', 'SEG')
ON CONFLICT (code) DO NOTHING;

-- 3. Classes
INSERT INTO public.classes (id, nom, niveau, effectif, departement_id) VALUES
(1, 'TI1.1', '1ère Année Licence', 32, 1),
(2, 'TI1.2', '1ère Année Licence', 30, 1),
(3, 'DSI2.1', '2ème Année Licence DSI', 28, 1),
(4, 'DSI2.2', '2ème Année Licence DSI', 26, 1),
(5, 'SEM2.1', '2ème Année Licence SEM', 25, 1),
(6, 'RSI2.1', '2ème Année Licence RSI', 27, 1),
(12, 'DSI3.3', '3ème Année Licence DSI', 28, 1)
ON CONFLICT (id) DO NOTHING;

-- 4. Salles
INSERT INTO public.salles (id, numero, capacite, type) VALUES
(1, 'C001', 60, 'COURS'),
(2, 'C104', 50, 'COURS'),
(3, 'C003', 45, 'COURS'),
(4, 'C004', 45, 'COURS'),
(5, 'LI1.5', 25, 'TP'),
(6, 'LI2.1', 25, 'TP'),
(7, 'LI2.3', 25, 'TP'),
(8, 'LI2.6', 25, 'TP')
ON CONFLICT (numero) DO NOTHING;

-- 5. Matieres
INSERT INTO public.matieres (id, code, intitule) VALUES
(1, 'DEV-MOB-1', 'Développement Mobile Natif'),
(2, 'GLA-01', 'Génie Logiciel Avancé ( CI )'),
(3, 'ADMIN-SEC-01', 'Administration Systèmes & Sécurité ( TP )'),
(4, 'INT-PROJ-01', 'Projet d''Intégration ( TP )'),
(5, 'BI-UX-01', 'Atelier: Business Intelligence / UI-UX Design ( TP )'),
(6, 'SOA-01', 'Architectures Orientées Services SOA ( CI / TP )'),
(7, 'ML-01', 'Atelier Fondements Machine Learning ( TP )'),
(8, 'MCO-01', 'Méthodologie de Conception Objet ( CI )'),
(9, 'TRE-01', 'Techniques de recherche d''emploi & marketing ( CI )'),
(10, 'TOEIC-01', 'Preparing TOEIC ( CI )')
ON CONFLICT (code) DO NOTHING;

-- 6. Seances
INSERT INTO public.seances (jour, heure_debut, heure_fin, type, color_variant, matiere_id, salle_id, classe_id) VALUES
('LUNDI', '11:40', '13:10', 'COURS', 'blue', 8, 1, 12),
('LUNDI', '13:15', '14:45', 'COURS', 'amber', 9, 2, 12),
('LUNDI', '14:50', '16:20', 'COURS', 'amber', 9, 2, 12),
('MARDI', '08:30', '10:00', 'TP', 'green', 4, 7, 12),
('MARDI', '10:05', '11:35', 'COURS', 'purple', 10, 3, 12),
('MARDI', '11:40', '13:10', 'COURS', 'blue', 6, 4, 12),
('MARDI', '13:15', '14:45', 'TP', 'green', 7, 7, 12),
('MERCREDI', '08:30', '10:00', 'TP', 'green', 6, 8, 12),
('MERCREDI', '10:05', '11:35', 'TP', 'green', 6, 8, 12),
('MERCREDI', '11:40', '13:10', 'COURS', 'blue', 5, 5, 12),
('JEUDI', '08:30', '10:00', 'TP', 'green', 5, 5, 12),
('JEUDI', '10:05', '11:35', 'TP', 'green', 5, 5, 12),
('JEUDI', '11:40', '13:10', 'TP', 'green', 7, 7, 12),
('JEUDI', '13:15', '14:45', 'TP', 'green', 7, 7, 12),
('VENDREDI', '08:30', '10:00', 'COURS', 'blue', 2, 1, 12),
('VENDREDI', '10:05', '11:35', 'TP', 'green', 3, 6, 12);
