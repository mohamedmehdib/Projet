"use client";

import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  Calendar,
  GraduationCap,
  Shield,
  Layers,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export interface FaqItem {
  question: string;
  answer: string;
  category: "Safety" | "Setup" | "Integrations";
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Comment UniPlan élimine-t-il les conflits dans les emplois du temps ?",
    answer:
      "UniPlan intègre un moteur d'optimisation de contraintes multi-niveaux. Il prend en compte en temps réel la capacité et l'équipement des salles, les indisponibilités et desiderata des enseignants, les volumes horaires des filières et les règles pédagogiques. Dès qu'un conflit potentiel est détecté (enseignant affecté deux fois au même créneau, dépassement de capacité d'amphithéâtre), le système propose immédiatement la permutation optimale la moins intrusive.",
    category: "Safety",
  },
  {
    question: "Combien de temps prend le déploiement au sein d'un établissement ?",
    answer:
      "Pour un institut de taille moyenne, le déploiement complet s'effectue en moins de 48 heures. Nous fournissons des gabarits d'import simples (CSV/Excel) pour charger vos listes d'enseignants, salles, filières et maquettes pédagogiques. Notre équipe d'assistance vous accompagne pas à pas pour la première génération.",
    category: "Setup",
  },
  {
    question: "Comment sont recueillis et arbitrés les vœux des professeurs ?",
    answer:
      "Chaque enseignant dispose d'un accès personnel pour soumettre ses souhaits de créneaux (jours préférés, demi-journées réservées à la recherche, charge maximale quotidienne). Le directeur de département visualise l'ensemble des vœux sur une matrice interactive et peut valider ou ajuster les contraintes en toute équité avant de lancer la génération.",
    category: "Setup",
  },
  {
    question: "Les données des étudiants et des notes sont-elles en sécurité ?",
    answer:
      "Absolument. La sécurité et la confidentialité sont au cœur de l'architecture UniPlan. Toutes les données sont chiffrées de bout en bout (AES-256 au repos, TLS 1.3 en transit). L'hébergement respecte scrupuleusement la réglementation RGPD avec des serveurs certifiés ISO-27001 et des sauvegardes automatiques quotidiennes.",
    category: "Safety",
  },
  {
    question: "Comment fonctionne le suivi des absences et l'assiduité ?",
    answer:
      "L'enseignant réalise l'appel numérique directement depuis son smartphone ou PC en amphi. Les présences, retards et absences sont immédiatement consignés. Dès qu'un seuil critique est approché par un étudiant, des alertes automatiques sont émises par email/notification, et les secrétaires peuvent rattacher les certificats médicaux justificatifs.",
    category: "Safety",
  },
  {
    question: "UniPlan s'intègre-t-il avec nos logiciels universitaires existants ?",
    answer:
      "Oui. UniPlan propose des connecteurs ou des exports compatibles avec les formats universitaires courants (Apogée, ENT, Pégase, annuaires LDAP/Active Directory). Vous pouvez également synchroniser automatiquement les plannings avec Google Calendar, Outlook et Apple iCal.",
    category: "Integrations",
  },
];

export default function FaqRoadmap() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useScrollReveal<HTMLElement>(0.1);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={containerRef}
      aria-labelledby="faq-heading"
      className="relative w-full py-12 sm:py-16 bg-primary text-secondary transition-colors duration-300 border-t border-secondary/10 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 scroll-scrub">
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-secondary mb-5"
          >
            Tout ce que vous devez savoir. <br className="hidden sm:inline" />
            <span className="text-accent">
              En toute transparence.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-secondary/70 max-w-xl mx-auto leading-relaxed">
            Des réponses concrètes sur la résolution des conflits, la sécurité des données, l'intégration aux systèmes existants et la gestion des vœux.
          </p>
        </div>

        {/* Expandable Accordion with CSS Grid Row Transition */}
        <div className="space-y-4 mb-16">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="scroll-scrub"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <div
                  className={`rounded-2xl border overflow-hidden transition-colors duration-200 ${
                    isOpen
                      ? "border-accent/50 bg-secondary/7 shadow-xl shadow-accent/10"
                      : "border-secondary/15 bg-secondary/3 hover:border-secondary/30 hover:bg-secondary/5"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer focus:outline-none group"
                  >
                    <div className="flex items-center gap-3 pr-4">
                      <span
                        className={`text-xs font-mono font-bold transition-colors duration-200 ${
                          isOpen ? "text-accent" : "text-accent/70"
                        }`}
                      >
                        0{index + 1}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-secondary group-hover:text-accent transition-colors duration-200">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-secondary/60 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        isOpen ? "rotate-180 text-accent scale-110" : ""
                      }`}
                    />
                  </button>

                  {/* Animated Accordion Content */}
                  <div
                    id={`faq-answer-${index}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-secondary/75 leading-relaxed border-t border-secondary/10">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
