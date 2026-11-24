"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  UserCheck,
  User as UserIcon,
  Moon,
  Sun,
  LogOut,
  FileText,
  GraduationCap,
  Building2,
  LayoutDashboard,
  Users,
  School,
  BookOpen,
} from "lucide-react";
import { User, UserRole } from "@/types/schema";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { getSession, logout, isAuthorizedForDashboard, roleRedirectPath } from "@/lib/auth";
import { logoutWithSupabase } from "@/lib/supabaseAuth";
import RoleEtudiant, { StudentTab } from "./RoleEtudiant";
import RoleEnseignant, { EnseignantTab } from "./RoleEnseignant";
import RoleSecretaire, { SecretaireTab } from "./RoleSecretaire";
import RoleSuperAdmin, { SuperAdminTab } from "../admin/RoleSuperAdmin";
import RoleDirecteurDepartement, { DirecteurDepartementTab } from "./RoleDirecteurDepartement";
import RoleDirecteurEtablissement, { DirecteurEtablissementTab } from "./RoleDirecteurEtablissement";

export type DashboardTab =
  | StudentTab
  | EnseignantTab
  | SecretaireTab
  | SuperAdminTab
  | DirecteurDepartementTab
  | DirecteurEtablissementTab
  | string;

interface RolePageProps {
  currentUser: User;
  activeTab: string;
  onUpdateUser?: (updatedUser: User) => void;
}

function getDefaultTabForRole(role: UserRole): string {
  switch (role) {
    case "Etudiant":
      return "timetable";
    case "Enseignant":
      return "absences";
    case "Secretaire":
      return "notes";
    case "SuperAdmin":
      return "inscriptions";
    case "DirecteurDepartement":
      return "emplois";
    case "DirecteurEtablissement":
      return "dashboard";
    default:
      return "profile";
  }
}

