import { User, Seance, Absence, Matiere, Salle, GroupeTP, Classe, Departement } from "@/types/schema";

export const DEFAULT_STUDENT: User = {
  id: 1,
  nom: "Ben Salah",
  prenom: "Ali",
  email: "ali.bensalah@iset.tn",
  motDePasse: "••••••••",
  photo: "",
  role: "Etudiant",
  matricule: "ETU-2026-0342",
  dateInscription: "2024-09-15",
};

export interface TimetableSlot {
  timeLabel: string; // e.g. "08H30 10H00"
  timeRange: string;
}

export const TIME_SLOTS: TimetableSlot[] = [
  { timeLabel: "08H30 10H00", timeRange: "08:30 – 10:00" },
  { timeLabel: "10H05 11H35", timeRange: "10:05 – 11:35" },
  { timeLabel: "11H40 13H10", timeRange: "11:40 – 13:10" },
  { timeLabel: "13H15 14H45", timeRange: "13:15 – 14:45" },
  { timeLabel: "14H50 16H20", timeRange: "14:50 – 16:20" },
  { timeLabel: "16H25 17H55", timeRange: "16:25 – 17:55" },
];

export interface GridSession {
  id: number;
  jour: "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi" | "Samedi";
  timeSlot: string; // e.g. "08H30 10H00"
  matiere: string;
  enseignant: string;
  salle: string;
  groupe: string;
  type?: string;
}

// Exactly mirroring the ISET Sousse Timetable portal screenshot
export const ISET_TIMETABLE_DATA: GridSession[] = [
  // Lundi
  {
    id: 101,
    jour: "Lundi",
    timeSlot: "11H40 13H10",
    matiere: "Méthodologie de Conception Objet ( CI )",
    enseignant: "Manel Belarbi",
    salle: "C001",
    groupe: "DSI3.3 ( T )",
  },
  {
    id: 102,
    jour: "Lundi",
    timeSlot: "13H15 14H45",
    matiere: "Tech. de recherche d'emploi et marketing de soi ( CI )",
    enseignant: "Abdelaziz Bouslama",
    salle: "C104",
    groupe: "DSI3.3 ( T )",
  },
  {
    id: 103,
    jour: "Lundi",
    timeSlot: "14H50 16H20",
    matiere: "Tech. de recherche d'emploi et marketing de soi ( CI )",
    enseignant: "Abdelaziz Bouslama",
    salle: "C104",
    groupe: "DSI3.3 ( T )",
  },

  // Mardi
  {
    id: 104,
    jour: "Mardi",
    timeSlot: "08H30 10H00",
    matiere: "Projet d'Intégration ( TP )",
    enseignant: "Adnène Rouatbi",
    salle: "LI2.4",
    groupe: "DSI3.3 ( T )",
  },
  {
    id: 105,
    jour: "Mardi",
    timeSlot: "10H05 11H35",
    matiere: "Preparing TOEIC ( CI )",
    enseignant: "Henda Bedoui",
    salle: "C003",
    groupe: "DSI3.3 ( T )",
  },
  {
    id: 106,
    jour: "Mardi",
    timeSlot: "11H40 13H10",
    matiere: "SOA ( CI )",
    enseignant: "Benene Fradi",
    salle: "C004",
    groupe: "DSI3.3 ( T )",
  },
  {
    id: 107,
    jour: "Mardi",
    timeSlot: "13H15 14H45",
    matiere: "Atlier: Business Intelligence/ UI-UX Design ( TP )",
    enseignant: "Sonia Sahli",
    salle: "LI2.3",
    groupe: "DSI3.3 ( T )",
  },

  // Mercredi
  {
    id: 108,
    jour: "Mercredi",
    timeSlot: "08H30 10H00",
    matiere: "Atelier SOA ( TP )",
    enseignant: "Benene Fradi",
    salle: "LI2.6",
    groupe: "DSI3.3 ( T )",
  },
  {
    id: 109,
    jour: "Mercredi",
    timeSlot: "10H05 11H35",
    matiere: "Atelier fondement machine learning ( TP )",
    enseignant: "Benene Fradi",
    salle: "LI2.6",
    groupe: "DSI3.3 ( T )",
  },
  {
    id: 110,
    jour: "Mercredi",
    timeSlot: "11H40 13H10",
    matiere: "Développement Mobile ( CI )",
    enseignant: "Yassine Kachoukh",
    salle: "LI1.5",
    groupe: "DSI3.3 ( T )",
  },

  // Jeudi
  {
    id: 111,
    jour: "Jeudi",
    timeSlot: "08H30 10H00",
    matiere: "Atelier développement Mobile natif ( TP )",
    enseignant: "Yassine Kachoukh",
    salle: "LI1.5",
    groupe: "DSI3.3 ( T )",
  },
  {
    id: 112,
    jour: "Jeudi",
    timeSlot: "10H05 11H35",
    matiere: "Atelier développement Mobile natif ( TP )",
    enseignant: "Yassine Kachoukh",
    salle: "LI1.5",
    groupe: "DSI3.3 ( T )",
  },
  {
    id: 113,
    jour: "Jeudi",
    timeSlot: "11H40 13H10",
    matiere: "Atlier: Business Intelligence/ UI-UX Design ( TP )",
    enseignant: "Adel Dahmane",
    salle: "LI2.3",
    groupe: "DSI3.3 ( T )",
  },
  {
    id: 114,
    jour: "Jeudi",
    timeSlot: "13H15 14H45",
    matiere: "Atlier: Business Intelligence/ UI-UX Design ( TP )",
    enseignant: "Adel Dahmane",
    salle: "LI2.3",
    groupe: "DSI3.3 ( T )",
  },

  // Vendredi
  {
    id: 115,
    jour: "Vendredi",
    timeSlot: "08H30 10H00",
    matiere: "Génie Logiciel Avancé ( CI )",
    enseignant: "Mounir Dridi",
    salle: "C001",
    groupe: "DSI3.3 ( T )",
  },
  {
    id: 116,
    jour: "Vendredi",
    timeSlot: "10H05 11H35",
    matiere: "Administration Systèmes & Sécurité ( TP )",
    enseignant: "Fatma Zairi",
    salle: "LI2.1",
    groupe: "DSI3.3 ( T )",
  },
];

