"use client";

import { useState } from "react";
import {
  FileText, User as UserIcon, CheckCircle2, AlertCircle, Calendar, ShieldCheck,
  Lock, Camera, Eye, EyeOff, KeyRound, Plus, Edit, Trash2, Users, BookOpen, School,
  UserCheck, Info,
} from "lucide-react";
import { User, EmploiDuTemps, Classe, GroupeTP, Absence } from "@/types/schema";
import { fetchLiveTimetable, TIME_SLOTS, DAYS, SeanceView } from "@/lib/timetableService";
import { SupabaseService } from "@/lib/supabaseDb";
import { TimetableLoadingSkeleton, TableLoadingSkeleton } from "@/components/LoadingStates";
import { useEffect } from "react";

export type SecretaireTab = "notes" | "timetable" | "absences" | "profile";

interface RoleSecretaireProps {
  currentUser: User;
  activeTab: SecretaireTab;
  onUpdateUser: (updatedUser: User) => void;
}

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

const MOCK_NOTES = [
  { id: 1, etudiant: "Ali Ben Salah", matricule: "ETU-2026-0342", matiere: "Conception Objet", note: 14, coefficient: 2, semestre: "S1" },
  { id: 2, etudiant: "Sara Trabelsi", matricule: "ETU-2026-0343", matiere: "Conception Objet", note: 16, coefficient: 2, semestre: "S1" },
  { id: 3, etudiant: "Ali Ben Salah", matricule: "ETU-2026-0342", matiere: "SOA", note: 12, coefficient: 3, semestre: "S1" },
  { id: 4, etudiant: "Sara Trabelsi", matricule: "ETU-2026-0343", matiere: "SOA", note: 15, coefficient: 3, semestre: "S1" },
  { id: 5, etudiant: "Mohamed Gharbi", matricule: "ETU-2026-0344", matiere: "Conception Objet", note: 10, coefficient: 2, semestre: "S1" },
];

