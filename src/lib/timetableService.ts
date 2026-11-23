import { createClient } from "@/lib/supabase/client";

export interface SeanceView {
  id: number;
  jour: string; // "Lundi", "Mardi", etc.
  timeSlot: string; // e.g. "08H30 10H00"
  matiere: string;
  enseignant: string;
  salle: string;
  groupe: string;
  type?: string;
  classeId?: number;
  enseignantId?: string | null;
  salleId?: number | null;
  matiereId?: number;
  colorVariant?: string;
  raw?: any;
}

export const TIME_SLOTS = [
  { timeLabel: "08H30 10H00", timeRange: "08:30 – 10:00", debut: "08:30", fin: "10:00" },
  { timeLabel: "10H05 11H35", timeRange: "10:05 – 11:35", debut: "10:05", fin: "11:35" },
  { timeLabel: "11H40 13H10", timeRange: "11:40 – 13:10", debut: "11:40", fin: "13:10" },
  { timeLabel: "13H15 14H45", timeRange: "13:15 – 14:45", debut: "13:15", fin: "14:45" },
  { timeLabel: "14H50 16H20", timeRange: "14:50 – 16:20", debut: "14:50", fin: "16:20" },
  { timeLabel: "16H25 17H55", timeRange: "16:25 – 17:55", debut: "16:25", fin: "17:55" },
];

export const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"] as const;

export function formatJour(rawJour: string): string {
  if (!rawJour) return "Lundi";
  const lower = rawJour.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function matchTimeSlot(heureDebut: string, heureFin: string): string {
  const cleanDebut = (heureDebut || "08:30").slice(0, 5); // "08:30:00" -> "08:30"
  const cleanFin = (heureFin || "10:00").slice(0, 5);

  const slot = TIME_SLOTS.find((s) => s.debut === cleanDebut);
  if (slot) return slot.timeLabel;

  // fallback formatting
  const d = cleanDebut.replace(":", "H");
  const f = cleanFin.replace(":", "H");
  return `${d} ${f}`;
}

export interface TimetableFilter {
  classeId?: number;
  enseignantId?: string;
  salleId?: number;
}

export async function fetchLiveTimetable(filter?: number | TimetableFilter): Promise<SeanceView[]> {
  const supabase = createClient();
  let query = supabase
    .from("seances")
    .select(
      `
      id,
      jour,
      heure_debut,
      heure_fin,
      type,
      color_variant,
      matiere_id,
      salle_id,
      classe_id,
      enseignant_id,
      matieres (id, intitule, code),
      salles (id, numero, capacite, type),
      classes (id, nom, niveau, effectif),
      profiles (id, nom, prenom, email)
    `
    );

  if (typeof filter === "number") {
    query = query.eq("classe_id", filter);
  } else if (filter) {
    if (filter.classeId) query = query.eq("classe_id", filter.classeId);
    if (filter.enseignantId) query = query.eq("enseignant_id", filter.enseignantId);
    if (filter.salleId) query = query.eq("salle_id", filter.salleId);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error("Error fetching live seances:", error);
    return [];
  }

  return data.map((item: any) => {
    const enseignantNom = item.profiles
      ? `${item.profiles.prenom} ${item.profiles.nom}`.trim()
      : "Non assigné";

    return {
      id: item.id,
      jour: formatJour(item.jour),
      timeSlot: matchTimeSlot(item.heure_debut, item.heure_fin),
      matiere: item.matieres?.intitule || "Matière",
      enseignant: enseignantNom,
      salle: item.salles?.numero || "Salle",
      groupe: item.classes?.nom ? `${item.classes.nom} ( T )` : "Groupe",
      type: item.type,
      classeId: item.classe_id,
      enseignantId: item.enseignant_id,
      salleId: item.salle_id,
      matiereId: item.matiere_id,
      colorVariant: item.color_variant,
      raw: item,
    };
  });
}
