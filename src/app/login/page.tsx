"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sun,
  Moon,
} from "lucide-react";
import { User } from "@/types/schema";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { loginWithSupabase } from "@/lib/supabaseAuth";
import { isAuthenticated } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useThemeToggle();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to /dashboard immediately
  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
      return;
    }
    setLoading(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      // Authenticate strictly with Supabase Auth
      const result = await loginWithSupabase(email, password);

      if (result.ok) {
        localStorage.setItem("auth_user", JSON.stringify(result.user));
        localStorage.setItem("auth_token", "sb-token-" + result.user.id);
        router.push("/dashboard");
        return;
      }

      setError(result.error || "Email ou mot de passe incorrect.");
    } catch {
      setError("Erreur lors de la connexion. Veuillez vérifier vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-primary text-secondary overflow-hidden">
      {/* ================= LEFT BRAND PANEL (Matches Page 24 of Maquette) ================= */}
      <div className="hidden lg:flex lg:w-1/2 h-full bg-[#080C19] text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden border-r border-white/10 shrink-0">
        {/* Glow Spheres & Ambient Lighting */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[420px] h-[420px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none" />

        {/* Top Header / Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-colors group px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Retour à l&apos;accueil</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="UniPlan"
                width={24}
                height={24}
                className="object-contain drop-shadow-sm"
              />
              <span className="text-sm font-extrabold tracking-tight text-white">
                Uni<span className="text-[#818CF8]">Plan</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center Presentation Copy (Strictly from Maquette Page 24) */}
        <div className="relative z-10 max-w-lg my-auto py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-semibold text-indigo-300 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#818CF8]" />
            <span>Portail Numérique Académique</span>
          </div>

          <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15] mb-4">
            Emplois du temps, absences et voeux, dans un seul espace.
          </h1>
          <p className="text-sm text-slate-300/80 mb-7 leading-relaxed font-normal">
            Plateforme de l&apos;Institut Supérieur des Études Technologiques de Sousse. Chaque rôle dispose de ses propres écrans.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-2xl px-4 py-3.5 backdrop-blur-md transition-colors">
              <div className="w-2 h-2 rounded-full bg-[#818CF8] shrink-0 ring-4 ring-indigo-500/20" />
              <span className="text-xs sm:text-sm text-slate-200 font-medium">
                Publication des emplois du temps avec contrôle des conflits
              </span>
            </div>
            <div className="flex items-center gap-3.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-2xl px-4 py-3.5 backdrop-blur-md transition-colors">
              <div className="w-2 h-2 rounded-full bg-[#818CF8] shrink-0 ring-4 ring-indigo-500/20" />
              <span className="text-xs sm:text-sm text-slate-200 font-medium">
                Saisie des absences et justificatifs
              </span>
            </div>
            <div className="flex items-center gap-3.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-2xl px-4 py-3.5 backdrop-blur-md transition-colors">
              <div className="w-2 h-2 rounded-full bg-[#818CF8] shrink-0 ring-4 ring-indigo-500/20" />
              <span className="text-xs sm:text-sm text-slate-200 font-medium">
                Validation des voeux et gestion des classes
              </span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-white/10">
          <span>© 2026 ISET Sousse · Direction des Études</span>
          <span className="inline-flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#818CF8]" />
            Système sécurisé
          </span>
        </div>
      </div>

      {/* ================= RIGHT FORM PANEL ================= */}
      <div className="flex-1 h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto relative">
        {/* Top Floating Controls (Theme Toggle) */}
        <div className="flex items-center justify-between w-full mb-4">
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

        {/* Form Container (Vertically centered) */}
        <div className="w-full max-w-md mx-auto my-auto">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-secondary">
              Connexion
            </h2>
            <p className="text-xs sm:text-sm text-secondary/60 mt-1.5">
              Utilisez votre adresse institutionnelle.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1.5">
                Adresse e-mail
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-secondary/40 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@iset.tn"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-secondary/20 bg-secondary/3 text-secondary placeholder:text-secondary/40 text-sm focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-primary transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-secondary">
                  Mot de passe
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Contactez l'administration de l'ISET pour réinitialiser vos accès.");
                  }}
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-secondary/40 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-secondary/20 bg-secondary/3 text-secondary placeholder:text-secondary/40 text-sm focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-primary transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-secondary/40 hover:text-secondary cursor-pointer"
                  aria-label={showPassword ? "Masquer mot de passe" : "Afficher mot de passe"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-secondary/30 text-accent focus:ring-accent/30 cursor-pointer"
                />
                <span className="text-xs text-secondary/70">Mémoriser cet appareil</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-accent text-white text-sm font-semibold hover:opacity-95 active:scale-98 transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>


          {/* Sign up Link */}
          <div className="mt-6 pt-5 border-t border-secondary/10 flex items-center justify-between text-xs text-secondary/60">
            <span>Vous n&apos;avez pas encore de compte ?</span>
            <Link
              href="/signup"
              className="font-bold text-accent hover:underline inline-flex items-center gap-1"
            >
              <span>Créer un compte</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