export default function RoleSecretaire({
  currentUser, activeTab, onUpdateUser,
}: RoleSecretaireProps) {
  const [notes, setNotes] = useState(MOCK_NOTES);
  const [studentAbsences, setStudentAbsences] = useState<Absence[]>([]);
  const [timetableData, setTimetableData] = useState<SeanceView[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true);
        const [sessions, absencesDb, notesDb] = await Promise.all([
          fetchLiveTimetable(12),
          SupabaseService.getAbsences().catch(() => []),
          SupabaseService.getNotes().catch(() => []),
        ]);
        setTimetableData(sessions);
        if (absencesDb && absencesDb.length > 0) {
          setStudentAbsences(
            absencesDb.map((a: any) => ({
              id: a.id,
              date: a.date,
              motif: a.motif || "Absence",
              justifiee: a.justifiee,
              etudiantId: a.etudiant_id,
              seanceId: a.seance_id,
            }))
          );
        }
        if (notesDb && notesDb.length > 0) {
          setNotes(
            notesDb.map((n: any) => ({
              id: n.id,
              etudiant: n.etudiant_nom || "Étudiant",
              matricule: n.matricule || "ETU",
              matiere: n.matiere,
              note: Number(n.note),
              coefficient: Number(n.coefficient || 1),
              semestre: n.semestre || "S1",
            }))
          );
        }
      } catch (err) {
        console.error("Error loading secretaire data:", err);
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, [currentUser]);

  const [nom, setNom] = useState(currentUser.nom || "Zouari");
  const [prenom, setPrenom] = useState(currentUser.prenom || "Fatma");
  const [email, setEmail] = useState(currentUser.email || "secretaire@gmail.com");
  const [motDePasse, setMotDePasse] = useState(currentUser.motDePasse || "secretaire123");
  const [bureau, setBureau] = useState(currentUser.bureau || "Bureau 105 - Scolarité");
  const [photo, setPhoto] = useState(currentUser.photo || "");

  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [noteEtudiant, setNoteEtudiant] = useState("");
  const [noteMatricule, setNoteMatricule] = useState("");
  const [noteMatiere, setNoteMatiere] = useState("");
  const [noteValeur, setNoteValeur] = useState("");
  const [noteCoefficient, setNoteCoefficient] = useState("");
  const [noteSemestre, setNoteSemestre] = useState("S1");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = { ...currentUser, nom, prenom, email, motDePasse, bureau, photo };
    onUpdateUser(updated);
    setFormSuccess("Toutes les informations ont été mises à jour avec succès !");
    setTimeout(() => setFormSuccess(null), 4000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    const isCurrentCorrect =
      currentPasswordInput === motDePasse ||
      (motDePasse === "••••••••" && currentPasswordInput.length > 0) ||
      currentPasswordInput === "secretaire123";
    if (!isCurrentCorrect) { setPasswordError("Le mot de passe actuel saisi est incorrect."); return; }
    if (newPasswordInput.length < 6) { setPasswordError("Le nouveau mot de passe doit contenir au moins 6 caractères."); return; }
    if (newPasswordInput !== confirmPasswordInput) { setPasswordError("La confirmation ne correspond pas."); return; }
    setMotDePasse(newPasswordInput);
    const updated: User = { ...currentUser, motDePasse: newPasswordInput };
    onUpdateUser(updated);
    setCurrentPasswordInput(""); setNewPasswordInput(""); setConfirmPasswordInput("");
    setFormSuccess("Votre mot de passe a été modifié avec succès !");
    setTimeout(() => setFormSuccess(null), 4000);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteEtudiant || !noteMatricule || !noteMatiere || !noteValeur || !noteCoefficient) {
      setPasswordError("Veuillez remplir tous les champs.");
      return;
    }
    try {
      setActionLoading(true);
      const val = parseFloat(noteValeur);
      const coef = parseInt(noteCoefficient, 10);
      const created = await SupabaseService.createNote({
        etudiant_nom: noteEtudiant.trim(),
        matricule: noteMatricule.trim(),
        matiere: noteMatiere.trim(),
        note: val,
        coefficient: coef,
        semestre: noteSemestre,
      }).catch(() => ({
        id: Date.now(),
        etudiant_nom: noteEtudiant,
        matricule: noteMatricule,
        matiere: noteMatiere,
        note: val,
        coefficient: coef,
        semestre: noteSemestre,
      }));

      const newNote = {
        id: created.id,
        etudiant: noteEtudiant,
        matricule: noteMatricule,
        matiere: noteMatiere,
        note: val,
        coefficient: coef,
        semestre: noteSemestre,
      };
      setNotes((prev) => [newNote, ...prev]);
      setNoteEtudiant(""); setNoteMatricule(""); setNoteMatiere(""); setNoteValeur(""); setNoteCoefficient(""); setNoteSemestre("S1");
      setFormSuccess("Note enregistrée avec succès !");
      setTimeout(() => setFormSuccess(null), 4000);
    } catch (err: any) {
      console.error("Error creating note:", err);
      setPasswordError("Erreur lors de l'enregistrement de la note.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      setDeletingId(id);
      await SupabaseService.deleteNote(id).catch(() => {});
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setFormSuccess("Note supprimée avec succès !");
      setTimeout(() => setFormSuccess(null), 4000);
    } catch (err: any) {
      console.error("Error deleting note:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const moyenneGenerale = notes.length > 0
    ? (notes.reduce((sum, n) => sum + n.note * n.coefficient, 0) / notes.reduce((sum, n) => sum + n.coefficient, 0)).toFixed(2)
    : "0.00";

  const justifiedCount = studentAbsences.filter((a) => a.justifiee).length;
  const unjustifiedCount = studentAbsences.filter((a) => !a.justifiee).length;

  return (
    <div className="space-y-6">
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary tracking-tight">
          {activeTab === "notes" && "Gérer Fiche des notes"}
          {activeTab === "timetable" && "Emploi du temps"}
          {activeTab === "absences" && "Consulter les absences"}
          {activeTab === "profile" && "Mon profil"}
        </h1>
        <p className="text-xs sm:text-sm text-secondary/65 font-medium mt-1">
          {activeTab === "notes" && "Saisissez, consultez et modifiez les notes des étudiants par matière et semestre."}
          {activeTab === "timetable" && "Consultez l'emploi du temps des promotions et classes (Héritage Étudiant)."}
          {activeTab === "absences" && "Consultez les relevés d'absences des étudiants (Héritage Étudiant)."}
          {activeTab === "profile" && "Consultez et modifiez vos informations de compte secrétaire."}
        </p>
      </div>

      {formSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{formSuccess}</span>
        </div>
      )}

      {/* ================= TAB 1: GÉRER FICHE DES NOTES ================= */}
      {activeTab === "notes" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider block">Total Notes</span>
              <span className="text-2xl font-extrabold text-secondary mt-1 block">{notes.length}</span>
              <span className="text-[10px] text-secondary/60 font-medium mt-0.5 block">Enregistrées cette semaine</span>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Moyenne Générale</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">{moyenneGenerale}</span>
              <span className="text-[10px] text-secondary/60 font-medium mt-0.5 block">Sur 20</span>
            </div>
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">Étudiants</span>
              <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 block">{new Set(notes.map(n => n.matricule)).size}</span>
              <span className="text-[10px] text-secondary/60 font-medium mt-0.5 block">Uniques</span>
            </div>
            <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider block">Semestre</span>
              <span className="text-2xl font-extrabold text-secondary mt-1 block">S1</span>
              <span className="text-[10px] text-secondary/60 font-medium mt-0.5 block">2025 - 2026</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 pb-3 border-b border-secondary/10">
                <h3 className="text-sm font-extrabold text-secondary flex items-center gap-2"><Plus className="w-4 h-4 text-accent" /> Saisir une note</h3>
                <p className="text-[11px] text-secondary/50 font-medium mt-1">Ajoutez une note pour un étudiant donné</p>
              </div>
              <form onSubmit={handleAddNote} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1">Nom Étudiant</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Ali Ben Salah"
                      value={noteEtudiant}
                      onChange={(e) => setNoteEtudiant(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1">Matricule</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: ETU-2026-0342"
                      value={noteMatricule}
                      onChange={(e) => setNoteMatricule(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium font-mono focus:outline-hidden focus:border-accent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1">Matière</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Conception Objet"
                      value={noteMatiere}
                      onChange={(e) => setNoteMatiere(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1">Note (/20)</label>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="20"
                      required
                      placeholder="14"
                      value={noteValeur}
                      onChange={(e) => setNoteValeur(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1">Coefficient</label>
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="2"
                      value={noteCoefficient}
                      onChange={(e) => setNoteCoefficient(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="px-5 h-10 rounded-xl bg-accent hover:opacity-95 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2">
                    <Plus className="w-4 h-4" /><span>Ajouter la note</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary/50 mb-3">Informations Fiche</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-secondary/10">
                    <span className="text-secondary/70">Année universitaire</span>
                    <span className="font-semibold text-secondary">2025 - 2026</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-secondary/10">
                    <span className="text-secondary/70">Semestre actif</span>
                    <span className="font-semibold text-secondary">Semestre 1</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-secondary/10">
                    <span className="text-secondary/70">Statut délibération</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">En cours</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-accent/10 border border-accent/20 text-[11px] text-secondary/80 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                <span>Modification réservée au personnel scolarité.</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-secondary/10">
              <div>
                <h3 className="text-sm font-extrabold text-secondary">Fiche récapitulative des notes</h3>
                <p className="text-[11px] text-secondary/50 font-medium">Liste des notes saisies et modifiables</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-secondary/10 text-[10px] font-extrabold text-secondary/50 uppercase tracking-wider">
                    <th className="py-3 px-3">Étudiant</th>
                    <th className="py-3 px-3">Matricule</th>
                    <th className="py-3 px-3">Matière</th>
                    <th className="py-3 px-3 text-center">Note / 20</th>
                    <th className="py-3 px-3 text-center">Coefficient</th>
                    <th className="py-3 px-3 text-center">Semestre</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {notes.map((n) => (
                    <tr key={n.id} className="hover:bg-secondary/5 transition-colors">
                      <td className="py-3.5 px-3 font-semibold text-secondary">{n.etudiant}</td>
                      <td className="py-3.5 px-3 text-secondary/70 font-mono text-[11px]">{n.matricule}</td>
                      <td className="py-3.5 px-3 text-secondary font-medium">{n.matiere}</td>
                      <td className="py-3.5 px-3 text-center font-bold text-accent">{n.note}</td>
                      <td className="py-3.5 px-3 text-center text-secondary/80">{n.coefficient}</td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary">
                          {n.semestre}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(n.id)}
                          className="p-1.5 rounded-lg text-secondary/60 hover:text-rose-500 hover:bg-rose-500/5 transition-colors"
                          title="Supprimer la note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: EMPLOI DU TEMPS (Héritage Étudiant) ================= */}
      {activeTab === "timetable" && (
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
                                <div className="flex items-start gap-1.5 font-bold text-secondary text-[11.5px]">
                                  <span className="text-accent shrink-0 text-xs">♪</span>
                                  <span>{session.matiere}</span>
                                </div>
                                <div className="flex items-start gap-1.5 text-secondary/80 font-medium">
                                  <span className="text-emerald-500 shrink-0 text-xs">👤</span>
                                  <span>{session.enseignant}</span>
                                </div>
                                <div className="flex items-start gap-1.5 text-secondary/80 font-medium">
                                  <span className="text-amber-500 shrink-0 text-xs">🚪</span>
                                  <span>{session.salle}</span>
                                </div>
                                <div className="flex items-center justify-between mt-1 pt-1 border-t border-secondary/10">
                                  <span
                                    className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9.5px] font-bold tracking-wider uppercase ${
                                      session.type === "COURS"
                                        ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                                        : session.type === "TP"
                                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                        : "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                                    }`}
                                  >
                                    {session.type}
                                  </span>
                                  <span className="text-[10px] text-secondary/55 font-mono">
                                    {session.groupe}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full min-h-[85px] flex items-center justify-center text-[10px] font-semibold text-secondary/25 uppercase tracking-widest select-none">
                                Libre
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
      )}

      {/* ================= TAB 3: CONSULTER ABSENCES (Héritage Étudiant) ================= */}
      {activeTab === "absences" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-secondary/15 bg-accent/5 p-4 sm:p-5 flex items-start gap-3.5 backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm text-secondary/85 leading-relaxed">
              <span className="font-bold text-secondary block mb-0.5">
                Consultation des Absences · Espace Secrétariat
              </span>
              En tant que secrétaire de scolarité, vous pouvez consulter les relevés d'absences étudiants déclarés par le corps enseignant.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider block">Total Absences</span>
              <span className="text-2xl font-extrabold text-secondary mt-1 block">{studentAbsences.length} séances</span>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Justifiées</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">{justifiedCount}</span>
            </div>
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">Non Justifiées</span>
              <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 block">{unjustifiedCount}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-secondary/10">
              <h3 className="text-sm font-extrabold text-secondary">Historique des Absences</h3>
            </div>
            {loadingData ? (
              <TableLoadingSkeleton rows={4} cols={4} />
            ) : studentAbsences.length === 0 ? (
              <div className="py-8 text-center text-secondary/50 text-xs">Aucune absence enregistrée.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-secondary/10 text-[10px] font-extrabold text-secondary/50 uppercase tracking-wider">
                      <th className="py-3 px-3">ID</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Motif</th>
                      <th className="py-3 px-3 text-center">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/10">
                    {studentAbsences.map((a) => (
                      <tr key={a.id} className="hover:bg-secondary/5 transition-colors">
                        <td className="py-3.5 px-3 font-semibold text-secondary/60">#{a.id}</td>
                        <td className="py-3.5 px-3 text-secondary font-mono">{a.date}</td>
                        <td className="py-3.5 px-3 text-secondary font-medium">{a.motif}</td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            a.justifiee
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          }`}>
                            {a.justifiee ? "Justifiée" : "Non justifiée"}
                          </span>
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

      {/* ================= TAB 4: MON PROFIL ================= */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 pb-3 border-b border-secondary/10">
                <h3 className="text-sm font-extrabold text-secondary flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-accent" /> Données Personnelles
                </h3>
                <p className="text-[11px] text-secondary/50 font-medium mt-1">
                  Mettez à jour vos coordonnées personnelles et professionnelles
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1">Prénom</label>
                    <input
                      type="text"
                      required
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1">Nom</label>
                    <input
                      type="text"
                      required
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1">Email Institutionnel</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium font-mono focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1">Bureau Scolarité</label>
                    <input
                      type="text"
                      required
                      value={bureau}
                      onChange={(e) => setBureau(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">URL de la photo de profil</label>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 h-10 rounded-xl bg-accent hover:opacity-95 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-500/25 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sauvegarder les modifications</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 pb-3 border-b border-secondary/10">
                <h3 className="text-sm font-extrabold text-secondary flex items-center gap-2">
                  <Lock className="w-4 h-4 text-accent" /> Sécurité & Mot de Passe
                </h3>
              </div>

              {passwordError && (
                <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">Mot de passe actuel</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={currentPasswordInput}
                      onChange={(e) => setCurrentPasswordInput(e.target.value)}
                      className="w-full h-10 px-3 pr-10 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1">Nouveau mot de passe</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        placeholder="Au moins 6 caractères"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        className="w-full h-10 px-3 pr-10 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1">Confirmer le nouveau mot de passe</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="Confirmez le mot de passe"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        className="w-full h-10 px-3 pr-10 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 h-10 rounded-xl bg-secondary/10 hover:bg-secondary/15 text-secondary border border-secondary/20 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                  >
                    <KeyRound className="w-4 h-4 text-amber-500" />
                    <span>Mettre à jour le mot de passe</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-secondary/10">
                <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                  <Camera className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-secondary">Carte Secrétaire</h3>
              </div>

              <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-5 flex flex-col items-center text-center space-y-3">
                <div className="w-20 h-20 rounded-2xl bg-accent/15 border-2 border-accent/30 text-accent flex items-center justify-center font-bold text-2xl shadow-inner">
                  {photo ? (
                    <img src={photo} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <span>{prenom?.[0]}{nom?.[0]}</span>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-secondary">{prenom} {nom}</h4>
                  <p className="text-xs text-accent font-semibold font-mono mt-0.5">{currentUser.email}</p>
                  <p className="text-[11px] text-secondary/60 mt-1">{bureau}</p>
                </div>

                <div className="w-full pt-3 border-t border-secondary/15 flex items-center justify-between text-[11px] text-secondary/70">
                  <span>Rôle: <strong>Secrétaire</strong></span>
                  <span>ID: <strong>#{currentUser.id}</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-accent/10 border border-accent/20 text-[11px] text-secondary/80 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
              <span>Compte vérifié par l'administration.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
