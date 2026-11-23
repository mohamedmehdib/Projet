"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer
      aria-label="Site Footer"
      className="relative w-full bg-primary text-secondary border-t border-secondary/15 transition-colors duration-300 pt-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Section: Brand + Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-secondary/10">
          {/* Brand Info (Span 2 on lg) */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col items-start">
            <Link href="/#home" className="flex items-center gap-3 mb-4 group">
              <div className="relative w-9 h-9 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/logo.svg"
                  alt="UniPlan"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-secondary">
                  Uni<span className="text-accent">Plan</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-secondary/50 font-semibold -mt-1">
                  Academic SaaS
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-secondary/70 leading-relaxed mb-6 max-w-sm">
              La plateforme moderne de pilotage universitaire et d'ordonnancement sans conflit. Conçue pour simplifier le quotidien des directeurs, secrétaires, enseignants et étudiants.
            </p>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/5 border border-secondary/10 text-xs text-secondary/75 mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Données chiffrées AES-256 · Conformité RGPD & Hébergement certifié</span>
            </div>
          </div>

          {/* Column 1: Modules & Fonctionnalités */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-4">
              Modules
            </h4>
            <ul className="space-y-2.5 text-xs text-secondary/70">
              <li>
                <a href="#timetable" className="text-secondary/70 hover:text-accent transition-colors py-0.5 inline-block">
                  Emplois du Temps
                </a>
              </li>
              <li>
                <a href="#roles" className="text-secondary/70 hover:text-accent transition-colors py-0.5 inline-block">
                  Vœux Enseignants
                </a>
              </li>
              <li>
                <a href="#roles" className="text-secondary/70 hover:text-accent transition-colors py-0.5 inline-block">
                  Suivi des Absences
                </a>
              </li>
              <li>
                <a href="#roles" className="text-secondary/70 hover:text-accent transition-colors py-0.5 inline-block">
                  Gestion des Salles
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Rôles & Portails */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-4">
              Portails Rôles
            </h4>
            <ul className="space-y-2.5 text-xs text-secondary/70">
              <li>
                <a href="#roles" className="text-secondary/70 hover:text-accent transition-colors py-0.5 inline-block">
                  Directeur d'Établissement
                </a>
              </li>
              <li>
                <a href="#roles" className="text-secondary/70 hover:text-accent transition-colors py-0.5 inline-block">
                  Direction de Département
                </a>
              </li>
              <li>
                <a href="#roles" className="text-secondary/70 hover:text-accent transition-colors py-0.5 inline-block">
                  Secrétariat Pédagogique
                </a>
              </li>
              <li>
                <a href="#roles" className="text-secondary/70 hover:text-accent transition-colors py-0.5 inline-block">
                  Espace Enseignants
                </a>
              </li>
              <li>
                <a href="#roles" className="text-secondary/70 hover:text-accent transition-colors py-0.5 inline-block">
                  Portail Étudiants
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Tarifs & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-4">
              Ressources
            </h4>
            <ul className="space-y-2.5 text-xs text-secondary/70">
              <li>
                <a href="#contact-sales" className="text-secondary/70 hover:text-accent transition-colors py-0.5 inline-block">
                  Demande d'Offre
                </a>
              </li>
              <li>
                <a href="#faq" className="text-secondary/70 hover:text-accent transition-colors py-0.5 inline-block">
                  Foire Aux Questions
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-secondary/70 hover:text-accent transition-colors py-0.5 inline-block">
                  Témoignages
                </a>
              </li>
              <li>
                <a href="#contact" className="text-secondary/70 hover:text-accent transition-colors py-0.5 inline-block">
                  Demande de Démo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-secondary/60">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <p>© 2026 UniPlan. Tous droits réservés.</p>
            <span className="hidden sm:inline text-secondary/30">•</span>
            <div className="flex items-center gap-1.5 text-secondary/50">
              <GraduationCap className="w-3.5 h-3.5 text-accent" />
              <span>Plateforme de Gestion Universitaire Dédiée</span>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center gap-2">
            {[
              {
                name: "LinkedIn",
                href: "#",
                icon: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                ),
              },
              {
                name: "X",
                href: "#",
                icon: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ),
              },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={`Suivez UniPlan sur ${social.name}`}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary/70 hover:text-secondary bg-secondary/5 hover:bg-secondary/10 border border-secondary/10 hover:border-secondary/20 transition-all duration-200"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
