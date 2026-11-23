"use client";

import { useState, useRef, useEffect } from "react";
import {
  ShieldCheck,
  Building2,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Users,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export interface RoleItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  capabilities: string[];
  mockUI: React.ReactNode;
}

const roles: RoleItem[] = [
  {
    id: "super-admin",
    name: "Super Admin",
    subtitle: "Gouvernance Globale de la Plateforme",
    description:
      "Contrôle d'accès total à l'infrastructure. Configure les paramètres multi-établissements, supervise l'ensemble des départements et audite les accès.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    icon: <ShieldCheck className="w-5 h-5" />,
    capabilities: [
      "Gestion centralisée multi-instituts & campus",
      "Génération et supervision des comptes administrateurs",
      "Configuration des connecteurs d'authentification SSO & LDAP",
      "Audit des journaux de sécurité et d'activité",
      "Sauvegardes chiffrées et conformité RGPD",
      "Surveillance de la disponibilité système en temps réel",
    ],
    mockUI: (
      <div className="rounded-xl border border-secondary/10 bg-secondary/4 p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-secondary/10">
          <p className="text-xs font-semibold text-secondary/70 uppercase tracking-wider">Supervision Système</p>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-medium">Santé 100%</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Campus Actifs", val: "14" },
            { label: "Utilisateurs Inscrits", val: "18 420" },
            { label: "Emplois du Temps Actifs", val: "128" },
            { label: "Temps de Réponse", val: "42 ms" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-secondary/5 border border-secondary/10 px-3 py-2">
              <p className="text-[10px] text-secondary/50">{item.label}</p>
              <p className="text-sm font-bold text-secondary/90">{item.val}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-2.5">
          <p className="text-[11px] font-medium text-red-500">Dernier audit de sécurité</p>
          <p className="text-xs text-secondary/80 mt-0.5">0 vulnérabilité détectée · Chiffrement AES-256 actif</p>
        </div>
      </div>
    ),
  },
  {
    id: "directeur-etablissement",
    name: "Directeur d'Établissement",
    subtitle: "Vision Stratégique & Validation Finale",
    description:
      "Supervise l'ensemble des départements de la faculté. Valide les plannings semestriels avant publication et pilote les indicateurs de performance académique.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
    icon: <Building2 className="w-5 h-5" />,
    capabilities: [
      "Tableaux de bord consolidés pour toute l'université",
      "Validation en un clic des emplois du temps finalisés",
      "Suivi de l'occupation des amphithéâtres et laboratoires",
      "Analyses d'assiduité globale par département",
      "Régulation de la charge horaire des enseignants",
      "Rapports ministériels et statistiques d'accréditation",
    ],
    mockUI: (
      <div className="rounded-xl border border-secondary/10 bg-secondary/4 p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-secondary/10">
          <p className="text-xs font-semibold text-secondary/70 uppercase tracking-wider">Validation des Emplois du Temps S2</p>
          <span className="text-[10px] text-accent font-semibold">Semestre 2</span>
        </div>
        <div className="space-y-2">
          {[
            { dept: "Département Informatique", status: "Validé", date: "Aujourd'hui à 11:20", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
            { dept: "Sciences Économiques & Gestion", status: "En Révision", date: "1 conflit de salle résolu", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
            { dept: "Génie Électrique & Mécanique", status: "Validé", date: "Hier à 17:45", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
          ].map((d) => (
            <div key={d.dept} className="flex items-center justify-between rounded-lg bg-secondary/5 border border-secondary/10 px-3 py-2">
              <div>
                <p className="text-xs font-medium text-secondary/90">{d.dept}</p>
                <p className="text-[10px] text-secondary/50">{d.date}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${d.color}`}>
                {d.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "directeur-departement",
    name: "Directeur de Département",
    subtitle: "Coordination Pédagogique & Filières",
    description:
      "Gère les modules, l'affectation des enseignants et les maquettes pédagogiques. Arbitre les vœux et soumet les plannings du département.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    icon: <BookOpen className="w-5 h-5" />,
    capabilities: [
      "Gestion des filières, niveaux (Licence, Master) et groupes",
      "Affectation des matières aux enseignants permanents et vacataires",
      "Collecte et arbitrage des vœux de créneaux horaires",
      "Génération automatique d'emplois du temps optimisés",
      "Détection et résolution prompte de tout chevauchement",
      "Transmission pour approbation à la direction",
    ],
    mockUI: (
      <div className="rounded-xl border border-secondary/10 bg-secondary/4 p-4 space-y-3">
        <p className="text-xs font-semibold text-secondary/70 uppercase tracking-wider">Département Informatique</p>
        <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-secondary/70">Collecte des vœux enseignants</span>
            <span className="font-bold text-purple-500">24 / 26 soumis</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary/10">
            <div className="h-full rounded-full bg-purple-500" style={{ width: "92%" }} />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-secondary/5 border border-secondary/10 px-3 py-2 text-xs">
          <span className="text-secondary/80">Conflits détectés dans le brouillon</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">0 conflit</span>
        </div>
      </div>
    ),
  },
  {
    id: "secretaire",
    name: "Secrétaire Pédagogique",
    subtitle: "Gestion Opérationnelle & Logistique",
    description:
      "Pilote l'occupation des salles, gère les changements de dernière minute, traite les justificatifs d'absence et publie les annonces officielles.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    icon: <ClipboardList className="w-5 h-5" />,
    capabilities: [
      "Attribution dynamique et réservation ponctuelle des salles",
      "Gestion des reports et rattrapages de séances",
      "Validation des justificatifs médicaux et administratifs",
      "Diffusion instantanée des avis aux étudiants et enseignants",
      "Impression et export PDF des plannings par groupe",
      "Tenue à jour des registres d'assiduité",
    ],
    mockUI: (
      <div className="rounded-xl border border-secondary/10 bg-secondary/4 p-4 space-y-3">
        <p className="text-xs font-semibold text-secondary/70 uppercase tracking-wider">État des Salles en Temps Réel</p>
        <div className="space-y-1.5">
          {[
            { room: "Amphi Ibn Khaldoun", cap: "300 places", status: "Occupé (L2 Info)", free: false },
            { room: "Labo Réseaux & Sécurité", cap: "32 postes", status: "Disponible", free: true },
            { room: "Salle 204", cap: "45 places", status: "Réservée à 14h00", free: true },
          ].map((r) => (
            <div key={r.room} className="flex items-center justify-between rounded-lg bg-secondary/5 border border-secondary/10 px-3 py-2">
              <div>
                <p className="text-xs font-medium text-secondary/90">{r.room}</p>
                <p className="text-[10px] text-secondary/50">{r.cap}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                r.free ? "bg-emerald-500/15 text-emerald-500" : "bg-red-500/15 text-red-400"
              }`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "enseignant",
    name: "Enseignant",
    subtitle: "Espace Académique & Pédagogique",
    description:
      "Dépose ses desiderata d'horaires, accède à son emploi du temps interactif, signale les absences en cours et consulte ses charges semestrielles.",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/30",
    icon: <GraduationCap className="w-5 h-5" />,
    capabilities: [
      "Formulaire interactif de soumission des vœux et contraintes",
      "Consultation de l'emploi du temps personnalisé synchronisable iCal",
      "Appel numérique et pointage des présences en 30 secondes",
      "Notification directe des étudiants en cas de déplacement de séance",
      "Accès aux listes d'émargement et fiches étudiants",
      "Suivi de la complétion des volumes horaires prévus",
    ],
    mockUI: (
      <div className="rounded-xl border border-secondary/10 bg-secondary/4 p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-secondary/10">
          <p className="text-xs font-semibold text-secondary/70 uppercase tracking-wider">Planning du Jour · Dr. Benali</p>
          <span className="text-[10px] text-teal-500 font-semibold">Semaine A</span>
        </div>
        <div className="space-y-2">
          <div className="rounded-lg bg-teal-500/10 border border-teal-500/25 p-2.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-teal-600 dark:text-teal-400">08:30 – 10:30 · Cours Magistral</span>
              <span className="text-secondary/50">Amphi C</span>
            </div>
            <p className="text-xs font-semibold text-secondary/90 mt-1">Architecture des Ordinateurs (L1)</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-secondary/60">112 étudiants inscrits</span>
              <button type="button" className="text-[10px] font-semibold bg-teal-500 text-white px-2 py-0.5 rounded cursor-pointer">
                Faire l'appel
              </button>
            </div>
          </div>
          <div className="rounded-lg bg-secondary/5 border border-secondary/10 p-2 text-xs text-secondary/70">
            <span className="text-[11px] text-secondary/50">14:00 – 16:00 :</span> TP Réseaux (Labo 1)
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "etudiant",
    name: "Étudiant",
    subtitle: "Portail Universitaire Personnel",
    description:
      "Consulte son emploi du temps mis à jour en temps réel, reçoit des alertes push lors de changements de salle et suit son assiduité.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    icon: <Users className="w-5 h-5" />,
    capabilities: [
      "Emploi du temps synchronisé sur smartphone et tablette",
      "Alertes en direct en cas d'annulation ou changement de salle",
      "Suivi transparent du quota d'absences par matière",
      "Dépôt numérique des certificats et justificatifs médicaux",
      "Accès aux coordonnées des enseignants et délégués de groupe",
      "Vue calendrier des examens et soutenances à venir",
    ],
    mockUI: (
      <div className="rounded-xl border border-secondary/10 bg-secondary/4 p-4 space-y-3">
        <p className="text-xs font-semibold text-secondary/70 uppercase tracking-wider">Mon Profil Étudiant · L3 Info</p>
        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-secondary/70">Taux d'assiduité global</span>
            <span className="font-bold text-blue-500">94.2%</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary/10">
            <div className="h-full rounded-full bg-blue-500" style={{ width: "94.2%" }} />
          </div>
        </div>
        <div className="rounded-lg bg-secondary/5 border border-secondary/10 p-2.5 text-xs">
          <p className="font-semibold text-secondary/90">Prochain cours : Base de Données Avancées</p>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-secondary/60">
            <span>⏰ 13:30</span>
            <span>•</span>
            <span>📍 Salle 108 (Bâtiment B)</span>
          </div>
        </div>
      </div>
    ),
  },
];

export default function RoleShowcase() {
  const [activeRoleIndex, setActiveRoleIndex] = useState<number>(0);
  const [hoveredRoleIndex, setHoveredRoleIndex] = useState<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>({ left: 0, top: 0, width: 0, height: 0 });
  const [hoverStyle, setHoverStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>({ left: 0, top: 0, width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const tabsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const switcherScrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  const containerRef = useScrollReveal<HTMLElement>(0.08);
  const role = roles[activeRoleIndex];

  const checkScrollState = () => {
    const el = switcherScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  };

  const scrollSwitcher = (direction: "left" | "right") => {
    const el = switcherScrollRef.current;
    if (!el) return;

    const buttons = Object.values(tabsRef.current).filter(Boolean) as HTMLButtonElement[];
    if (buttons.length === 0) return;

    const currentScroll = el.scrollLeft;
    let targetScroll = currentScroll;

    if (direction === "right") {
      const nextBtn = buttons.find((btn) => btn.offsetLeft - 6 > currentScroll + 8);
      targetScroll = nextBtn ? Math.max(0, nextBtn.offsetLeft - 6) : el.scrollWidth;
    } else {
      const prevButtons = buttons.filter((btn) => btn.offsetLeft - 6 < currentScroll - 8);
      const prevBtn = prevButtons[prevButtons.length - 1];
      targetScroll = prevBtn ? Math.max(0, prevBtn.offsetLeft - 6) : 0;
    }

    el.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  const handleTabHover = (id: string) => {
    const idx = roles.findIndex((r) => r.id === id);
    setHoveredRoleIndex(idx);
    const btn = tabsRef.current[id];
    if (btn) {
      setHoverStyle({
        left: btn.offsetLeft,
        top: btn.offsetTop,
        width: btn.offsetWidth,
        height: btn.offsetHeight,
      });
    }
  };

  const handleTabChange = (index: number) => {
    setActiveRoleIndex(index);
    const targetRole = roles[index];
    if (!targetRole) return;
    const btn = tabsRef.current[targetRole.id];
    const scrollContainer = switcherScrollRef.current;
    if (btn && scrollContainer) {
      const targetScroll = Math.max(0, btn.offsetLeft - 6);
      scrollContainer.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const activeRoleObj = roles[activeRoleIndex];
    if (!activeRoleObj) return;

    const updateIndicator = () => {
      const activeBtn = tabsRef.current[activeRoleObj.id];
      if (activeBtn) {
        setIndicatorStyle({
          left: activeBtn.offsetLeft,
          top: activeBtn.offsetTop,
          width: activeBtn.offsetWidth,
          height: activeBtn.offsetHeight,
        });
        setHoverStyle((prev) =>
          prev.width === 0
            ? {
                left: activeBtn.offsetLeft,
                top: activeBtn.offsetTop,
                width: activeBtn.offsetWidth,
                height: activeBtn.offsetHeight,
              }
            : prev
        );
      }
    };

    updateIndicator();
    checkScrollState();
    setIsMounted(true);

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        updateIndicator();
        checkScrollState();
      });
    }

    const handleResize = () => {
      updateIndicator();
      checkScrollState();
    };

    window.addEventListener("resize", handleResize);

    const scrollEl = switcherScrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", checkScrollState, { passive: true });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (scrollEl) {
        scrollEl.removeEventListener("scroll", checkScrollState);
      }
    };
  }, [activeRoleIndex]);

  const prev = () => handleTabChange((activeRoleIndex - 1 + roles.length) % roles.length);
  const next = () => handleTabChange((activeRoleIndex + 1) % roles.length);

  return (
    <section
      id="roles"
      ref={containerRef}
      aria-labelledby="roles-heading"
      className="relative w-full py-12 sm:py-16 bg-primary text-secondary transition-colors duration-300 border-t border-secondary/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 scroll-scrub">
          <h2
            id="roles-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-secondary mb-5"
          >
            Une seule plateforme, <br />
            <span className="text-accent">6 portails dédiés sur mesure.</span>
          </h2>
          <p className="text-sm sm:text-base text-secondary/70 max-w-2xl mx-auto leading-relaxed">
            Chaque acteur universitaire accède à un espace optimisé pour ses missions : de la gouvernance stratégique jusqu'au quotidien des étudiants dans les amphis.
          </p>
        </div>

        {/* Top Interactive Role Switcher */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-12 w-full max-w-7xl mx-auto px-2 scroll-scrub">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scrollSwitcher("left")}
            aria-label="Faire défiler les rôles vers la gauche"
            className={`shrink-0 h-12 w-10 sm:h-12 sm:w-11 flex items-center justify-center rounded-2xl bg-secondary/5 hover:bg-secondary/10 border border-secondary/15 text-secondary backdrop-blur-lg shadow-xs transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
              canScrollLeft
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none invisible"
            }`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-5 sm:h-5" />
          </button>

          {/* Outer Rounded Viewport Mask */}
          <div className="rounded-2xl border border-secondary/15 bg-secondary/5 backdrop-blur-lg overflow-hidden max-w-full">
            <div
              ref={switcherScrollRef}
              className="overflow-x-auto scrollbar-none scroll-smooth"
            >
              <div
                onMouseLeave={() => setHoveredRoleIndex(null)}
                className="relative inline-flex p-1.5 gap-1.5 sm:gap-2 flex-nowrap"
              >
                {/* Animated Sliding Background Hover Pill */}
                <div
                  className="absolute rounded-xl bg-secondary/10 pointer-events-none z-0 transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{
                    left: `${hoverStyle.left}px`,
                    top: `${hoverStyle.top}px`,
                    width: `${hoverStyle.width}px`,
                    height: `${hoverStyle.height}px`,
                    opacity:
                      hoveredRoleIndex !== null && hoveredRoleIndex !== activeRoleIndex
                        ? 1
                        : 0,
                  }}
                />

                {/* Animated Sliding Background Accent Pill */}
                <div
                  className={`absolute rounded-xl bg-accent shadow-lg shadow-accent/25 pointer-events-none z-0 ${
                    isMounted
                      ? "transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                      : "transition-none"
                  }`}
                  style={{
                    left: `${indicatorStyle.left}px`,
                    top: `${indicatorStyle.top}px`,
                    width: `${indicatorStyle.width}px`,
                    height: `${indicatorStyle.height}px`,
                    opacity: indicatorStyle.width > 0 ? 1 : 0,
                  }}
                />

                {roles.map((r, i) => {
                  const isActive = activeRoleIndex === i;

                  return (
                    <button
                      key={r.id}
                      ref={(el) => {
                        tabsRef.current[r.id] = el;
                      }}
                      type="button"
                      onClick={() => handleTabChange(i)}
                      onMouseEnter={() => handleTabHover(r.id)}
                      aria-selected={isActive}
                      role="tab"
                      className={`relative z-10 flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer select-none whitespace-nowrap ${
                        isActive
                          ? "text-white"
                          : "text-secondary/70 hover:text-secondary"
                      }`}
                    >
                      <span className={isActive ? "text-white" : "text-accent"}>
                        {r.icon}
                      </span>
                      <span>{r.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scrollSwitcher("right")}
            aria-label="Faire défiler les rôles vers la droite"
            className={`shrink-0 h-12 w-10 sm:h-12 sm:w-11 flex items-center justify-center rounded-2xl bg-secondary/5 hover:bg-secondary/10 border border-secondary/15 text-secondary backdrop-blur-lg shadow-xs transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
              canScrollRight
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none invisible"
            }`}
          >
            <ChevronRight className="w-5 h-5 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Role Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Left: Role Details (7 cols) */}
          <div
            className={`lg:col-span-7 rounded-3xl border p-6 sm:p-9 transition-all duration-300 backdrop-blur-xl ${role.bgColor} ${role.borderColor}`}
          >
            <div className="flex items-center gap-4 mb-5">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${role.bgColor} border ${role.borderColor} ${role.color} shadow-sm`}
              >
                {role.icon}
              </div>
              <div>
                <h3 className={`text-xl sm:text-2xl font-extrabold ${role.color}`}>{role.name}</h3>
                <p className="text-xs sm:text-sm text-secondary/60 font-medium">{role.subtitle}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-secondary/80 leading-relaxed mb-6">
              {role.description}
            </p>

            <div className="space-y-3 mb-8">
              <p className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider">
                Missions &amp; Fonctionnalités clés
              </p>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {role.capabilities.map((cap) => (
                  <div key={cap} className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${role.color}`} />
                    <span className="text-xs text-secondary/80 leading-snug">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-secondary/15">
              <a
                href="#contact-sales"
                className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold ${role.color} hover:opacity-85 transition-opacity`}
              >
                Découvrir ce portail <ArrowRight className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Rôle précédent"
                  className="w-8 h-8 rounded-lg border border-secondary/15 flex items-center justify-center text-secondary/70 hover:text-secondary hover:bg-secondary/10 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Rôle suivant"
                  className="w-8 h-8 rounded-lg border border-secondary/15 flex items-center justify-center text-secondary/70 hover:text-secondary hover:bg-secondary/10 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Interactive Role Dashboard Mockup (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-secondary/15 bg-secondary/3 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-secondary/10">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${role.color.replace("text-", "bg-")}`} />
                  <span className="text-xs font-semibold text-secondary/70">Interface {role.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>
              </div>
              {role.mockUI}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