export const MOCK_STUDENT_ABSENCES: Absence[] = [
  {
    id: 1,
    date: "05/10/2026",
    motif: "Maladie (Certificat médical déposé - SOA)",
    justifiee: true,
  },
  {
    id: 2,
    date: "08/10/2026",
    motif: "Non justifié (Projet d'Intégration)",
    justifiee: false,
  },
  {
    id: 3,
    date: "14/10/2026",
    motif: "Convocation administrative (Atelier Mobile)",
    justifiee: true,
  },
  {
    id: 4,
    date: "22/10/2026",
    motif: "Non justifié (Conception Objet)",
    justifiee: false,
  },
];

// Super Admin Mock Data
export const DEFAULT_SUPER_ADMIN: User = {
  id: 99,
  nom: "Mansouri",
  prenom: "Kamel",
  email: "admin@iset.rnu.tn",
  motDePasse: "••••••••",
  photo: "",
  role: "SuperAdmin",
};

export const MOCK_INSTITUTS = [
  {
    id: 1,
    nom: "Institut Supérieur des Études Technologiques de Sousse (ISET)",
    adresse: "Rue Ibn El Jazzar, BP 65, Sousse Erriadh 4054",
    telephone: 73307960,
  },
  {
    id: 2,
    nom: "Institut Supérieur des Sciences Appliquées et de Technologie de Sousse (ISSAT)",
    adresse: "Cité Taffala, 4003 Sousse",
    telephone: 73382656,
  },
  {
    id: 3,
    nom: "Institut Supérieur de Gestion de Sousse (ISG)",
    adresse: "Rue Abdelaziz El Bahi, BP 763, Sousse 4000",
    telephone: 73234444,
  },
];

