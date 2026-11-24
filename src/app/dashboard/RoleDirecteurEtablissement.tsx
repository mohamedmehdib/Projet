"use client";

import { useState, useEffect } from "react";
import {
  Users, User as UserIcon, CheckCircle2, AlertCircle, ShieldCheck, Lock, Camera,
  Eye, EyeOff, KeyRound, Plus, Trash2, Edit, Building2, LayoutDashboard, Settings,
  GraduationCap, Calendar, FileText, BookOpen, School, X, Loader2,
} from "lucide-react";
import { User, EmploiDuTemps, Classe, GroupeTP } from "@/types/schema";
import { fetchLiveTimetable, TIME_SLOTS, DAYS, SeanceView } from "@/lib/timetableService";
import { SupabaseService } from "@/lib/supabaseDb";
import { TimetableLoadingSkeleton, TableLoadingSkeleton } from "@/components/LoadingStates";
import { Lock as LockIcon, CheckCircle, ShieldAlert, FileCheck, ToggleLeft, ToggleRight } from "lucide-react";

export type DirecteurEtablissementTab =
  | "enseignants"
  | "etudiants"
  | "departements"
  | "classes"
  | "salles"
  | "groupes"
  | "inscriptions"
  | "dashboard"
  | "profile";

const CURRENT_EMPLOI: EmploiDuTemps = {
  id: 1,
  semestre: "Semestre 1 (S1)",
  anneeUniversitaire: "2025 - 2026",
};

const CURRENT_CLASSE: Classe = {
  id: 12,
  nom: "DSI3.3",
  niveau: "Licence 3ème Année",
  effectif: 28,
};

const CURRENT_GROUPE_TP: GroupeTP = {
  id: 3,
  nom: "Groupe TP 1",
  capacite: 15,
};

interface RoleDirecteurEtablissementProps {
  currentUser: User;
  activeTab: DirecteurEtablissementTab;
  onUpdateUser: (updatedUser: User) => void;
}