function renderRolePage(role: string, props: RolePageProps) {
  switch (role) {
    case "Etudiant":
      return <RoleEtudiant currentUser={props.currentUser} activeTab={props.activeTab as StudentTab} onUpdateUser={props.onUpdateUser!} />;
    case "Enseignant":
      return <RoleEnseignant currentUser={props.currentUser} activeTab={props.activeTab as EnseignantTab} onUpdateUser={props.onUpdateUser!} />;
    case "Secretaire":
      return <RoleSecretaire currentUser={props.currentUser} activeTab={props.activeTab as SecretaireTab} onUpdateUser={props.onUpdateUser!} />;
    case "SuperAdmin":
      return <RoleSuperAdmin currentUser={props.currentUser} activeTab={props.activeTab as SuperAdminTab} onUpdateUser={props.onUpdateUser!} />;
    case "DirecteurDepartement":
      return <RoleDirecteurDepartement currentUser={props.currentUser} activeTab={props.activeTab as DirecteurDepartementTab} onUpdateUser={props.onUpdateUser!} />;
    case "DirecteurEtablissement":
      return <RoleDirecteurEtablissement currentUser={props.currentUser} activeTab={props.activeTab as DirecteurEtablissementTab} onUpdateUser={props.onUpdateUser!} />;
    default:
      return null;
  }
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDarkMode, toggleTheme } = useThemeToggle();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTabState] = useState<string>("timetable");
  const [activeRoleMode, setActiveRoleMode] = useState<"DirecteurDepartement" | "Enseignant">("DirecteurDepartement");
  const [mounted, setMounted] = useState(false);

  // Sync activeTab with URL ?tab= parameter
  const handleSelectTab = (tab: string) => {
    setActiveTabState(tab);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    router.replace(`/dashboard?${params.toString()}`, { scroll: false });
  };

  // Toggle role mode for Directeur de Département
  const handleSwitchRoleMode = (mode: "DirecteurDepartement" | "Enseignant") => {
    setActiveRoleMode(mode);
    const defaultTab = mode === "DirecteurDepartement" ? "emplois" : "absences";
    handleSelectTab(defaultTab);
  };

  // Load authenticated user from localStorage; redirect if not authenticated
  useEffect(() => {
    setMounted(true);
    const user = getSession();
    if (!user) {
      router.push("/login");
      return;
    }
    if (!isAuthorizedForDashboard(user.role)) {
      router.push(roleRedirectPath(user.role));
      return;
    }
    setCurrentUser(user);

    // If URL contains ?tab=..., use it; otherwise use default role tab
    const urlTab = searchParams.get("tab");
    if (urlTab) {
      setActiveTabState(urlTab);
    } else {
      const defaultTab = getDefaultTabForRole(user.role);
      setActiveTabState(defaultTab);
    }
  }, [router, searchParams]);

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
  };

  const handleLogout = async () => {
    logout();
    await logoutWithSupabase().catch(() => {});
    router.replace("/login");
  };

  if (!mounted || !currentUser) {
    return null;
  }

  return (
    <div className="h-screen w-full flex bg-primary text-secondary overflow-hidden transition-colors duration-300">
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="w-64 h-full bg-primary/80 backdrop-blur-xl border-r border-secondary/15 flex flex-col justify-between shrink-0 p-5 relative z-10">
        <div className="overflow-y-auto pr-1">
          {/* Logo Brand Header & Theme Toggle Button */}
          <div className="flex items-center justify-between mb-6 px-1">
            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="relative transition-transform duration-300 group-hover:scale-105 flex items-center">
                <Image
                  src="/logo.svg"
                  alt="UniPlan"
                  width={32}
                  height={32}
                  priority
                  className="h-8 w-8 object-contain drop-shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-secondary leading-none">
                  Uni<span className="text-accent">Plan</span>
                </span>
                <span className="text-[9px] font-bold tracking-widest text-secondary/50 uppercase leading-tight mt-0.5">
                  ISET Sousse
                </span>
              </div>
            </Link>

            {/* Theme Toggle Button next to logo */}
            <button
              type="button"
              onClick={toggleTheme}
              className="h-8 w-8 rounded-xl border border-secondary/20 bg-secondary/5 hover:bg-secondary/10 hover:border-secondary/35 text-secondary flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-xs shrink-0"
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

          {/* Switch Role Mode Pill for Directeur de Département */}
          {currentUser.role === "DirecteurDepartement" && (
            <div className="mb-6 p-1.5 rounded-2xl bg-secondary/5 border border-secondary/15">
              <div className="text-[10px] font-extrabold text-secondary/50 uppercase tracking-wider px-2 py-1 mb-1">
                Espace Actif
              </div>
              <div className="grid grid-cols-2 gap-1 bg-secondary/10 p-0.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleSwitchRoleMode("DirecteurDepartement")}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                    activeRoleMode === "DirecteurDepartement"
                      ? "bg-accent text-white shadow-xs"
                      : "text-secondary/60 hover:text-secondary hover:bg-secondary/10"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Direction</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchRoleMode("Enseignant")}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                    activeRoleMode === "Enseignant"
                      ? "bg-accent text-white shadow-xs"
                      : "text-secondary/60 hover:text-secondary hover:bg-secondary/10"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                  <span>Enseignant</span>
                </button>
              </div>
            </div>
          )}

          {/* Role-based Navigation */}
          <div className="space-y-6">
            <div>
              <nav className="flex flex-col gap-1.5">
                {currentUser.role === "Etudiant" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("timetable")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "timetable"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>Consulter l'emploi de temps</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("absences")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "absences"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <UserCheck className="w-4 h-4 shrink-0" />
                      <span>Consulter absences</span>
                    </button>
                  </>
                )}

                {/* 2. ENSEIGNANT (ou Directeur de Département en mode Enseignant) */}
                {(currentUser.role === "Enseignant" ||
                  (currentUser.role === "DirecteurDepartement" && activeRoleMode === "Enseignant")) && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("absences")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "absences"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <UserCheck className="w-4 h-4 shrink-0" />
                      <span>Ajouter Abs</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("seances")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "seances"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>Mes séances</span>
                    </button>
                  </>
                )}

                {/* 3. SECRETAIRE (Gérer Fiche des notes + Héritage Étudiant: Consulter l'emploi de temps & Consulter absences) */}
                {currentUser.role === "Secretaire" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("notes")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "notes"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <FileText className="w-4 h-4 shrink-0" />
                      <span>Gérer Fiche des notes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("timetable")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "timetable"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>Consulter l'emploi de temps</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("absences")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "absences"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <UserCheck className="w-4 h-4 shrink-0" />
                      <span>Consulter absences</span>
                    </button>
                  </>
                )}

                {/* 4. SUPER ADMIN (Diagramme: Établir inscription) */}
                {currentUser.role === "SuperAdmin" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("inscriptions")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "inscriptions"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 shrink-0" />
                      <span>Établir inscription</span>
                    </button>
                  </>
                )}

                {/* 5. DIRECTEUR DE DÉPARTEMENT (en mode Direction) */}
                {currentUser.role === "DirecteurDepartement" && activeRoleMode === "DirecteurDepartement" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("emplois")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "emplois"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>Gérer les emplois</span>
                    </button>
                  </>
                )}

                {/* 6. DIRECTEUR D'ÉTABLISSEMENT */}
                {currentUser.role === "DirecteurEtablissement" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("dashboard")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "dashboard"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 shrink-0" />
                      <span>Consulter Dashboard</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("enseignants")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "enseignants"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <Users className="w-4 h-4 shrink-0" />
                      <span>Gérer les enseignants</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("etudiants")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "etudiants"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 shrink-0" />
                      <span>Gérer les étudiants</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("departements")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "departements"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span>Gérer département</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("classes")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "classes"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <School className="w-4 h-4 shrink-0" />
                      <span>Gérer les classes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("salles")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "salles"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span>Gérer les salles (C/TP)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("groupes")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "groupes"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <Users className="w-4 h-4 shrink-0" />
                      <span>Créer les groupes TP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("inscriptions")}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        activeTab === "inscriptions"
                          ? "bg-accent text-white shadow-md shadow-indigo-500/25"
                          : "text-secondary/70 hover:text-secondary hover:bg-secondary/8"
                      }`}
                    >
                      <FileText className="w-4 h-4 shrink-0" />
                      <span>Établir inscription</span>
                    </button>
                  </>
                )}
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-bold text-secondary/45 uppercase tracking-widest px-3 mb-2">
                Compte
              </p>
              <nav className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectTab("profile")}
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

        {/* Sidebar Footer: User summary & Logout */}
        <div className="pt-4 border-t border-secondary/15 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-bold text-secondary truncate">
              {currentUser.prenom} {currentUser.nom}
            </p>
            <p className="text-[10px] font-medium text-accent truncate">
              {currentUser.role === "DirecteurDepartement"
                ? activeRoleMode === "DirecteurDepartement"
                  ? "Directeur de Département"
                  : "Directeur Dép. (Mode Enseignant)"
                : currentUser.role}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Se déconnecter"
            className="p-2 rounded-lg text-secondary/60 hover:text-rose-500 hover:bg-secondary/10 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto relative bg-primary">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 right-1/4 w-[500px] h-[300px] bg-accent/15 rounded-full blur-[120px]" />

        {/* Dynamic Tab Body */}
        <div className="p-6 sm:p-8 max-w-7xl w-full mx-auto relative z-10">
          {renderRolePage(
            currentUser.role === "DirecteurDepartement" ? activeRoleMode : currentUser.role,
            {
              currentUser,
              activeTab,
              onUpdateUser: handleUpdateUser,
            }
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-primary" />}>
      <DashboardContent />
    </Suspense>
  );
}