export const MOCK_OFFRES = [
  {
    id: 1,
    intitule: "Licence en Développement des Systèmes d'Information (DSI)",
    niveau: "Licence Appliquée - Bac+3",
    description: "Formation de cadres techniques spécialisés dans la conception logicielle, le développement Web/Mobile et le génie logiciel moderne.",
  },
  {
    id: 2,
    intitule: "Licence en Réseaux et Services Informatiques (RSI)",
    niveau: "Licence Appliquée - Bac+3",
    description: "Formation aux architectures réseau, protocoles IP, cloud computing et administration avancée de la cybersécurité.",
  },
  {
    id: 3,
    intitule: "Licence en Systèmes Embarqués et IoT (SE)",
    niveau: "Licence Appliquée - Bac+3",
    description: "Conception de microcontrôleurs, capteurs connectés, automatisation industrielle et programmation bas-niveau C/C++.",
  },
  {
    id: 4,
    intitule: "Mastère Professionnel en Ingénierie Logicielle & DevOps",
    niveau: "Mastère Professionnel - Bac+5",
    description: "Expertise en architectures distribuées, intégration continue CI/CD, cloud orchestration et Big Data.",
  },
];

// ==========================================
// Academic Structure Mock Data
// ==========================================
export const MOCK_MATIERES = [
  { id: 1, code: "DSI301", intitule: "Conception Objet" },
  { id: 2, code: "DSI302", intitule: "Génie Logiciel Avancé" },
  { id: 3, code: "DSI303", intitule: "Administration Systèmes & Sécurité" },
  { id: 4, code: "DSI304", intitule: "Projet d'Intégration" },
  { id: 5, code: "DSI305", intitule: "Développement Mobile" },
  { id: 6, code: "DSI306", intitule: "SOA" },
  { id: 7, code: "DSI307", intitule: "Business Intelligence / UI-UX Design" },
  { id: 8, code: "DSI308", intitule: "Méthodologie de Conception Objet (CI)" },
  { id: 9, code: "DSI309", intitule: "Tech. de recherche d'emploi et marketing de soi (CI)" },
  { id: 10, code: "DSI310", intitule: "Preparing TOEIC (CI)" },
];

export const MOCK_SALLES = [
  { id: 1, numero: "C001", capacite: 60, type: "COURS" as const },
  { id: 2, numero: "C104", capacite: 60, type: "COURS" as const },
  { id: 3, numero: "C003", capacite: 40, type: "COURS" as const },
  { id: 4, numero: "C004", capacite: 40, type: "COURS" as const },
  { id: 5, numero: "LI1.5", capacite: 30, type: "TP" as const },
  { id: 6, numero: "LI2.1", capacite: 30, type: "TP" as const },
  { id: 7, numero: "LI2.3", capacite: 30, type: "TP" as const },
  { id: 8, numero: "LI2.4", capacite: 30, type: "TP" as const },
  { id: 9, numero: "LI2.6", capacite: 30, type: "TP" as const },
];

export const MOCK_GROUPES_TP = [
  { id: 1, nom: "Groupe TP 1", capacite: 15 },
  { id: 2, nom: "Groupe TP 2", capacite: 15 },
  { id: 3, nom: "Groupe TP 3", capacite: 15 },
];

export const MOCK_CLASSES = [
  { id: 1, nom: "DSI3.1", niveau: "Licence 3ème Année", effectif: 28 },
  { id: 2, nom: "DSI3.2", niveau: "Licence 3ème Année", effectif: 28 },
  { id: 12, nom: "DSI3.3", niveau: "Licence 3ème Année", effectif: 28 },
];

export const MOCK_DEPARTEMENTS = [
  { id: 1, nom: "Technologies de l'Informatique", code: "DSI" },
  { id: 2, nom: "Réseaux et Télécommunications", code: "RT" },
  { id: 3, nom: "Systèmes Embarqués", code: "SE" },
];

