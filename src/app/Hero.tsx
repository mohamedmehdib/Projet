"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  UserCheck, 
  BookOpen, 
  Users
} from "lucide-react";

/** Animated counter that counts from 0 to a target value */
function useCountUp(target: number, duration = 1800, decimals = 0) {
  const [value, setValue] = useState(0);
  const triggered = useRef(false);

  const trigger = () => {
    if (triggered.current) return;
    triggered.current = true;

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return { value, trigger };
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const uptime = useCountUp(99.9, 1800, 1);
  const seances = useCountUp(12500, 1800, 0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const startCounters = () => {
      if (hasAnimated) return;
      setHasAnimated(true);
      uptime.trigger();
      seances.trigger();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCounters();
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    // Fallback trigger after a short delay in case section is already in view
    const timer = setTimeout(startCounters, 300);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [hasAnimated, uptime, seances]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-primary text-secondary pt-20 sm:pt-24 pb-6 sm:pb-8 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-center relative z-10">
        
        {/* ================= LEFT SECTION: H1, P, BUTTONS ================= */}
        <div className="lg:w-1/2 flex flex-col items-start text-left">
          {/* Academic Badge with logo.svg */}
          <div className="hero-animate inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/25 bg-accent/10 text-xs font-semibold text-accent mb-3.5 shadow-xs">
            <Image
              src="/logo.svg"
              alt="UniPlan Icon"
              width={16}
              height={16}
              className="w-4 h-4 object-contain"
            />
            <span>UniPlan • ERP & Planification Universitaire</span>
          </div>

          {/* H1 Headline */}
          <h1 className="hero-animate text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-3.5 text-secondary">
            Planification Universitaire <span className="text-accent decoration-accent/30">Sans Conflit</span>
          </h1>

          {/* Paragraph Description */}
          <p className="hero-animate hero-animate-delay-1 text-sm sm:text-base text-secondary/75 font-normal leading-relaxed mb-5 max-w-xl">
            UniPlan centralise la gestion de votre institut : plannings sans chevauchement (Cours, TD, TP), collecte automatisée des vœux et disponibilités des enseignants, affectation optimale des salles et émargement digital.
          </p>

          {/* Action Buttons */}
          <div className="hero-animate hero-animate-delay-2 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-6">
            <a
              href="#roles"
              className="group relative w-full sm:w-auto px-6 py-3 rounded-full bg-accent text-white font-bold text-sm shadow-xl shadow-accent/20 hover:opacity-95 hover:shadow-accent/35 transition-all transform hover:-translate-y-0.5 cursor-pointer text-center flex items-center justify-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">Consulter les Plannings</span>
              <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover:translate-x-1" />
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>

            <a
              href="/voeux"
              className="group w-full sm:w-auto px-6 py-3 rounded-full bg-secondary/5 backdrop-blur-md text-secondary border border-secondary/20 font-semibold text-sm hover:bg-secondary/10 hover:border-secondary/35 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <BookOpen className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform duration-200" />
              <span>Dépôt des Vœux Enseignant</span>
            </a>
          </div>

          {/* Trust Highlights — Animated Counters */}
          <div className="hero-animate hero-animate-delay-3 pt-4 border-t border-secondary/15 w-full grid grid-cols-3 gap-3">
            <div className="transition-transform duration-300 hover:scale-105">
              <p className="text-sm sm:text-base font-extrabold text-secondary flex items-center gap-1.5">
                <span>0 Conflit</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              </p>
              <p className="text-[10px] sm:text-[11px] text-secondary/65 font-medium">Contrôle Salles & Profs</p>
            </div>
            <div className="transition-transform duration-300 hover:scale-105">
              <p className="text-sm sm:text-base font-extrabold text-secondary tabular-nums">
                {seances.value.toLocaleString()} +
              </p>
              <p className="text-[10px] sm:text-[11px] text-secondary/65 font-medium">Séances Planifiées</p>
            </div>
            <div className="transition-transform duration-300 hover:scale-105">
              <p className="text-sm sm:text-base font-extrabold text-secondary tabular-nums">
                {uptime.value.toFixed(1)}%
              </p>
              <p className="text-[10px] sm:text-[11px] text-secondary/65 font-medium">Disponibilité Espace</p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SECTION: LIVE TIMETABLE & ACADEMIC DASHBOARD CARD ================= */}
        <div className="hero-animate-right relative lg:w-1/2 w-full flex items-center justify-center">
          <div className="relative w-full max-w-lg mx-auto">
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -inset-3 sm:-inset-6 rounded-3xl bg-accent/25 blur-2xl transition-all duration-300" />

            {/* Academic Preview Card */}
            <div className="relative w-full rounded-3xl border border-secondary/15 bg-primary/80 p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-3.5 transition-transform duration-500 hover:scale-[1.01]">
              
              {/* Header: Class & Academic Year */}
              <div className="flex items-center justify-between pb-3 border-b border-secondary/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-secondary">Emploi du Temps Hebdomadaire</h3>
                    <p className="text-[11px] text-secondary/60 font-medium">Classe : L3 Génie Logiciel • Semestre 1</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Publié & Validé
                  </span>
                </div>
              </div>

              {/* Sample Live Schedule Grid (Cours / TD / TP) */}
              <div className="flex flex-col gap-2.5">
                {/* Session 1: COURS */}
                <div className="group rounded-2xl p-3 border border-indigo-500/25 bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500 text-white uppercase tracking-wider">
                        COURS
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-secondary group-hover:text-accent transition-colors">
                        Architecture des Données & Cloud
                      </h4>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-secondary/80 shrink-0">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      <span>08:30 - 10:00</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-secondary/70">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-secondary/50" />
                      Amphi Ibn Khaldoun (150 places)
                    </span>
                    <span className="font-medium text-secondary/90">Pr. Dr. Ben Salem</span>
                  </div>
                </div>

                {/* Session 2: TP (with TP Group Badge) */}
                <div className="group rounded-2xl p-3 border border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white uppercase tracking-wider">
                        TP
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-secondary">
                        Développement Web & Frameworks
                      </h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary/80">
                        Groupe 1
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-secondary/80 shrink-0">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>10:15 - 12:15</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-secondary/70">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-secondary/50" />
                      Labo Informatique 03 (30 postes)
                    </span>
                    <span className="font-medium text-secondary/90">M. K. Mansour</span>
                  </div>
                </div>

                {/* Attendance Quick Roll-call Indicator */}
                <div className="rounded-2xl p-3 border border-secondary/15 bg-secondary/5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-secondary text-xs">Émargement Séance en Cours</p>
                      <p className="text-[10px] text-secondary/60">29 Présents • 1 Absence justifiée</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-1 rounded-md border border-accent/20">
                    Pointage Direct
                  </span>
                </div>
              </div>

              {/* Bottom Quick Roles Switcher Banner */}
              <div className="pt-2 border-t border-secondary/10 flex items-center justify-between text-[11px] text-secondary/60">
                <span className="flex items-center gap-1.5 font-medium">
                  <Users className="w-3.5 h-3.5 text-accent" />
                  Portails : Admin • Enseignants • Étudiants
                </span>
                <span className="font-bold text-accent hover:underline cursor-pointer">
                  Vue Grille Hebdo →
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
