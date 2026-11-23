"use client";

import { useState } from "react";
import { Mail, Phone, Send, ShieldCheck, CheckCircle2 } from "lucide-react";
import RippleButton from "./RippleButton";

interface ContactSalesData {
  fullName: string;
  email: string;
  phone: number | "";
  institution: string;
  role: string;
  studentCount: string;
  message: string;
}

const INITIAL_FORM: ContactSalesData = {
  fullName: "",
  email: "",
  phone: "",
  institution: "",
  role: "responsable-planning",
  studentCount: "500-2000",
  message: "",
};

export default function ContactSales() {
  const [formData, setFormData] = useState<ContactSalesData>(INITIAL_FORM);
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

    await new Promise((resolve) => setTimeout(resolve, 850));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setIsSubmitted(false);
  };

  return (
    <section id="contact-sales" aria-labelledby="contact-sales-heading" className="relative w-full py-12 sm:py-16 bg-primary text-secondary transition-colors duration-300 border-t border-secondary/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 scroll-scrub">
          <h2 id="contact-sales-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-secondary mb-5">
            Demandez une Offre Personnalisée
          </h2>
          <p className="text-sm sm:text-base text-secondary/70 max-w-2xl mx-auto leading-relaxed">
            UniPlan n&apos;affiche pas de tarifs publics. Chaque établissement est unique — contactez notre{" "}
            <span className="text-accent font-semibold">service des ventes</span> pour obtenir une offre adaptée à vos besoins : nombre d&apos;étudiants, filières, vœux enseignants, gestion des salles et contraintes d&apos;emploi du temps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 scroll-scrub">
          <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-6">
            <Mail className="w-5 h-5 text-accent mb-3" />
            <h3 className="text-sm font-semibold text-secondary mb-2">service.ventes@uniplan.edu</h3>
            <p className="text-xs text-secondary/60 leading-relaxed">
              Échangez directement avec notre équipe commerciale pour construire votre offre sur mesure.
            </p>
          </div>
          <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-6">
            <Phone className="w-5 h-5 text-accent mb-3" />
            <h3 className="text-sm font-semibold text-secondary mb-2">Appel Découverte</h3>
            <p className="text-xs text-secondary/60 leading-relaxed">
              Prenez rendez-vous pour une analyse de vos besoins et une démonstration adaptée à votre institut.
            </p>
          </div>
          <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-6">
            <ShieldCheck className="w-5 h-5 text-accent mb-3" />
            <h3 className="text-sm font-semibold text-secondary mb-2">Aucun Engagement</h3>
            <p className="text-xs text-secondary/60 leading-relaxed">
              La demande d&apos;offre est gratuite et sans engagement. Vous recevez une proposition personnalisée sous 48h.
            </p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto scroll-scrub">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5 bg-secondary/5 border border-secondary/10 rounded-2xl p-8 sm:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-bold text-secondary mb-1.5">
                    Nom Complet
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Jean Dupont"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/20 bg-primary/70 text-secondary placeholder:text-secondary/40 text-xs font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-secondary mb-1.5">
                    Email Professionnel
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jean.dupont@institut.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/20 bg-primary/70 text-secondary placeholder:text-secondary/40 text-xs font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-secondary mb-1.5">
                    Téléphone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="number"
                    inputMode="numeric"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ex: 73307960"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/20 bg-primary/70 text-secondary placeholder:text-secondary/40 text-xs font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label htmlFor="institution" className="block text-xs font-bold text-secondary mb-1.5">
                    Établissement / Institut
                  </label>
                  <input
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="ISET de Tunis"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/20 bg-primary/70 text-secondary placeholder:text-secondary/40 text-xs font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    <option value="responsable-planning">Responsable Planning</option>
                    <option value="directeur-departement">Directeur Département</option>
                    <option value="directeur-etablissement">Directeur Établissement</option>
                    <option value="superadmin">Super Administrateur</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="studentCount" className="block text-xs font-bold text-secondary mb-1.5">
                    Nombre d&apos;Étudiants (estimé)
                  </label>
                  <select
                    id="studentCount"
                    name="studentCount"
                    value={formData.studentCount}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/20 bg-primary/70 text-secondary text-xs font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer"
                  >
                    <option value="moins-500">Moins de 500</option>
                    <option value="500-2000">500 - 2 000</option>
                    <option value="2000-5000">2 000 - 5 000</option>
                    <option value="plus-5000">Plus de 5 000</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold text-secondary mb-1.5">
                  Précisions sur vos besoins (optionnel)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Détaillez vos contraintes : nombre de filières, gestion des vœux, salles spécifiques..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/20 bg-primary/70 text-secondary placeholder:text-secondary/40 text-xs font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                />
              </div>
              <RippleButton
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-5 rounded-xl bg-accent text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-accent/25 hover:-translate-y-0.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Envoi au Service des Ventes...</span>
                  </span>
                ) : (
                  <>
                    <span>Envoyer ma Demande d&apos;Offre</span>
                    <Send className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </>
                )}
              </RippleButton>

              <p className="text-[10px] text-center text-secondary/50 pt-1">
                🔒 Vos données restent strictement confidentielles et ne sont jamais partagées à des tiers.
              </p>
            </form>
          ) : (
            <div className="text-center py-12 bg-secondary/5 border border-secondary/10 rounded-2xl p-8">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-secondary mb-3">Demande Envoyée !</h3>
              <p className="text-sm text-secondary/70 mb-6">
                Notre service des ventes a bien reçu votre demande. Vous recevrez une offre personnalisée sous 48h ouvrées par email.
              </p>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-accent hover:underline transition-colors"
              >
                Envoyer une autre demande
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}