"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, User, MessageCircle, Send, GraduationCap } from "lucide-react";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface Message {
  id: number;
  role: "user" | "bot";
  content: string;
}

const SUGGESTIONS = [
  { label: "📅 Emplois du temps", prompt: "Comment fonctionne la génération d'emplois du temps sans conflit ?" },
  { label: "🎓 Vœux enseignants", prompt: "Comment les professeurs soumettent-ils leurs vœux de créneaux ?" },
  { label: "👤 6 Rôles & Accès", prompt: "Quels sont les rôles et permissions disponibles dans UniPlan ?" },
  { label: "📊 Suivi des absences", prompt: "Comment se déroule le suivi de l'assiduité et des absences ?" },
  { label: "💳 Tarifs & Démo", prompt: "Quels sont les tarifs et comment obtenir une démonstration ?" },
];

/** Client-side knowledge base responses for UniPlan */
function getUniPlanResponse(input: string): string {
  const query = input.toLowerCase().trim();

  if (
    query.includes("emploi") ||
    query.includes("planning") ||
    query.includes("timetable") ||
    query.includes("conflit") ||
    query.includes("séance") ||
    query.includes("cours") ||
    query.includes("amphi")
  ) {
    return `### 📅 Emplois du Temps Intelligents Sans Conflit
UniPlan génère et synchronise les plannings de l'ensemble de votre établissement :
• **Résolution automatique des conflits** : analyse en direct les disponibilités des enseignants, des salles et des groupes d'étudiants.
• **Prise en compte des contraintes** : capacité des amphithéâtres, labos spécialisés, temps de pause et équilibre journalier.
• **Multi-départements & filières** : gestion transparente des troncs communs, TD et TP.
• **Export & Synchronisation** : téléchargement en PDF prêt à l'impression, exports Excel et synchronisation automatique avec Google Calendar / Outlook / iCal.

👉 Consultez la section [Rôles](#roles) pour voir l'aperçu par profil !`;
  }

  if (
    query.includes("vœu") ||
    query.includes("voeu") ||
    query.includes("souhait") ||
    query.includes("enseignant") ||
    query.includes("prof") ||
    query.includes("professeur") ||
    query.includes("charge")
  ) {
    return `### 🎓 Module des Vœux Enseignants
Finis les fichiers Excel et les échanges infinis par email :
• **Portail Enseignant Dédié** : chaque professeur saisit ses créneaux préférés, ses indisponibilités régulières et ses souhaits de charge.
• **Arbitrage Pédagogique** : le directeur de département visualise l'ensemble des requêtes sur une matrice claire.
• **Intégration Directe** : les contraintes validées alimentent immédiatement l'algorithme de planification.
• **Équité & Transparence** : traçabilité des attributions et respect des volumes horaires réglementaires.`;
  }

  if (
    query.includes("rôle") ||
    query.includes("role") ||
    query.includes("accès") ||
    query.includes("profil") ||
    query.includes("admin") ||
    query.includes("directeur") ||
    query.includes("secrétaire") ||
    query.includes("étudiant") ||
    query.includes("permission")
  ) {
    return `### 👤 6 Rôles Universitaires Dédiés
UniPlan compartimente précisément les responsabilités :
1. **Super Admin** : gestion multi-établissements, sécurité globale, SSO/LDAP et sauvegardes.
2. **Directeur d'Établissement** : vision stratégique, tableaux de bord de faculté et validation finale des plannings.
3. **Directeur de Département** : maquettes pédagogiques, affectation des enseignants et arbitrage des vœux.
4. **Secrétaire Pédagogique** : logistique des salles, publication officielle et justificatifs d'absence.
5. **Enseignant** : dépôt des vœux, consultation de son planning et appel numérique en cours.
6. **Étudiant** : planning personnalisé en direct sur smartphone et suivi du quota d'absences.`;
  }

  if (
    query.includes("absence") ||
    query.includes("présence") ||
    query.includes("assiduité") ||
    query.includes("justificatif") ||
    query.includes("émargement") ||
    query.includes("retard")
  ) {
    return `### 📊 Suivi d'Assiduité & Absences
Une traçabilité moderne pour lutter contre l'absentéisme :
• **Pointage en 30 secondes** : l'enseignant valide les présences depuis son téléphone ou son ordinateur en amphi.
• **Alertes Automatisées** : notifications automatiques envoyées à l'étudiant dès l'approche du seuil d'élimination.
• **Dépôt Numérique** : transmission et validation des certificats médicaux par le secrétariat.
• **Rapports Statistiques** : indicateurs d'assiduité par matière, filière ou promotion téléchargeables en 1 clic.`;
  }

  if (
    query.includes("prix") ||
    query.includes("tarif") ||
    query.includes("plan") ||
    query.includes("coût") ||
    query.includes("abonnement") ||
    query.includes("euro") ||
    query.includes("starter") ||
    query.includes("université") ||
    query.includes("campus")
  ) {
    return `### 💳 Tarifs & Formules UniPlan
Nos offres sont dimensionnées selon la taille de votre structure :
• **Institut Starter (49€/mois • 39€/mois en annuel)** : idéal pour un département ou un petit institut (jusqu'à 500 étudiants).
• **Université (149€/mois • 119€/mois en annuel)** *(Le Plus Choisi)* : multi-départements, résolution avancée des conflits et 6 portails rôles (jusqu'à 5 000 étudiants).
• **Multi-Campus (399€/mois • 319€/mois en annuel)** : étudiants illimités, intégration SSO/LDAP, API dédiée et SLA 99.9%.

💡 *Économisez 20% avec l'engagement annuel !*
👉 Consultez notre section [Demande d'Offre](#contact-sales).`;
  }

  if (
    query.includes("démo") ||
    query.includes("demo") ||
    query.includes("essai") ||
    query.includes("test") ||
    query.includes("contacter") ||
    query.includes("contact")
  ) {
    return `### 🚀 Démonstration Personnalisée & Essai Gratuit
Vous souhaitez tester UniPlan avec vos propres maquettes pédagogiques ?
• **Essai Gratuit de 14 Jours** : accès complet sans engagement.
• **Atelier de Démonstration** : présentation de 30 minutes avec nos experts universitaires.
• **Accompagnement à l'Import** : aide à la conversion de vos fichiers existants.

👉 Envoyez-nous un message via notre [Formulaire de Contact](#contact) ou sélectionnez votre offre dans la section [Demande d'Offre](#contact-sales) !`;
  }

  return `### 👋 Bonjour ! Je suis l'assistant UniPlan.

Je suis à votre service pour vous orienter sur notre solution :
• **Génération des emplois du temps** sans conflit
• **Soumission et arbitrage des vœux** enseignants
• **Les 6 rôles dédiés** (Admin, Directeurs, Secrétariat, Enseignants, Étudiants)
• **Suivi des absences** et appel numérique
• **Tarifs et options d'intégration** (SSO, ENT, exports)

Sur quel sujet puis-je vous renseigner aujourd'hui ?`;
}

function FormattedContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
      {lines.map((line, idx) => {
        if (line.startsWith("### ")) {
          return (
            <h4 key={idx} className="font-bold text-secondary text-sm pt-1">
              {line.replace("### ", "")}
            </h4>
          );
        }
        if (line.startsWith("• ")) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-accent shrink-0 mt-0.5">•</span>
              <span>{line.replace("• ", "")}</span>
            </div>
          );
        }
        if (!line.trim()) {
          return <div key={idx} className="h-1" />;
        }
        return <p key={idx}>{line}</p>;
      })}
    </div>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      content:
        "Bonjour ! 👋 Je suis l'assistant **UniPlan**. Comment puis-je vous accompagner dans la gestion des emplois du temps et le pilotage de votre université ?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const closedAt = localStorage.getItem("uniplan_chatbot_closed_at");
    if (closedAt) {
      const lastClosed = parseInt(closedAt, 10);
      const TWELVE_HOURS = 12 * 60 * 60 * 1000;
      if (Date.now() - lastClosed < TWELVE_HOURS) {
        return;
      }
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 25000);
    return () => clearTimeout(timer);
  }, [isReady]);

  const closeChat = () => {
    setIsOpen(false);
    localStorage.setItem("uniplan_chatbot_closed_at", Date.now().toString());
  };

  const toggleChat = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (!next) {
      localStorage.setItem("uniplan_chatbot_closed_at", Date.now().toString());
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeChat();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleSendText(textToSend?: string) {
    const text = (textToSend || message).trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const responseContent = getUniPlanResponse(text);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          content: responseContent,
        },
      ]);
      setIsTyping(false);
    }, 450);
  }

  return (
    <div ref={containerRef} className="fixed bottom-5 right-6 z-50">
      {/* Chat Panel */}
      <div
        className={cn(
          "absolute bottom-16 right-0",
          "w-[350px] sm:w-[390px] max-w-[calc(100vw-2rem)]",
          "overflow-hidden rounded-3xl border border-secondary/15 bg-primary/95 shadow-2xl shadow-accent/20 backdrop-blur-xl",
          "transition-all duration-300 origin-bottom-right",
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-3 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-secondary/10 bg-secondary/4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-accent/15 border border-accent/30 text-accent shadow-sm overflow-hidden p-1.5">
              <Image
                src="/logo.svg"
                alt="UniPlan Assistant"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-secondary tracking-tight">
                UniPlan Assistant
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-medium text-secondary/60">
                  En ligne • Réponses instantanées
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={closeChat}
            aria-label="Fermer le chat"
            className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-lg hover:bg-secondary/10 text-secondary/50 hover:text-secondary transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-3.5">
          {messages.length <= 2 && (
            <div className="pt-1 pb-2">
              <p className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider mb-2">
                Questions Fréquentes
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSendText(item.prompt)}
                    className="text-xs px-2.5 py-1.5 rounded-xl bg-secondary/5 hover:bg-accent hover:text-white border border-secondary/15 hover:border-transparent text-secondary/80 transition-all duration-150 cursor-pointer text-left active:scale-95"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-end gap-2",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border shadow-xs overflow-hidden",
                  msg.role === "bot"
                    ? "border-accent/25 bg-accent/10"
                    : "border-secondary/20 bg-secondary/10"
                )}
              >
                {msg.role === "bot" ? (
                  <Image
                    src="/logo.svg"
                    alt="UniPlan Assistant"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                ) : (
                  <User size={13} className="text-secondary/70" />
                )}
              </div>

              <div
                className={cn(
                  "max-w-[85%] rounded-2xl p-3.5 shadow-sm border",
                  msg.role === "bot"
                    ? "rounded-bl-xs border-secondary/10 bg-secondary/4 text-secondary"
                    : "rounded-br-xs border-accent bg-accent text-white shadow-accent/20"
                )}
              >
                {msg.role === "bot" ? (
                  <FormattedContent content={msg.content} />
                ) : (
                  <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-end gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 overflow-hidden shadow-xs">
                <Image
                  src="/logo.svg"
                  alt="UniPlan Assistant"
                  width={16}
                  height={16}
                  className="object-contain"
                />
              </div>
              <div className="rounded-2xl rounded-bl-xs border border-secondary/10 bg-secondary/4 px-3.5 py-2.5 shadow-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-accent animate-typing-dot-1" />
                  <div className="h-2 w-2 rounded-full bg-accent animate-typing-dot-2" />
                  <div className="h-2 w-2 rounded-full bg-accent animate-typing-dot-3" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-secondary/10 p-3 bg-secondary/2">
          <div className="flex items-center gap-2 rounded-2xl border border-secondary/15 bg-secondary/5 px-3 py-2 transition-all focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 focus-within:bg-secondary/7">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendText()}
              placeholder="Posez votre question sur UniPlan…"
              className="flex-1 bg-transparent text-xs sm:text-sm text-secondary placeholder:text-secondary/40 outline-none"
            />
            <button
              type="button"
              onClick={() => handleSendText()}
              disabled={!message.trim() || isTyping}
              aria-label="Envoyer le message"
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                message.trim() && !isTyping
                  ? "cursor-pointer bg-accent text-white shadow-md shadow-accent/25 hover:opacity-95 active:scale-95"
                  : "cursor-not-allowed bg-secondary/10 text-secondary/30"
              )}
            >
              <Send size={14} className={message.trim() && !isTyping ? "translate-x-0.5" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Launcher Button */}
      <button
        type="button"
        onClick={toggleChat}
        aria-label={isOpen ? "Fermer l'assistant" : "Discuter avec l'assistant UniPlan"}
        className={cn(
          "cursor-pointer",
          "flex h-13 w-13 items-center justify-center",
          "rounded-2xl transition-all duration-300 shadow-xl",
          isOpen
            ? "border border-secondary/20 bg-primary text-secondary hover:bg-secondary/10"
            : "bg-accent text-white hover:opacity-95 shadow-accent/30 hover:shadow-accent/50 hover:scale-105 active:scale-95 animate-launcher-glow"
        )}
      >
        {isOpen ? (
          <X size={20} className="transition-transform duration-200" />
        ) : (
          <div className="relative flex items-center justify-center">
            <MessageCircle size={22} />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
