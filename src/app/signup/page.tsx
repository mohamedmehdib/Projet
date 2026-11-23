"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  Building2,
  MapPin,
  Phone,
  ShieldCheck,
  Sun,
  Moon,
} from "lucide-react";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { signupWithSupabase } from "@/lib/supabaseAuth";
import { isAuthenticated } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useThemeToggle();

  // If already authenticated, redirect to /dashboard immediately
  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  // Directeur d'établissement credentials
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Établissement (Institut) data
  const [etablissementNom, setEtablissementNom] = useState("");
  const [etablissementAdresse, setEtablissementAdresse] = useState("");
  const [etablissementTelephone, setEtablissementTelephone] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (
      !nom.trim() ||
      !prenom.trim() ||
      !email.trim() ||
      !password ||
      !etablissementNom.trim()
    ) {
      setError("Veuillez renseigner vos coordonnées et le nom de votre établissement.");
      setLoading(false);
      return;
    }

    try {
      // User is always registered as DirecteurEtablissement
      const parsedTel = etablissementTelephone ? parseInt(etablissementTelephone.replace(/\D/g, ""), 10) : null;
      const result = await signupWithSupabase({
        email: email.trim(),
        password,
        nom: nom.trim(),
        prenom: prenom.trim(),
        role: "DirecteurEtablissement",
        institutNom: etablissementNom.trim(),
        institutAdresse: etablissementAdresse.trim(),
        institutTelephone: Number.isNaN(parsedTel) ? null : parsedTel,
      });

      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }

      localStorage.setItem("auth_user", JSON.stringify(result.user));
      localStorage.setItem("auth_token", "sb-session-" + result.user.id);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Erreur lors de l'enregistrement de votre établissement.");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-primary text-secondary overflow-hidden">
      {/* ================= LEFT BRAND PANEL ================= */}
      <div className="hidden lg:flex lg:w-2/5 h-full bg-[#080C19] text-white p-10 xl:p-12 flex-col justify-between relative overflow-hidden border-r border-white/10 shrink-0">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none" />

        {/* Brand header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-colors group px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Accueil</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="UniPlan" width={22} height={22} className="object-contain" />
              <span className="text-sm font-extrabold tracking-tight text-white">
                Uni<span className="text-[#818CF8]">Plan</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center feature highlight */}
        <div className="relative z-10 max-w-sm my-auto py-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-semibold text-indigo-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#818CF8]" />
            <span>Direction d&apos;Établissement</span>
          </div>

          <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-white leading-tight mb-3">
            Inscrivez votre établissement et pilotez l&apos;ensemble du campus.
          </h1>
          <p className="text-xs xl:text-sm text-slate-300/80 mb-6 leading-relaxed">
            En tant que Directeur d&apos;Établissement, vous disposez des droits complets pour créer et gérer les enseignants, étudiants, départements et emplois du temps.
          </p>

          <div className="space-y-3 text-xs text-slate-200">
            <div className="flex items-center gap-3 bg-white/[0.04] p-3 rounded-xl border border-white/10">
              <Building2 className="w-4 h-4 text-[#818CF8] shrink-0" />
              <span>Gérer les départements, classes, salles et groupes TP</span>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.04] p-3 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#818CF8] shrink-0" />
              <span>Gérer les comptes enseignants et étudiants</span>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.04] p-3 rounded-xl border border-white/10">
              <Sparkles className="w-4 h-4 text-[#818CF8] shrink-0" />
              <span>Administration globale des emplois du temps</span>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="relative z-10 text-xs text-slate-400 pt-3 border-t border-white/10">
          © 2026 UniPlan · Gestion Universitaire
        </div>
      </div>

      {/* ================= RIGHT FORM PANEL ================= */}
      <div className="flex-1 h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12 overflow-y-auto relative">
        {/* Top Floating Controls */}
        <div className="flex items-center justify-between w-full mb-2">
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary/70 hover:text-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Accueil</span>
            </Link>
          </div>
          <div className="hidden lg:block" />

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-xl border border-secondary/20 bg-secondary/5 text-secondary flex items-center justify-center cursor-pointer hover:border-secondary/40 hover:bg-secondary/10 active:scale-95 transition-all shadow-xs ml-auto"
            aria-label="Basculer le mode sombre"
            title={isDarkMode ? "Passer en Mode Clair" : "Passer en Mode Sombre"}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>
        </div>

        <div className="w-full max-w-xl mx-auto my-auto py-2">
          <div className="mb-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-secondary">
              Créer un compte Établissement
            </h2>
            <p className="text-xs sm:text-sm text-secondary/60 mt-1">
              Renseignez les données de votre établissement et vos identifiants de directeur.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Section 1: Établissement */}
            <div className="p-4 rounded-2xl border border-secondary/15 bg-secondary/[0.02] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Informations de l&apos;Établissement</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Nom de l&apos;établissement <span className="text-accent">*</span>
                </label>
                <div className="relative flex items-center">
                  <Building2 className="w-4 h-4 text-secondary/40 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={etablissementNom}
                    onChange={(e) => setEtablissementNom(e.target.value)}
                    placeholder="Ex: Institut Supérieur des Études Technologiques de Sousse"
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-secondary/20 bg-secondary/3 text-secondary placeholder:text-secondary/40 text-xs sm:text-sm focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Adresse
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="w-4 h-4 text-secondary/40 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      value={etablissementAdresse}
                      onChange={(e) => setEtablissementAdresse(e.target.value)}
                      placeholder="Ex: Rue Ibn El Jazzar, Sousse"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-secondary/20 bg-secondary/3 text-secondary placeholder:text-secondary/40 text-xs sm:text-sm focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Téléphone
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-secondary/40 absolute left-3 pointer-events-none" />
                    <input
                      type="number"
                      inputMode="numeric"
                      value={etablissementTelephone}
                      onChange={(e) => setEtablissementTelephone(e.target.value)}
                      placeholder="Ex: 73307960"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-secondary/20 bg-secondary/3 text-secondary placeholder:text-secondary/40 text-xs sm:text-sm focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-primary transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Directeur d'établissement */}
            <div className="p-4 rounded-2xl border border-secondary/15 bg-secondary/[0.02] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider">
                <UserIcon className="w-3.5 h-3.5" />
                <span>Directeur de l&apos;Établissement</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Nom <span className="text-accent">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <UserIcon className="w-4 h-4 text-secondary/40 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="Hassen"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-secondary/20 bg-secondary/3 text-secondary placeholder:text-secondary/40 text-xs sm:text-sm focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Prénom <span className="text-accent">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <UserIcon className="w-4 h-4 text-secondary/40 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      placeholder="Leila"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-secondary/20 bg-secondary/3 text-secondary placeholder:text-secondary/40 text-xs sm:text-sm focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    E-mail institutionnel <span className="text-accent">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-secondary/40 absolute left-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="directeur@iset.tn"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-secondary/20 bg-secondary/3 text-secondary placeholder:text-secondary/40 text-xs sm:text-sm focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Mot de passe <span className="text-accent">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-secondary/40 absolute left-3 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-secondary/20 bg-secondary/3 text-secondary placeholder:text-secondary/40 text-xs sm:text-sm focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-primary transition-all font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-accent text-white text-sm font-semibold hover:opacity-95 active:scale-98 transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Créer le compte de l&apos;Établissement</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-secondary/10 flex items-center justify-between text-xs text-secondary/60">
            <span>Vous avez déjà un compte ?</span>
            <Link
              href="/login"
              className="font-bold text-accent hover:underline inline-flex items-center gap-1"
            >
              <span>Se connecter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
