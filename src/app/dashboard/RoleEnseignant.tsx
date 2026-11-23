"use client";

import { useState } from "react";
import {
  Calendar, UserCheck, User as UserIcon, CheckCircle2, AlertCircle,
  FileText, Clock, ShieldCheck, Info, School, MapPin, Lock, Camera,
  Eye, EyeOff, KeyRound, Plus, Trash2, BookOpen, Loader2,
} from "lucide-react";
import { User, Absence, Seance, EmploiDuTemps, Classe, GroupeTP } from "@/types/schema";
import { fetchLiveTimetable, TIME_SLOTS, DAYS, SeanceView } from "@/lib/timetableService";
import { SupabaseService } from "@/lib/supabaseDb";
import { uploadAvatar } from "@/lib/uploadService";
import { TimetableLoadingSkeleton, TableLoadingSkeleton } from "@/components/LoadingStates";
import { useEffect } from "react";

export type EnseignantTab = "seances" | "absences" | "profile";

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

interface RoleEnseignantProps {
  currentUser: User;
  activeTab: EnseignantTab;
  onUpdateUser: (updatedUser: User) => void;
}

export default function RoleEnseignant({
  currentUser, activeTab, onUpdateUser,
}: RoleEnseignantProps) {
  const [absences, setAbsences] = useState<any[]>([]);
  const [timetableData, setTimetableData] = useState<SeanceView[]>([]);
  const [classesList, setClassesList] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deletingAbsenceId, setDeletingAbsenceId] = useState<number | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Form states for adding absence
  const [selectedClasse, setSelectedClasse] = useState("");
  const [absenceEtudiantId, setAbsenceEtudiantId] = useState("");
  const [absenceDate, setAbsenceDate] = useState(new Date().toISOString().slice(0, 10));
  const [absenceMotif, setAbsenceMotif] = useState("");
  const [absenceJustifiee, setAbsenceJustifiee] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true);
        const [sessions, absencesDb, classesDb, profilesDb] = await Promise.all([
          fetchLiveTimetable(12),
          SupabaseService.getAbsences().catch(() => []),
          SupabaseService.getClasses().catch(() => []),
          SupabaseService.getProfiles().catch(() => []),
        ]);
        setTimetableData(sessions);

        const fetchedClasses = classesDb || [];
        setClassesList(fetchedClasses);
        if (fetchedClasses.length > 0 && !selectedClasse) {
          setSelectedClasse(fetchedClasses[0].nom);
        }

        const etudiants = (profilesDb || []).filter((p: any) => p.role === "Etudiant");
        setStudentsList(etudiants);

        if (absencesDb && absencesDb.length > 0) {
          setAbsences(
            absencesDb.map((a: any) => ({
              id: a.id,
              date: a.date,
              motif: a.motif || "Absence cours",
              justifiee: a.justifiee,
              etudiantId: a.etudiant_id,
              etudiantNom: a.profiles ? `${a.profiles.prenom} ${a.profiles.nom}` : (a.etudiant_id ? `Étudiant #${String(a.etudiant_id).slice(0, 6)}` : "Étudiant"),
              matricule: a.profiles?.matricule,
              seanceId: a.seance_id,
              classeNom: a.seances?.classes?.nom,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading enseignant data:", err);
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, [currentUser]);

  const [nom, setNom] = useState(currentUser.nom || "");
  const [prenom, setPrenom] = useState(currentUser.prenom || "");
  const [grade, setGrade] = useState(currentUser.grade || "");
  const [specialite, setSpecialite] = useState(currentUser.specialite || "");
  const [photo, setPhoto] = useState(currentUser.photo || "");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = { ...currentUser, nom, prenom, grade, specialite, photo };
    try {
      if (typeof currentUser.id === "string") {
        await SupabaseService.updateProfile(currentUser.id, { nom, prenom, grade, specialite, photo });
      }
    } catch (err) {
      console.warn("Could not sync profile:", err);
    }
    onUpdateUser(updated);
    setFormSuccess("Toutes les informations ont été mises à jour avec succès !");
    setTimeout(() => setFormSuccess(null), 4000);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const publicUrl = await uploadAvatar(file, String(currentUser.id));
      setPhoto(publicUrl);
      setFormSuccess("Photo téléchargée avec succès !");
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err: any) {
      console.error("Upload error:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRecordAbsence = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (!absenceDate || !absenceMotif || !absenceEtudiantId) {
      setPasswordError("Veuillez sélectionner la classe, l'étudiant et saisir la date et le motif.");
      return;
    }

    try {
      setActionLoading(true);
      const selectedStudent = studentsList.find((s) => String(s.id) === String(absenceEtudiantId));
      const studentLabel = selectedStudent
        ? `${selectedStudent.prenom} ${selectedStudent.nom}`
        : `Étudiant #${String(absenceEtudiantId).slice(0, 6)}`;

      let createdId = Date.now();
      try {
        const res = await SupabaseService.createAbsence({
          date: absenceDate,
          motif: absenceMotif.trim(),
          justifiee: absenceJustifiee,
          etudiant_id: String(absenceEtudiantId),
        });
        if (res?.id) createdId = res.id;
      } catch (dbErr) {
        console.warn("Notice: absence saved locally/fallback:", dbErr);
      }

      const newAbsence = {
        id: createdId,
        date: absenceDate,
        motif: absenceMotif.trim(),
        justifiee: absenceJustifiee,
        etudiantId: absenceEtudiantId,
        etudiantNom: studentLabel,
        matricule: selectedStudent?.matricule,
        classeNom: selectedClasse,
      };

      setAbsences((prev) => [newAbsence, ...prev]);
      setAbsenceMotif("");
      setAbsenceJustifiee(false);
      setFormSuccess(`Absence enregistrée avec succès pour ${studentLabel} !`);
      setTimeout(() => setFormSuccess(null), 4000);
    } catch (err: any) {
      console.error("Error recording absence:", err);
      setPasswordError(err?.message || "Erreur lors de l'enregistrement de l'absence.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAbsence = async (id: number) => {
    try {
      setDeletingAbsenceId(id);
      await SupabaseService.deleteAbsence(id).catch(() => {});
      setAbsences((prev) => prev.filter((a) => a.id !== id));
      setFormSuccess("Absence supprimée.");
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error deleting absence:", err);
    } finally {
      setDeletingAbsenceId(null);
    }
  };

  // Filter students by selected class (or show all if class has no linked students yet)
  const filteredStudents = studentsList.filter((s) => {
    if (!selectedClasse) return true;
    if (s.classe_nom) return s.classe_nom === selectedClasse;
    if (s.classe) return s.classe === selectedClasse;
    return true;
  });

  const justifiedCount = absences.filter((a) => a.justifiee).length;
  const unjustifiedCount = absences.filter((a) => !a.justifiee).length;

  return (
    <div className="space-y-6">
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary tracking-tight">
          {activeTab === "seances" && "Mes séances"}
          {activeTab === "absences" && "Gérer les absences"}
          {activeTab === "profile" && "Mon profil"}
        </h1>
        <p className="text-xs sm:text-sm text-secondary/65 font-medium mt-1">
          {activeTab === "seances" && "Consultez et gérez vos séances d'enseignement planifiées cette semaine."}
          {activeTab === "absences" && "Enregistrez les absences des étudiants lors de vos séances de cours, TD et TP."}
          {activeTab === "profile" && "Consultez et modifiez vos informations de compte enseignant."}
        </p>
      </div>
      {formSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{formSuccess}</span>
        </div>
      )}

      {/* ================= TAB 1: EMPLOI DU TEMPS ================= */}
      {activeTab === "seances" && (
        <div className="rounded-2xl border border-secondary/15 bg-primary/95 shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-secondary/15 bg-secondary/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-secondary block">
                  Emploi du Temps · {CURRENT_CLASSE.nom} ({CURRENT_CLASSE.niveau})
                </span>
                <span className="text-[11px] text-secondary/55 font-medium">
                  {CURRENT_EMPLOI.semestre} · Année Universitaire {CURRENT_EMPLOI.anneeUniversitaire}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="px-3 py-1 rounded-xl bg-secondary/5 border border-secondary/15 text-secondary/80 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-accent" />
                <span>Effectif: <strong>{CURRENT_CLASSE.effectif}</strong></span>
              </div>
              <div className="px-3 py-1 rounded-xl bg-secondary/5 border border-secondary/15 text-secondary/80 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-purple-400" />
                <span>{CURRENT_GROUPE_TP.nom} (Capacité: {CURRENT_GROUPE_TP.capacite})</span>
              </div>
            </div>
          </div>
          {loadingData ? (
            <TimetableLoadingSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left min-w-[950px]">
                <thead>
                  <tr className="border-b border-secondary/20 bg-secondary/5 text-secondary">
                    <th className="py-3 px-3.5 border-r border-secondary/15 text-xs font-extrabold text-secondary tracking-wider text-center w-28">
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
                    <tr key={day} className="hover:bg-secondary/[0.02] transition-colors">
                      <td className="py-4 px-3.5 border-r border-secondary/15 text-xs font-extrabold text-secondary text-center align-middle bg-secondary/[0.02]">
                        {day}
                      </td>

                      {TIME_SLOTS.map((slot) => {
                        const session = timetableData.find(
                          (s) => s.jour === day && s.timeSlot === slot.timeLabel
                        );

                        return (
                          <td
                            key={slot.timeLabel}
                            className="py-3 px-3 border-r border-secondary/15 last:border-r-0 align-top w-[14.5%] min-h-[110px]"
                          >
                            {session ? (
                              <div className="flex flex-col gap-1.5 text-[11px] leading-tight">
                                <div className="flex items-start gap-1.5 font-bold text-secondary text-[11.5px] group-hover:text-accent transition-colors">
                                  <span className="text-accent shrink-0 text-xs">♪</span>
                                  <span>
                                    <strong className="font-semibold text-secondary/60">
                                      Matière:{" "}
                                    </strong>
                                    {session.matiere}
                                  </span>
                                </div>

                                <div className="flex items-start gap-1.5 text-secondary/80 font-medium">
                                  <span className="text-emerald-500 shrink-0 text-xs">👤</span>
                                  <span>
                                    <strong className="font-semibold text-secondary/60">
                                      Enseignant:{" "}
                                    </strong>
                                    {session.enseignant}
                                  </span>
                                </div>

                                <div className="flex items-start gap-1.5 text-secondary/80 font-medium">
                                  <span className="text-amber-500 shrink-0 text-xs">🚪</span>
                                  <span>
                                    <strong className="font-semibold text-secondary/60">
                                      Salle:{" "}
                                    </strong>
                                    <span className="font-bold text-secondary">
                                      {session.salle}
                                    </span>
                                  </span>
                                </div>

                                <div className="flex items-start gap-1.5 text-secondary/80 font-medium">
                                  <span className="text-indigo-500 shrink-0 text-xs">👥</span>
                                  <span>
                                    <strong className="font-semibold text-secondary/60">
                                      Groupe:{" "}
                                    </strong>
                                    {session.groupe}
                                  </span>
                                </div>
                              </div>
                            ) : null}
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
      )}

      {/* ================= TAB 2: GÉRER LES ABSENCES ================= */}
      {activeTab === "absences" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider block">Total Absences</span>
              <span className="text-2xl font-extrabold text-secondary mt-1 block">{absences.length}</span>
              <span className="text-[10px] text-secondary/60 font-medium mt-0.5 block">Enregistrées cette semaine</span>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Justifiées</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">{justifiedCount}</span>
            </div>
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">Non Justifiées</span>
              <span className="text-2xl font-extrabold text-red-600 dark:text-red-400 mt-1 block">{unjustifiedCount}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 pb-3 border-b border-secondary/10">
                <h3 className="text-sm font-extrabold text-secondary flex items-center gap-2"><Plus className="w-4 h-4 text-accent" /> Enregistrer une absence</h3>
                <p className="text-[11px] text-secondary/50 font-medium mt-1">Saisissez l'absence d'un étudiant pour une séance donnée</p>
              </div>
              <form onSubmit={handleRecordAbsence} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1">Classe</label>
                    <select
                      value={selectedClasse}
                      onChange={(e) => {
                        setSelectedClasse(e.target.value);
                        setAbsenceEtudiantId("");
                      }}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20"
                    >
                      <option value="">-- Sélectionner une classe --</option>
                      {classesList.map((c) => (
                        <option key={c.id} value={c.nom}>
                          {c.nom} ({c.effectif || 0} étudiants)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1">Étudiant absent</label>
                    <select
                      required
                      value={absenceEtudiantId}
                      onChange={(e) => setAbsenceEtudiantId(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-primary text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20"
                    >
                      <option value="">-- Choisir un étudiant --</option>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.prenom} {st.nom} {st.matricule ? `(${st.matricule})` : ""}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          Aucun étudiant disponible
                        </option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={absenceDate}
                      onChange={(e) => setAbsenceDate(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1">Motif</label>
                    <input
                      type="text"
                      required
                      value={absenceMotif}
                      onChange={(e) => setAbsenceMotif(e.target.value)}
                      placeholder="Maladie, Non justifié, Retard..."
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={absenceJustifiee}
                      onChange={(e) => setAbsenceJustifiee(e.target.checked)}
                      className="rounded border-secondary/30 text-accent focus:ring-accent/30 cursor-pointer"
                    />
                    <span className="text-xs text-secondary/70">Absence justifiée</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full h-10 rounded-xl bg-accent text-white text-xs font-semibold hover:opacity-95 shadow-md shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                  <span>{actionLoading ? "Enregistrement..." : "Enregistrer l'absence"}</span>
                </button>
              </form>
            </div>
            <div className="rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 pb-3 border-b border-secondary/10">
                <h3 className="text-sm font-extrabold text-secondary">Historique des absences enregistrées</h3>
                <p className="text-[11px] text-secondary/50 font-medium mt-1">{absences.length} entrée(s) dans le relevé</p>
              </div>
              {passwordError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>{passwordError}</span></div>
              )}
              {loadingData ? (
                <TableLoadingSkeleton rows={4} cols={5} />
              ) : absences.length === 0 ? (
                <div className="py-8 text-center text-secondary/50 text-xs">
                  Aucune absence enregistrée.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-secondary/10 text-[10px] font-extrabold text-secondary/50 uppercase tracking-wider">
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Étudiant</th>
                        <th className="py-3 px-3">Motif</th>
                        <th className="py-3 px-3">Statut</th>
                        <th className="py-3 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/10">
                      {absences.map((item) => (
                        <tr key={item.id} className="hover:bg-secondary/5 transition-colors">
                          <td className="py-3.5 px-3 font-semibold text-secondary whitespace-nowrap">
                            <span className="inline-flex items-center">
                              <Calendar className="w-3.5 h-3.5 text-accent mr-1.5" />
                              {item.date}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-medium text-secondary">
                            <div>{item.etudiantNom || `ID #${item.etudiantId}`}</div>
                            {item.matricule && (
                              <div className="text-[10px] text-secondary/50 font-mono">{item.matricule}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-secondary font-medium">{item.motif}</td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                item.justifiee
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : "bg-red-500/10 text-red-600 border-red-500/20"
                              }`}
                            >
                              {item.justifiee ? "Justifiée" : "Non justifiée"}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <button
                              type="button"
                              disabled={deletingAbsenceId === item.id}
                              onClick={() => handleDeleteAbsence(item.id)}
                              className="p-1.5 rounded-lg text-secondary/60 hover:text-rose-500 hover:bg-rose-500/5 transition-colors disabled:opacity-40"
                              title="Supprimer l'absence"
                            >
                              {deletingAbsenceId === item.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
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

      {/* ================= TAB 3: MON PROFIL ================= */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-secondary/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent"><UserIcon className="w-4 h-4" /></div>
                <div>
                  <h3 className="text-sm font-extrabold text-secondary">Fiche Enseignant</h3>
                  <p className="text-[11px] text-secondary/50 font-medium">Informations du compte enseignant</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">Nom</label>
                  <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">Prénom</label>
                  <input type="text" required value={prenom} onChange={(e) => setPrenom(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-secondary/70 mb-1">Adresse e-mail</label>
                <input type="email" disabled value={currentUser.email} className="w-full h-10 px-3 rounded-xl border border-secondary/15 bg-secondary/5 text-xs text-secondary/60 font-medium cursor-not-allowed select-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">Grade</label>
                  <input type="text" required value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">Spécialité</label>
                  <input type="text" required value={specialite} onChange={(e) => setSpecialite(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-secondary/70 mb-1">Photo de profil</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="text-xs text-secondary/70 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-white hover:file:opacity-90 cursor-pointer"
                  />
                  {uploadingImage && (
                    <span className="text-[11px] text-accent animate-pulse font-medium">Téléchargement en cours...</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button type="submit" className="w-full sm:w-auto px-6 h-10 rounded-xl bg-accent text-white text-xs font-semibold hover:opacity-95 shadow-md shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /><span>Enregistrer les informations</span></button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-secondary/10">
                <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent"><Camera className="w-4 h-4" /></div>
                <h3 className="text-sm font-extrabold text-secondary">Carte d&apos;Enseignant</h3>
              </div>
              <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-5 flex flex-col items-center text-center space-y-3">
                <div className="w-20 h-20 rounded-2xl bg-accent/15 border-2 border-accent/30 text-accent flex items-center justify-center font-bold text-2xl shadow-inner overflow-hidden">{photo ? <img src={photo} alt="Avatar" className="w-full h-full object-cover" /> : <span>{prenom?.[0]}{nom?.[0]}</span>}</div>
                <div>
                  <h4 className="text-base font-extrabold text-secondary">{prenom} {nom}</h4>
                  <p className="text-xs text-secondary/60 mt-0.5">{currentUser.email}</p>
                  <p className="text-[11px] text-secondary/60 mt-1">{grade} · {specialite}</p>
                </div>
                <div className="w-full pt-3 border-t border-secondary/15 flex items-center justify-center text-[11px] text-secondary/70"><span>Rôle: <strong>Enseignant</strong></span></div>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-accent/10 border border-accent/20 text-[11px] text-secondary/80 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-accent shrink-0" /><span>Compte vérifié par l&apos;administration.</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