// ==========================================
// Mock Users (Enseignants, Etudiants, etc.)
// ==========================================
export const MOCK_ENSEIGNANTS: User[] = [
  {
    id: 101, nom: "Belarbi", prenom: "Manel", email: "manel.belarbi@iset.rnu.tn",
    motDePasse: "password123", photo: "", role: "Enseignant",
    grade: "Professeur", specialite: "Conception Objet",
  },
  {
    id: 102, nom: "Bouslama", prenom: "Abdelaziz", email: "abdelaziz.bouslama@iset.rnu.tn",
    motDePasse: "password123", photo: "", role: "Enseignant",
    grade: "Maître de Conférences", specialite: "Recherche d'emploi",
  },
  {
    id: 103, nom: "Rouatbi", prenom: "Adnène", email: "adnene.rouatbi@iset.rnu.tn",
    motDePasse: "password123", photo: "", role: "Enseignant",
    grade: "Professeur", specialite: "Projet d'Intégration",
  },
  {
    id: 104, nom: "Bedoui", prenom: "Henda", email: "henda.bedoui@iset.rnu.tn",
    motDePasse: "password123", photo: "", role: "Enseignant",
    grade: "Maître de Conférences", specialite: "Anglais",
  },
  {
    id: 105, nom: "Fradi", prenom: "Benene", email: "benene.fradi@iset.rnu.tn",
    motDePasse: "password123", photo: "", role: "Enseignant",
    grade: "Professeur", specialite: "SOA / Machine Learning",
  },
  {
    id: 106, nom: "Sahli", prenom: "Sonia", email: "sonia.sahli@iset.rnu.tn",
    motDePasse: "password123", photo: "", role: "Enseignant",
    grade: "Maître de Conférences", specialite: "BI / UI-UX",
  },
  {
    id: 107, nom: "Kachoukh", prenom: "Yassine", email: "yassine.kachoukh@iset.rnu.tn",
    motDePasse: "password123", photo: "", role: "Enseignant",
    grade: "Professeur", specialite: "Développement Mobile",
  },
  {
    id: 108, nom: "Dahmane", prenom: "Adel", email: "adel.dahmane@iset.rnu.tn",
    motDePasse: "password123", photo: "", role: "Enseignant",
    grade: "Maître de Conférences", specialite: "BI / UI-UX",
  },
  {
    id: 109, nom: "Dridi", prenom: "Mounir", email: "mounir.dridi@iset.rnu.tn",
    motDePasse: "password123", photo: "", role: "Enseignant",
    grade: "Professeur", specialite: "Génie Logiciel",
  },
  {
    id: 110, nom: "Zairi", prenom: "Fatma", email: "fatma.zairi@iset.rnu.tn",
    motDePasse: "password123", photo: "", role: "Enseignant",
    grade: "Maître de Conférences", specialite: "Systèmes & Sécurité",
  },
];

export const MOCK_ETUDIANTS: User[] = [
  {
    id: 1, nom: "Ben Salah", prenom: "Ali", email: "ali.bensalah@iset.tn",
    motDePasse: "password123", photo: "", role: "Etudiant",
    matricule: "ETU-2026-0342", dateInscription: "2024-09-15",
  },
  {
    id: 2, nom: "Trabelsi", prenom: "Amina", email: "amina.trabelsi@iset.tn",
    motDePasse: "password123", photo: "", role: "Etudiant",
    matricule: "ETU-2026-0343", dateInscription: "2024-09-15",
  },
  {
    id: 3, nom: "Gara", prenom: "Omar", email: "omar.gara@iset.tn",
    motDePasse: "password123", photo: "", role: "Etudiant",
    matricule: "ETU-2026-0344", dateInscription: "2024-09-15",
  },
  {
    id: 4, nom: "Jaziri", prenom: "Leila", email: "leila.jaziri@iset.tn",
    motDePasse: "password123", photo: "", role: "Etudiant",
    matricule: "ETU-2026-0345", dateInscription: "2024-09-15",
  },
];

