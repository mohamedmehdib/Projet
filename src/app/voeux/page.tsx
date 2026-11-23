"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  User as UserIcon,
  Moon,
  Sun,
  LogOut,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Search,
  Eye,
  Pencil,
  X,
  Users,
  Building,
  Calendar,
  UserCheck,
  Settings,
  ShieldCheck,
  Mail,
  Lock,
  ArrowUp,
  ClipboardList,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  FichierVoeux,
  VoeuMatiere,
  VoeuEmploi,
  FicheVoeuxMatiere,
  FicheVoeuxEmploi,
  TypeSeance,
  Jour,
} from "@/types/schema";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { SupabaseService } from "@/lib/supabaseDb";
import { getSession } from "@/lib/auth";

// ---------- Helpers ----------
function getName(map: { id: number; nom?: string; intitule?: string }[], id: number): string {
  const item = map.find((i) => i.id === id);
  return item ? (item.nom ?? item.intitule ?? `ID ${id}`) : `ID ${id}`;
}

const JOURS: Jour[] = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"];
const TYPE_SEANCES: TypeSeance[] = ["COURS", "TD", "TP"];

type VoeuxTab = "depot" | "liste" | "profile";

// ---------- Component ----------
export default function RoleVoeux({ currentUser: initialUser }: { currentUser?: User }) {
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser || null);
  const [activeTab, setActiveTab] = useState<VoeuxTab>("depot");
  const [mounted, setMounted] = useState(false);
  const [fichiersVoeux, setFichiersVoeux] = useState<FichierVoeux[]>([]);
  const [loadingVoeux, setLoadingVoeux] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!currentUser) {
      const sess = getSession();
      if (sess) setCurrentUser(sess);
    }
  }, [currentUser]);

  // Load voeux from Supabase
  const loadSupabaseVoeux = async () => {
    try {
      setLoadingVoeux(true);
      const data = await SupabaseService.getVoeux().catch(() => []);
      if (data && data.length > 0) {
        setFichiersVoeux(
          data.map((v: any) => ({
            id: v.id,
            anneeUniversitaire: v.annee_universitaire,
            semestre: v.semestre,
            dateDepot: v.date_depot ? String(v.date_depot).slice(0, 10) : new Date().toISOString().slice(0, 10),
            statut: v.statut || "brouillon",
          }))
        );
      } else {
        setFichiersVoeux([
          {
            id: 1,
            anneeUniversitaire: "2025 - 2026",
            semestre: "Semestre 1 (S1)",
            dateDepot: "2026-09-01",
            statut: "brouillon",
          },
        ]);
      }
    } finally {
      setLoadingVoeux(false);
    }
  };

  useEffect(() => {
    loadSupabaseVoeux();
  }, [currentUser]);

  // ---------- Depot form state ----------
  const [depotForm, setDepotForm] = useState<Partial<FichierVoeux>>({
    anneeUniversitaire: "2025 - 2026",
    semestre: "Semestre 1 (S1)",
    dateDepot: "2026-09-01",
    statut: "brouillon",
  });
  const [depotError, setDepotError] = useState<string | null>(null);
  const [depotSuccess, setDepotSuccess] = useState<string | null>(null);

  // ---------- VoeuMatiere (enseignant) state ----------
  const [voeuMatiereForm, setVoeuMatiereForm] = useState<Partial<VoeuMatiere>>({
    priorite: 1,
    typeSeance: "COURS",
    volumeHoraire: 0,
  });
  const [voeuxMatiere, setVoeuxMatiere] = useState<VoeuMatiere[]>([]);
  const [voeuMatiereError, setVoeuMatiereError] = useState<string | null>(null);

  const handleAddVoeuMatiere = () => {
    setVoeuMatiereError(null);
    if (!voeuMatiereForm.typeSeance || voeuMatiereForm.volumeHoraire == null || voeuMatiereForm.volumeHoraire <= 0) {
      setVoeuMatiereError("Veuillez remplir tous les champs correctement.");
      return;
    }
    const newVoeu: VoeuMatiere = {
      id: Date.now(),
      priorite: Number(voeuMatiereForm.priorite) || 1,
      typeSeance: voeuMatiereForm.typeSeance,
      volumeHoraire: Number(voeuMatiereForm.volumeHoraire),
    };
    setVoeuxMatiere((prev) => [...prev, newVoeu]);
    setVoeuMatiereForm({ priorite: prevPriorite + 1, typeSeance: "COURS", volumeHoraire: 0 });
  };

  let prevPriorite = voeuxMatiere.length > 0 ? Math.max(...voeuxMatiere.map((v) => v.priorite)) + 1 : 1;

  const handleRemoveVoeuMatiere = (id: number) => {
    setVoeuxMatiere((prev) => prev.filter((v) => v.id !== id));
  };

  // ---------- VoeuEmploi (etudiant) state ----------
  const [voeuEmploiForm, setVoeuEmploiForm] = useState<Partial<VoeuEmploi>>({
    jour: "LUNDI",
    heureDebut: "08:30",
    heureFin: "10:00",
    disponible: true,
  });
  const [voeuxEmploi, setVoeuxEmploi] = useState<VoeuEmploi[]>([]);
  const [voeuEmploiError, setVoeuEmploiError] = useState<string | null>(null);

  const handleAddVoeuEmploi = () => {
    setVoeuEmploiError(null);
    if (!voeuEmploiForm.jour || !voeuEmploiForm.heureDebut || !voeuEmploiForm.heureFin) {
      setVoeuEmploiError("Veuillez remplir tous les champs.");
      return;
    }
    const newVoeu: VoeuEmploi = {
      id: Date.now(),
      jour: voeuEmploiForm.jour,
      heureDebut: voeuEmploiForm.heureDebut,
      heureFin: voeuEmploiForm.heureFin,
      disponible: voeuEmploiForm.disponible ?? true,
    };
    setVoeuxEmploi((prev) => [...prev, newVoeu]);
  };

  const handleRemoveVoeuEmploi = (id: number) => {
    setVoeuxEmploi((prev) => prev.filter((v) => v.id !== id));
  };

  // ---------- Save depot ----------
  const handleSaveDepot = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepotError(null);
    setDepotSuccess(null);
    if (!depotForm.anneeUniversitaire || !depotForm.semestre || !depotForm.dateDepot) {
      setDepotError("Veuillez remplir tous les champs du fichier de vœux.");
      return;
    }
    try {
      setActionLoading(true);
      // Persist in Supabase
      if (currentUser?.id) {
        await SupabaseService.submitVoeu(
          {
            enseignant_id: String(currentUser.id),
            annee_universitaire: depotForm.anneeUniversitaire,
            semestre: depotForm.semestre,
            statut: depotForm.statut || "brouillon",
          },
          voeuxMatiere.map((vm) => ({
            matiere_id: 1, // Fallback to first matiere if not chosen
            priorite: vm.priorite,
            type_seance: vm.typeSeance,
            volume_horaire: vm.volumeHoraire,
          }))
        ).catch(() => {});

        // If etudiant has voeux emploi, persist them as well
        if (voeuxEmploi.length > 0) {
          for (const ve of voeuxEmploi) {
            await SupabaseService.createVoeuEmploi({
              user_id: String(currentUser.id),
              user_nom: `${currentUser.prenom} ${currentUser.nom}`,
              jour: ve.jour,
              heure_debut: ve.heureDebut,
              heure_fin: ve.heureFin,
              disponible: ve.disponible,
            }).catch(() => {});
          }
        }
      }

      const newFichier: FichierVoeux = {
        id: Date.now(),
        anneeUniversitaire: depotForm.anneeUniversitaire,
        semestre: depotForm.semestre,
        dateDepot: depotForm.dateDepot,
        statut: depotForm.statut || "brouillon",
      };
      setFichiersVoeux((prev) => [newFichier, ...prev]);
      setDepotSuccess("Fichier de vœux déposé avec succès !");
      setDepotForm({
        anneeUniversitaire: "2025 - 2026",
        semestre: "Semestre 1 (S1)",
        dateDepot: new Date().toISOString().slice(0, 10),
        statut: "brouillon",
      });
    } catch (err: any) {
      console.error("Error submitting voeu:", err);
      setDepotError("Erreur lors de la soumission du vœu.");
    } finally {
      setActionLoading(false);
    }
  };

  // ---------- Render ----------
  if (!mounted || !currentUser) {
    return null;
  }

  return (
    <div className="h-screen w-full flex bg-primary text-secondary overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-primary/80 backdrop-blur-xl border-r border-secondary/15 flex flex-col justify-between shrink-0 p-5 relative z-10">
        <div>
          <div className="flex items-center justify-between mb-8 px-1">
            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
              <span className="text-base font-extrabold tracking-tight text-secondary leading-none">
                Uni<span className="text-accent">Plan</span>
              </span>
              <span className="text-[9px] font-bold tracking-widest text-secondary/50 uppercase leading-tight mt-0.5">
                ISET Sousse
              </span>
            </Link>
            <button
              type="button"
              onClick={() => {}}
              className="h-8 w-8 rounded-xl border border-secondary/20 bg-secondary/5 text-secondary flex items-center justify-center cursor-pointer shrink-0"
            >
              <Moon className="w-4 h-4 text-slate-700" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-secondary/45 uppercase tracking-widest px-3 mb-2">
                Espace Vœux
              </p>
              <nav className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("depot")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                    activeTab === "depot"
                      ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                      : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                  }`}
                >
                  <ClipboardList className="w-4 h-4 shrink-0" />
                  <span>Dépôt des Vœux</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("liste")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                    activeTab === "liste"
                      ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                      : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Liste des Vœux</span>
                </button>
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-bold text-secondary/45 uppercase tracking-widest px-3 mb-2">
                Compte
              </p>
              <nav className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                    activeTab === "profile"
                      ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                      : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                  }`}
                >
                  <UserIcon className="w-4 h-4 shrink-0" />
                  <span>Mon profil</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-secondary/15 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-bold text-secondary truncate">
              {currentUser.prenom} {currentUser.nom}
            </p>
            <p className="text-[10px] font-medium text-accent truncate">{currentUser.role}</p>
          </div>
          <button
            type="button"
            className="p-2 rounded-lg text-secondary/60 hover:text-rose-500 hover:bg-secondary/10 transition-colors cursor-pointer shrink-0"
            onClick={() => {
              localStorage.removeItem("auth_user");
              localStorage.removeItem("auth_token");
              window.location.href = "/login";
            }}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto relative bg-primary">
        <div className="p-6 sm:p-8 max-w-7xl w-full mx-auto relative z-10">
          {activeTab === "depot" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary tracking-tight">
                    Dépôt des Vœux
                  </h1>
                  <p className="text-sm text-secondary/65 mt-1">
                    Enseignant : soumettez vos vœux de matière (priorité, type de séance, volume horaire).<br />
                    Étudiant : soumettez vos vœux d'emploi (jour, créneau, disponibilité).
                  </p>
                </div>
              </div>

              {depotError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{depotError}</span>
                </div>
              )}
              {depotSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{depotSuccess}</span>
                </div>
              )}

              {/* Fichier Vœux header form */}
              <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-secondary/10">
                  <h3 className="text-sm font-extrabold text-secondary flex items-center gap-2">
                    <Mail className="w-4 h-4 text-accent" />
                    <span>Fichier de Vœux</span>
                  </h3>
                </div>
                <form onSubmit={handleSaveDepot} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1.5">
                      Année Universitaire
                    </label>
                    <input
                      type="text"
                      required
                      value={depotForm.anneeUniversitaire || ""}
                      onChange={(e) => setDepotForm({ ...depotForm, anneeUniversitaire: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-secondary text-xs font-medium focus:outline-hidden focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1.5">
                      Semestre
                    </label>
                    <select
                      required
                      value={depotForm.semestre || ""}
                      onChange={(e) => setDepotForm({ ...depotForm, semestre: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-secondary text-xs font-medium focus:outline-hidden focus:border-accent"
                    >
                      <option value="Semestre 1 (S1)">Semestre 1 (S1)</option>
                      <option value="Semestre 2 (S2)">Semestre 2 (S2)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1.5">
                      Date de dépôt
                    </label>
                    <input
                      type="date"
                      required
                      value={depotForm.dateDepot || ""}
                      onChange={(e) => setDepotForm({ ...depotForm, dateDepot: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-secondary text-xs font-medium focus:outline-hidden focus:border-accent"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="block text-xs font-semibold text-secondary/70 mb-1.5">
                      Statut
                    </label>
                    <select
                      value={depotForm.statut || "brouillon"}
                      onChange={(e) => setDepotForm({ ...depotForm, statut: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-secondary text-xs font-medium focus:outline-hidden focus:border-accent"
                    >
                      <option value="brouillon">Brouillon</option>
                      <option value="soumis">Soumis</option>
                      <option value="valide">Validé</option>
                    </select>
                  </div>
                  <div className="col-span-full flex justify-end pt-3">
                    <button
                      type="submit"
                      className="px-6 h-10 rounded-xl bg-accent text-white text-xs font-bold hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <ArrowUp className="w-4 h-4" />
                      <span>Déposer le fichier</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Voeu Matiere (Enseignant) */}
              {currentUser.role === "Enseignant" && (
                <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-6 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-secondary/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-extrabold text-secondary">
                        Vœux Matière (Enseignant)
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-secondary/60 mb-4">
                    Choisissez une matière, son type de séance (Cours/TD/TP), le volume horaire et la priorité.
                  </p>

                  {voeuMatiereError && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{voeuMatiereError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1.5">
                        Priorité
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={voeuMatiereForm.priorite || 1}
                        onChange={(e) =>
                          setVoeuMatiereForm({ ...voeuMatiereForm, priorite: Number(e.target.value) })
                        }
                        className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-secondary text-xs font-medium focus:outline-hidden focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1.5">
                        Type Séance
                      </label>
                      <select
                        value={voeuMatiereForm.typeSeance || "COURS"}
                        onChange={(e) =>
                          setVoeuMatiereForm({ ...voeuMatiereForm, typeSeance: e.target.value as TypeSeance })
                        }
                        className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-secondary text-xs font-medium focus:outline-hidden focus:border-accent"
                      >
                        {TYPE_SEANCES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1.5">
                        Volume Horaire
                      </label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={voeuMatiereForm.volumeHoraire || 0}
                        onChange={(e) =>
                          setVoeuMatiereForm({ ...voeuMatiereForm, volumeHoraire: Number(e.target.value) })
                        }
                        className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-secondary text-xs font-medium focus:outline-hidden focus:border-accent"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleAddVoeuMatiere}
                        className="w-full h-10 rounded-xl bg-accent text-white text-xs font-bold hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-secondary/15 bg-secondary/5 text-[11px] font-bold text-secondary/60 uppercase tracking-wider">
                          <th className="py-3.5 px-4">Priorité</th>
                          <th className="py-3.5 px-4">Type Séance</th>
                          <th className="py-3.5 px-4">Volume Horaire</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-secondary/15">
                        {voeuxMatiere.map((v) => (
                          <tr key={v.id} className="hover:bg-secondary/5 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-secondary">#{v.priorite}</td>
                            <td className="py-3.5 px-4 text-secondary text-xs capitalize">{v.typeSeance}</td>
                            <td className="py-3.5 px-4 text-secondary">{v.volumeHoraire} h</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveVoeuMatiere(v.id)}
                                className="p-1.5 rounded-lg border border-secondary/15 hover:bg-rose-500/15 text-rose-500 hover:text-rose-600 transition-all cursor-pointer"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {voeuxMatiere.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-secondary/50 text-xs">
                              Aucun vœu matière ajouté.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Voeu Emploi (Etudiant) */}
              {currentUser.role === "Etudiant" && (
                <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-6 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-secondary/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-extrabold text-secondary">
                        Vœux Emploi (Étudiant)
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-secondary/60 mb-4">
                    Indiquez vos jours et créneaux préférés, ainsi que votre disponibilité.
                  </p>

                  {voeuEmploiError && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{voeuEmploiError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1.5">
                        Jour
                      </label>
                      <select
                        value={voeuEmploiForm.jour || "LUNDI"}
                        onChange={(e) => setVoeuEmploiForm({ ...voeuEmploiForm, jour: e.target.value as Jour })}
                        className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-secondary text-xs font-medium focus:outline-hidden focus:border-accent"
                      >
                        {JOURS.map((j) => (
                          <option key={j} value={j}>
                            {j.charAt(0) + j.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1.5">
                        Heure Début
                      </label>
                      <input
                        type="time"
                        required
                        value={voeuEmploiForm.heureDebut || ""}
                        onChange={(e) => setVoeuEmploiForm({ ...voeuEmploiForm, heureDebut: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-secondary text-xs font-medium focus:outline-hidden focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1.5">
                        Heure Fin
                      </label>
                      <input
                        type="time"
                        required
                        value={voeuEmploiForm.heureFin || ""}
                        onChange={(e) => setVoeuEmploiForm({ ...voeuEmploiForm, heureFin: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-secondary text-xs font-medium focus:outline-hidden focus:border-accent"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={voeuEmploiForm.disponible ?? true}
                          onChange={(e) =>
                            setVoeuEmploiForm({ ...voeuEmploiForm, disponible: e.target.checked })
                          }
                          className="w-4 h-4 rounded-md border-secondary/30 text-accent focus:ring-accent/30 cursor-pointer"
                        />
                        <span className="text-xs text-secondary/70">Disponible</span>
                      </label>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleAddVoeuEmploi}
                        className="w-full h-10 rounded-xl bg-accent text-white text-xs font-bold hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-secondary/15 bg-secondary/5 text-[11px] font-bold text-secondary/60 uppercase tracking-wider">
                          <th className="py-3.5 px-4">Jour</th>
                          <th className="py-3.5 px-4">Créneau</th>
                          <th className="py-3.5 px-4">Disponible</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-secondary/15">
                        {voeuxEmploi.map((v) => (
                          <tr key={v.id} className="hover:bg-secondary/5 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-secondary capitalize">
                              {v.jour.charAt(0) + v.jour.slice(1).toLowerCase()}
                            </td>
                            <td className="py-3.5 px-4 text-secondary">{v.heureDebut} – {v.heureFin}</td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                v.disponible
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                              }`}>
                                {v.disponible ? "Oui" : "Non"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveVoeuEmploi(v.id)}
                                className="p-1.5 rounded-lg border border-secondary/15 hover:bg-rose-500/15 text-rose-500 hover:text-rose-600 transition-all cursor-pointer"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {voeuxEmploi.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-secondary/50 text-xs">
                              Aucun vœu emploi ajouté.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "liste" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary tracking-tight">
                    Liste des Fichiers de Vœux
                  </h1>
                  <p className="text-sm text-secondary/65 mt-1">
                    Consultez l'historique des fichiers de vœux déposés.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-secondary/15 bg-primary/90 shadow-2xl backdrop-blur-xl">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-secondary/15 bg-secondary/5 text-[11px] font-bold text-secondary/60 uppercase tracking-wider">
                      <th className="py-3.5 px-4">ID</th>
                      <th className="py-3.5 px-4">Année Universitaire</th>
                      <th className="py-3.5 px-4">Semestre</th>
                      <th className="py-3.5 px-4">Date de dépôt</th>
                      <th className="py-3.5 px-4">Statut</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/15">
                    {fichiersVoeux.map((f) => (
                      <tr key={f.id} className="hover:bg-secondary/5 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-secondary">#{f.id}</td>
                        <td className="py-3.5 px-4 text-secondary">{f.anneeUniversitaire}</td>
                        <td className="py-3.5 px-4 text-secondary">{f.semestre}</td>
                        <td className="py-3.5 px-4 text-secondary">{f.dateDepot}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            f.statut === "valide"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : f.statut === "soumis"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                : "bg-secondary/10 text-secondary border-secondary/20"
                          }`}>
                            {f.statut}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            className="p-1.5 rounded-lg border border-secondary/15 hover:bg-secondary/10 text-secondary/70 hover:text-secondary transition-all cursor-pointer"
                            title="Consulter"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {fichiersVoeux.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-secondary/50 text-xs">
                          Aucun fichier de vœux trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary tracking-tight">
                Mon Profil
              </h1>
              <p className="text-sm text-secondary/65 mt-1">
                Consultez et modifiez vos informations personnelles.
              </p>

              <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                <form className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1.5">
                        Nom
                      </label>
                      <input
                        type="text"
                        defaultValue={currentUser.nom}
                        className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-secondary text-xs font-medium focus:outline-hidden focus:border-accent"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary/70 mb-1.5">
                        Prénom
                      </label>
                      <input
                        type="text"
                        defaultValue={currentUser.prenom}
                        className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-secondary text-xs font-medium focus:outline-hidden focus:border-accent"
                        disabled
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary/70 mb-1.5">
                      E-mail
                    </label>
                    <input
                      type="email"
                      defaultValue={currentUser.email}
                      className="w-full h-10 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-secondary text-xs font-medium focus:outline-hidden focus:border-accent"
                      disabled
                    />
                  </div>
                    <p className="text-[11px] text-secondary/50 mt-3">
                      Profil vérifié par l&apos;établissement.
                    </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
