"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, Quote, Building2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  flag: string;
  rating: number;
  quote: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    name: "Prof. Fatima Zahra El Mansouri",
    role: "Directrice des Études",
    company: "Université Mohammed V",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    flag: "🇲🇦",
    rating: 5,
    quote: "Avant UniPlan, la planification des emplois du temps prenait trois semaines et finissait toujours avec des conflits. Maintenant, en 2 heures, tout est généré automatiquement et sans aucun chevauchement. C'est révolutionnaire.",
  },
  {
    id: "2",
    name: "Dr. Karim Belhaj",
    role: "Directeur Département Informatique",
    company: "ENSI Tunis",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    flag: "🇹🇳",
    rating: 5,
    quote: "Le module vœux enseignants a complètement transformé notre organisation. Chaque professeur soumet ses disponibilités en ligne, et le système les intègre automatiquement. Les tensions liées à la planification ont disparu.",
  },
  {
    id: "3",
    name: "Mme. Leila Benali",
    role: "Secrétaire Principale",
    company: "Institut Supérieur de Gestion Alger",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    flag: "🇩🇿",
    rating: 5,
    quote: "UniPlan a divisé par cinq le temps que je passais à gérer les emplois du temps. Les étudiants reçoivent leur planning par notification dès qu'il est publié. Plus aucun appel pour savoir 'où a lieu le cours ?'.",
  },
  {
    id: "4",
    name: "M. Youssef Chraibi",
    role: "Enseignant-Chercheur",
    company: "Université Hassan II Casablanca",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    flag: "🇲🇦",
    rating: 5,
    quote: "Je soumets mes vœux en 5 minutes depuis mon téléphone. Le système respecte mes indisponibilités le matin et m'attribue les créneaux demandés. Je n'ai plus besoin de négocier des semaines avec l'administration.",
  },
  {
    id: "5",
    name: "Sara Hammami",
    role: "Étudiante en Master Data Science",
    company: "ESPRIT Tunis",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    flag: "🇹🇳",
    rating: 5,
    quote: "Mon emploi du temps est toujours synchronisé sur mon smartphone. Je reçois une alerte immédiate si un amphi est déplacé. Le suivi des absences m'aide à être sereine pour les examens finaux.",
  },
  {
    id: "6",
    name: "Dr. Ahmed Ferrat",
    role: "Vice-Président Pédagogie",
    company: "Université de Tlemcen",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250",
    flag: "🇩🇿",
    rating: 5,
    quote: "UniPlan nous a permis de passer à une gestion centralisée pour 4 campus simultanément. Les rapports d'assiduité automatiques ont réduit notre charge administrative de 60%. Un outil indispensable.",
  },
];

export default function Testimonials() {
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useScrollReveal<HTMLElement>(0.1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = TESTIMONIALS.length;

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % total);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, total]);

  return (
    <section
      id="testimonials"
      ref={containerRef}
      aria-labelledby="testimonials-heading"
      className="relative w-full py-12 sm:py-16 bg-primary text-secondary transition-colors duration-300 border-t border-secondary/10 overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-accent/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 scroll-scrub">
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-secondary leading-tight"
          >
            Adopté par les Établissements. <br className="hidden sm:inline" />
            <span className="text-accent">Approuvé par les Enseignants.</span>
          </h2>
          <p className="text-sm sm:text-base text-secondary/70 mt-3 max-w-2xl mx-auto leading-relaxed">
            Découvrez comment directeurs, secrétaires, professeurs et étudiants vivent une rentrée sereine grâce à UniPlan.
          </p>
        </div>

        {/* 3-Cards Sliding Viewport */}
        <div
          className="relative overflow-hidden scroll-scrub"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: `translateX(-${startIndex * (100 / 3)}%)`,
            }}
          >
            {/* Render items twice for smooth continuous loop */}
            {[...TESTIMONIALS, ...TESTIMONIALS].map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="w-full md:w-1/2 lg:w-1/3 shrink-0 p-3 flex"
              >
                <div className="w-full rounded-3xl bg-secondary/3 hover:bg-secondary/5 border border-secondary/12 hover:border-accent/40 p-6 sm:p-7 backdrop-blur-xl shadow-lg transition-all duration-300 flex flex-col justify-between group">
                  {/* Card Header: User Info at Top */}
                  <div className="pb-4 border-b border-secondary/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-accent/40 shadow-xs shrink-0">
                        <Image
                          src={item.avatar}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-xs font-black text-secondary truncate">{item.name}</span>
                          <span className="text-xs shrink-0">{item.flag}</span>
                        </div>
                        <div className="text-[11px] text-secondary/60 font-medium truncate flex items-center gap-1 mt-0.5">
                          <span className="truncate">{item.role}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-0.5 truncate">
                            <Building2 className="w-3 h-3 text-secondary/40 shrink-0" />
                            <span className="truncate">{item.company}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Quote Body */}
                  <div className="pt-5 pb-2 flex-1 relative flex flex-col justify-center">
                    <Quote className="absolute top-2 -left-1 w-10 h-10 text-secondary/5 -z-1 pointer-events-none" />
                    <p className="text-xs sm:text-sm text-secondary/80 font-medium leading-relaxed italic">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8 scroll-scrub">
          {TESTIMONIALS.map((item, index) => {
            const isActive = index === startIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setStartIndex(index)}
                aria-label={`Aller au témoignage ${index + 1}`}
                className={`relative rounded-full transition-all duration-300 cursor-pointer ${
                  isActive ? "w-8 h-2 bg-accent" : "w-2 h-2 bg-secondary/20 hover:bg-secondary/40"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