export const MOCK_SEANCES: Seance[] = [
  { id: 1, jour: "LUNDI", heureDebut: "08:30", heureFin: "10:00", type: "TD", colorVariant: "blue" },
  { id: 2, jour: "LUNDI", heureDebut: "10:05", heureFin: "11:35", type: "COURS", colorVariant: "purple" },
  { id: 3, jour: "LUNDI", heureDebut: "11:40", heureFin: "13:10", type: "COURS", colorVariant: "blue" },
  { id: 4, jour: "LUNDI", heureDebut: "13:15", heureFin: "14:45", type: "COURS", colorVariant: "amber" },
  { id: 5, jour: "LUNDI", heureDebut: "14:50", heureFin: "16:20", type: "COURS", colorVariant: "amber" },
  { id: 6, jour: "MARDI", heureDebut: "08:30", heureFin: "10:00", type: "TP", colorVariant: "green" },
  { id: 7, jour: "MARDI", heureDebut: "10:05", heureFin: "11:35", type: "COURS", colorVariant: "purple" },
  { id: 8, jour: "MARDI", heureDebut: "11:40", heureFin: "13:10", type: "COURS", colorVariant: "blue" },
  { id: 9, jour: "MARDI", heureDebut: "13:15", heureFin: "14:45", type: "TP", colorVariant: "green" },
  { id: 10, jour: "MERCREDI", heureDebut: "08:30", heureFin: "10:00", type: "TP", colorVariant: "green" },
  { id: 11, jour: "MERCREDI", heureDebut: "10:05", heureFin: "11:35", type: "TP", colorVariant: "green" },
  { id: 12, jour: "MERCREDI", heureDebut: "11:40", heureFin: "13:10", type: "COURS", colorVariant: "blue" },
  { id: 13, jour: "JEUDI", heureDebut: "08:30", heureFin: "10:00", type: "TP", colorVariant: "green" },
  { id: 14, jour: "JEUDI", heureDebut: "10:05", heureFin: "11:35", type: "TP", colorVariant: "green" },
  { id: 15, jour: "JEUDI", heureDebut: "11:40", heureFin: "13:10", type: "TP", colorVariant: "green" },
  { id: 16, jour: "JEUDI", heureDebut: "13:15", heureFin: "14:45", type: "TP", colorVariant: "green" },
  { id: 17, jour: "VENDREDI", heureDebut: "08:30", heureFin: "10:00", type: "COURS", colorVariant: "blue" },
  { id: 18, jour: "VENDREDI", heureDebut: "10:05", heureFin: "11:35", type: "TP", colorVariant: "green" },
];

