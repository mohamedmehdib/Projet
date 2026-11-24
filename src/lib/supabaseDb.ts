import { createClient } from "@/lib/supabase/client";

export const SupabaseService = {
  // ===================== PROFILES =====================
  async getProfiles() {
    const supabase = createClient();
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) throw error;
    return data;
  },

  async createUser(item: {
    email: string;
    password?: string;
    nom: string;
    prenom: string;
    role: string;
    matricule?: string;
    grade?: string;
    specialite?: string;
    bureau?: string;
  }) {
    const supabase = createClient();
    const cleanEmail = item.email.trim().toLowerCase();

    // 1. PRIMARY: Standard Supabase Auth signUp creates fully valid auth.users + auth.identities
    try {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: cleanEmail,
        password: item.password || "UniPlan2026!",
        options: {
          data: {
            nom: item.nom.trim(),
            prenom: item.prenom.trim(),
            role: item.role,
            matricule: item.matricule || null,
            grade: item.grade || null,
            specialite: item.specialite || null,
            bureau: item.bureau || null,
          },
        },
      });

      if (!authErr && authData?.user) {
        return {
          id: authData.user.id,
          nom: item.nom.trim(),
          prenom: item.prenom.trim(),
          email: cleanEmail,
          role: item.role,
        };
      }

      if (authErr && (authErr.message.includes("already registered") || authErr.message.includes("already exists"))) {
        throw new Error("Cet utilisateur existe déjà.");
      }
    } catch (e: any) {
      if (e?.message && (e.message.includes("existe déjà") || e.message.includes("already exists") || e.message.includes("already registered"))) {
        throw e;
      }
    }

    // 2. FALLBACK: RPC function (if available and handles identities)
    try {
      const { data: rpcData, error: rpcErr } = await supabase.rpc("create_new_user", {
        p_email: cleanEmail,
        p_password: item.password || "UniPlan2026!",
        p_nom: item.nom.trim(),
        p_prenom: item.prenom.trim(),
        p_role: item.role,
        p_matricule: item.matricule || null,
        p_grade: item.grade || null,
        p_specialite: item.specialite || null,
        p_bureau: item.bureau || null,
      });

      if (!rpcErr && rpcData) {
        return rpcData;
      }

      if (rpcErr && rpcErr.message && !rpcErr.message.includes("function") && !rpcErr.message.includes("does not exist")) {
        throw new Error(rpcErr.message);
      }
    } catch (e: any) {
      if (e?.message && (e.message.includes("existe déjà") || e.message.includes("already exists"))) {
        throw e;
      }
    }

    // 3. Last fallback: direct insert into public.profiles
    const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`;
    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          id,
          email: cleanEmail,
          nom: item.nom.trim(),
          prenom: item.prenom.trim(),
          role: item.role,
          matricule: item.matricule || null,
          grade: item.grade || null,
          specialite: item.specialite || null,
          bureau: item.bureau || null,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === "42501") {
        throw new Error("Impossible d'insérer le profil (RLS activée sur 'profiles').");
      }
      throw new Error(error.message || "Erreur lors de l'enregistrement du profil.");
    }

    return data;
  },

  async deleteUser(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) throw error;
  },

  async updateProfile(id: string, updates: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error("Mise à jour impossible : permissions insuffisantes (RLS) ou profil introuvable.");
    }
    return data[0];
  },

  // ===================== DÉPARTEMENTS =====================
  async getDepartements() {
    const supabase = createClient();
    const { data, error } = await supabase.from("departements").select("*").order("nom");
    if (error) throw error;
    return data;
  },

  async createDepartement(item: { nom: string; code: string }) {
    const supabase = createClient();
    const { data, error } = await supabase.from("departements").insert([item]).select().single();
    if (error) throw error;
    return data;
  },

  async updateDepartement(id: number, updates: { nom?: string; code?: string }) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("departements")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteDepartement(id: number) {
    const supabase = createClient();
    const { error } = await supabase.from("departements").delete().eq("id", id);
    if (error) throw error;
  },

  // ===================== CLASSES =====================
  async getClasses() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("classes")
      .select("*, departements(id, nom, code)")
      .order("nom");
    if (error) throw error;
    return data;
  },

  async createClasse(item: { nom: string; niveau: string; effectif: number; departement_id?: number }) {
    const supabase = createClient();
    const { data, error } = await supabase.from("classes").insert([item]).select().single();
    if (error) throw error;
    return data;
  },

  async updateClasse(id: number, updates: { nom?: string; niveau?: string; effectif?: number; departement_id?: number }) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("classes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteClasse(id: number) {
    const supabase = createClient();
    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (error) throw error;
  },

  // ===================== SALLES =====================
  async getSalles() {
    const supabase = createClient();
    const { data, error } = await supabase.from("salles").select("*").order("numero");
    if (error) throw error;
    return data;
  },

  async createSalle(item: { numero: string; capacite: number; type: "COURS" | "TP" }) {
    const supabase = createClient();
    const { data, error } = await supabase.from("salles").insert([item]).select().single();
    if (error) throw error;
    return data;
  },

  async updateSalle(id: number, updates: { numero?: string; capacite?: number; type?: "COURS" | "TP" }) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("salles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteSalle(id: number) {
    const supabase = createClient();
    const { error } = await supabase.from("salles").delete().eq("id", id);
    if (error) throw error;
  },

  // ===================== MATIÈRES =====================
  async getMatieres() {
    const supabase = createClient();
    const { data, error } = await supabase.from("matieres").select("*").order("intitule");
    if (error) throw error;
    return data;
  },

  async createMatiere(item: { code: string; intitule: string }) {
    const supabase = createClient();
    const { data, error } = await supabase.from("matieres").insert([item]).select().single();
    if (error) throw error;
    return data;
  },

  // ===================== SÉANCES / EMPLOI DU TEMPS =====================
  async getSeances() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("seances")
      .select("*, matieres(id, code, intitule), salles(id, numero, capacite, type), classes(id, nom, niveau, effectif), profiles(id, nom, prenom, email)")
      .order("heure_debut");
    if (error) throw error;
    return data;
  },

  async createSeance(item: {
    jour: string;
    heure_debut: string;
    heure_fin: string;
    type: string;
    color_variant?: string;
    matiere_id: number;
    salle_id?: number | null;
    classe_id?: number | null;
    enseignant_id?: string | null;
  }) {
    const supabase = createClient();
    const { data, error } = await supabase.from("seances").insert([item]).select().single();
    if (error) throw error;
    return data;
  },

  async updateSeance(
    id: number,
    updates: {
      jour?: string;
      heure_debut?: string;
      heure_fin?: string;
      type?: string;
      color_variant?: string;
      matiere_id?: number;
      salle_id?: number | null;
      classe_id?: number | null;
      enseignant_id?: string | null;
    }
  ) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("seances")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteSeance(id: number) {
    const supabase = createClient();
    const { error } = await supabase.from("seances").delete().eq("id", id);
    if (error) throw error;
  },

  async deleteSeancesByClasse(classeId: number) {
    const supabase = createClient();
    const { error } = await supabase.from("seances").delete().eq("classe_id", classeId);
    if (error) throw error;
  },

  async bulkCreateSeances(items: Array<{
    jour: string;
    heure_debut: string;
    heure_fin: string;
    type: string;
    color_variant?: string;
    matiere_id: number;
    salle_id?: number | null;
    classe_id?: number | null;
    enseignant_id?: string | null;
  }>) {
    if (items.length === 0) return [];
    const supabase = createClient();
    const { data, error } = await supabase.from("seances").insert(items).select();
    if (error) throw error;
    return data;
  },

  // ===================== ABSENCES =====================
  async getAbsences() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("absences")
      .select("*, seances(*, matieres(*)), profiles(*)")
      .order("date", { ascending: false });
    if (error) throw error;
    return data;
  },

  async createAbsence(item: {
    date: string;
    motif: string;
    justifiee: boolean;
    etudiant_id: string;
    seance_id?: number;
  }) {
    const supabase = createClient();
    const { data, error } = await supabase.from("absences").insert([item]).select().single();
    if (error) throw error;
    return data;
  },

  async updateAbsence(id: number, updates: Partial<{ motif: string; justifiee: boolean }>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("absences")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteAbsence(id: number) {
    const supabase = createClient();
    const { error } = await supabase.from("absences").delete().eq("id", id);
    if (error) throw error;
  },

  // ===================== VŒUX ENSEIGNANTS =====================
  async getVoeux(enseignantId?: string) {
    const supabase = createClient();
    let query = supabase
      .from("voeux")
      .select("*, voeux_matieres(*, matieres(*)), profiles(id, nom, prenom, email)");

    if (enseignantId) {
      query = query.eq("enseignant_id", enseignantId);
    }

    const { data, error } = await query.order("date_depot", { ascending: false });
    if (error) throw error;
    return data;
  },

  async submitVoeu(
    voeu: {
      enseignant_id: string;
      annee_universitaire: string;
      semestre: string;
      statut?: string;
    },
    matieres: Array<{
      matiere_id: number;
      priorite: number;
      type_seance: "COURS" | "TD" | "TP";
      volume_horaire: number;
    }>
  ) {
    const supabase = createClient();
    const { data: createdVoeu, error: voeuError } = await supabase
      .from("voeux")
      .insert([voeu])
      .select()
      .single();

    if (voeuError) throw voeuError;

    if (matieres.length > 0) {
      const matieresWithVoeuId = matieres.map((m) => ({
        ...m,
        voeu_id: createdVoeu.id,
      }));
      const { error: itemsError } = await supabase
        .from("voeux_matieres")
        .insert(matieresWithVoeuId);
      if (itemsError) throw itemsError;
    }

    return createdVoeu;
  },

  // ===================== GROUPES TP =====================
  async getGroupesTP() {
    const supabase = createClient();
    const { data, error } = await supabase.from("groupes_tp").select("*").order("nom");
    if (error) {
      console.warn("Notice: Table 'groupes_tp' introuvable ou inaccessible dans Supabase:", error.message);
      return [];
    }
    return data || [];
  },

  async createGroupeTP(item: { nom: string; capacite: number; classe_nom?: string; classe_id?: number }) {
    const supabase = createClient();
    const { data, error } = await supabase.from("groupes_tp").insert([item]).select();
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error("Impossible de créer le groupe TP dans Supabase.");
    }
    return data[0];
  },

  async deleteGroupeTP(id: number) {
    const supabase = createClient();
    const { error } = await supabase.from("groupes_tp").delete().eq("id", id);
    if (error) throw error;
  },

  // ===================== CAMPAGNES D'INSCRIPTION =====================
  async getInscriptionsCampagnes() {
    const supabase = createClient();
    const { data, error } = await supabase.from("inscriptions_campagnes").select("*").order("date_debut", { ascending: false });
    if (error) throw error;
    return data;
  },

  async createInscriptionCampagne(item: { annee: string; date_debut: string; date_fin: string; statut?: string; inscrits?: number }) {
    const supabase = createClient();
    const { data, error } = await supabase.from("inscriptions_campagnes").insert([item]).select().single();
    if (error) throw error;
    return data;
  },

  // ===================== NOTES =====================
  async getNotes() {
    const supabase = createClient();
    const { data, error } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async createNote(item: {
    etudiant_id?: string;
    etudiant_nom?: string;
    matricule?: string;
    matiere: string;
    note: number;
    coefficient?: number;
    semestre?: string;
  }) {
    const supabase = createClient();
    const { data, error } = await supabase.from("notes").insert([item]).select().single();
    if (error) throw error;
    return data;
  },

  async deleteNote(id: number) {
    const supabase = createClient();
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) throw error;
  },

  // ===================== OFFRES D'ENSEIGNEMENT =====================
  async getOffresEnseignement(departementId?: number) {
    const supabase = createClient();
    let query = supabase.from("offres_enseignement").select("*");
    if (departementId) {
      query = query.eq("departement_id", departementId);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async createOffreEnseignement(item: {
    departement_id?: number;
    matiere: string;
    semestre: string;
    volume_cours: number;
    volume_td: number;
    volume_tp: number;
    places_ouvertes: number;
    places_assignees?: number;
    statut?: string;
  }) {
    const supabase = createClient();
    const { data, error } = await supabase.from("offres_enseignement").insert([item]).select().single();
    if (error) throw error;
    return data;
  },

  // ===================== VOEUX EMPLOI (ÉTUDIANTS / ENSEIGNANTS) =====================
  async getVoeuxEmploi(userId?: string) {
    const supabase = createClient();
    let query = supabase.from("voeux_emploi").select("*").order("created_at", { ascending: false });
    if (userId) {
      query = query.eq("user_id", userId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createVoeuEmploi(item: {
    user_id?: string;
    user_nom?: string;
    jour: string;
    heure_debut: string;
    heure_fin: string;
    disponible?: boolean;
  }) {
    const supabase = createClient();
    const { data, error } = await supabase.from("voeux_emploi").insert([item]).select().single();
    if (error) throw error;
    return data;
  },

  async deleteVoeuEmploi(id: number) {
    const supabase = createClient();
    const { error } = await supabase.from("voeux_emploi").delete().eq("id", id);
    if (error) throw error;
  },
};
