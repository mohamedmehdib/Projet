"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  School,
  Sparkles,
  Plus,
  Trash2,
  Edit,
  AlertTriangle,
  CheckCircle2,
  Printer,
  RefreshCw,
  X,
  Layers,
  GraduationCap,
  DoorOpen,
  Filter,
  Check,
  AlertCircle,
  Wand2,
} from "lucide-react";
import { SupabaseService } from "@/lib/supabaseDb";
import {
  fetchLiveTimetable,
  TIME_SLOTS,
  DAYS,
  SeanceView,
  formatJour,
  matchTimeSlot,
} from "@/lib/timetableService";
import {
  FullSeanceRecord,
  CandidateSeance,
  validateSeanceConflicts,
  autoGenerateTimetable,
  SubjectCurriculumRequirement,
  normalizeJourToDb,
  normalizeJourToDisplay,
  slotLabelToTimes,
  SeanceType,
} from "@/lib/timetableEngine";
import { TimetableLoadingSkeleton } from "@/components/LoadingStates";

interface TimetableManagerProps {
  initialClasseId?: number;
  canEdit?: boolean;
  title?: string;
  subtitle?: string;
}

export default function TimetableManager({
  initialClasseId,
  canEdit = true,
  title,
  subtitle,
}: TimetableManagerProps) {
  // Navigation / View modes
  const [viewMode, setViewMode] = useState<"classe" | "enseignant" | "salle">("classe");
  const [selectedClasseId, setSelectedClasseId] = useState<number>(initialClasseId || 0);
  const [selectedEnseignantId, setSelectedEnseignantId] = useState<string>("");
  const [selectedSalleId, setSelectedSalleId] = useState<number>(0);

  // Database collections
  const [classesList, setClassesList] = useState<any[]>([]);
  const [sallesList, setSallesList] = useState<any[]>([]);
  const [matieresList, setMatieresList] = useState<any[]>([]);
  const [teachersList, setTeachersList] = useState<any[]>([]);
  const [allSeances, setAllSeances] = useState<FullSeanceRecord[]>([]);

  // State
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeanceId, setEditingSeanceId] = useState<number | null>(null);
  const [modalForm, setModalForm] = useState<{
    jour: string;
    timeSlot: string;
    classeId: number;
    matiereId: number;
    type: SeanceType;
    enseignantId: string;
    salleId: number;
  }>({
    jour: "Lundi",
    timeSlot: TIME_SLOTS[0].timeLabel,
    classeId: 0,
    matiereId: 0,
    type: "COURS",
    enseignantId: "",
    salleId: 0,
  });
  const [savingSeance, setSavingSeance] = useState(false);

  // Auto-Generation Modal state
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [autoRequirements, setAutoRequirements] = useState<SubjectCurriculumRequirement[]>([]);
  const [autoGenResult, setAutoGenResult] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApplyingAuto, setIsApplyingAuto] = useState(false);

  // Confirmation for clearing timetable
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  // Load all foundational data
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [classes, salles, matieres, profiles, seances] = await Promise.all([
        SupabaseService.getClasses().catch(() => []),
        SupabaseService.getSalles().catch(() => []),
        SupabaseService.getMatieres().catch(() => []),
        SupabaseService.getProfiles().catch(() => []),
        SupabaseService.getSeances().catch(() => []),
      ]);

      const formattedClasses = (classes || []).map((c: any) => ({
        id: c.id,
        nom: c.nom,
        niveau: c.niveau,
        effectif: c.effectif || 30,
      }));

      const formattedSalles = (salles || []).map((s: any) => ({
        id: s.id,
        numero: s.numero,
        capacite: s.capacite || 30,
        type: s.type || "COURS",
      }));

      const teachers = (profiles || [])
        .filter((p: any) => p.role === "Enseignant")
        .map((t: any) => ({
          id: t.id,
          nom: t.nom,
          prenom: t.prenom,
          email: t.email,
        }));

      setClassesList(formattedClasses);
      setSallesList(formattedSalles);
      setMatieresList(matieres || []);
      setTeachersList(teachers);
      setAllSeances(seances || []);

      // Default selections if not set
      if (!selectedClasseId && formattedClasses.length > 0) {
        setSelectedClasseId(initialClasseId || formattedClasses[0].id);
      }
      if (!selectedEnseignantId && teachers.length > 0) {
        setSelectedEnseignantId(teachers[0].id);
      }
      if (!selectedSalleId && formattedSalles.length > 0) {
        setSelectedSalleId(formattedSalles[0].id);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des données emploi du temps:", err);
      showNotification("error", "Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Currently selected class object
  const currentClasse = useMemo(() => {
    return classesList.find((c) => c.id === selectedClasseId) || classesList[0] || null;
  }, [classesList, selectedClasseId]);

  // Currently selected teacher object
  const currentTeacher = useMemo(() => {
    return teachersList.find((t) => t.id === selectedEnseignantId) || null;
  }, [teachersList, selectedEnseignantId]);

  // Currently selected room object
  const currentSalle = useMemo(() => {
    return sallesList.find((s) => s.id === selectedSalleId) || null;
  }, [sallesList, selectedSalleId]);

  // Filtered timetable records depending on viewMode
  const displayedSeances = useMemo(() => {
    return allSeances
      .filter((s) => {
        if (viewMode === "classe") {
          return selectedClasseId ? s.classe_id === selectedClasseId : false;
        }
        if (viewMode === "enseignant") {
          return selectedEnseignantId ? s.enseignant_id === selectedEnseignantId : false;
        }
        if (viewMode === "salle") {
          return selectedSalleId ? s.salle_id === selectedSalleId : false;
        }
        return false;
      })
      .map((item) => {
        const enseignantNom = item.profiles
          ? `${item.profiles.prenom} ${item.profiles.nom}`.trim()
          : "Non assigné";

        return {
          id: item.id!,
          jour: normalizeJourToDisplay(item.jour),
          timeSlot: matchTimeSlot(item.heure_debut, item.heure_fin),
          matiere: item.matieres?.intitule || "Matière",
          enseignant: enseignantNom,
          salle: item.salles?.numero || "Salle",
          groupe: item.classes?.nom || "Groupe",
          type: item.type,
          colorVariant: item.color_variant,
          raw: item,
        };
      });
  }, [allSeances, viewMode, selectedClasseId, selectedEnseignantId, selectedSalleId]);

  // Conflict validation for the currently opened Add/Edit modal form
  const modalConflictReport = useMemo(() => {
    if (!isModalOpen) {
      return { hasConflict: false, errors: [], warnings: [], details: {} };
    }

    const candidate: CandidateSeance = {
      id: editingSeanceId || undefined,
      jour: modalForm.jour,
      timeSlot: modalForm.timeSlot,
      matiereId: modalForm.matiereId,
      type: modalForm.type,
      classeId: modalForm.classeId,
      enseignantId: modalForm.enseignantId || null,
      salleId: modalForm.salleId || null,
    };

    return validateSeanceConflicts(candidate, allSeances, {
      salles: sallesList,
      classes: classesList,
      teachers: teachersList,
    });
  }, [isModalOpen, modalForm, editingSeanceId, allSeances, sallesList, classesList, teachersList]);

  // Open modal for creating a new session (optionally in a clicked slot)
  const handleOpenAddModal = (defaultJour?: string, defaultSlot?: string) => {
    setEditingSeanceId(null);
    setModalForm({
      jour: defaultJour || "Lundi",
      timeSlot: defaultSlot || TIME_SLOTS[0].timeLabel,
      classeId: selectedClasseId || (classesList[0]?.id ?? 0),
      matiereId: matieresList[0]?.id ?? 0,
      type: "COURS",
      enseignantId: viewMode === "enseignant" ? selectedEnseignantId : (teachersList[0]?.id || ""),
      salleId: viewMode === "salle" ? selectedSalleId : (sallesList[0]?.id || 0),
    });
    setIsModalOpen(true);
  };

  // Open modal to edit an existing session
  const handleOpenEditModal = (seanceView: SeanceView) => {
    const raw = seanceView.raw as FullSeanceRecord;
    setEditingSeanceId(raw.id || null);
    setModalForm({
      jour: normalizeJourToDisplay(raw.jour),
      timeSlot: matchTimeSlot(raw.heure_debut, raw.heure_fin),
      classeId: raw.classe_id || 0,
      matiereId: raw.matiere_id || 0,
      type: raw.type || "COURS",
      enseignantId: raw.enseignant_id || "",
      salleId: raw.salle_id || 0,
    });
    setIsModalOpen(true);
  };

  // Save (Create or Update) session
  const handleSaveSeance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalConflictReport.hasConflict) {
      alert("Veuillez résoudre les conflits avant d'enregistrer.");
      return;
    }

    const times = slotLabelToTimes(modalForm.timeSlot);
    const dbJour = normalizeJourToDb(modalForm.jour);

    try {
      setSavingSeance(true);
      const payload = {
        jour: dbJour,
        heure_debut: times.heure_debut,
        heure_fin: times.heure_fin,
        type: modalForm.type,
        color_variant: modalForm.type === "COURS" ? "blue" : modalForm.type === "TP" ? "purple" : "emerald",
        matiere_id: Number(modalForm.matiereId),
        classe_id: Number(modalForm.classeId),
        salle_id: modalForm.salleId ? Number(modalForm.salleId) : null,
        enseignant_id: modalForm.enseignantId || null,
      };

      if (editingSeanceId) {
        await SupabaseService.updateSeance(editingSeanceId, payload);
        showNotification("success", "Séance mise à jour avec succès.");
      } else {
        await SupabaseService.createSeance(payload);
        showNotification("success", "Nouvelle séance ajoutée à l'emploi du temps.");
      }

      setIsModalOpen(false);
      // Reload fresh sessions
      const freshSeances = await SupabaseService.getSeances();
      setAllSeances(freshSeances || []);
    } catch (err: any) {
      console.error("Erreur enregistrement séance:", err);
      showNotification("error", err.message || "Erreur lors de l'enregistrement de la séance.");
    } finally {
      setSavingSeance(false);
    }
  };

  // Delete a session
  const handleDeleteSeance = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette séance ?")) return;

    try {
      await SupabaseService.deleteSeance(id);
      setAllSeances((prev) => prev.filter((s) => s.id !== id));
      showNotification("success", "Séance supprimée.");
    } catch (err: any) {
      console.error("Erreur suppression séance:", err);
      showNotification("error", "Impossible de supprimer la séance.");
    }
  };

  // Clear all sessions of current class
  const handleClearClassTimetable = async () => {
    if (!selectedClasseId) return;
    try {
      await SupabaseService.deleteSeancesByClasse(selectedClasseId);
      setAllSeances((prev) => prev.filter((s) => s.classe_id !== selectedClasseId));
      setIsConfirmClearOpen(false);
      showNotification("success", `L'emploi du temps de la classe a été entièrement réinitialisé.`);
    } catch (err: any) {
      console.error("Erreur réinitialisation emploi du temps:", err);
      showNotification("error", "Erreur lors de la réinitialisation de l'emploi du temps.");
    }
  };

  // Open Auto-Generation Dialog
  const handleOpenAutoGenerator = () => {
    if (!currentClasse) {
      alert("Veuillez sélectionner une classe.");
      return;
    }

    // Initialize requirements with all subjects (default 1 cours, 1 td, or 1 tp for first subjects)
    const initialReqs: SubjectCurriculumRequirement[] = matieresList.map((m, idx) => ({
      matiereId: m.id,
      code: m.code,
      intitule: m.intitule,
      coursCount: idx < 4 ? 1 : 0,
      tdCount: idx < 2 ? 1 : 0,
      tpCount: idx === 0 || idx === 1 ? 1 : 0,
      preferredTeacherId: teachersList[idx % teachersList.length]?.id || null,
    }));

    setAutoRequirements(initialReqs);
    setAutoGenResult(null);
    setIsAutoModalOpen(true);
  };

  // Run the Auto-Generation Algorithm
  const handleRunAlgorithm = () => {
    if (!currentClasse) return;
    setIsGenerating(true);

    try {
      const result = autoGenerateTimetable(
        currentClasse,
        autoRequirements,
        allSeances,
        {
          salles: sallesList,
          teachers: teachersList,
          matieres: matieresList,
        },
        {
          days: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
          maxSessionsPerDay: 4,
        }
      );

      setAutoGenResult(result);
    } catch (err) {
      console.error("Erreur algorithme auto:", err);
      alert("Erreur lors de l'exécution de l'algorithme d'optimisation.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply auto-generated schedule to the database
  const handleApplyAutoGenerated = async () => {
    if (!autoGenResult || !autoGenResult.scheduled.length || !currentClasse) return;

    try {
      setIsApplyingAuto(true);
      // 1. Clear old sessions for this class
      await SupabaseService.deleteSeancesByClasse(currentClasse.id);

      // 2. Prepare bulk payload
      const payload = autoGenResult.scheduled.map((s: any) => ({
        jour: normalizeJourToDb(s.jour),
        heure_debut: s.heure_debut,
        heure_fin: s.heure_fin,
        type: s.type,
        color_variant: s.color_variant,
        matiere_id: s.matiere_id,
        classe_id: s.classe_id,
        salle_id: s.salle_id,
        enseignant_id: s.enseignant_id,
      }));

      // 3. Bulk insert
      await SupabaseService.bulkCreateSeances(payload);

      // 4. Reload full database
      const freshSeances = await SupabaseService.getSeances();
      setAllSeances(freshSeances || []);

      setIsAutoModalOpen(false);
      showNotification(
        "success",
        `Félicitations ! L'emploi du temps de ${currentClasse.nom} a été généré avec succès (${payload.length} séances planifiées sans conflit).`
      );
    } catch (err: any) {
      console.error("Erreur application emploi du temps:", err);
      showNotification("error", "Erreur lors de l'application de l'emploi du temps généré.");
    } finally {
      setIsApplyingAuto(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center justify-between gap-3 shadow-lg animate-fadeIn ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 border-red-500/25 text-red-600 dark:text-red-400"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header & Controls */}
      <div className="rounded-2xl border border-secondary/15 bg-primary/95 p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-secondary/60 uppercase tracking-wider mr-1">
              Affichage :
            </span>
            <button
              onClick={() => setViewMode("classe")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                viewMode === "classe"
                  ? "bg-accent text-primary border-accent shadow-sm"
                  : "bg-secondary/5 text-secondary hover:bg-secondary/10 border-secondary/15"
              }`}
            >
              <School className="w-3.5 h-3.5" />
              Par Classe
            </button>
            <button
              onClick={() => setViewMode("enseignant")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                viewMode === "enseignant"
                  ? "bg-accent text-primary border-accent shadow-sm"
                  : "bg-secondary/5 text-secondary hover:bg-secondary/10 border-secondary/15"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Par Enseignant
            </button>
            <button
              onClick={() => setViewMode("salle")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                viewMode === "salle"
                  ? "bg-accent text-primary border-accent shadow-sm"
                  : "bg-secondary/5 text-secondary hover:bg-secondary/10 border-secondary/15"
              }`}
            >
              <DoorOpen className="w-3.5 h-3.5" />
              Par Salle
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {canEdit && (
              <>
                <button
                  onClick={() => handleOpenAddModal()}
                  className="px-3.5 py-2 rounded-xl bg-accent text-primary text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une séance
                </button>

                {viewMode === "classe" && (
                  <>
                    <button
                      onClick={handleOpenAutoGenerator}
                      className="px-3.5 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs font-bold hover:bg-purple-500/25 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Wand2 className="w-4 h-4 text-purple-500 animate-pulse" />
                      Génération auto
                    </button>

                    <button
                      onClick={() => setIsConfirmClearOpen(true)}
                      className="p-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 active:scale-95 transition-all"
                      title="Vider cet emploi du temps"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </>
            )}

            {!canEdit && (
              <div className="px-3 py-1.5 rounded-xl bg-secondary/5 border border-secondary/15 text-secondary/60 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Supervision institutionnelle (Lecture seule)</span>
              </div>
            )}

            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl border border-secondary/15 text-secondary/70 hover:bg-secondary/5 hover:text-secondary active:scale-95 transition-all"
              title="Imprimer ou Exporter en PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Selector Bar depending on View Mode */}
        <div className="mt-4 pt-4 border-t border-secondary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-secondary">
              {viewMode === "classe" && "Sélectionnez la Classe :"}
              {viewMode === "enseignant" && "Sélectionnez l'Enseignant :"}
              {viewMode === "salle" && "Sélectionnez la Salle :"}
            </span>

            {viewMode === "classe" && (
              <select
                value={selectedClasseId}
                onChange={(e) => setSelectedClasseId(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-secondary/20 bg-primary text-secondary text-xs font-bold focus:outline-none focus:ring-2 focus:ring-accent shadow-xs"
              >
                {classesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom} ({c.niveau}) · Effectif: {c.effectif}
                  </option>
                ))}
              </select>
            )}

            {viewMode === "enseignant" && (
              <select
                value={selectedEnseignantId}
                onChange={(e) => setSelectedEnseignantId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-secondary/20 bg-primary text-secondary text-xs font-bold focus:outline-none focus:ring-2 focus:ring-accent shadow-xs"
              >
                {teachersList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.prenom} {t.nom}
                  </option>
                ))}
              </select>
            )}

            {viewMode === "salle" && (
              <select
                value={selectedSalleId}
                onChange={(e) => setSelectedSalleId(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-secondary/20 bg-primary text-secondary text-xs font-bold focus:outline-none focus:ring-2 focus:ring-accent shadow-xs"
              >
                {sallesList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.numero} · {s.type} ({s.capacite} places)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Quick Stats on selected view */}
          <div className="flex items-center gap-3 text-xs text-secondary/70">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>
                <strong>{displayedSeances.length}</strong> séances /{" "}
                <strong>{displayedSeances.length * 1.5}h</strong> par semaine
              </span>
            </div>
            {viewMode === "classe" && currentClasse && (
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>Effectif : {currentClasse.effectif} étudiants</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Timetable Weekly Grid */}
      <div className="rounded-2xl border border-secondary/15 bg-primary/95 shadow-2xl backdrop-blur-xl overflow-hidden">
        {loading ? (
          <TimetableLoadingSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[980px]">
              <thead>
                <tr className="border-b border-secondary/20 bg-secondary/5 text-secondary">
                  <th className="py-3 px-3.5 border-r border-secondary/15 text-xs font-extrabold text-secondary tracking-wider text-center w-28 bg-secondary/[0.04]">
                    Jour
                  </th>
                  {TIME_SLOTS.map((slot) => (
                    <th
                      key={slot.timeLabel}
                      className="py-3 px-3 border-r border-secondary/15 last:border-r-0 text-center text-xs font-bold text-secondary tracking-tight"
                    >
                      <span className="block">{slot.timeLabel}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/15">
                {DAYS.map((day) => (
                  <tr key={day} className="hover:bg-secondary/[0.015] transition-colors">
                    <td className="py-4 px-3.5 border-r border-secondary/15 text-xs font-extrabold text-secondary text-center align-middle bg-secondary/[0.03]">
                      {day}
                    </td>

                    {TIME_SLOTS.map((slot) => {
                      const session = displayedSeances.find(
                        (s) => s.jour === day && s.timeSlot === slot.timeLabel
                      );

                      return (
                        <td
                          key={slot.timeLabel}
                          className="py-2.5 px-2.5 border-r border-secondary/15 last:border-r-0 align-top w-[14.5%] min-h-[110px] relative group"
                        >
                          {session ? (
                            <div className="h-full rounded-xl border border-secondary/15 p-2 bg-secondary/[0.03] hover:bg-secondary/[0.06] transition-all flex flex-col justify-between gap-1.5 shadow-xs relative">
                              {/* Hover actions for edit/delete */}
                              {canEdit && (
                                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10 bg-primary/90 rounded-lg p-0.5 shadow-sm border border-secondary/15">
                                  <button
                                    onClick={() => handleOpenEditModal(session)}
                                    className="p-1 hover:text-accent rounded-md text-secondary/60 transition-colors"
                                    title="Modifier la séance"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSeance(session.id)}
                                    className="p-1 hover:text-red-500 rounded-md text-secondary/60 transition-colors"
                                    title="Supprimer la séance"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}

                              {/* Session Details */}
                              <div className="space-y-1">
                                <div className="flex items-start gap-1 font-bold text-secondary text-[11.5px] leading-snug">
                                  <span className="text-accent shrink-0">📖</span>
                                  <span className="line-clamp-2">{session.matiere}</span>
                                </div>

                                {viewMode !== "enseignant" && (
                                  <div className="flex items-center gap-1 text-[11px] text-secondary/75 font-medium truncate">
                                    <span className="shrink-0 text-emerald-500">👤</span>
                                    <span className="truncate">{session.enseignant}</span>
                                  </div>
                                )}

                                {viewMode !== "salle" && (
                                  <div className="flex items-center gap-1 text-[11px] text-secondary/75 font-medium truncate">
                                    <span className="shrink-0 text-amber-500">🚪</span>
                                    <span className="truncate">{session.salle}</span>
                                  </div>
                                )}

                                {viewMode !== "classe" && (
                                  <div className="flex items-center gap-1 text-[11px] text-secondary/75 font-medium truncate">
                                    <span className="shrink-0 text-blue-500">🎓</span>
                                    <span className="truncate font-semibold">{session.groupe}</span>
                                  </div>
                                )}
                              </div>

                              {/* Footer Badges */}
                              <div className="flex items-center justify-between mt-1 pt-1 border-t border-secondary/10">
                                <span
                                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase border ${
                                    session.type === "TP"
                                      ? "bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/25"
                                      : session.type === "TD"
                                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/25"
                                      : "bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/25"
                                  }`}
                                >
                                  {session.type}
                                </span>
                                {viewMode === "classe" && (
                                  <span className="text-[10px] text-secondary/50 font-mono">
                                    {session.groupe}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => canEdit && handleOpenAddModal(day, slot.timeLabel)}
                              className={`h-full min-h-[90px] rounded-xl flex flex-col items-center justify-center transition-all border border-transparent ${
                                canEdit
                                  ? "cursor-pointer hover:border-dashed hover:border-accent/40 hover:bg-accent/[0.04]"
                                  : "select-none"
                              }`}
                            >
                              <span className="text-[10px] font-bold text-secondary/25 uppercase tracking-wider group-hover:hidden">
                                Libre
                              </span>
                              {canEdit && (
                                <div className="hidden group-hover:flex items-center gap-1 text-accent text-xs font-bold animate-fadeIn">
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Planifier</span>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: AJOUTER / MODIFIER UNE SÉANCE                                     */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-primary border border-secondary/20 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-secondary/15 bg-secondary/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-secondary">
                    {editingSeanceId ? "Modifier la séance" : "Planifier une nouvelle séance"}
                  </h3>
                  <span className="text-[11px] text-secondary/60">
                    Détection automatique des conflits en direct
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-secondary/10 text-secondary/60 hover:text-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSeance} className="p-6 space-y-4">
              {/* Day & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-secondary/80 block mb-1">Jour</label>
                  <select
                    value={modalForm.jour}
                    onChange={(e) => setModalForm({ ...modalForm, jour: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-secondary/20 bg-primary text-secondary text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary/80 block mb-1">
                    Créneau horaire
                  </label>
                  <select
                    value={modalForm.timeSlot}
                    onChange={(e) => setModalForm({ ...modalForm, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-secondary/20 bg-primary text-secondary text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {TIME_SLOTS.map((s) => (
                      <option key={s.timeLabel} value={s.timeLabel}>
                        {s.timeLabel} ({s.timeRange})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Classe */}
              <div>
                <label className="text-xs font-bold text-secondary/80 block mb-1">Classe</label>
                <select
                  value={modalForm.classeId}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, classeId: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-secondary/20 bg-primary text-secondary text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {classesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom} ({c.niveau}) · Effectif: {c.effectif}
                    </option>
                  ))}
                </select>
              </div>

              {/* Matière */}
              <div>
                <label className="text-xs font-bold text-secondary/80 block mb-1">Matière</label>
                <select
                  value={modalForm.matiereId}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, matiereId: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-secondary/20 bg-primary text-secondary text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {matieresList.map((m) => (
                    <option key={m.id} value={m.id}>
                      [{m.code}] {m.intitule}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type de Séance */}
              <div>
                <label className="text-xs font-bold text-secondary/80 block mb-1">
                  Type de séance
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["COURS", "TD", "TP"] as SeanceType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setModalForm({ ...modalForm, type: t })}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        modalForm.type === t
                          ? t === "COURS"
                            ? "bg-blue-500/20 text-blue-600 border-blue-500/40 shadow-xs"
                            : t === "TD"
                            ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/40 shadow-xs"
                            : "bg-purple-500/20 text-purple-600 border-purple-500/40 shadow-xs"
                          : "bg-secondary/5 text-secondary/70 border-secondary/15 hover:bg-secondary/10"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enseignant & Salle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-secondary/80 block mb-1">
                    Enseignant
                  </label>
                  <select
                    value={modalForm.enseignantId}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, enseignantId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-secondary/20 bg-primary text-secondary text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">-- Aucun enseignant --</option>
                    {teachersList.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.prenom} {t.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary/80 block mb-1">Salle</label>
                  <select
                    value={modalForm.salleId}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, salleId: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-secondary/20 bg-primary text-secondary text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value={0}>-- Aucune salle --</option>
                    {sallesList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.numero} ({s.type}, {s.capacite}pl)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conflict & Warning Banner */}
              {modalConflictReport.hasConflict && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Conflit strict détecté :</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {modalConflictReport.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {modalConflictReport.warnings.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Avertissements pédagogiques :</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {modalConflictReport.warnings.map((warn, idx) => (
                      <li key={idx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-secondary/15">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-secondary/15 text-secondary text-xs font-semibold hover:bg-secondary/5 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={savingSeance || modalConflictReport.hasConflict}
                  className="px-5 py-2 rounded-xl bg-accent text-primary text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {savingSeance ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <span>Enregistrer la séance</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: GÉNÉRATEUR AUTOMATIQUE                                           */}
      {/* ========================================================================= */}
      {isAutoModalOpen && currentClasse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-primary border border-secondary/20 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-secondary/15 bg-secondary/[0.02] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-500">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-secondary">
                    Générateur Automatique d&apos;Emploi du Temps
                  </h3>
                  <span className="text-[11px] text-secondary/60">
                    Classe : <strong>{currentClasse.nom}</strong> ({currentClasse.niveau}) ·{" "}
                    Effectif : {currentClasse.effectif}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAutoModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-secondary/10 text-secondary/60 hover:text-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              <p className="text-xs text-secondary/70 leading-relaxed">
                Définissez ci-dessous le volume hebdomadaire souhaité pour chaque matière.
                L&apos;algorithme distribuera les créneaux sur la semaine, réservera les salles
                adaptées (labos pour TP, amphis pour cours) et évitera tout chevauchement
                d&apos;enseignants ou de salles.
              </p>

              {/* Subjects Table */}
              <div className="border border-secondary/15 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/5 border-b border-secondary/15 font-bold text-secondary text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Matière</th>
                      <th className="py-2.5 px-3 text-center">Cours (1h30)</th>
                      <th className="py-2.5 px-3 text-center">TD (1h30)</th>
                      <th className="py-2.5 px-3 text-center">TP (1h30)</th>
                      <th className="py-2.5 px-3">Enseignant réfèrent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/10">
                    {autoRequirements.map((req, idx) => (
                      <tr key={req.matiereId} className="hover:bg-secondary/[0.02]">
                        <td className="py-2.5 px-3 font-semibold text-secondary">
                          <span className="text-accent font-mono text-[10px] block">{req.code}</span>
                          <span>{req.intitule}</span>
                        </td>

                        {/* Cours Counter */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="inline-flex items-center gap-1.5 bg-secondary/5 rounded-lg p-1 border border-secondary/10">
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...autoRequirements];
                                next[idx].coursCount = Math.max(0, next[idx].coursCount - 1);
                                setAutoRequirements(next);
                              }}
                              className="w-5 h-5 rounded flex items-center justify-center hover:bg-secondary/10 text-secondary font-bold"
                            >
                              -
                            </button>
                            <span className="w-4 font-bold text-secondary text-center">
                              {req.coursCount}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...autoRequirements];
                                next[idx].coursCount += 1;
                                setAutoRequirements(next);
                              }}
                              className="w-5 h-5 rounded flex items-center justify-center hover:bg-secondary/10 text-secondary font-bold"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* TD Counter */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="inline-flex items-center gap-1.5 bg-secondary/5 rounded-lg p-1 border border-secondary/10">
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...autoRequirements];
                                next[idx].tdCount = Math.max(0, next[idx].tdCount - 1);
                                setAutoRequirements(next);
                              }}
                              className="w-5 h-5 rounded flex items-center justify-center hover:bg-secondary/10 text-secondary font-bold"
                            >
                              -
                            </button>
                            <span className="w-4 font-bold text-secondary text-center">
                              {req.tdCount}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...autoRequirements];
                                next[idx].tdCount += 1;
                                setAutoRequirements(next);
                              }}
                              className="w-5 h-5 rounded flex items-center justify-center hover:bg-secondary/10 text-secondary font-bold"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* TP Counter */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="inline-flex items-center gap-1.5 bg-secondary/5 rounded-lg p-1 border border-secondary/10">
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...autoRequirements];
                                next[idx].tpCount = Math.max(0, next[idx].tpCount - 1);
                                setAutoRequirements(next);
                              }}
                              className="w-5 h-5 rounded flex items-center justify-center hover:bg-secondary/10 text-secondary font-bold"
                            >
                              -
                            </button>
                            <span className="w-4 font-bold text-secondary text-center">
                              {req.tpCount}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...autoRequirements];
                                next[idx].tpCount += 1;
                                setAutoRequirements(next);
                              }}
                              className="w-5 h-5 rounded flex items-center justify-center hover:bg-secondary/10 text-secondary font-bold"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Preferred Teacher */}
                        <td className="py-2.5 px-3">
                          <select
                            value={req.preferredTeacherId || ""}
                            onChange={(e) => {
                              const next = [...autoRequirements];
                              next[idx].preferredTeacherId = e.target.value || null;
                              setAutoRequirements(next);
                            }}
                            className="w-full px-2 py-1 rounded-lg border border-secondary/15 bg-primary text-secondary text-[11px]"
                          >
                            <option value="">-- Automatique --</option>
                            {teachersList.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.prenom} {t.nom}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Execution Results View */}
              {autoGenResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs space-y-2 animate-fadeIn ${
                    autoGenResult.success
                      ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/25 text-amber-700 dark:text-amber-400"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {autoGenResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    )}
                    <span>{autoGenResult.message}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-medium pt-1">
                    <span>
                      Total séances : <strong>{autoGenResult.placedCount}</strong>
                    </span>
                    <span>
                      Heures planifiées : <strong>{autoGenResult.placedCount * 1.5}h</strong>
                    </span>
                    <span>
                      Conflits détectés : <strong className="text-emerald-500">0</strong>
                    </span>
                  </div>

                  {autoGenResult.unplaced.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-amber-500/20">
                      <span className="font-bold">Séances non affectées :</span>
                      <ul className="list-disc pl-5 mt-1 space-y-0.5">
                        {autoGenResult.unplaced.map((u: any, idx: number) => (
                          <li key={idx}>
                            {u.matiereIntitule} ({u.type}) : {u.reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between p-5 border-t border-secondary/15 bg-secondary/[0.02] shrink-0">
              <button
                type="button"
                onClick={() => setIsAutoModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-secondary/15 text-secondary text-xs font-semibold hover:bg-secondary/5 transition-colors"
              >
                Fermer
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRunAlgorithm}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Optimisation en cours...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Calculer & Optimiser</span>
                    </>
                  )}
                </button>

                {autoGenResult && autoGenResult.placedCount > 0 && (
                  <button
                    type="button"
                    onClick={handleApplyAutoGenerated}
                    disabled={isApplyingAuto}
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
                  >
                    {isApplyingAuto ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Valider et Enregistrer</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CONFIRM CLEAR TIMETABLE                                          */}
      {/* ========================================================================= */}
      {isConfirmClearOpen && currentClasse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-primary border border-secondary/20 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-secondary">
                  Vider l&apos;emploi du temps ?
                </h3>
                <span className="text-xs text-secondary/60">Action irréversible</span>
              </div>
            </div>

            <p className="text-xs text-secondary/70 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer toutes les séances programmées pour la classe{" "}
              <strong>{currentClasse.nom}</strong> ?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-secondary/15">
              <button
                type="button"
                onClick={() => setIsConfirmClearOpen(false)}
                className="px-4 py-2 rounded-xl border border-secondary/15 text-secondary text-xs font-semibold hover:bg-secondary/5 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleClearClassTimetable}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                Oui, tout supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
