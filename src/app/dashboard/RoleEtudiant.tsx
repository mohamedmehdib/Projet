"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  UserCheck,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  CalendarDays,
  ShieldCheck,
  Info,
  Hash,
  School,
  Sparkles,
  BookOpen,
  MapPin,
  Lock,
  Camera,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import {
  User,
  Absence,
  Etudiant,
  EmploiDuTemps,
  Classe,
  GroupeTP,
} from "@/types/schema";
import { fetchLiveTimetable, TIME_SLOTS, DAYS, SeanceView } from "@/lib/timetableService";
import { SupabaseService } from "@/lib/supabaseDb";
import { uploadAvatar } from "@/lib/uploadService";
import { TimetableLoadingSkeleton, TableLoadingSkeleton } from "@/components/LoadingStates";

export type StudentTab = "timetable" | "absences" | "profile";

// Associated Academic Structure from schema.ts
const CURRENT_EMPLOI: EmploiDuTemps = {
  id: 1,
  semestre: "Semestre 1 (S1)",
  anneeUniversitaire: "2025 - 2026",
};

const MOCK_CURRENT_CLASSE: Classe = {
  id: 12,
  nom: "DSI3.3",
  niveau: "Licence 3ème Année",
  effectif: 28,
};

const MOCK_CURRENT_GROUPE_TP: GroupeTP = {
  id: 3,
  nom: "Groupe TP 1",
  capacite: 15,
};

interface RoleEtudiantProps {
  currentUser: User;
  activeTab: StudentTab;
  onUpdateUser: (updatedUser: User) => void;
}

