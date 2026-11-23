"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  Building2,
  Users,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import RippleButton from "./RippleButton";

interface ContactFormData {
  fullName: string;
  email: string;
  phone: number | "";
  institution: string;
  role: string;
  studentCount: string;
  subject: string;
  message: string;
}

const INITIAL_FORM: ContactFormData = {
  fullName: "",
  email: "",
  phone: "",
  institution: "",
  role: "responsable-planning",
  studentCount: "500-2000",
  subject: "demo",
  message: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numValue = value === "" ? "" : Number(value.replace(/\D/g, ""));
      setFormData((prev) => ({
        ...prev,
        phone: value === "" || Number.isNaN(numValue) ? "" : numValue,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.institution.trim()) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires (Nom, Email professionnel, Établissement).");
      return;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setErrorMessage("Veuillez saisir une adresse email professionnelle valide.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    // Simulate API submission
    await new Promise((resolve) => setTimeout(resolve, 850));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setIsSubmitted(false);
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative w-full py-12 sm:py-16 bg-primary text-secondary transition-colors duration-300 border-t border-secondary/10 overflow-hidden"
    >
      {/* Background soft ambient glows */}
      <div className="absolute top-1/4 -left-36 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-36 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 scroll-scrub">
          <h2
            id="contact-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-secondary mb-5"
          >
            Prêt à Simplifier la Gestion <br className="hidden sm:inline" />
            <span className="text-accent">de Votre Établissement ?</span>
          </h2>
          <p className="text-sm sm:text-base text-secondary/70 max-w-2xl mx-auto leading-relaxed">
            Demandez une démonstration personnalisée ou échangez avec nos ingénieurs pédagogiques pour adapter UniPlan à vos maquettes et contraintes d'enseignement.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch max-w-6xl mx-auto">
          {/* Left Column: Direct info, trust badges, reassurance */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 scroll-scrub">
            <div className="rounded-3xl p-7 sm:p-8 border border-secondary/15 bg-secondary/3 backdrop-blur-xl shadow-xl flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent mb-6 shadow-sm">
                  <GraduationCap className="w-6 h-6 text-accent" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-secondary mb-3">
                  Un accompagnement dédié aux universités & facultés
                </h3>
                <p className="text-xs sm:text-sm text-secondary/70 leading-relaxed mb-6">
                  Nos consultants académiques réalisent un audit de votre grille horaire, importent vos maquettes LMD / DUT / Écoles d'Ingénieurs et forment vos équipes en moins de 48 heures.
                </p>

                {/* Contact points */}
                <div className="space-y-4 pt-2 border-t border-secondary/10">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/15 flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <Mail className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider">Email académique</p>
                      <a
                        href="mailto:contact@uniplan.education"
                        className="text-xs sm:text-sm font-semibold text-secondary hover:text-accent transition-colors"
                      >
                        contact@uniplan.education
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/15 flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider">Ligne directe universités</p>
                      <a
                        href="tel:+33189452000"
                        className="text-xs sm:text-sm font-semibold text-secondary hover:text-accent transition-colors"
                      >
                        +33 (0)1 89 45 20 00
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/15 flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider">Réactivité garantie</p>
                      <p className="text-xs sm:text-sm font-medium text-secondary/80">
                        Réponse sous 2 heures ouvrées
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantees Pills */}
              <div className="pt-6 mt-6 border-t border-secondary/10 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-secondary/5 border border-secondary/10 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-[11px] font-semibold text-secondary/80">Données RGPD & UE</span>
                </div>
                <div className="p-3 rounded-2xl bg-secondary/5 border border-secondary/10 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-[11px] font-semibold text-secondary/80">Multi-campus prêt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact / Demo Request Form */}
          <div className="lg:col-span-7 scroll-scrub">
            <div className="rounded-3xl p-7 sm:p-9 border border-secondary/15 bg-secondary/4 backdrop-blur-xl shadow-2xl relative">
              {isSubmitted ? (
                /* Success Feedback State */
                <div className="py-10 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-5 animate-pulse-glow">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-secondary tracking-tight mb-2">
                    Demande transmise avec succès !
                  </h3>
                  <p className="text-sm text-secondary/70 max-w-md mx-auto leading-relaxed mb-6">
                    Merci <strong className="text-secondary">{formData.fullName}</strong>. Un expert de l&apos;équipe UniPlan a bien reçu votre demande pour <strong className="text-secondary">{formData.institution}</strong> et vous contactera à <strong className="text-accent">{formData.email}</strong> sous 24h ouvrées.
                  </p>

                  <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/10 max-w-sm w-full text-left mb-6 space-y-1.5 text-xs text-secondary/70">
                    <p><strong>Établissement :</strong> {formData.institution}</p>
                    <p><strong>Objet :</strong> {formData.subject === "demo" ? "Démonstration personnalisée" : formData.subject === "devis" ? "Devis sur mesure" : "Renseignement technique"}</p>
                    <p><strong>Effectif :</strong> {formData.studentCount} étudiants</p>
                  </div>

                  <RippleButton
                    onClick={handleReset}
                    className="py-2.5 px-6 rounded-xl bg-accent text-white font-bold text-xs hover:opacity-95 shadow-md shadow-accent/25 transition-all cursor-pointer"
                  >
                    Envoyer une autre demande
                  </RippleButton>
                </div>
              ) : (
                /* Main Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-secondary mb-1">
                      Demander une Démo ou un Devis
                    </h3>
                    <p className="text-xs text-secondary/60 mb-5">
                      Tous les champs marqués d&apos;une astérisque (*) sont requis.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs font-semibold">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-bold text-secondary mb-1.5">
                        Nom & Prénom *
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="ex: Dr. Jean Dupont"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/20 bg-primary/70 text-secondary text-xs font-medium placeholder:text-secondary/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-secondary mb-1.5">
                        Email Professionnel *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jean.dupont@universite.fr"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/20 bg-primary/70 text-secondary text-xs font-medium placeholder:text-secondary/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Institution Name */}
                    <div>
                      <label htmlFor="institution" className="block text-xs font-bold text-secondary mb-1.5">
                        Établissement / Université *
                      </label>
                      <input
                        id="institution"
                        name="institution"
                        type="text"
                        required
                        value={formData.institution}
                        onChange={handleChange}
                        placeholder="ex: Faculté des Sciences, Sorbonne..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/20 bg-primary/70 text-secondary text-xs font-medium placeholder:text-secondary/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-secondary mb-1.5">
                        Téléphone (optionnel)
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="number"
                        inputMode="numeric"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Ex: 73307960"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/20 bg-primary/70 text-secondary text-xs font-medium placeholder:text-secondary/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Role */}
                    <div>
                      <label htmlFor="role" className="block text-xs font-bold text-secondary mb-1.5">
                        Votre Rôle
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/20 bg-primary/70 text-secondary text-xs font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer"
                      >
                        <option value="responsable-planning">Responsable Planning & Scolarité</option>
                        <option value="directeur-doyen">Doyen / Directeur d&apos;Établissement</option>
                        <option value="chef-departement">Chef de Département</option>
                        <option value="enseignant">Enseignant / Chercheur</option>
                        <option value="dsi-it">DSI / Administrateur IT</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>

                    {/* Student count */}
                    <div>
                      <label htmlFor="studentCount" className="block text-xs font-bold text-secondary mb-1.5">
                        Taille de l&apos;Établissement
                      </label>
                      <select
                        id="studentCount"
                        name="studentCount"
                        value={formData.studentCount}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/20 bg-primary/70 text-secondary text-xs font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer"
                      >
                        <option value="<500">Moins de 500 étudiants</option>
                        <option value="500-2000">500 à 2 000 étudiants</option>
                        <option value="2000-5000">2 000 à 5 000 étudiants</option>
                        <option value=">5000">Plus de 5 000 étudiants</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-xs font-bold text-secondary mb-1.5">
                      Objet Principal
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/20 bg-primary/70 text-secondary text-xs font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer"
                    >
                      <option value="demo">Démonstration en direct (30 min)</option>
                      <option value="devis">Demande de devis & contrat cadre</option>
                      <option value="migration">Migration depuis un logiciel existant</option>
                      <option value="partenariat">Partenariat universitaire ou académique</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-secondary mb-1.5">
                      Précisions sur vos besoins ou contraintes (optionnel)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Indiquez vos spécificités : nombre de filières, gestion des vœux, contraintes de salles..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/20 bg-primary/70 text-secondary text-xs font-medium placeholder:text-secondary/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <RippleButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-5 rounded-xl bg-accent text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-accent/25 hover:-translate-y-0.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Envoi en cours...</span>
                      </span>
                    ) : (
                      <>
                        <span>Envoyer ma demande de démonstration</span>
                        <Send className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </>
                    )}
                  </RippleButton>

                  <p className="text-[10px] text-center text-secondary/50 pt-1">
                    🔒 Vos données restent strictement confidentielles et ne sont jamais partagées à des tiers.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

