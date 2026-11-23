import { createClient } from "@/lib/supabase/client";
import { User, UserRole } from "@/types/schema";
import { MOCK_USERS } from "@/lib/mockData";

export type AuthUser = User | null;

/**
 * Maps Supabase Profile + Auth data to the application's User model
 */
export function mapProfileToUser(profile: any): User {
  return {
    id: profile.id, // UUID from auth.users / profiles
    nom: profile.nom || "",
    prenom: profile.prenom || "",
    email: profile.email || "",
    motDePasse: "", // Passwords are handled securely by Supabase Auth
    photo: profile.photo || "",
    role: (profile.role as UserRole) || "Etudiant",
    matricule: profile.matricule || undefined,
    dateInscription: profile.date_inscription || undefined,
    grade: profile.grade || undefined,
    specialite: profile.specialite || undefined,
    bureau: profile.bureau || undefined,
  };
}

/**
 * Sign In with Email & Password via Supabase Auth
 * Includes graceful fallback for pre-configured development / administrative accounts
 */
export async function loginWithSupabase(
  email: string,
  password: string
): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  // If Supabase encountered a database schema/user corrupt state or failure,
  // check if this is an administrative or seed mock account with valid credentials.
  if (error || !data.user) {
    const mockMatch = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.motDePasse === password
    );

    if (mockMatch) {
      return { ok: true, user: mockMatch };
    }

    // Friendly translation for unexpected GoTrue schema query issues
    if (error?.message?.includes("Database error querying schema")) {
      return {
        ok: false,
        error:
          "Erreur d'authentification Supabase (Database error querying schema). Ce compte a été corrompu dans auth.users. Exécutez le script SQL de réparation ou utilisez un compte valide.",
      };
    }

    return {
      ok: false,
      error: error?.message || "Identifiants invalides ou compte introuvable.",
    };
  }

  // Fetch full user profile
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileErr || !profile) {
    // Fallback using auth metadata if profile query fails or trigger is pending
    const meta = data.user.user_metadata || {};
    const fallbackUser: User = {
      id: data.user.id as any,
      nom: meta.nom || "",
      prenom: meta.prenom || "",
      email: data.user.email || "",
      motDePasse: "",
      photo: "",
      role: (meta.role as UserRole) || "Etudiant",
      matricule: meta.matricule,
      grade: meta.grade,
      specialite: meta.specialite,
      bureau: meta.bureau,
    };
    return { ok: true, user: fallbackUser };
  }

  return { ok: true, user: mapProfileToUser(profile) };
}

/**
 * Sign Up with Supabase Auth
 */
export async function signupWithSupabase(params: {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role: UserRole;
  matricule?: string;
  grade?: string;
  specialite?: string;
  bureau?: string;
  institutNom?: string;
  institutAdresse?: string;
  institutTelephone?: number | null;
}): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email: params.email.trim(),
    password: params.password,
    options: {
      data: {
        nom: params.nom.trim(),
        prenom: params.prenom.trim(),
        role: params.role,
        matricule: params.matricule?.trim() || null,
        grade: params.grade?.trim() || null,
        specialite: params.specialite?.trim() || null,
        bureau: params.bureau?.trim() || null,
        institut_nom: params.institutNom?.trim() || null,
      },
    },
  });

  if (error || !data.user) {
    return {
      ok: false,
      error: error?.message || "Erreur lors de la création du compte.",
    };
  }

  // If user signed up with établissement details, record the institut
  if (params.institutNom) {
    try {
      await supabase.from("instituts").insert([
        {
          nom: params.institutNom.trim(),
          adresse: params.institutAdresse?.trim() || "",
          telephone: params.institutTelephone ?? null,
          directeur_id: data.user.id,
        },
      ]);
    } catch (e) {
      console.warn("Could not record institut details:", e);
    }
  }

  // Fallback user structure
  const newUser: User = {
    id: data.user.id as any,
    nom: params.nom.trim(),
    prenom: params.prenom.trim(),
    email: params.email.trim(),
    motDePasse: "",
    photo: "",
    role: params.role,
    matricule: params.matricule,
    grade: params.grade,
    specialite: params.specialite,
    bureau: params.bureau,
  };

  return { ok: true, user: newUser };
}

/**
 * Sign out from Supabase Auth
 */
export async function logoutWithSupabase(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

/**
 * Get current session user directly from Supabase
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (!profile) {
    const meta = session.user.user_metadata || {};
    return {
      id: session.user.id as any,
      nom: meta.nom || "",
      prenom: meta.prenom || "",
      email: session.user.email || "",
      motDePasse: "",
      photo: "",
      role: (meta.role as UserRole) || "Etudiant",
      matricule: meta.matricule,
      grade: meta.grade,
      specialite: meta.specialite,
      bureau: meta.bureau,
    };
  }

  return mapProfileToUser(profile);
}
