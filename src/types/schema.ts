// ==========================================
// 5. ENUMERATIONS
// ==========================================
export type TypeSeance = "COURS" | "TD" | "TP";

export type TypeSalle = "COURS" | "TP";

export type Jour = "LUNDI" | "MARDI" | "MERCREDI" | "JEUDI" | "VENDREDI" | "SAMEDI";

export type UserRole =
  | "Enseignant"
  | "Etudiant"
  | "Secretaire"
  | "SuperAdmin"
  | "DirecteurDepartement"
  | "DirecteurEtablissement";

// ==========================================
// 1. USER HIERARCHY (Inheritance from Utilisateur)
// ==========================================
export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  photo: string;
}

export interface Enseignant extends Utilisateur {
  grade: string;
  specialite: string;
}

export interface Etudiant extends Utilisateur {
  matricule: string;
  dateInscription: string; // Date
}

export interface Secretaire extends Utilisateur {
  bureau: string;
}

export interface SuperAdmin extends Utilisateur {}

export interface DirecteurDepartement extends Utilisateur {}

export interface DirecteurEtablissement extends Utilisateur {}

// Convenient unified User interface for session and UI states
export interface User extends Utilisateur {
  role: UserRole;
  matricule?: string;
  dateInscription?: string;
  grade?: string;
  specialite?: string;
  bureau?: string;
}

// ==========================================
// 2. WISHES MANAGEMENT (FichierVoeux)
// ==========================================
export interface FichierVoeux {
  id: number;
  anneeUniversitaire: string;
  semestre: string;
  dateDepot: string; // Date
  statut: string;
}

export interface VoeuMatiere {
  id: number;
  priorite: number;
  typeSeance: TypeSeance;
  volumeHoraire: number; // float
}

export interface FicheVoeuxMatiere extends FichierVoeux {
  voeuxMatiere: VoeuMatiere[];
}

export interface VoeuEmploi {
  id: number;
  jour: Jour;
  heureDebut: string; // Time
  heureFin: string; // Time
  disponible: boolean;
}

export interface FicheVoeuxEmploi extends FichierVoeux {
  voeuxEmploi: VoeuEmploi[];
}

// ==========================================
// 3. TIMETABLE & ACADEMIC STRUCTURE
// ==========================================
export interface Matiere {
  id: number;
  code: string;
  intitule: string;
}

export interface Salle {
  id: number;
  numero: string;
  capacite: number;
  type: TypeSalle;
}

export interface GroupeTP {
  id: number;
  nom: string;
  capacite: number;
}

export interface Classe {
  id: number;
  nom: string;
  niveau: string;
  effectif: number;
}

export interface Seance {
  id: number;
  jour: Jour;
  heureDebut: string; // Time
  heureFin: string; // Time
  type: TypeSeance;
  colorVariant?: "blue" | "purple" | "green" | "amber";
}

export interface EmploiDuTemps {
  id: number;
  semestre: string;
  anneeUniversitaire: string;
}

export interface Absence {
  id: number;
  date: string; // Date
  motif: string;
  justifiee: boolean;
  etudiantId?: number;
  seanceId?: number;
}

// ==========================================
// 4. INSTITUTION STRUCTURE
// ==========================================
export interface Offre {
  id: number;
  intitule: string;
  niveau: string;
  description: string;
}

export interface DateInscription {
  id: number;
  anneeUniversitaire: string;
  dateDebut: string; // Date
  dateFin: string; // Date
}

export interface Departement {
  id: number;
  nom: string;
  code: string;
}

export interface Institut {
  id: number;
  nom: string;
  adresse: string;
  telephone: number | null;
}
