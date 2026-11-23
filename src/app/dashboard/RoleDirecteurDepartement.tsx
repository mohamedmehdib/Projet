"use client";

import { useState } from "react";
import {
  Calendar, User as UserIcon, CheckCircle2, AlertCircle, ShieldCheck, Lock, Camera,
  Eye, EyeOff, KeyRound, Plus, Trash2, Edit, Building2, LayoutDashboard, Users,
  GraduationCap, FileText, Settings, BookOpen, School,
} from "lucide-react";
import { User, EmploiDuTemps, Classe, GroupeTP } from "@/types/schema";
import { fetchLiveTimetable, TIME_SLOTS, DAYS, SeanceView } from "@/lib/timetableService";
import { SupabaseService } from "@/lib/supabaseDb";
import { uploadAvatar } from "@/lib/uploadService";
import { TimetableLoadingSkeleton, TableLoadingSkeleton } from "@/components/LoadingStates";
import TimetableManager from "@/components/TimetableManager";
import { useEffect } from "react";

export type DirecteurDepartementTab = "emplois" | "inscrits" | "offres" | "profile";

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

interface RoleDirecteurDepartementProps {
  currentUser: User;
  activeTab: DirecteurDepartementTab;
  onUpdateUser: (updatedUser: User) => void;
}

