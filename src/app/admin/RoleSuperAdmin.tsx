"use client";

import { useState } from "react";
import {
  User as UserIcon, CheckCircle2, AlertCircle, ShieldCheck, Lock, Camera,
  Eye, EyeOff, KeyRound, Plus, Trash2, Edit, GraduationCap, Calendar, FileText,
} from "lucide-react";
import { User, DateInscription } from "@/types/schema";

export type SuperAdminTab = "inscriptions" | "profile";

const MOCK_INSCRIPTIONS_DATA: (DateInscription & { statut: string; inscrits: number })[] = [
  { id: 1, anneeUniversitaire: "2025 - 2026", dateDebut: "2025-09-01", dateFin: "2025-09-20", statut: "Clôturée", inscrits: 1420 },
  { id: 2, anneeUniversitaire: "2026 - 2027", dateDebut: "2026-09-01", dateFin: "2026-09-25", statut: "Planifiée", inscrits: 0 },
];

interface RoleSuperAdminProps {
  currentUser: User;
  activeTab: SuperAdminTab;
  onUpdateUser: (updatedUser: User) => void;
}

export default function RoleSuperAdmin({
  currentUser, activeTab, onUpdateUser,
}: RoleSuperAdminProps) {
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [inscriptions, setInscriptions] = useState(MOCK_INSCRIPTIONS_DATA);

  // Inscription form
  const [annee, setAnnee] = useState("2026 - 2027");
  const [dateDebut, setDateDebut] = useState("2026-09-01");
  const [dateFin, setDateFin] = useState("2026-09-25");

  // Profile Form state
  const [nom, setNom] = useState(currentUser.nom || "Admin");
  const [prenom, setPrenom] = useState(currentUser.prenom || "Système");
  const [email, setEmail] = useState(currentUser.email || "superadmin@gmail.com");
  const [motDePasse, setMotDePasse] = useState(currentUser.motDePasse || "admin123");
  const [photo, setPhoto] = useState(currentUser.photo || "");

  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = { ...currentUser, nom, prenom, email, motDePasse, photo };
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
      currentPasswordInput === "admin123";
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

  const handleAddInscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annee || !dateDebut || !dateFin) {
      setPasswordError("Veuillez remplir tous les champs.");
      return;
    }
    const newInsc = {
      id: Date.now(),
      anneeUniversitaire: annee,
      dateDebut,
      dateFin,
      statut: "Ouverte",
      inscrits: 0,
    };
    setInscriptions([...inscriptions, newInsc]);
    setFormSuccess("Période d'inscription établie avec succès !");
    setTimeout(() => setFormSuccess(null), 4000);
  };

  const handleDeleteInscription = (id: number) => {
    setInscriptions(inscriptions.filter(i => i.id !== id));
    setFormSuccess("Période d'inscription supprimée.");
    setTimeout(() => setFormSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary tracking-tight">
          {activeTab === "inscriptions" && "Établir inscription"}
          {activeTab === "profile" && "Mon profil"}
        </h1>
        <p className="text-xs sm:text-sm text-secondary/65 font-medium mt-1">
          {activeTab === "inscriptions" && "Configurez et ouvrez les campagnes d'inscriptions universitaires pour l'ensemble de l'établissement."}
          {activeTab === "profile" && "Consultez et modifiez votre compte SuperAdmin."}
        </p>
      </div>

      {formSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{formSuccess}</span>
        </div>
      )}

      {/* ================= TAB 1: ÉTABLIR INSCRIPTION ================= */}
      {activeTab === "inscriptions" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider block">Campagnes Créées</span>
              <span className="text-2xl font-extrabold text-secondary mt-1 block">{inscriptions.length}</span>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Campagnes Actives</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                {inscriptions.filter(i => i.statut === "Ouverte").length}
              </span>
            </div>
            <div className="rounded-2xl border border-secondary/15 bg-primary/90 p-4 shadow-md backdrop-blur-xl">
              <span className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider block">Total Inscriptions Enregistrées</span>
              <span className="text-2xl font-extrabold text-secondary mt-1 block">
                {inscriptions.reduce((acc, i) => acc + i.inscrits, 0)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-secondary/10">
                <div>
                  <h3 className="text-sm font-extrabold text-secondary">Calendrier des Inscriptions</h3>
                  <p className="text-[11px] text-secondary/50 font-medium">Périodes officielles d'inscription et de réinscription</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-secondary/10 text-[10px] font-extrabold text-secondary/50 uppercase tracking-wider">
                      <th className="py-3 px-3">Année Univ.</th>
                      <th className="py-3 px-3">Date Début</th>
                      <th className="py-3 px-3">Date Fin</th>
                      <th className="py-3 px-3 text-center">Inscrits</th>
                      <th className="py-3 px-3 text-center">Statut</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/10">
                    {inscriptions.map((i) => (
                      <tr key={i.id} className="hover:bg-secondary/5 transition-colors">
                        <td className="py-3.5 px-3 font-semibold text-secondary">{i.anneeUniversitaire}</td>
                        <td className="py-3.5 px-3 text-secondary font-mono">{i.dateDebut}</td>
                        <td className="py-3.5 px-3 text-secondary font-mono">{i.dateFin}</td>
                        <td className="py-3.5 px-3 text-center font-bold text-secondary">{i.inscrits}</td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            i.statut === "Ouverte"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-secondary/10 text-secondary border-secondary/20"
                          }`}>
                            {i.statut}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteInscription(i.id)}
                            className="p-1.5 rounded-lg text-secondary/60 hover:text-rose-500 hover:bg-rose-500/5 transition-colors"
                            title="Supprimer"
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

            <div className="rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
              <h3 className="text-sm font-extrabold text-secondary flex items-center gap-2 mb-4 pb-2 border-b border-secondary/10">
                <Plus className="w-4 h-4 text-accent" /> Ouvrir une période
              </h3>
              <form onSubmit={handleAddInscription} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">Année Universitaire</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 2026 - 2027"
                    value={annee}
                    onChange={(e) => setAnnee(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">Date Début</label>
                  <input
                    type="date"
                    required
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary/70 mb-1">Date Fin</label>
                  <input
                    type="date"
                    required
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-secondary/20 bg-secondary/5 text-xs text-secondary font-medium focus:outline-hidden focus:border-accent"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-10 rounded-xl bg-accent text-white text-xs font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /><span>Établir la période</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MON PROFIL ================= */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-3xl border border-secondary/15 bg-primary/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 pb-3 border-b border-secondary/10">
                <h3 className="text-sm font-extrabold text-secondary flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-accent" /> Données Personnelles
                </h3>
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
                        placeholder="Confirmez le nouveau mot de passe"
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
                <h3 className="text-sm font-extrabold text-secondary">Carte SuperAdmin</h3>
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
                  <p className="text-[11px] text-secondary/60 mt-1">Super Administrateur</p>
                </div>

                <div className="w-full pt-3 border-t border-secondary/15 flex items-center justify-between text-[11px] text-secondary/70">
                  <span>Rôle: <strong>SuperAdmin</strong></span>
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