// Seance -> enseignant/matiere/salle/groupe/classe mapping (flat view for enseignant dashboard)
export const MOCK_SEANCE_ASSIGNMENTS = [
  { seanceId: 1, enseignantId: 105, matiereId: 6, salleId: 8, groupeId: 1, classeId: 12 },
  { seanceId: 2, enseignantId: 104, matiereId: 10, salleId: 3, groupeId: 1, classeId: 12 },
  { seanceId: 3, enseignantId: 101, matiereId: 8, salleId: 1, groupeId: 1, classeId: 12 },
  { seanceId: 4, enseignantId: 102, matiereId: 9, salleId: 2, groupeId: 1, classeId: 12 },
  { seanceId: 5, enseignantId: 102, matiereId: 9, salleId: 2, groupeId: 1, classeId: 12 },
  { seanceId: 6, enseignantId: 103, matiereId: 4, salleId: 7, groupeId: 1, classeId: 12 },
  { seanceId: 7, enseignantId: 104, matiereId: 10, salleId: 3, groupeId: 1, classeId: 12 },
  { seanceId: 8, enseignantId: 105, matiereId: 6, salleId: 1, groupeId: 1, classeId: 12 },
  { seanceId: 9, enseignantId: 106, matiereId: 7, salleId: 7, groupeId: 1, classeId: 12 },
  { seanceId: 10, enseignantId: 105, matiereId: 6, salleId: 8, groupeId: 2, classeId: 12 },
  { seanceId: 11, enseignantId: 105, matiereId: 6, salleId: 8, groupeId: 2, classeId: 12 },
  { seanceId: 12, enseignantId: 107, matiereId: 5, salleId: 5, groupeId: 1, classeId: 12 },
  { seanceId: 13, enseignantId: 107, matiereId: 5, salleId: 5, groupeId: 2, classeId: 12 },
  { seanceId: 14, enseignantId: 107, matiereId: 5, salleId: 5, groupeId: 2, classeId: 12 },
  { seanceId: 15, enseignantId: 106, matiereId: 7, salleId: 7, groupeId: 2, classeId: 12 },
  { seanceId: 16, enseignantId: 106, matiereId: 7, salleId: 7, groupeId: 2, classeId: 12 },
  { seanceId: 17, enseignantId: 109, matiereId: 2, salleId: 1, groupeId: 1, classeId: 12 },
  { seanceId: 18, enseignantId: 110, matiereId: 3, salleId: 6, groupeId: 1, classeId: 12 },
];

// ==========================================
// Absence Mock Data (enseignant records)
// ==========================================
export const MOCK_ABSENCES: Absence[] = [
  { id: 1, date: "05/10/2026", motif: "Maladie (Certificat médical déposé)", justifiee: true, etudiantId: 1, seanceId: 3 },
  { id: 2, date: "08/10/2026", motif: "Non justifié", justifiee: false, etudiantId: 2, seanceId: 6 },
  { id: 3, date: "14/10/2026", motif: "Convocation administrative", justifiee: true, etudiantId: 1, seanceId: 12 },
  { id: 4, date: "22/10/2026", motif: "Non justifié", justifiee: false, etudiantId: 3, seanceId: 8 },
];

// ==========================================
// Hardcoded credentials for all roles
// Each role can sign in with email/password below
// ==========================================
export const HARDCODED_USERS: User[] = [
  // Etudiant
  {
    id: 1,
    nom: "Ben Salah",
    prenom: "Ali",
    email: "etudiant@gmail.com",
    motDePasse: "etudiant123",
    photo: "",
    role: "Etudiant",
    matricule: "ETU-2026-0342",
    dateInscription: "2024-09-15",
  },
  // Enseignant
  {
    id: 101,
    nom: "Belarbi",
    prenom: "Manel",
    email: "enseignant@gmail.com",
    motDePasse: "enseignant123",
    photo: "",
    role: "Enseignant",
    grade: "Maître de Conférences",
    specialite: "Informatique",
  },
  // Secretaire
  {
    id: 201,
    nom: "Zouari",
    prenom: "Fatma",
    email: "secretaire@gmail.com",
    motDePasse: "secretaire123",
    photo: "",
    role: "Secretaire",
    bureau: "Bureau 105 - Scolarité",
  },
  // SuperAdmin
  {
    id: 301,
    nom: "Admin",
    prenom: "Système",
    email: "superadmin@gmail.com",
    motDePasse: "admin123",
    photo: "",
    role: "SuperAdmin",
  },
  // DirecteurDepartement
  {
    id: 401,
    nom: "Gara",
    prenom: "Mohamed",
    email: "directeurdepartement@gmail.com",
    motDePasse: "departement123",
    photo: "",
    role: "DirecteurDepartement",
  },
  // DirecteurEtablissement
  {
    id: 501,
    nom: "Hassen",
    prenom: "Leila",
    email: "directeuretablissement@gmail.com",
    motDePasse: "etablissement123",
    photo: "",
    role: "DirecteurEtablissement",
  },
];

export const MOCK_USERS: User[] = HARDCODED_USERS;