export default function RoleEtudiant({
  currentUser,
  activeTab,
  onUpdateUser,
}: RoleEtudiantProps) {
  const [timetableData, setTimetableData] = useState<SeanceView[]>([]);
  const [studentAbsences, setStudentAbsences] = useState<Absence[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Fetch live timetable and absences from Supabase DB
  useEffect(() => {
    async function loadDbData() {
      try {
        setLoadingData(true);
        const [sessions, absences] = await Promise.all([
          fetchLiveTimetable(12),
          SupabaseService.getAbsences().catch(() => []),
        ]);
        setTimetableData(sessions);
        if (absences && absences.length > 0) {
          setStudentAbsences(
            absences.map((a: any) => ({
              id: a.id,
              date: a.date,
              motif: a.motif || "Absence signalée",
              justifiee: a.justifiee,
              etudiantId: a.etudiant_id,
              seanceId: a.seance_id,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading student data from Supabase:", err);
      } finally {
        setLoadingData(false);
      }
    }
    loadDbData();
  }, [currentUser]);

  // Profile Form state
  const [nom, setNom] = useState(currentUser.nom || "");
  const [prenom, setPrenom] = useState(currentUser.prenom || "");
  const [photo, setPhoto] = useState(currentUser.photo || "");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      nom,
      prenom,
      photo,
    };
    try {
      if (typeof currentUser.id === "string") {
        await SupabaseService.updateProfile(currentUser.id, {
          nom,
          prenom,
          photo,
        });
      }
    } catch (err) {
      console.warn("Could not sync profile to db:", err);
    }
    onUpdateUser(updated);
    setFormSuccess("Vos informations ont été mises à jour avec succès !");
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

  const justifiedCount = studentAbsences.filter((a) => a.justifiee).length;
  const unjustifiedCount = studentAbsences.filter((a) => !a.justifiee).length;
  const totalHoursAbsent = studentAbsences.length * 1.5; // each session = 1h30

  return (
    <div className="space-y-6">
      {/* Top Heading */}
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary tracking-tight">
          {activeTab === "timetable" && "Emploi du temps"}
          {activeTab === "absences" && "Mes absences (Relevé d'assiduité)"}
          {activeTab === "profile" && "Mon profil"}
        </h1>
        <p className="text-xs sm:text-sm text-secondary/65 font-medium mt-1">
          {activeTab === "timetable" &&
            "Consultez le planning hebdomadaire de votre classe avec synchronisation en temps réel."}
          {activeTab === "absences" &&
            "Consultez vos absences enregistrées par vos enseignants lors des séances de cours, TD et TP."}
          {activeTab === "profile" &&
            "Consultez et modifiez les attributs officiels de votre compte étudiant."}
        </p>
      </div>

      {formSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{formSuccess}</span>
        </div>
      )}

      {/* ================= TAB 1: EMPLOI DU TEMPS (schema: EmploiDuTemps, Classe, GroupeTP, Seance, Jour) ================= */}
      {activeTab === "timetable" && (
        <div className="rounded-2xl border border-secondary/15 bg-primary/95 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Header with Title and EmploiDuTemps / Classe metadata */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-secondary/15 bg-secondary/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-secondary block">
                  Emploi du Temps · {MOCK_CURRENT_CLASSE.nom} ({MOCK_CURRENT_CLASSE.niveau})
                </span>
                <span className="text-[11px] text-secondary/55 font-medium">
                  {CURRENT_EMPLOI.semestre} · Année Universitaire {CURRENT_EMPLOI.anneeUniversitaire}
                </span>
              </div>
            </div>

            {/* Badges reflecting Classe & GroupeTP schema */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="px-3 py-1 rounded-xl bg-secondary/5 border border-secondary/15 text-secondary/80 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-accent" />
                <span>Effectif: <strong>{MOCK_CURRENT_CLASSE.effectif}</strong></span>
              </div>
              <div className="px-3 py-1 rounded-xl bg-secondary/5 border border-secondary/15 text-secondary/80 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-purple-400" />
                <span>{MOCK_CURRENT_GROUPE_TP.nom} (Capacité: {MOCK_CURRENT_GROUPE_TP.capacite})</span>
              </div>
            </div>
          </div>

          {/* Exact ISET Portal Timetable Table Structure */}
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

      {/* ================= TAB 2: MES ABSENCES (schema: Absence { id, date, motif, justifiee }) ================= */}
      {activeTab === "absences" && (
        <div className="space-y-6">
          {/* Informational Banner */}
          <div className="rounded-2xl border border-secondary/15 bg-accent/5 p-4 sm:p-5 flex items-start gap-3.5 backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm text-secondary/85 leading-relaxed">
              <span className="font-bold text-secondary block mb-0.5">
                Relevé officiel · Étudiant {prenom} {nom}
              </span>
              Conformément au système académique, chaque absence est saisie directement par l&apos;enseignant lors du contrôle d&apos;émargement de la séance.
              En cas d&apos;absence non justifiée, veuillez vous rapprocher du secrétariat du département avec vos pièces justificatives sous 48h.
            </div>
          </div>

          {/* Cards Overview of Student Absences */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider block">
                Total Absences
              </span>
              <span className="text-2xl font-extrabold text-secondary mt-1 block">
                {studentAbsences.length} séances
              </span>
              <span className="text-[10px] text-secondary/60 font-medium mt-0.5 block">
                Soit {totalHoursAbsent} heures manquées
              </span>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Absences Justifiées
              </span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                {justifiedCount}
              </span>
              <span className="text-[10px] text-secondary/60 font-medium mt-0.5 block">
                Validées par l&apos;administration
              </span>
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">
                Non Justifiées
              </span>
              <span className="text-2xl font-extrabold text-red-600 dark:text-red-400 mt-1 block">
                {unjustifiedCount}
              </span>
              <span className="text-[10px] text-secondary/60 font-medium mt-0.5 block">
                Risque d&apos;élimination d&apos;examen
              </span>
            </div>

            <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider block">
                Taux d&apos;assiduité
              </span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                92.5%
              </span>
              <span className="text-[10px] text-secondary/60 font-medium mt-0.5 block">
                Statut : Éligible aux examens
              </span>
            </div>
          </div>

          {/* Table: Absences de l'étudiant (id, date, motif, justifiee) */}
          <div className="rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-secondary/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-secondary">
                    Historique de vos absences enregistrées
                  </h3>
                  <span className="text-[11px] text-secondary/50 font-medium">
                    Attributs schema: id, date, motif, justifiee
                  </span>
                </div>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary/5 text-secondary/70 border border-secondary/15">
                {studentAbsences.length} enregistrements
              </span>
            </div>

            {loadingData ? (
              <TableLoadingSkeleton rows={4} cols={4} />
            ) : studentAbsences.length === 0 ? (
              <div className="py-8 text-center text-secondary/50 text-xs">
                Aucune absence enregistrée.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-secondary/10 text-[10px] font-extrabold text-secondary/50 uppercase tracking-wider">
                      <th className="py-3 px-3">id (int)</th>
                      <th className="py-3 px-3">date (Date)</th>
                      <th className="py-3 px-3">Motif</th>
                      <th className="py-3 px-3">justifiee (boolean)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/10">
                    {studentAbsences.map((item) => (
                      <tr key={item.id} className="hover:bg-secondary/5 transition-colors">
                        <td className="py-3.5 px-3 font-semibold text-secondary/60">
                          #{item.id}
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-secondary whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-accent" />
                            <span>{item.date}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-secondary font-medium">
                          {item.motif}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${item.justifiee
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                              }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${item.justifiee ? "bg-emerald-500" : "bg-red-500"
                                }`}
                            />
                            {item.justifiee ? "Justifiée (true)" : "Non justifiée (false)"}
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

      {/* ================= TAB 3: MON PROFIL (schema: Utilisateur & Etudiant) ================= */}
      {/* Utilisateur: id, nom, prenom, email, motDePasse, photo */}
      {/* Etudiant: matricule, dateInscription */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-secondary/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-secondary">
                    Fiche Étudiant
                  </h3>
                  <p className="text-[11px] text-secondary/50 font-medium">
                    Gérez vos informations personnelles
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Row 1: nom & prenom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    required
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>

              {/* Row 2: email (read-only) */}
              <div>
                <label className="block text-xs font-semibold text-secondary/70 mb-1">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full h-10 px-3 rounded-xl border border-secondary/15 bg-secondary/5 text-xs text-secondary/60 font-medium cursor-not-allowed select-none"
                />
              </div>

              {/* Row 3: Photo upload */}
              <div>
                <label className="block text-xs font-semibold text-secondary/70 mb-1">
                  Photo de profil
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="text-xs text-secondary/70 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-white hover:file:opacity-90 cursor-pointer"
                  />
                  {uploadingImage && (
                    <span className="text-[11px] text-accent animate-pulse font-medium">
                      Téléchargement en cours...
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 h-10 rounded-xl bg-accent text-white text-xs font-semibold hover:opacity-95 shadow-md shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enregistrer les informations</span>
                </button>
              </div>
            </form>
          </div>

          {/* Photo & Card Summary */}
          <div className="lg:col-span-4 rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-secondary/10">
                <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                  <Camera className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-secondary">
                  Carte d&apos;Étudiant
                </h3>
              </div>

              <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-5 flex flex-col items-center text-center space-y-3">
                <div className="w-20 h-20 rounded-2xl bg-accent/15 border-2 border-accent/30 text-accent flex items-center justify-center font-bold text-2xl shadow-inner overflow-hidden">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{prenom?.[0]}{nom?.[0]}</span>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-secondary">
                    {prenom} {nom}
                  </h4>
                  <p className="text-xs text-secondary/60 mt-0.5">
                    {currentUser.email}
                  </p>
                </div>

                <div className="w-full pt-3 border-t border-secondary/15 flex items-center justify-center text-[11px] text-secondary/70">
                  <span>Classe: <strong>DSI3.3</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-accent/10 border border-accent/20 text-[11px] text-secondary/80 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
              <span>Compte vérifié par le Directeur de l&apos;Établissement.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