export default function RoleDirecteurDepartement({
  currentUser, activeTab, onUpdateUser,
}: RoleDirecteurDepartementProps) {
  const [timetableData, setTimetableData] = useState<SeanceView[]>([]);
  const [inscritsList, setInscritsList] = useState<any[]>([]);
  const [classesList, setClassesList] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [offresList, setOffresList] = useState<any[]>([
    { id: 1, intitule: "Licence Informatique", niveau: "Licence 3", description: "Formation en informatique de gestion", departement: "Informatique" },
    { id: 2, intitule: "Licence Gestion", niveau: "Licence 3", description: "Formation en gestion des entreprises", departement: "Gestion" },
    { id: 3, intitule: "Master Informatique", niveau: "Master 1", description: "Spécialisation en génie logiciel", departement: "Informatique" },
  ]);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true);
        const [sessions, profiles, classes, dbOffres] = await Promise.all([
          fetchLiveTimetable(12),
          SupabaseService.getProfiles().catch(() => []),
          SupabaseService.getClasses().catch(() => []),
          SupabaseService.getOffresEnseignement().catch(() => []),
        ]);
        setTimetableData(sessions);
        setClassesList(classes);
        if (dbOffres && dbOffres.length > 0) {
          setOffresList(
            dbOffres.map((o: any) => ({
              id: o.id,
              intitule: o.matiere,
              niveau: o.semestre || "Licence",
              description: `C: ${o.volume_cours}h · TD: ${o.volume_td}h · TP: ${o.volume_tp}h (${o.statut || "Ouvert"})`,
              departement: "Informatique",
            }))
          );
        }
        if (profiles) {
          const etudiants = profiles.filter((p: any) => p.role === "Etudiant");
          setInscritsList(
            etudiants.map((e: any, index: number) => ({
              id: e.id || index + 1,
              nom: e.nom,
              prenom: e.prenom,
              matricule: e.matricule || `ETU-2026-${1000 + index}`,
              classe: "DSI3.3",
              niveau: "Licence 3",
              statut: "Inscrit",
            }))
          );
        }
      } catch (err) {
        console.error("Error loading directeur departement data:", err);
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, [currentUser]);

  const [nom, setNom] = useState(currentUser.nom || "");
  const [prenom, setPrenom] = useState(currentUser.prenom || "");
  const [photo, setPhoto] = useState(currentUser.photo || "");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = { ...currentUser, nom, prenom, photo };
    try {
      if (typeof currentUser.id === "string") {
        await SupabaseService.updateProfile(currentUser.id, { nom, prenom, photo });
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

  return (
    <div className="space-y-6">
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary tracking-tight">
          {activeTab === "emplois" && "Gérer les emplois"}
          {activeTab === "inscrits" && "Gérer inscrits"}
          {activeTab === "offres" && "Créer les offres"}
          {activeTab === "profile" && "Mon profil"}
        </h1>
        <p className="text-xs sm:text-sm text-secondary/65 font-medium mt-1">
          {activeTab === "emplois" && "Supervisez la création et l'affectation des emplois du temps par classe."}
          {activeTab === "inscrits" && "Gérez les inscriptions et réinscriptions des étudiants."}
          {activeTab === "offres" && "Créez et gérez les offres de formation par département."}
          {activeTab === "profile" && "Consultez et modifiez votre compte directeur de département."}
        </p>
      </div>

      {formSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{formSuccess}</span>
        </div>
      )}

      {/* ================= TAB: EMPLOI DU TEMPS ================= */}
      {activeTab === "emplois" && (
        <TimetableManager />
      )}

      {/* ================= TAB: GÉRER INSCRITS ================= */}
      {activeTab === "inscrits" && (
        <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-extrabold text-secondary">Étudiants inscrits</h3>
              <p className="text-[11px] text-secondary/50 font-medium">Gestion des inscriptions du département</p>
            </div>
            <button type="button" className="px-4 h-10 rounded-xl bg-accent text-white text-xs font-semibold hover:opacity-95 transition-all cursor-pointer flex items-center gap-2">
              <Plus className="w-4 h-4" /><span>Nouvel inscrit</span>
            </button>
          </div>
          {loadingData ? (
            <TableLoadingSkeleton rows={4} cols={8} />
          ) : inscritsList.length === 0 ? (
            <div className="py-8 text-center text-secondary/50 text-xs">Aucun étudiant inscrit trouvé.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-secondary/10 text-[10px] font-extrabold text-secondary/50 uppercase tracking-wider">
                    <th className="py-3 px-3">id</th><th className="py-3 px-3">Nom</th><th className="py-3 px-3">Prénom</th><th className="py-3 px-3">Matricule</th><th className="py-3 px-3">Classe</th><th className="py-3 px-3">Niveau</th><th className="py-3 px-3 text-center">Statut</th><th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {inscritsList.map((i) => (
                    <tr key={i.id} className="hover:bg-secondary/5 transition-colors">
                      <td className="py-3.5 px-3 font-semibold text-secondary/60">#{i.id}</td>
                      <td className="py-3.5 px-3 text-secondary font-medium">{i.nom}</td>
                      <td className="py-3.5 px-3 text-secondary">{i.prenom}</td>
                      <td className="py-3.5 px-3 text-secondary font-mono text-xs">{i.matricule}</td>
                      <td className="py-3.5 px-3 text-secondary">{i.classe}</td>
                      <td className="py-3.5 px-3 text-secondary">{i.niveau}</td>
                      <td className="py-3.5 px-3 text-center"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${i.statut === "Inscrit" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}`}>{i.statut}</span></td>
                      <td className="py-3.5 px-3 text-center"><button type="button" className="p-1.5 rounded-lg text-secondary/60 hover:text-rose-500 hover:bg-rose-500/5 transition-colors" title="Supprimer"><Trash2 className="w-3 h-3" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB: CRÉER LES OFFRES ================= */}
      {activeTab === "offres" && (
        <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-extrabold text-secondary">Offres de formation</h3>
              <p className="text-[11px] text-secondary/50 font-medium">Créez et gérez les offres du département</p>
            </div>
            <button type="button" className="px-4 h-10 rounded-xl bg-accent text-white text-xs font-semibold hover:opacity-95 transition-all cursor-pointer flex items-center gap-2">
              <Plus className="w-4 h-4" /><span>Nouvelle offre</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-secondary/10 text-[10px] font-extrabold text-secondary/50 uppercase tracking-wider">
                  <th className="py-3 px-3">id</th><th className="py-3 px-3">Intitulé</th><th className="py-3 px-3">Niveau</th><th className="py-3 px-3">Département</th><th className="py-3 px-3">Description</th><th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {offresList.map((o) => (
                  <tr key={o.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-secondary/60">#{o.id}</td>
                    <td className="py-3.5 px-3 text-secondary font-medium">{o.intitule}</td>
                    <td className="py-3.5 px-3 text-secondary">{o.niveau}</td>
                    <td className="py-3.5 px-3 text-secondary">{o.departement}</td>
                    <td className="py-3.5 px-3 text-secondary text-xs">{o.description}</td>
                    <td className="py-3.5 px-3 text-center"><button type="button" className="p-1.5 rounded-lg text-secondary/60 hover:text-rose-500 hover:bg-rose-500/5 transition-colors" title="Supprimer"><Trash2 className="w-3 h-3" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB: MON PROFIL ================= */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-secondary/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent"><UserIcon className="w-4 h-4" /></div>
                <div>
                  <h3 className="text-sm font-extrabold text-secondary">Fiche Directeur Département</h3>
                  <p className="text-[11px] text-secondary/50 font-medium">Informations du compte directeur de département</p>
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
                <h3 className="text-sm font-extrabold text-secondary">Carte Directeur Département</h3>
              </div>
              <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-5 flex flex-col items-center text-center space-y-3">
                <div className="w-20 h-20 rounded-2xl bg-accent/15 border-2 border-accent/30 text-accent flex items-center justify-center font-bold text-2xl shadow-inner overflow-hidden">{photo ? <img src={photo} alt="Avatar" className="w-full h-full object-cover" /> : <span>{prenom?.[0]}{nom?.[0]}</span>}</div>
                <div>
                  <h4 className="text-base font-extrabold text-secondary">{prenom} {nom}</h4>
                  <p className="text-xs text-secondary/60 mt-0.5">{currentUser.email}</p>
                  <p className="text-[11px] text-secondary/60 mt-1">Directeur de Département</p>
                </div>
                <div className="w-full pt-3 border-t border-secondary/15 flex items-center justify-center text-[11px] text-secondary/70"><span>Rôle: <strong>Directeur de Département</strong></span></div>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-accent/10 border border-accent/20 text-[11px] text-secondary/80 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-accent shrink-0" /><span>Compte vérifié par l'administration.</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