export default function RoleDirecteurEtablissement({
  currentUser,
  activeTab,
  onUpdateUser,
}: RoleDirecteurEtablissementProps) {
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [usersList, setUsersList] = useState<any[]>([]);
  const [departementsList, setDepartementsList] = useState<any[]>([]);
  const [classesList, setClassesList] = useState<any[]>([]);
  const [sallesList, setSallesList] = useState<any[]>([]);
  const [groupesList, setGroupesList] = useState<any[]>([]);
  const [inscriptionsList, setInscriptionsList] = useState<any[]>([]);
  const [timetableData, setTimetableData] = useState<SeanceView[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Modal / Form state for adding items
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isAddingDepartement, setIsAddingDepartement] = useState(false);
  const [isAddingClasse, setIsAddingClasse] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Helper to generate department code from words (e.g. Génie Électrique -> GE, Technologies de l'Informatique -> TI)
  const generateDepartmentCode = (name: string): string => {
    const stopWords = new Set(["de", "des", "du", "d", "l", "la", "le", "les", "et", "en", "pour", "a", "au", "aux"]);
    // Normalize apostrophes and split on whitespace or punctuation
    const words = name
      .replace(/['’]/g, " ")
      .split(/[^a-zA-ZÀ-ÿ0-9]+/)
      .filter((w) => w.length > 0 && !stopWords.has(w.toLowerCase()));
    return words.map((w) => w[0].toUpperCase()).join("");
  };

  // Edit département modal state (including selecting Directeur de Département from existing Enseignants)
  const [editingDept, setEditingDept] = useState<any | null>(null);
  const [editDeptNom, setEditDeptNom] = useState("");
  const [editDeptCode, setEditDeptCode] = useState("");
  const [selectedEnseignantIdForDept, setSelectedEnseignantIdForDept] = useState<string>("");

  // Edit user modal state (Enseignant, Étudiant, Directeur de Département)
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editUserNom, setEditUserNom] = useState("");
  const [editUserPrenom, setEditUserPrenom] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserGrade, setEditUserGrade] = useState("");
  const [editUserSpecialite, setEditUserSpecialite] = useState("");
  const [editUserBureau, setEditUserBureau] = useState("");
  const [editUserMatricule, setEditUserMatricule] = useState("");

  // Edit classe modal state
  const [editingClasse, setEditingClasse] = useState<any | null>(null);
  const [editClasseNom, setEditClasseNom] = useState("");
  const [editClasseNiveau, setEditClasseNiveau] = useState("");
  const [editClasseEffectif, setEditClasseEffectif] = useState("");
  const [editClasseDeptId, setEditClasseDeptId] = useState("");

  // Edit salle modal state
  const [editingSalle, setEditingSalle] = useState<any | null>(null);
  const [editSalleNumero, setEditSalleNumero] = useState("");
  const [editSalleCapacite, setEditSalleCapacite] = useState("");
  const [editSalleType, setEditSalleType] = useState<"COURS" | "TP">("COURS");
  const [editSalleEtage, setEditSalleEtage] = useState("RDC");

  // Edit groupe TP modal state
  const [editingGroupe, setEditingGroupe] = useState<any | null>(null);
  const [editGroupeNom, setEditGroupeNom] = useState("");
  const [editGroupeCapacite, setEditGroupeCapacite] = useState("");
  const [editGroupeClasse, setEditGroupeClasse] = useState("DSI3.3");

  // New user form state
  const [newUserNom, setNewUserNom] = useState("");
  const [newUserPrenom, setNewUserPrenom] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [newUserGrade, setNewUserGrade] = useState("Maître Assistant");
  const [newUserSpecialite, setNewUserSpecialite] = useState("");
  const [newUserMatricule, setNewUserMatricule] = useState("");
  const [newUserBureau, setNewUserBureau] = useState("Bureau 102");
  const [lastCreatedCredentials, setLastCreatedCredentials] = useState<{
    nom: string;
    email: string;
    motDePasse: string;
  } | null>(null);

  // New département form state
  const [deptNom, setDeptNom] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [newDeptEnseignantId, setNewDeptEnseignantId] = useState<string>("");

  // New classe form state
  const [classeNom, setClasseNom] = useState("");
  const [classeNiveau, setClasseNiveau] = useState("Licence 1");
  const [classeEffectif, setClasseEffectif] = useState("30");
  const [classeDeptId, setClasseDeptId] = useState<string>("");

  // New salle form state
  const [salleNumero, setSalleNumero] = useState("");
  const [salleCapacite, setSalleCapacite] = useState("");
  const [salleType, setSalleType] = useState<"COURS" | "TP">("COURS");
  const [salleEtage, setSalleEtage] = useState("RDC");

  // New groupe form state
  const [groupeNom, setGroupeNom] = useState("");
  const [groupeCapacite, setGroupeCapacite] = useState("");
  const [groupeClasse, setGroupeClasse] = useState("DSI3.3");

  // New inscription form state
  const [anneeInsc, setAnneeInsc] = useState("2026 - 2027");
  const [dateDebutInsc, setDateDebutInsc] = useState("2026-09-01");
  const [dateFinInsc, setDateFinInsc] = useState("2026-09-25");

  // Profile Form state
  const [nom, setNom] = useState(currentUser.nom || "Hassen");
  const [prenom, setPrenom] = useState(currentUser.prenom || "Leila");
  const [email, setEmail] = useState(currentUser.email || "directeuretablissement@gmail.com");
  const [motDePasse, setMotDePasse] = useState(currentUser.motDePasse || "etablissement123");
  const [photo, setPhoto] = useState(currentUser.photo || "");

  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function loadData() {
    try {
      setLoadingData(true);
      const [profiles, deps, classes, salles, seances, dbGroupes, dbInscriptions] = await Promise.all([
        SupabaseService.getProfiles().catch(() => []),
        SupabaseService.getDepartements().catch(() => []),
        SupabaseService.getClasses().catch(() => []),
        SupabaseService.getSalles().catch(() => []),
        fetchLiveTimetable(12),
        SupabaseService.getGroupesTP().catch(() => []),
        SupabaseService.getInscriptionsCampagnes().catch(() => []),
      ]);
      // Find teachers and any current department directors
      const profilesList = profiles || [];
      const currentDirDepts = profilesList.filter((p: any) => p.role === "DirecteurDepartement");
      
      setUsersList(
        profilesList.map((p: any) => ({
          id: p.id,
          nom: p.nom,
          prenom: p.prenom,
          email: p.email,
          role: p.role,
          matricule: p.matricule,
          grade: p.grade,
          specialite: p.specialite,
          bureau: p.bureau,
          statut: "Actif",
        }))
      );
      setDepartementsList(
        (deps || []).map((d: any, index: number) => {
          // If there is an existing user with role DirecteurDepartement, associate them or display standard
          const assignedDir = currentDirDepts[index % Math.max(1, currentDirDepts.length)];
          const respName = assignedDir ? `${assignedDir.prenom} ${assignedDir.nom}` : "Non assigné";
          return {
            id: d.id,
            nom: d.nom,
            code: d.code,
            responsable: respName,
            responsableId: assignedDir ? assignedDir.id : null,
          };
        })
      );
      setClassesList(
        (classes || []).map((c: any) => ({
          id: c.id,
          nom: c.nom,
          niveau: c.niveau,
          effectif: c.effectif,
          departement: c.departements?.nom || "TI",
        }))
      );
      setSallesList(
        (salles || []).map((s: any) => ({
          id: s.id,
          numero: s.numero,
          capacite: s.capacite,
          type: s.type,
          etage: "Campus",
        }))
      );
      setGroupesList(
        (dbGroupes || []).map((g: any) => ({
          id: g.id,
          nom: g.nom,
          capacite: g.capacite,
          classe: g.classe_nom || "DSI3.3",
        }))
      );
      setInscriptionsList(
        (dbInscriptions || []).map((i: any) => ({
          id: i.id,
          annee: i.annee,
          dateDebut: i.date_debut,
          dateFin: i.date_fin,
          statut: i.statut,
          inscrits: i.inscrits || 0,
        }))
      );
      setTimetableData(seances || []);
    } catch (err) {
      console.error("Error loading directeur etablissement data:", err);
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      const updated: User = { ...currentUser, nom, prenom, email, motDePasse, photo };
      await onUpdateUser(updated);
      setFormSuccess("Toutes les informations ont été mises à jour avec succès !");
      setTimeout(() => setFormSuccess(null), 4000);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    const isCurrentCorrect =
      currentPasswordInput === motDePasse ||
      (motDePasse === "••••••••" && currentPasswordInput.length > 0) ||
      currentPasswordInput === "etablissement123";
    if (!isCurrentCorrect) { setPasswordError("Le mot de passe actuel saisi est incorrect."); return; }
    if (newPasswordInput.length < 6) { setPasswordError("Le nouveau mot de passe doit contenir au moins 6 caractères."); return; }
    if (newPasswordInput !== confirmPasswordInput) { setPasswordError("La confirmation ne correspond pas."); return; }
    try {
      setPasswordLoading(true);
      setMotDePasse(newPasswordInput);
      const updated: User = { ...currentUser, motDePasse: newPasswordInput };
      await onUpdateUser(updated);
      setCurrentPasswordInput(""); setNewPasswordInput(""); setConfirmPasswordInput("");
      setFormSuccess("Votre mot de passe a été modifié avec succès !");
      setTimeout(() => setFormSuccess(null), 4000);
    } finally {
      setPasswordLoading(false);
    }
  };

  // 1. ADD ENSEIGNANT, ETUDIANT OU DIRECTEUR DE DEPARTEMENT
  const handleAddUserSubmit = async (
    e: React.FormEvent,
    roleToAdd: "Enseignant" | "Etudiant" | "DirecteurDepartement"
  ) => {
    e.preventDefault();
    if (!newUserNom || !newUserPrenom || !newUserEmail) return;

    // --- Validation anti-duplication Client ---
    const cleanEmail = newUserEmail.trim().toLowerCase();
    const existingEmail = usersList.find((u) => u.email.trim().toLowerCase() === cleanEmail);
    if (existingEmail) {
      setFormError(`Un compte existe déjà avec l'adresse email : ${cleanEmail}`);
      setTimeout(() => setFormError(null), 6000);
      return;
    }

    const studentMatricule = newUserMatricule.trim() || `ETU-${Date.now().toString().slice(-4)}`;
    if (roleToAdd === "Etudiant") {
      const existingMatricule = usersList.find(
        (u) => u.role === "Etudiant" && u.matricule && u.matricule.trim().toLowerCase() === studentMatricule.toLowerCase()
      );
      if (existingMatricule) {
        setFormError(`Un étudiant possède déjà le matricule : ${studentMatricule}`);
        setTimeout(() => setFormError(null), 6000);
        return;
      }
    }

    try {
      setActionLoading(true);
      setFormError(null);

      // Mot de passe pour un étudiant = matricule; pour un enseignant = enseignant + 3 chiffres aléatoires (100 à 999)
      const resolvedMatricule = roleToAdd === "Etudiant" ? studentMatricule : undefined;
      const randomThreeDigits = Math.floor(100 + Math.random() * 900); // 100 to 999
      const resolvedPassword =
        roleToAdd === "Etudiant"
          ? studentMatricule
          : `enseignant${randomThreeDigits}`;

      const created = await SupabaseService.createUser({
        nom: newUserNom.trim(),
        prenom: newUserPrenom.trim(),
        email: newUserEmail.trim(),
        password: resolvedPassword,
        role: roleToAdd,
        matricule: resolvedMatricule,
        grade: roleToAdd === "Enseignant" ? newUserGrade : undefined,
        specialite: roleToAdd === "Enseignant" ? newUserSpecialite : undefined,
        bureau: roleToAdd === "Enseignant" ? newUserBureau : undefined,
      });

      const newEntry = {
        id: created.id || Date.now(),
        nom: newUserNom.trim(),
        prenom: newUserPrenom.trim(),
        email: newUserEmail.trim(),
        role: roleToAdd,
        matricule: resolvedMatricule,
        grade: newUserGrade,
        specialite: newUserSpecialite,
        bureau: newUserBureau,
        statut: "Actif",
      };

      setUsersList((prev) => [newEntry, ...prev]);

      if (roleToAdd === "Enseignant") {
        setLastCreatedCredentials({
          nom: `${newUserPrenom.trim()} ${newUserNom.trim()}`,
          email: newUserEmail.trim(),
          motDePasse: resolvedPassword,
        });
      }

      let successMsg = "Opération effectuée avec succès !";
      if (roleToAdd === "Etudiant") {
        successMsg = `Étudiant inscrit avec succès ! Son mot de passe est son matricule : ${resolvedMatricule}`;
      } else if (roleToAdd === "DirecteurDepartement") {
        successMsg = `Directeur de département créé avec succès !`;
      } else {
        successMsg = `Enseignant enregistré avec succès ! Mot de passe généré : ${resolvedPassword}`;
      }

      setFormSuccess(successMsg);
      setTimeout(() => setFormSuccess(null), 8000);
      setIsAddingUser(false);
      setNewUserNom("");
      setNewUserPrenom("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserMatricule("");
    } catch (err: any) {
      console.error("Error creating user:", err?.message || err);
      const errorMsg =
        err?.message ||
        (typeof err === "string" ? err : "Erreur lors de la création du compte.");
      setFormError(errorMsg);
      setTimeout(() => setFormError(null), 6000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, roleName: string) => {
    try {
      setDeletingId(id);
      await SupabaseService.deleteUser(id).catch(() => {});
      setUsersList((prev) => prev.filter((u) => u.id !== id));
      setFormSuccess("Opération effectuée avec succès !");
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error deleting user:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // 2. ADD & DELETE DÉPARTEMENT
  const handleAddDepartement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptNom || !deptCode) return;

    // --- Validation anti-duplication Client ---
    const cleanNom = deptNom.trim().toLowerCase();
    const cleanCode = deptCode.trim().toUpperCase();

    const existingCode = departementsList.find((d) => d.code.trim().toUpperCase() === cleanCode);
    if (existingCode) {
      setFormError(`Un département avec le code [${cleanCode}] existe déjà (${existingCode.nom}).`);
      setTimeout(() => setFormError(null), 6000);
      return;
    }

    const existingNom = departementsList.find((d) => d.nom.trim().toLowerCase() === cleanNom);
    if (existingNom) {
      setFormError(`Le département "${deptNom.trim()}" existe déjà.`);
      setTimeout(() => setFormError(null), 6000);
      return;
    }

    try {
      setActionLoading(true);
      setFormError(null);
      const created = await SupabaseService.createDepartement({
        nom: deptNom.trim(),
        code: cleanCode,
      });

      let assignedResponsable = "Directeur de Département";
      let assignedResponsableId: string | undefined = undefined;

      if (newDeptEnseignantId) {
        const selectedTeacher = usersList.find((u) => u.id === newDeptEnseignantId);
        if (selectedTeacher) {
          await SupabaseService.updateProfile(newDeptEnseignantId, {
            role: "DirecteurDepartement",
          }).catch((err) => console.warn("Notice: profile update fallback", err));

          assignedResponsable = `${selectedTeacher.prenom} ${selectedTeacher.nom}`;
          assignedResponsableId = selectedTeacher.id;

          setUsersList((prev) =>
            prev.map((u) =>
              u.id === newDeptEnseignantId
                ? { ...u, role: "DirecteurDepartement" }
                : u
            )
          );
        }
      }

      setDepartementsList((prev) => [
        ...prev,
        {
          id: created.id,
          nom: deptNom.trim(),
          code: cleanCode,
          responsable: assignedResponsable,
          responsableId: assignedResponsableId,
        },
      ]);
      setDeptNom("");
      setDeptCode("");
      setNewDeptEnseignantId("");
      setIsAddingDepartement(false);
      setFormSuccess("Département ajouté avec succès !");
      setTimeout(() => setFormSuccess(null), 4000);
    } catch (err: any) {
      console.error("Error creating department:", err);
      const msg = err?.message?.includes("duplicate") || err?.message?.includes("unique")
        ? `Le département ou le code [${cleanCode}] est déjà utilisé.`
        : err?.message || "Erreur lors de la création du département.";
      setFormError(msg);
      setTimeout(() => setFormError(null), 6000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDepartement = async (id: number) => {
    try {
      setDeletingId(id);
      await SupabaseService.deleteDepartement(id).catch(() => {});
      setDepartementsList((prev) => prev.filter((d) => d.id !== id));
      setFormSuccess("Département supprimé.");
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error deleting department:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Open Edit Département Modal
  const handleOpenEditDepartement = (dept: any) => {
    setEditingDept(dept);
    setEditDeptNom(dept.nom);
    setEditDeptCode(dept.code);
    setSelectedEnseignantIdForDept(dept.responsableId || "");
  };

  // Save Edit Département & Assign Directeur de Département from existing Enseignant
  const handleSaveEditDepartement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept || !editDeptNom || !editDeptCode) return;

    const cleanNom = editDeptNom.trim().toLowerCase();
    const cleanCode = editDeptCode.trim().toUpperCase();

    // Check duplication with other departments (excluding current one)
    const existingCode = departementsList.find(
      (d) => d.id !== editingDept.id && d.code.trim().toUpperCase() === cleanCode
    );
    if (existingCode) {
      setFormError(`Le code [${cleanCode}] est déjà utilisé par le département ${existingCode.nom}.`);
      setTimeout(() => setFormError(null), 6000);
      return;
    }

    const existingNom = departementsList.find(
      (d) => d.id !== editingDept.id && d.nom.trim().toLowerCase() === cleanNom
    );
    if (existingNom) {
      setFormError(`Le département "${editDeptNom.trim()}" existe déjà.`);
      setTimeout(() => setFormError(null), 6000);
      return;
    }

    try {
      setActionLoading(true);
      setFormError(null);

      // 1. Update department name & code
      await SupabaseService.updateDepartement(editingDept.id, {
        nom: editDeptNom.trim(),
        code: cleanCode,
      });

      // 2. If an enseignant was selected to become Directeur de Département:
      let newResponsableName = editingDept.responsable;
      let newResponsableId = editingDept.responsableId;

      if (selectedEnseignantIdForDept) {
        const selectedTeacher = usersList.find((u) => u.id === selectedEnseignantIdForDept);
        if (selectedTeacher) {
          // Promote this teacher's profile role to 'DirecteurDepartement' in Supabase
          await SupabaseService.updateProfile(selectedEnseignantIdForDept, {
            role: "DirecteurDepartement",
          }).catch((err) => console.warn("Notice: profile update fallback", err));

          newResponsableName = `${selectedTeacher.prenom} ${selectedTeacher.nom}`;
          newResponsableId = selectedTeacher.id;

          // Update local users list so the teacher appears as DirecteurDepartement
          setUsersList((prev) =>
            prev.map((u) =>
              u.id === selectedEnseignantIdForDept
                ? { ...u, role: "DirecteurDepartement" }
                : u
            )
          );
        }
      }

      // 3. Update local departementsList
      setDepartementsList((prev) =>
        prev.map((d) =>
          d.id === editingDept.id
            ? {
                ...d,
                nom: editDeptNom.trim(),
                code: cleanCode,
                responsable: newResponsableName,
                responsableId: newResponsableId,
              }
            : d
        )
      );

      setEditingDept(null);
      setFormSuccess("Département et responsable mis à jour avec succès !");
      setTimeout(() => setFormSuccess(null), 4000);
    } catch (err: any) {
      console.error("Error updating department and director:", err);
      const msg = err?.message?.includes("duplicate") || err?.message?.includes("unique")
        ? `Le code [${cleanCode}] est déjà utilisé.`
        : err?.message || "Erreur lors de la mise à jour.";
      setFormError(msg);
      setTimeout(() => setFormError(null), 6000);
    } finally {
      setActionLoading(false);
    }
  };

  // Open Edit User Modal (Enseignant, Étudiant, Directeur de Département)
  const handleOpenEditUser = (user: any) => {
    setEditingUser(user);
    setEditUserNom(user.nom || "");
    setEditUserPrenom(user.prenom || "");
    setEditUserEmail(user.email || "");
    setEditUserGrade(user.grade || "Maître Assistant");
    setEditUserSpecialite(user.specialite || "Informatique");
    setEditUserBureau(user.bureau || "Bureau 102");
    setEditUserMatricule(user.matricule || "");
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editUserNom || !editUserPrenom) return;

    if (editingUser.role === "Etudiant" && editUserMatricule.trim()) {
      const cleanMatricule = editUserMatricule.trim().toLowerCase();
      const existingMatricule = usersList.find(
        (u) => u.id !== editingUser.id && u.role === "Etudiant" && u.matricule && u.matricule.trim().toLowerCase() === cleanMatricule
      );
      if (existingMatricule) {
        setFormError(`Le matricule "${editUserMatricule.trim()}" est déjà attribué à un autre étudiant.`);
        setTimeout(() => setFormError(null), 6000);
        return;
      }
    }

    try {
      setActionLoading(true);
      setFormError(null);
      const updates: any = {
        nom: editUserNom.trim(),
        prenom: editUserPrenom.trim(),
      };
      if (editingUser.role === "Enseignant" || editingUser.role === "DirecteurDepartement") {
        updates.grade = editUserGrade;
        updates.specialite = editUserSpecialite;
        updates.bureau = editUserBureau;
      }
      if (editingUser.role === "Etudiant") {
        updates.matricule = editUserMatricule.trim();
      }

      await SupabaseService.updateProfile(editingUser.id, updates);

      setUsersList((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, ...updates }
            : u
        )
      );

      setEditingUser(null);
      setFormSuccess("Utilisateur mis à jour avec succès !");
      setTimeout(() => setFormSuccess(null), 4000);
    } catch (err: any) {
      console.error("Error updating user:", err);
      setFormError(err?.message || "Erreur lors de la mise à jour.");
      setTimeout(() => setFormError(null), 6000);
    } finally {
      setActionLoading(false);
    }
  };

  // Open Edit Classe Modal
  const handleOpenEditClasse = (classe: any) => {
    setEditingClasse(classe);
    setEditClasseNom(classe.nom);
    setEditClasseNiveau(classe.niveau);
    setEditClasseEffectif(String(classe.effectif));
    const dept = departementsList.find((d) => d.nom === classe.departement);
    setEditClasseDeptId(dept ? String(dept.id) : "");
  };

  const handleSaveEditClasse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClasse || !editClasseNom || !editClasseNiveau) return;

    const cleanNom = editClasseNom.trim().toLowerCase();
    const existingClasse = classesList.find(
      (c) => c.id !== editingClasse.id && c.nom.trim().toLowerCase() === cleanNom
    );
    if (existingClasse) {
      setFormError(`Une classe avec le nom "${editClasseNom.trim()}" existe déjà.`);
      setTimeout(() => setFormError(null), 6000);
      return;
    }

    try {
      setActionLoading(true);
      setFormError(null);
      const eff = parseInt(editClasseEffectif, 10) || 30;
      const deptIdNum = editClasseDeptId ? parseInt(editClasseDeptId, 10) : undefined;
      const matchedDept = departementsList.find((d) => d.id === deptIdNum);

      await SupabaseService.updateClasse(editingClasse.id, {
        nom: editClasseNom.trim(),
        niveau: editClasseNiveau.trim(),
        effectif: eff,
        departement_id: deptIdNum,
      });

      setClassesList((prev) =>
        prev.map((c) =>
          c.id === editingClasse.id
            ? {
                ...c,
                nom: editClasseNom.trim(),
                niveau: editClasseNiveau.trim(),
                effectif: eff,
                departement: matchedDept ? matchedDept.nom : c.departement,
              }
            : c
        )
      );

      setEditingClasse(null);
      setFormSuccess("Classe mise à jour avec succès !");
      setTimeout(() => setFormSuccess(null), 4000);
    } catch (err: any) {
      console.error("Error updating class:", err);
      setFormError(err?.message || "Erreur lors de la mise à jour de la classe.");
      setTimeout(() => setFormError(null), 6000);
    } finally {
      setActionLoading(false);
    }
  };

  // Open Edit Salle Modal
  const handleOpenEditSalle = (salle: any) => {
    setEditingSalle(salle);
    setEditSalleNumero(salle.numero);
    setEditSalleCapacite(String(salle.capacite));
    setEditSalleType(salle.type || "COURS");
    setEditSalleEtage(salle.etage || "RDC");
  };

  const handleSaveEditSalle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSalle || !editSalleNumero || !editSalleCapacite) return;

    const cleanNumero = editSalleNumero.trim().toLowerCase();
    const existingSalle = sallesList.find(
      (s) => s.id !== editingSalle.id && s.numero.trim().toLowerCase() === cleanNumero
    );
    if (existingSalle) {
      setFormError(`Une salle avec le numéro "${editSalleNumero.trim()}" existe déjà.`);
      setTimeout(() => setFormError(null), 6000);
      return;
    }

    try {
      setActionLoading(true);
      setFormError(null);
      const cap = parseInt(editSalleCapacite, 10) || 30;

      await SupabaseService.updateSalle(editingSalle.id, {
        numero: editSalleNumero.trim().toUpperCase(),
        capacite: cap,
        type: editSalleType,
      });

      setSallesList((prev) =>
        prev.map((s) =>
          s.id === editingSalle.id
            ? {
                ...s,
                numero: editSalleNumero.trim().toUpperCase(),
                capacite: cap,
                type: editSalleType,
                etage: editSalleEtage || s.etage,
              }
            : s
        )
      );

      setEditingSalle(null);
      setFormSuccess("Salle mise à jour avec succès !");
      setTimeout(() => setFormSuccess(null), 4000);
    } catch (err: any) {
      console.error("Error updating salle:", err);
      setFormError(err?.message || "Erreur lors de la mise à jour de la salle.");
      setTimeout(() => setFormError(null), 6000);
    } finally {
      setActionLoading(false);
    }
  };

  // 3. ADD & DELETE CLASSE
  const handleAddClasse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classeNom || !classeNiveau) return;

    const cleanNom = classeNom.trim().toLowerCase();
    const existingClasse = classesList.find((c) => c.nom.trim().toLowerCase() === cleanNom);
    if (existingClasse) {
      setFormError(`Une classe avec le nom "${classeNom.trim()}" existe déjà.`);
      setTimeout(() => setFormError(null), 6000);
      return;
    }

    try {
      setActionLoading(true);
      setFormError(null);
      const eff = parseInt(classeEffectif, 10) || 30;
      const deptIdNum = classeDeptId ? parseInt(classeDeptId, 10) : undefined;
      const created = await SupabaseService.createClasse({
        nom: classeNom.trim(),
        niveau: classeNiveau.trim(),
        effectif: eff,
        departement_id: deptIdNum,
      });

      const matchedDept = departementsList.find((d) => d.id === deptIdNum);

      setClassesList((prev) => [
        ...prev,
        {
          id: created.id,
          nom: classeNom.trim(),
          niveau: classeNiveau.trim(),
          effectif: eff,
          departement: matchedDept ? matchedDept.nom : "TI",
        },
      ]);
      setClasseNom("");
      setClasseEffectif("30");
      setIsAddingClasse(false);
      setFormSuccess("Classe créée avec succès !");
      setTimeout(() => setFormSuccess(null), 4000);
    } catch (err: any) {
      console.error("Error creating class:", err);
      setFormError(err?.message || "Erreur lors de la création de la classe.");
      setTimeout(() => setFormError(null), 6000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClasse = async (id: number) => {
    try {
      setDeletingId(id);
      await SupabaseService.deleteClasse(id).catch(() => {});
      setClassesList((prev) => prev.filter((c) => c.id !== id));
      setFormSuccess("Classe supprimée.");
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error deleting class:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // 4. ADD & DELETE SALLE
  const handleAddSalle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salleNumero || !salleCapacite) return;

    const cleanNumero = salleNumero.trim().toLowerCase();
    const existingSalle = sallesList.find((s) => s.numero.trim().toLowerCase() === cleanNumero);
    if (existingSalle) {
      setFormError(`Une salle avec le numéro "${salleNumero.trim()}" existe déjà.`);
      setTimeout(() => setFormError(null), 6000);
      return;
    }

    try {
      setActionLoading(true);
      setFormError(null);
      const cap = parseInt(salleCapacite, 10);
      const created = await SupabaseService.createSalle({
        numero: salleNumero.trim().toUpperCase(),
        capacite: cap,
        type: salleType,
      });

      setSallesList((prev) => [
        ...prev,
        {
          id: created.id,
          numero: salleNumero.trim().toUpperCase(),
          capacite: cap,
          type: salleType,
          etage: salleEtage || "Campus",
        },
      ]);
      setSalleNumero("");
      setSalleCapacite("");
      setFormSuccess("Salle créée avec succès !");
      setTimeout(() => setFormSuccess(null), 4000);
    } catch (err: any) {
      console.error("Error creating room:", err);
      setFormError(err?.message || "Erreur lors de la création de la salle.");
      setTimeout(() => setFormError(null), 6000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSalle = async (id: number) => {
    try {
      setDeletingId(id);
      await SupabaseService.deleteSalle(id).catch(() => {});
      setSallesList((prev) => prev.filter((x) => x.id !== id));
      setFormSuccess("Salle supprimée.");
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error deleting room:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // 5. ADD & DELETE GROUPE TP
  const handleAddGroupe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupeNom || !groupeCapacite || !groupeClasse) return;

    const requestedCap = parseInt(groupeCapacite, 10);
    if (isNaN(requestedCap) || requestedCap <= 0) {
      setFormError("Veuillez saisir une capacité valide pour le groupe TP.");
      setTimeout(() => setFormError(null), 5000);
      return;
    }

    // Trouver la classe rattachée et son effectif total
    const targetClasse = classesList.find((c) => c.nom === groupeClasse);
    const classeTotalEffectif = targetClasse ? targetClasse.effectif : 28;

    // Problème 1 : La capacité d'un seul groupe ne peut pas dépasser l'effectif total de la classe
    if (requestedCap > classeTotalEffectif) {
      setFormError(
        `Impossible de créer ce groupe : la capacité demandée (${requestedCap} étudiants) dépasse l'effectif total de la classe ${groupeClasse} (${classeTotalEffectif} étudiants).`
      );
      setTimeout(() => setFormError(null), 6000);
      return;
    }

    // Calculer la somme des capacités des groupes TP déjà existants pour cette classe
    const existingGroupesForClass = groupesList.filter((g) => g.classe === groupeClasse);
    const currentSumCapacite = existingGroupesForClass.reduce((sum, g) => sum + (g.capacite || 0), 0);

    // Problème 2 : La somme cumulée de tous les groupes TP ne doit pas dépasser l'effectif de la classe
    const newTotalCapacite = currentSumCapacite + requestedCap;
    if (newTotalCapacite > classeTotalEffectif) {
      const placesRestantes = Math.max(0, classeTotalEffectif - currentSumCapacite);
      setFormError(
        `Dépassement d'effectif : la classe ${groupeClasse} compte ${classeTotalEffectif} étudiants. Les groupes existants occupent déjà ${currentSumCapacite} places. Il ne reste que ${placesRestantes} place(s) disponible(s).`
      );
      setTimeout(() => setFormError(null), 7000);
      return;
    }

    // Vérifier l'unicité du nom de groupe pour cette classe
    const cleanNom = groupeNom.trim().toLowerCase();
    const existingGroupe = existingGroupesForClass.find(
      (g) => g.nom.trim().toLowerCase() === cleanNom
    );
    if (existingGroupe) {
      setFormError(`Le groupe "${groupeNom.trim()}" existe déjà pour la classe ${groupeClasse}.`);
      setTimeout(() => setFormError(null), 6000);
      return;
    }

    try {
      setActionLoading(true);
      const matchedClasseObj = classesList.find((c) => c.nom === groupeClasse);
      const created = await SupabaseService.createGroupeTP({
        nom: groupeNom.trim(),
        capacite: requestedCap,
        classe_nom: groupeClasse,
        classe_id: matchedClasseObj ? matchedClasseObj.id : undefined,
      }).catch(() => ({ id: Date.now(), nom: groupeNom.trim(), capacite: requestedCap, classe_nom: groupeClasse }));

      setGroupesList((prev) => [
        ...prev,
        { id: created.id, nom: groupeNom.trim(), capacite: requestedCap, classe: groupeClasse },
      ]);
      setGroupeNom("");
      setGroupeCapacite("");
      setFormSuccess(
        `Groupe TP "${groupeNom.trim()}" créé avec succès ! (${newTotalCapacite}/${classeTotalEffectif} places attribuées pour ${groupeClasse})`
      );
      setTimeout(() => setFormSuccess(null), 5000);
    } catch (err: any) {
      console.error("Error creating TP group:", err);
      setFormError("Erreur lors de la création du groupe TP.");
      setTimeout(() => setFormError(null), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenEditGroupe = (groupe: any) => {
    setEditingGroupe(groupe);
    setEditGroupeNom(groupe.nom || "");
    setEditGroupeCapacite(groupe.capacite ? String(groupe.capacite) : "");
    setEditGroupeClasse(groupe.classe || "DSI3.3");
  };

  const handleSaveEditGroupe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroupe || !editGroupeNom || !editGroupeCapacite || !editGroupeClasse) return;

    const requestedCap = parseInt(editGroupeCapacite, 10);
    if (isNaN(requestedCap) || requestedCap <= 0) {
      setFormError("Veuillez saisir une capacité valide pour le groupe TP.");
      setTimeout(() => setFormError(null), 5000);
      return;
    }

    const targetClasse = classesList.find((c) => c.nom === editGroupeClasse);
    const classeTotalEffectif = targetClasse ? targetClasse.effectif : 28;

    if (requestedCap > classeTotalEffectif) {
      setFormError(
        `Impossible : la capacité demandée (${requestedCap}) dépasse l'effectif total de la classe ${editGroupeClasse} (${classeTotalEffectif}).`
      );
      setTimeout(() => setFormError(null), 6000);
      return;
    }

    const otherGroupes = groupesList.filter((g) => g.classe === editGroupeClasse && g.id !== editingGroupe.id);
    const otherCapaciteSum = otherGroupes.reduce((sum, g) => sum + (g.capacite || 0), 0);

    if (otherCapaciteSum + requestedCap > classeTotalEffectif) {
      const placesRestantes = Math.max(0, classeTotalEffectif - otherCapaciteSum);
      setFormError(
        `Dépassement d'effectif : les autres groupes occupent déjà ${otherCapaciteSum} places sur ${classeTotalEffectif}. Il ne reste que ${placesRestantes} place(s).`
      );
      setTimeout(() => setFormError(null), 7000);
      return;
    }

    const cleanNom = editGroupeNom.trim().toLowerCase();
    const duplicate = otherGroupes.find((g) => g.nom.trim().toLowerCase() === cleanNom);
    if (duplicate) {
      setFormError(`Le groupe "${editGroupeNom.trim()}" existe déjà pour la classe ${editGroupeClasse}.`);
      setTimeout(() => setFormError(null), 6000);
      return;
    }

    try {
      setActionLoading(true);
      setFormError(null);
      const matchedClasseObj = classesList.find((c) => c.nom === editGroupeClasse);
      const updates = {
        nom: editGroupeNom.trim(),
        capacite: requestedCap,
        classe_nom: editGroupeClasse,
        classe_id: matchedClasseObj ? matchedClasseObj.id : undefined,
      };

      await SupabaseService.updateGroupeTP(editingGroupe.id, updates).catch((err) =>
        console.warn("Notice: updateGroupeTP fallback", err)
      );

      setGroupesList((prev) =>
        prev.map((g) =>
          g.id === editingGroupe.id
            ? { ...g, nom: editGroupeNom.trim(), capacite: requestedCap, classe: editGroupeClasse }
            : g
        )
      );

      setEditingGroupe(null);
      setFormSuccess(`Groupe TP "${editGroupeNom.trim()}" modifié avec succès !`);
      setTimeout(() => setFormSuccess(null), 4000);
    } catch (err: any) {
      console.error("Error updating TP group:", err);
      setFormError(err?.message || "Erreur lors de la modification du groupe TP.");
      setTimeout(() => setFormError(null), 6000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteGroupe = async (id: number) => {
    try {
      setDeletingId(id);
      await SupabaseService.deleteGroupeTP(id).catch(() => {});
      setGroupesList((prev) => prev.filter((g) => g.id !== id));
      setFormSuccess("Groupe TP supprimé.");
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error deleting TP group:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // 6. ADD INSCRIPTION
  const handleAddInscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anneeInsc || !dateDebutInsc || !dateFinInsc) return;

    const existingCampagne = inscriptionsList.find((i) => i.annee.trim() === anneeInsc.trim());
    if (existingCampagne) {
      setFormError(`Une campagne d'inscription existe déjà pour l'année universitaire ${anneeInsc}.`);
      setTimeout(() => setFormError(null), 6000);
      return;
    }

    try {
      setActionLoading(true);
      const created = await SupabaseService.createInscriptionCampagne({
        annee: anneeInsc.trim(),
        date_debut: dateDebutInsc,
        date_fin: dateFinInsc,
        statut: "Ouverte",
        inscrits: 0,
      }).catch(() => ({ id: Date.now(), annee: anneeInsc.trim(), date_debut: dateDebutInsc, date_fin: dateFinInsc, statut: "Ouverte", inscrits: 0 }));

      setInscriptionsList((prev) => [
        ...prev,
        {
          id: created.id,
          annee: anneeInsc.trim(),
          dateDebut: dateDebutInsc,
          dateFin: dateFinInsc,
          statut: "Ouverte",
          inscrits: 0,
        },
      ]);
      setFormSuccess("Campagne d'inscription établie avec succès !");
      setTimeout(() => setFormSuccess(null), 4000);
    } catch (err: any) {
      console.error("Error creating registration campaign:", err);
      setFormError("Erreur lors de la création de la campagne.");
      setTimeout(() => setFormError(null), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary tracking-tight">
          {activeTab === "enseignants" && "Gérer les enseignants"}
          {activeTab === "etudiants" && "Gérer les étudiants"}
          {activeTab === "departements" && "Gérer les départements"}
          {activeTab === "classes" && "Gérer les classes"}
          {activeTab === "salles" && "Gérer les salles"}
          {activeTab === "groupes" && "Créer les groupes TP"}
          {activeTab === "inscriptions" && "Établir inscription"}
          {activeTab === "dashboard" && "Consulter Dashboard"}
          {activeTab === "profile" && "Mon profil"}
        </h1>
        <p className="text-xs sm:text-sm text-secondary/65 font-medium mt-1">
          {activeTab === "enseignants" && "Supervisez le corps enseignant, grades et affectations de l'établissement."}
          {activeTab === "etudiants" && "Consultez et gérez la liste des étudiants de l'établissement."}
          {activeTab === "departements" && "Administrez les départements académiques et leurs responsables."}
          {activeTab === "classes" && "Gérez l'ensemble des classes, niveaux et effectifs."}
          {activeTab === "salles" && "Gérez les salles de cours et TP de l'établissement."}
          {activeTab === "groupes" && "Créez et gérez les groupes de travaux pratiques (TP)."}
          {activeTab === "inscriptions" && "Établissez et gérez les dates et périodes d'inscription universitaire."}
          {activeTab === "dashboard" && "Consultez les statistiques et indicateurs globaux de l'établissement."}
          {activeTab === "profile" && "Consultez et modifiez votre compte directeur d'établissement."}
        </p>
      </div>

      {lastCreatedCredentials && activeTab === "enseignants" && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-secondary text-xs">
                Compte enseignant créé pour <span className="text-indigo-400">{lastCreatedCredentials.nom}</span>
              </p>
              <p className="text-secondary/70 text-[11px] mt-0.5">
                Identifiants : <span className="font-mono text-secondary">{lastCreatedCredentials.email}</span> &nbsp;|&nbsp; Mot de passe :{" "}
                <span className="font-mono font-bold text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded-md">
                  {lastCreatedCredentials.motDePasse}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLastCreatedCredentials(null)}
            className="self-end sm:self-center px-3 py-1 rounded-lg border border-secondary/20 hover:bg-secondary/10 text-secondary/70 text-[11px] font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>
      )}

      {formSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{formSuccess}</span>
        </div>
      )}

      {formError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2.5 animate-fadeIn shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium">{formError}</span>
        </div>
      )}

      {/* ================= TAB 1: GÉRER LES ENSEIGNANTS ================= */}
      {activeTab === "enseignants" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-secondary/10">
              <div>
                <h3 className="text-sm font-extrabold text-secondary">Corps Enseignant</h3>
                <p className="text-[11px] text-secondary/50 font-medium">Liste des enseignants affectés à l'établissement</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingUser(!isAddingUser)}
                className="px-3.5 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:opacity-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                {isAddingUser ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{isAddingUser ? "Fermer le formulaire" : "Ajouter un enseignant"}</span>
              </button>
            </div>

            {/* Form to edit Enseignant */}
            {editingUser && editingUser.role === "Enseignant" && (
              <form onSubmit={handleSaveEditUser} className="mb-6 p-4 rounded-2xl border border-indigo-500/25 bg-indigo-500/5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-500/15">
                  <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <Edit className="w-3.5 h-3.5" /> Modifier l'enseignant #{String(editingUser.id).slice(0, 8)}
                  </h4>
                  <button type="button" onClick={() => setEditingUser(null)} className="text-secondary/50 hover:text-secondary p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Nom</label>
                    <input type="text" required value={editUserNom} onChange={(e) => setEditUserNom(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Prénom</label>
                    <input type="text" required value={editUserPrenom} onChange={(e) => setEditUserPrenom(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Email (Non modifiable)</label>
                    <input type="email" disabled value={editUserEmail} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/10 text-xs text-secondary/60 font-medium cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Grade</label>
                    <input type="text" value={editUserGrade} onChange={(e) => setEditUserGrade(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Département</label>
                    <select
                      value={editUserSpecialite}
                      onChange={(e) => setEditUserSpecialite(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500"
                    >
                      <option value="">-- Choisir un département --</option>
                      {departementsList.map((d) => (
                        <option key={d.id} value={d.nom}>
                          {d.nom} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Bureau</label>
                    <input type="text" value={editUserBureau} onChange={(e) => setEditUserBureau(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500" />
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2 border-t border-indigo-500/15">
                  <button type="button" onClick={() => setEditingUser(null)} className="px-3.5 py-1.5 rounded-xl border border-secondary/20 text-xs font-semibold text-secondary/70 hover:bg-secondary/5">Annuler</button>
                  <button type="submit" disabled={actionLoading} className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50">
                    {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{actionLoading ? "Enregistrement..." : "Enregistrer les modifications"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Form to add Enseignant */}
            {isAddingUser && (
              <form onSubmit={(e) => handleAddUserSubmit(e, "Enseignant")} className="mb-6 p-4 rounded-2xl border border-accent/20 bg-accent/5 space-y-3">
                <h4 className="text-xs font-bold text-accent flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Nouvel Enseignant
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Nom</label>
                    <input type="text" required placeholder="ex: Ben Salah" value={newUserNom} onChange={(e) => setNewUserNom(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Prénom</label>
                    <input type="text" required placeholder="ex: Mohamed" value={newUserPrenom} onChange={(e) => setNewUserPrenom(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Email</label>
                    <input type="email" required placeholder="enseignant@iset.tn" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Grade</label>
                    <input type="text" placeholder="Maître Technologue" value={newUserGrade} onChange={(e) => setNewUserGrade(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Département</label>
                    <select
                      value={newUserSpecialite}
                      onChange={(e) => setNewUserSpecialite(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent"
                    >
                      <option value="">-- Choisir un département --</option>
                      {departementsList.map((d) => (
                        <option key={d.id} value={d.nom}>
                          {d.nom} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Bureau</label>
                    <input type="text" placeholder="B204" value={newUserBureau} onChange={(e) => setNewUserBureau(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddingUser(false)} className="px-3 py-1.5 rounded-xl border border-secondary/20 text-xs font-semibold text-secondary/70 hover:bg-secondary/5">Annuler</button>
                  <button type="submit" disabled={actionLoading} className="px-4 py-1.5 rounded-xl bg-accent text-white text-xs font-bold hover:opacity-95 flex items-center gap-1.5 disabled:opacity-50">
                    {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{actionLoading ? "Enregistrement..." : "Enregistrer l'enseignant"}</span>
                  </button>
                </div>
              </form>
            )}

            {loadingData ? (
              <TableLoadingSkeleton rows={4} cols={7} />
            ) : usersList.filter((u) => u.role === "Enseignant").length === 0 ? (
              <div className="py-8 text-center text-secondary/50 text-xs">Aucun enseignant trouvé.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-secondary/10 text-[10px] font-extrabold text-secondary/50 uppercase tracking-wider">
                      <th className="py-3 px-3">ID</th>
                      <th className="py-3 px-3">Nom</th>
                      <th className="py-3 px-3">Prénom</th>
                      <th className="py-3 px-3">Email</th>
                      <th className="py-3 px-3">Grade</th>
                      <th className="py-3 px-3">Département</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/10">
                    {usersList
                      .filter((u) => u.role === "Enseignant")
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-secondary/5 transition-colors">
                          <td className="py-3.5 px-3 font-semibold text-secondary/60">#{String(u.id).slice(0, 8)}</td>
                          <td className="py-3.5 px-3 text-secondary font-medium">{u.nom}</td>
                          <td className="py-3.5 px-3 text-secondary">{u.prenom}</td>
                          <td className="py-3.5 px-3 text-secondary font-mono text-xs">{u.email}</td>
                          <td className="py-3.5 px-3 text-secondary">{u.grade || "Enseignant"}</td>
                          <td className="py-3.5 px-3 text-secondary font-medium">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                              {u.specialite || "Non assigné"}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditUser(u)}
                                title="Modifier cet enseignant"
                                className="p-1.5 rounded-lg text-secondary/60 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={deletingId === u.id}
                                onClick={() => handleDeleteUser(u.id, "Enseignant")}
                                title="Supprimer"
                                className="p-1.5 rounded-lg text-secondary/60 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-40"
                              >
                                {deletingId === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" /> : <Trash2 className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: GÉRER LES ÉTUDIANTS ================= */}
      {activeTab === "etudiants" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-secondary/10">
              <div>
                <h3 className="text-sm font-extrabold text-secondary">Étudiants de l'établissement</h3>
                <p className="text-[11px] text-secondary/50 font-medium">Effectifs inscrits par promotion et département</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingUser(!isAddingUser)}
                className="px-3.5 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:opacity-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                {isAddingUser ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{isAddingUser ? "Fermer le formulaire" : "Inscrire un étudiant"}</span>
              </button>
            </div>

            {/* Form to edit Étudiant */}
            {editingUser && editingUser.role === "Etudiant" && (
              <form onSubmit={handleSaveEditUser} className="mb-6 p-4 rounded-2xl border border-indigo-500/25 bg-indigo-500/5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-500/15">
                  <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <Edit className="w-3.5 h-3.5" /> Modifier l'étudiant #{String(editingUser.id).slice(0, 8)}
                  </h4>
                  <button type="button" onClick={() => setEditingUser(null)} className="text-secondary/50 hover:text-secondary p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Nom</label>
                    <input type="text" required value={editUserNom} onChange={(e) => setEditUserNom(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Prénom</label>
                    <input type="text" required value={editUserPrenom} onChange={(e) => setEditUserPrenom(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Email (Non modifiable)</label>
                    <input type="email" disabled value={editUserEmail} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/10 text-xs text-secondary/60 font-medium cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Matricule</label>
                    <input type="text" value={editUserMatricule} onChange={(e) => setEditUserMatricule(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500" />
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2 border-t border-indigo-500/15">
                  <button type="button" onClick={() => setEditingUser(null)} className="px-3.5 py-1.5 rounded-xl border border-secondary/20 text-xs font-semibold text-secondary/70 hover:bg-secondary/5">Annuler</button>
                  <button type="submit" disabled={actionLoading} className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50">
                    {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{actionLoading ? "Enregistrement..." : "Enregistrer les modifications"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Form to add Étudiant */}
            {isAddingUser && (
              <form onSubmit={(e) => handleAddUserSubmit(e, "Etudiant")} className="mb-6 p-4 rounded-2xl border border-accent/20 bg-accent/5 space-y-3">
                <h4 className="text-xs font-bold text-accent flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Inscription d'un nouvel étudiant
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Nom</label>
                    <input type="text" required placeholder="ex: Trabelsi" value={newUserNom} onChange={(e) => setNewUserNom(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Prénom</label>
                    <input type="text" required placeholder="ex: Yasmine" value={newUserPrenom} onChange={(e) => setNewUserPrenom(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Email</label>
                    <input type="email" required placeholder="etudiant@iset.tn" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">
                      Matricule <span className="text-[10px] text-accent font-normal">(servira de mot de passe)</span>
                    </label>
                    <input type="text" placeholder="ex: ETU-2026-0982" value={newUserMatricule} onChange={(e) => setNewUserMatricule(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddingUser(false)} className="px-3 py-1.5 rounded-xl border border-secondary/20 text-xs font-semibold text-secondary/70 hover:bg-secondary/5">Annuler</button>
                  <button type="submit" disabled={actionLoading} className="px-4 py-1.5 rounded-xl bg-accent text-white text-xs font-bold hover:opacity-95 flex items-center gap-1.5 disabled:opacity-50">
                    {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{actionLoading ? "Inscription en cours..." : "Valider l'inscription"}</span>
                  </button>
                </div>
              </form>
            )}

            {loadingData ? (
              <TableLoadingSkeleton rows={4} cols={6} />
            ) : usersList.filter((u) => u.role === "Etudiant").length === 0 ? (
              <div className="py-8 text-center text-secondary/50 text-xs">Aucun étudiant trouvé.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-secondary/10 text-[10px] font-extrabold text-secondary/50 uppercase tracking-wider">
                      <th className="py-3 px-3">ID</th>
                      <th className="py-3 px-3">Nom</th>
                      <th className="py-3 px-3">Prénom</th>
                      <th className="py-3 px-3">Email</th>
                      <th className="py-3 px-3">Matricule</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/10">
                    {usersList
                      .filter((u) => u.role === "Etudiant")
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-secondary/5 transition-colors">
                          <td className="py-3.5 px-3 font-semibold text-secondary/60">#{String(u.id).slice(0, 8)}</td>
                          <td className="py-3.5 px-3 text-secondary font-medium">{u.nom}</td>
                          <td className="py-3.5 px-3 text-secondary">{u.prenom}</td>
                          <td className="py-3.5 px-3 text-secondary font-mono text-xs">{u.email}</td>
                          <td className="py-3.5 px-3 text-secondary font-mono text-xs">{u.matricule || ("ETU-" + String(u.id).slice(0, 4))}</td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditUser(u)}
                                title="Modifier cet étudiant"
                                className="p-1.5 rounded-lg text-secondary/60 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={deletingId === u.id}
                                onClick={() => handleDeleteUser(u.id, "Étudiant")}
                                title="Supprimer"
                                className="p-1.5 rounded-lg text-secondary/60 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-40"
                              >
                                {deletingId === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" /> : <Trash2 className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: GÉRER DÉPARTEMENT ================= */}
      {activeTab === "departements" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-secondary/10">
              <div>
                <h3 className="text-sm font-extrabold text-secondary">Départements</h3>
                <p className="text-[11px] text-secondary/50 font-medium">Départements pédagogiques et désignation des directeurs</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingDepartement(!isAddingDepartement)}
                  className="px-3.5 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:opacity-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-xs"
                >
                  {isAddingDepartement ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{isAddingDepartement ? "Fermer" : "Nouveau département"}</span>
                </button>
              </div>
            </div>

            {/* Modal / Form to Edit Département & Select Directeur de Département from existing Enseignants */}
            {editingDept && (
              <form onSubmit={handleSaveEditDepartement} className="mb-6 p-5 rounded-2xl border border-purple-500/25 bg-purple-500/5 space-y-4 animate-fadeIn shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-purple-500/15">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    <span>Modifier le département &amp; Choisir le Directeur (parmi les enseignants)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingDept(null)}
                    className="p-1 rounded-lg text-secondary/50 hover:text-secondary hover:bg-secondary/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Nom du département</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Technologies de l'Informatique"
                      value={editDeptNom}
                      onChange={(e) => {
                        const newNom = e.target.value;
                        setEditDeptNom(newNom);
                        setEditDeptCode(generateDepartmentCode(newNom));
                      }}
                      className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Code (Abréviation)</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: TI"
                      value={editDeptCode}
                      onChange={(e) => setEditDeptCode(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">
                      Directeur de Département (Enseignant)
                    </label>
                    <select
                      value={selectedEnseignantIdForDept}
                      onChange={(e) => setSelectedEnseignantIdForDept(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-purple-500"
                    >
                      <option value="">-- Aucun enseignant assigné --</option>
                      {usersList
                        .filter((u) => u.role === "Enseignant" || u.role === "DirecteurDepartement")
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.prenom} {t.nom} ({t.grade || "Enseignant"} · {t.specialite || "Spécialité"})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-secondary/60">
                  💡 <em>Sélectionnez un enseignant existant : son compte sera automatiquement désigné Directeur de Département sans avoir besoin de recréer un compte ni mot de passe.</em>
                </p>

                <div className="pt-2 flex justify-end gap-2 border-t border-purple-500/15">
                  <button
                    type="button"
                    onClick={() => setEditingDept(null)}
                    className="px-3.5 py-1.5 rounded-xl border border-secondary/20 text-xs font-semibold text-secondary/70 hover:bg-secondary/5"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{actionLoading ? "Enregistrement..." : "Enregistrer les modifications"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Form to add Département */}
            {isAddingDepartement && (
              <form onSubmit={handleAddDepartement} className="mb-6 p-4 rounded-2xl border border-accent/20 bg-accent/5 space-y-3">
                <h4 className="text-xs font-bold text-accent flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Créer un nouveau département
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Nom du département</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Génie Civil"
                      value={deptNom}
                      onChange={(e) => {
                        const newNom = e.target.value;
                        setDeptNom(newNom);
                        setDeptCode(generateDepartmentCode(newNom));
                      }}
                      className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Code (Abréviation)</label>
                    <input type="text" required placeholder="ex: GC" value={deptCode} onChange={(e) => setDeptCode(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">
                      Directeur de Département (Enseignant)
                    </label>
                    <select
                      value={newDeptEnseignantId}
                      onChange={(e) => setNewDeptEnseignantId(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent"
                    >
                      <option value="">-- Aucun enseignant assigné --</option>
                      {usersList
                        .filter((u) => u.role === "Enseignant" || u.role === "DirecteurDepartement")
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.prenom} {t.nom} ({t.grade || "Enseignant"} · {t.specialite || "Spécialité"})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => { setIsAddingDepartement(false); setNewDeptEnseignantId(""); }} className="px-3 py-1.5 rounded-xl border border-secondary/20 text-xs font-semibold text-secondary/70 hover:bg-secondary/5">Annuler</button>
                  <button type="submit" disabled={actionLoading} className="px-4 py-1.5 rounded-xl bg-accent text-white text-xs font-bold hover:opacity-95 flex items-center gap-1.5 disabled:opacity-50">
                    {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{actionLoading ? "Création..." : "Enregistrer le département"}</span>
                  </button>
                </div>
              </form>
            )}

            {loadingData ? (
              <TableLoadingSkeleton rows={4} cols={5} />
            ) : departementsList.length === 0 ? (
              <div className="py-8 text-center text-secondary/50 text-xs">Aucun département trouvé.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-secondary/10 text-[10px] font-extrabold text-secondary/50 uppercase tracking-wider">
                      <th className="py-3 px-3">ID</th>
                      <th className="py-3 px-3">Nom</th>
                      <th className="py-3 px-3">Code</th>
                      <th className="py-3 px-3">Responsable</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/10">
                    {departementsList.map((d) => (
                      <tr key={d.id} className="hover:bg-secondary/5 transition-colors">
                        <td className="py-3.5 px-3 font-semibold text-secondary/60">#{d.id}</td>
                        <td className="py-3.5 px-3 text-secondary font-medium">{d.nom}</td>
                        <td className="py-3.5 px-3 text-secondary font-mono text-xs">{d.code}</td>
                        <td className="py-3.5 px-3 text-secondary">{d.responsable}</td>
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditDepartement(d)}
                              title="Modifier &amp; Choisir le Directeur"
                              className="p-1.5 rounded-lg text-secondary/60 hover:text-purple-600 hover:bg-purple-500/10 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Modifier</span>
                            </button>
                            <button
                              type="button"
                              disabled={deletingId === d.id}
                              onClick={() => handleDeleteDepartement(d.id)}
                              title="Supprimer"
                              className="p-1.5 rounded-lg text-secondary/60 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-40"
                            >
                              {deletingId === d.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Directeurs de Département Table / Section */}
            <div className="mt-8 pt-6 border-t border-secondary/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xs font-bold text-secondary flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    Directeurs de Département enregistrés
                  </h4>
                  <p className="text-[10px] text-secondary/50">Responsables de départements ayant accès au portail</p>
                </div>
              </div>

              {usersList.filter((u) => u.role === "DirecteurDepartement").length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-secondary/20 text-center text-secondary/50 text-xs">
                  Aucun compte Directeur de Département créé pour le moment.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-secondary/10">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-secondary/5 border-b border-secondary/10 text-[10px] font-extrabold text-secondary/50 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Nom complet</th>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Bureau</th>
                        <th className="py-2.5 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/10">
                      {usersList
                        .filter((u) => u.role === "DirecteurDepartement")
                        .map((u) => (
                          <tr key={u.id} className="hover:bg-secondary/5 transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-secondary">
                              {u.nom} {u.prenom}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-xs text-secondary/80">{u.email}</td>
                            <td className="py-2.5 px-3 text-secondary/70">{u.bureau || "Direction"}</td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditUser(u)}
                                  title="Modifier ce directeur"
                                  className="p-1 rounded-md text-secondary/50 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={deletingId === u.id}
                                  onClick={() => handleDeleteUser(u.id, "Directeur de Département")}
                                  title="Supprimer ce compte"
                                  className="p-1 rounded-md text-secondary/50 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-40"
                                >
                                  {deletingId === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" /> : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: GÉRER LES CLASSES ================= */}
      {activeTab === "classes" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-secondary/10">
              <div>
                <h3 className="text-sm font-extrabold text-secondary">Classes & Filières</h3>
                <p className="text-[11px] text-secondary/50 font-medium">Structure des promotions</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingClasse(!isAddingClasse)}
                className="px-3.5 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:opacity-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                {isAddingClasse ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{isAddingClasse ? "Fermer" : "Nouvelle classe"}</span>
              </button>
            </div>

            {/* Form to edit Classe */}
            {editingClasse && (
              <form onSubmit={handleSaveEditClasse} className="mb-6 p-4 rounded-2xl border border-indigo-500/25 bg-indigo-500/5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-500/15">
                  <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <Edit className="w-3.5 h-3.5" /> Modifier la classe #{editingClasse.id}
                  </h4>
                  <button type="button" onClick={() => setEditingClasse(null)} className="text-secondary/50 hover:text-secondary p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Nom de la classe</label>
                    <input type="text" required value={editClasseNom} onChange={(e) => setEditClasseNom(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Niveau</label>
                    <input type="text" required value={editClasseNiveau} onChange={(e) => setEditClasseNiveau(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Effectif</label>
                    <input type="number" required value={editClasseEffectif} onChange={(e) => setEditClasseEffectif(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Département</label>
                    <select value={editClasseDeptId} onChange={(e) => setEditClasseDeptId(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500">
                      <option value="">Choisir un département</option>
                      {departementsList.map((d) => (
                        <option key={d.id} value={d.id}>{d.nom} ({d.code})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2 border-t border-indigo-500/15">
                  <button type="button" onClick={() => setEditingClasse(null)} className="px-3.5 py-1.5 rounded-xl border border-secondary/20 text-xs font-semibold text-secondary/70 hover:bg-secondary/5">Annuler</button>
                  <button type="submit" disabled={actionLoading} className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50">
                    {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{actionLoading ? "Enregistrement..." : "Enregistrer les modifications"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Form to add Classe */}
            {isAddingClasse && (
              <form onSubmit={handleAddClasse} className="mb-6 p-4 rounded-2xl border border-accent/20 bg-accent/5 space-y-3">
                <h4 className="text-xs font-bold text-accent flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Créer une nouvelle classe
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Nom de la classe</label>
                    <input type="text" required placeholder="ex: DSI3.1" value={classeNom} onChange={(e) => setClasseNom(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Niveau</label>
                    <input type="text" required placeholder="ex: Licence 3ème Année" value={classeNiveau} onChange={(e) => setClasseNiveau(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Effectif</label>
                    <input type="number" required value={classeEffectif} onChange={(e) => setClasseEffectif(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Département</label>
                    <select value={classeDeptId} onChange={(e) => setClasseDeptId(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent">
                      <option value="">Choisir un département</option>
                      {departementsList.map((d) => (
                        <option key={d.id} value={d.id}>{d.nom} ({d.code})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddingClasse(false)} className="px-3 py-1.5 rounded-xl border border-secondary/20 text-xs font-semibold text-secondary/70 hover:bg-secondary/5">Annuler</button>
                  <button type="submit" disabled={actionLoading} className="px-4 py-1.5 rounded-xl bg-accent text-white text-xs font-bold hover:opacity-95 flex items-center gap-1.5 disabled:opacity-50">
                    {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{actionLoading ? "Création..." : "Enregistrer la classe"}</span>
                  </button>
                </div>
              </form>
            )}

            {loadingData ? (
              <TableLoadingSkeleton rows={4} cols={6} />
            ) : classesList.length === 0 ? (
              <div className="py-8 text-center text-secondary/50 text-xs">Aucune classe trouvée.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-secondary/10 text-[10px] font-extrabold text-secondary/50 uppercase tracking-wider">
                      <th className="py-3 px-3">ID</th>
                      <th className="py-3 px-3">Nom</th>
                      <th className="py-3 px-3">Niveau</th>
                      <th className="py-3 px-3 text-center">Effectif</th>
                      <th className="py-3 px-3">Département</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/10">
                    {classesList.map((c) => (
                      <tr key={c.id} className="hover:bg-secondary/5 transition-colors">
                        <td className="py-3.5 px-3 font-semibold text-secondary/60">#{c.id}</td>
                        <td className="py-3.5 px-3 text-secondary font-medium">{c.nom}</td>
                        <td className="py-3.5 px-3 text-secondary">{c.niveau}</td>
                        <td className="py-3.5 px-3 text-center text-secondary font-bold">{c.effectif}</td>
                        <td className="py-3.5 px-3 text-secondary">{c.departement}</td>
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditClasse(c)}
                              title="Modifier cette classe"
                              className="p-1.5 rounded-lg text-secondary/60 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={deletingId === c.id}
                              onClick={() => handleDeleteClasse(c.id)}
                              title="Supprimer"
                              className="p-1.5 rounded-lg text-secondary/60 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-40"
                            >
                              {deletingId === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}



      {/* ================= TAB 6: GÉRER LES SALLES ================= */}
      {activeTab === "salles" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider block">Total Salles</span>
              <span className="text-2xl font-extrabold text-secondary mt-1 block">{sallesList.length}</span>
            </div>
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Salles de Cours</span>
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 block">
                {sallesList.filter(s => s.type === "COURS").length}
              </span>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Laboratoires TP</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                {sallesList.filter(s => s.type === "TP").length}
              </span>
            </div>
            <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider block">Capacité Totale</span>
              <span className="text-2xl font-extrabold text-secondary mt-1 block">
                {sallesList.reduce((acc, s) => acc + s.capacite, 0)} places
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-secondary/10">
                <h3 className="text-sm font-extrabold text-secondary">Inventaire des Salles</h3>
              </div>
              {loadingData ? (
                <TableLoadingSkeleton rows={4} cols={5} />
              ) : sallesList.length === 0 ? (
                <div className="py-8 text-center text-secondary/50 text-xs">Aucune salle trouvée.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-secondary/10 text-[10px] font-extrabold text-secondary/50 uppercase tracking-wider">
                        <th className="py-3 px-3">Numéro</th><th className="py-3 px-3">Étage</th><th className="py-3 px-3">Capacité</th><th className="py-3 px-3 text-center">Type</th><th className="py-3 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/10">
                      {sallesList.map((s) => (
                        <tr key={s.id} className="hover:bg-secondary/5 transition-colors">
                          <td className="py-3.5 px-3 font-semibold text-secondary">{s.numero}</td>
                          <td className="py-3.5 px-3 text-secondary/70">{s.etage}</td>
                          <td className="py-3.5 px-3 text-secondary font-medium">{s.capacite} places</td>
                          <td className="py-3.5 px-3 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${s.type === "COURS" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"}`}>{s.type}</span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditSalle(s)}
                                title="Modifier cette salle"
                                className="p-1.5 rounded-lg text-secondary/60 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={deletingId === s.id}
                                onClick={() => handleDeleteSalle(s.id)}
                                className="p-1.5 rounded-lg text-secondary/60 hover:text-rose-500 hover:bg-rose-500/5 transition-colors disabled:opacity-40"
                              >
                                {deletingId === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" /> : <Trash2 className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
              {editingSalle ? (
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-indigo-500/20">
                    <h3 className="text-sm font-extrabold text-indigo-400 flex items-center gap-2">
                      <Edit className="w-4 h-4 text-indigo-400" /> Modifier la salle #{editingSalle.id}
                    </h3>
                    <button type="button" onClick={() => setEditingSalle(null)} className="text-secondary/50 hover:text-secondary p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveEditSalle} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1">Numéro Salle</label>
                      <input type="text" required value={editSalleNumero} onChange={(e) => setEditSalleNumero(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1">Capacité</label>
                      <input type="number" required value={editSalleCapacite} onChange={(e) => setEditSalleCapacite(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1">Type de Salle</label>
                      <select value={editSalleType} onChange={(e) => setEditSalleType(e.target.value as "COURS" | "TP")} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500">
                        <option value="COURS">COURS</option>
                        <option value="TP">TP (Travaux Pratiques)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1">Étage</label>
                      <input type="text" value={editSalleEtage} onChange={(e) => setEditSalleEtage(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500" />
                    </div>
                    <div className="pt-2 flex gap-2">
                      <button type="button" onClick={() => setEditingSalle(null)} className="w-1/3 h-10 rounded-xl border border-secondary/20 text-xs font-semibold text-secondary/70 hover:bg-secondary/5">Annuler</button>
                      <button type="submit" disabled={actionLoading} className="w-2/3 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>{actionLoading ? "Enregistrement..." : "Enregistrer"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-extrabold text-secondary flex items-center gap-2 mb-4 pb-2 border-b border-secondary/10">
                    <Plus className="w-4 h-4 text-accent" /> Ajouter une salle
                  </h3>
                  <form onSubmit={handleAddSalle} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1">Numéro Salle</label>
                      <input type="text" required placeholder="ex: LI2.5" value={salleNumero} onChange={(e) => setSalleNumero(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1">Capacité</label>
                      <input type="number" required placeholder="ex: 30" value={salleCapacite} onChange={(e) => setSalleCapacite(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1">Type de Salle</label>
                      <select value={salleType} onChange={(e) => setSalleType(e.target.value as "COURS" | "TP")} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent">
                        <option value="COURS">COURS</option>
                        <option value="TP">TP (Travaux Pratiques)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1">Étage</label>
                      <input type="text" value={salleEtage} onChange={(e) => setSalleEtage(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                    </div>
                    <div className="pt-2">
                      <button type="submit" disabled={actionLoading} className="w-full h-10 rounded-xl bg-accent text-white text-xs font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        <span>{actionLoading ? "Enregistrement..." : "Enregistrer la salle"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: CRÉER LES GROUPES TP ================= */}
      {activeTab === "groupes" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-secondary/10">
                <h3 className="text-sm font-extrabold text-secondary">Groupes TP Établis</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-secondary/10 text-[10px] font-extrabold text-secondary/50 uppercase tracking-wider">
                      <th className="py-3 px-3">Nom</th><th className="py-3 px-3">Classe</th><th className="py-3 px-3">Capacité</th><th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/10">
                    {groupesList.map((g) => (
                      <tr key={g.id} className="hover:bg-secondary/5 transition-colors">
                        <td className="py-3.5 px-3 font-semibold text-secondary">{g.nom}</td>
                        <td className="py-3.5 px-3 text-secondary/70">{g.classe}</td>
                        <td className="py-3.5 px-3 text-secondary font-medium">{g.capacite} étudiants max</td>
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditGroupe(g)}
                              title="Modifier ce groupe TP"
                              className="p-1.5 rounded-lg text-secondary/60 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={deletingId === g.id}
                              onClick={() => handleDeleteGroupe(g.id)}
                              title="Supprimer ce groupe TP"
                              className="p-1.5 rounded-lg text-secondary/60 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-40"
                            >
                              {deletingId === g.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
              {editingGroupe ? (
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-secondary/10">
                    <h3 className="text-sm font-extrabold text-secondary flex items-center gap-2">
                      <Edit className="w-4 h-4 text-indigo-500" /> Modifier le groupe TP #{editingGroupe.id}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingGroupe(null)}
                      className="p-1 rounded-lg text-secondary/50 hover:text-secondary hover:bg-secondary/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveEditGroupe} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1">Nom du groupe</label>
                      <input
                        type="text"
                        required
                        value={editGroupeNom}
                        onChange={(e) => setEditGroupeNom(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1">Classe rattachée</label>
                      <select
                        value={editGroupeClasse}
                        onChange={(e) => setEditGroupeClasse(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500"
                      >
                        {classesList.map((c) => (
                          <option key={c.id} value={c.nom}>
                            {c.nom} ({c.niveau} · {c.effectif} étudiants)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1">Capacité maximale</label>
                      <input
                        type="number"
                        required
                        value={editGroupeCapacite}
                        onChange={(e) => setEditGroupeCapacite(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingGroupe(null)}
                        className="w-1/3 h-10 rounded-xl border border-secondary/20 text-xs font-semibold text-secondary/70 hover:bg-secondary/5"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="w-2/3 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>{actionLoading ? "Enregistrement..." : "Enregistrer"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-extrabold text-secondary flex items-center gap-2 mb-4 pb-2 border-b border-secondary/10">
                    <Plus className="w-4 h-4 text-accent" /> Créer un groupe TP
                  </h3>
                  <form onSubmit={handleAddGroupe} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1">Nom du groupe</label>
                      <input type="text" required placeholder="ex: Groupe TP 3" value={groupeNom} onChange={(e) => setGroupeNom(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-secondary/70">Classe rattachée</label>
                        {(() => {
                          const matchedCl = classesList.find((c) => c.nom === groupeClasse);
                          const totalEff = matchedCl ? matchedCl.effectif : 28;
                          const usedEff = groupesList
                            .filter((g) => g.classe === groupeClasse)
                            .reduce((sum, g) => sum + (g.capacite || 0), 0);
                          const remaining = Math.max(0, totalEff - usedEff);
                          return (
                            <span className="text-[10px] font-bold text-accent">
                              Effectif : {usedEff}/{totalEff} ({remaining} place(s) restante(s))
                            </span>
                          );
                        })()}
                      </div>
                      <select value={groupeClasse} onChange={(e) => setGroupeClasse(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent">
                        {classesList.map(c => <option key={c.id} value={c.nom}>{c.nom} ({c.niveau} · {c.effectif} étudiants)</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1">Capacité maximale</label>
                      <input type="number" required placeholder="ex: 15" value={groupeCapacite} onChange={(e) => setGroupeCapacite(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                    </div>
                    <div className="pt-2">
                      <button type="submit" disabled={actionLoading} className="w-full h-10 rounded-xl bg-accent text-white text-xs font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        <span>{actionLoading ? "Création..." : "Créer le groupe"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 8: ÉTABLIR INSCRIPTION ================= */}
      {activeTab === "inscriptions" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-secondary/10">
                <h3 className="text-sm font-extrabold text-secondary">Campagnes d'Inscription Universitaire</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-secondary/10 text-[10px] font-extrabold text-secondary/50 uppercase tracking-wider">
                      <th className="py-3 px-3">Année Univ.</th><th className="py-3 px-3">Date Début</th><th className="py-3 px-3">Date Fin</th><th className="py-3 px-3 text-center">Inscrits</th><th className="py-3 px-3 text-center">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/10">
                    {inscriptionsList.map((insc) => (
                      <tr key={insc.id} className="hover:bg-secondary/5 transition-colors">
                        <td className="py-3.5 px-3 font-semibold text-secondary">{insc.annee}</td>
                        <td className="py-3.5 px-3 text-secondary font-mono">{insc.dateDebut}</td>
                        <td className="py-3.5 px-3 text-secondary font-mono">{insc.dateFin}</td>
                        <td className="py-3.5 px-3 text-center text-secondary font-bold">{insc.inscrits}</td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${insc.statut === "Ouverte" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-secondary/10 text-secondary border-secondary/20"}`}>{insc.statut}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
              <h3 className="text-sm font-extrabold text-secondary flex items-center gap-2 mb-4 pb-2 border-b border-secondary/10">
                <GraduationCap className="w-4 h-4 text-accent" /> Ouvrir une période
              </h3>
              <form onSubmit={handleAddInscription} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">Année Universitaire</label>
                  <select
                    value={anneeInsc}
                    onChange={(e) => setAnneeInsc(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent"
                  >
                    <option value="2024 - 2025">2024 - 2025</option>
                    <option value="2025 - 2026">2025 - 2026</option>
                    <option value="2026 - 2027">2026 - 2027</option>
                    <option value="2027 - 2028">2027 - 2028</option>
                    <option value="2028 - 2029">2028 - 2029</option>
                    <option value="2029 - 2030">2029 - 2030</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">Date Début</label>
                  <input type="date" required value={dateDebutInsc} onChange={(e) => setDateDebutInsc(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">Date Fin</label>
                  <input type="date" required value={dateFinInsc} onChange={(e) => setDateFinInsc(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full h-10 rounded-xl bg-accent text-white text-xs font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /><span>Établir la période</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 9: CONSULTER DASHBOARD ================= */}
      {activeTab === "dashboard" && (
        <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-secondary">Dashboard Général de l'Établissement</h3>
            <p className="text-[11px] text-secondary/50 font-medium mt-1">Supervision de l'ensemble des départements, salles et effectifs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-secondary/15 bg-secondary/5 p-5">
              <span className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider block">Départements</span>
              <span className="text-2xl font-extrabold text-secondary mt-1 block">{departementsList.length}</span>
            </div>
            <div className="rounded-2xl border border-secondary/15 bg-secondary/5 p-5">
              <span className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider block">Enseignants</span>
              <span className="text-2xl font-extrabold text-secondary mt-1 block">{usersList.filter(u => u.role === "Enseignant").length}</span>
            </div>
            <div className="rounded-2xl border border-secondary/15 bg-secondary/5 p-5">
              <span className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider block">Étudiants</span>
              <span className="text-2xl font-extrabold text-secondary mt-1 block">{usersList.filter(u => u.role === "Etudiant").length}</span>
            </div>
            <div className="rounded-2xl border border-secondary/15 bg-secondary/5 p-5">
              <span className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider block">Salles Total</span>
              <span className="text-2xl font-extrabold text-secondary mt-1 block">{sallesList.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 10: MON PROFIL ================= */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-secondary/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-secondary">Fiche Directeur d'Établissement</h3>
                  <p className="text-[11px] text-secondary/50 font-medium">Informations officielles de direction</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">Nom</label>
                  <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">Prénom</label>
                  <input type="text" required value={prenom} onChange={(e) => setPrenom(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary/70 mb-1">Email Institutionnel</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent" />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={profileLoading} className="w-full sm:w-auto px-6 h-10 rounded-xl bg-accent text-white text-xs font-bold hover:opacity-95 shadow-md shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50">
                  {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>{profileLoading ? "Enregistrement..." : "Enregistrer les modifications"}</span>
                </button>
              </div>
            </form>

            {/* Password Section */}
            <div className="mt-8 pt-6 border-t border-secondary/10">
              <h4 className="text-xs font-extrabold text-secondary flex items-center gap-2 mb-3">
                <KeyRound className="w-4 h-4 text-accent" /> Modifier le mot de passe
              </h4>
              {passwordError && (
                <div className="p-3 mb-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
              <form onSubmit={handleUpdatePassword} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Mot de passe actuel</label>
                  <input type="password" required value={currentPasswordInput} onChange={(e) => setCurrentPasswordInput(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Nouveau mot de passe</label>
                    <input type="password" required value={newPasswordInput} onChange={(e) => setNewPasswordInput(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary/70 mb-1">Confirmer mot de passe</label>
                    <input type="password" required value={confirmPasswordInput} onChange={(e) => setConfirmPasswordInput(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary" />
                  </div>
                </div>
                <button type="submit" disabled={passwordLoading} className="px-4 h-9 rounded-xl bg-secondary/10 hover:bg-secondary/15 text-xs font-bold text-secondary transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50">
                  {passwordLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{passwordLoading ? "Modification..." : "Mettre à jour le mot de passe"}</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
            <div className="space-y-4 text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl bg-accent/20 border-2 border-accent/40 flex items-center justify-center font-bold text-accent text-3xl shadow-inner">
                {prenom?.[0]}{nom?.[0]}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-secondary">{prenom} {nom}</h4>
                <p className="text-xs text-secondary/60 mt-0.5">{email}</p>
                <span className="inline-block mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-accent/15 text-accent border border-accent/30">
                  Directeur de l'Établissement
                </span>
              </div>
            </div>
            <div className="mt-6 p-3 rounded-xl bg-accent/10 border border-accent/20 text-[11px] text-secondary/80 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
              <span>Pouvoir d'administration global sur l'établissement.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
