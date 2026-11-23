import { createClient } from "@supabase/supabase-js";
import {
  MOCK_DEPARTEMENTS,
  MOCK_CLASSES,
  MOCK_SALLES,
  MOCK_MATIERES,
  HARDCODED_USERS,
} from "../src/lib/mockData.js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rsfdfagvoagmrfppkbtn.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzZmRmYWd2b2FnbXJmcHBrYnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ4NjY5MjQsImV4cCI6MjExMDQ0MjkyNH0.rDNiN8EN63Ao153TrvSyn0H9_NkM1AeDZxD01CQOfVQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function seed() {
  console.log("--- Seeding Users into Supabase Auth & Profiles ---");
  for (const u of HARDCODED_USERS) {
    console.log(`Creating user: ${u.email} (${u.role})...`);
    const { data, error } = await supabase.auth.signUp({
      email: u.email,
      password: u.motDePasse || "password123",
      options: {
        data: {
          nom: u.nom,
          prenom: u.prenom,
          role: u.role,
          matricule: u.matricule || null,
          grade: u.grade || null,
          specialite: u.specialite || null,
          bureau: u.bureau || null,
        },
      },
    });
    if (error) {
      console.warn(`User ${u.email} notice:`, error.message);
    } else {
      console.log(`User ${u.email} signed up successfully (ID: ${data.user?.id})`);
    }
  }

  console.log("\n--- Seeding Departements ---");
  for (const dep of MOCK_DEPARTEMENTS) {
    const { data, error } = await supabase.from("departements").upsert(
      { id: dep.id, nom: dep.nom, code: dep.code },
      { onConflict: "code" }
    );
    if (error) console.error("Error inserting dep:", error);
    else console.log(`Dep ${dep.nom} ok`);
  }

  console.log("\n--- Seeding Classes ---");
  for (const cls of MOCK_CLASSES) {
    const { data, error } = await supabase.from("classes").upsert(
      { id: cls.id, nom: cls.nom, niveau: cls.niveau, effectif: cls.effectif },
      { onConflict: "id" }
    );
    if (error) console.error("Error inserting class:", error);
    else console.log(`Class ${cls.nom} ok`);
  }

  console.log("\n--- Seeding Salles ---");
  for (const s of MOCK_SALLES) {
    const { data, error } = await supabase.from("salles").upsert(
      { id: s.id, numero: s.numero, capacite: s.capacite, type: s.type },
      { onConflict: "numero" }
    );
    if (error) console.error("Error inserting salle:", error);
    else console.log(`Salle ${s.numero} ok`);
  }

  console.log("\n--- Seeding Matieres ---");
  for (const m of MOCK_MATIERES) {
    const { data, error } = await supabase.from("matieres").upsert(
      { id: m.id, code: m.code, intitule: m.intitule },
      { onConflict: "code" }
    );
    if (error) console.error("Error inserting matiere:", error);
    else console.log(`Matiere ${m.intitule} ok`);
  }

  console.log("\n--- Seeding Seances ---");
  const seancesData = [
    { jour: "LUNDI", heure_debut: "11:40", heure_fin: "13:10", type: "COURS", matiere_id: 8, salle_id: 1, classe_id: 12 },
    { jour: "LUNDI", heure_debut: "13:15", heure_fin: "14:45", type: "COURS", matiere_id: 9, salle_id: 2, classe_id: 12 },
    { jour: "LUNDI", heure_debut: "14:50", heure_fin: "16:20", type: "COURS", matiere_id: 9, salle_id: 2, classe_id: 12 },
    { jour: "MARDI", heure_debut: "08:30", heure_fin: "10:00", type: "TP", matiere_id: 4, salle_id: 7, classe_id: 12 },
    { jour: "MARDI", heure_debut: "10:05", heure_fin: "11:35", type: "COURS", matiere_id: 10, salle_id: 3, classe_id: 12 },
    { jour: "MARDI", heure_debut: "11:40", heure_fin: "13:10", type: "COURS", matiere_id: 6, salle_id: 4, classe_id: 12 },
    { jour: "MARDI", heure_debut: "13:15", heure_fin: "14:45", type: "TP", matiere_id: 7, salle_id: 7, classe_id: 12 },
    { jour: "MERCREDI", heure_debut: "08:30", heure_fin: "10:00", type: "TP", matiere_id: 6, salle_id: 8, classe_id: 12 },
    { jour: "MERCREDI", heure_debut: "10:05", heure_fin: "11:35", type: "TP", matiere_id: 6, salle_id: 8, classe_id: 12 },
    { jour: "MERCREDI", heure_debut: "11:40", heure_fin: "13:10", type: "COURS", matiere_id: 5, salle_id: 5, classe_id: 12 },
    { jour: "JEUDI", heure_debut: "08:30", heure_fin: "10:00", type: "TP", matiere_id: 5, salle_id: 5, classe_id: 12 },
    { jour: "JEUDI", heure_debut: "10:05", heure_fin: "11:35", type: "TP", matiere_id: 5, salle_id: 5, classe_id: 12 },
    { jour: "JEUDI", heure_debut: "11:40", heure_fin: "13:10", type: "TP", matiere_id: 7, salle_id: 7, classe_id: 12 },
    { jour: "JEUDI", heure_debut: "13:15", heure_fin: "14:45", type: "TP", matiere_id: 7, salle_id: 7, classe_id: 12 },
    { jour: "VENDREDI", heure_debut: "08:30", heure_fin: "10:00", type: "COURS", matiere_id: 2, salle_id: 1, classe_id: 12 },
    { jour: "VENDREDI", heure_debut: "10:05", heure_fin: "11:35", type: "TP", matiere_id: 3, salle_id: 6, classe_id: 12 }
  ];

  for (const s of seancesData) {
    const { error } = await supabase.from("seances").insert([s]);
    if (error) console.error("Error inserting seance:", error);
  }
  console.log("Seances seeded!");
}

seed().catch(console.error);
