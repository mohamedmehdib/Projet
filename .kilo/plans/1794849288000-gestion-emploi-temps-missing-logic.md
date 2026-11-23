# Plan: Gestion d'emploi de temps — implement missing logic + correct false logic

**Source of truth:** `public/diagramme cas.png` (use-case diagram) + `public/diagramme classe.jpeg` (class diagram).
**Stack:** Next.js 16.4.5 (App Router), React 19, Tailwind v4, TypeScript. LocalStorage mock only (no backend).

## 1. Current state (audited)

`src/types/schema.ts` already mirrors the class diagram: `Utilisateur` + 6 role subclasses, `FichierVoeux`/`FicheVoeuxMatiere`/`FicheVoeuxEmploi`/`VoeuMatiere`/`VoeuEmploi`, `Matiere`, `Salle`, `GroupeTP`, `Classe`, `Seance`, `EmploiDuTemps`, `Absence`, `Offre`, `DateInscription`, `Departement`, `Institut`.

Existing pages: `/` (landing), `/login`, `/signup`, `/dashboard` (Étudiant only: timetable/absences/profile).

## 2. Gap analysis vs diagrams

### Missing use cases (diagramme cas.png)
| Actor | Use case | Status |
|---|---|---|
| Étudiant | Gérer Profil | PARTIAL (profile tab exists, RoleEtudiant only) |
| Étudiant | Consulter l'emploi de temps | DONE (RoleEtudiant timetable) |
| Enseignant | Consulter absences / **Ajouter Abs** (`<<include>>`) | MISSING |
| Secrétaire | **Gérer Fiche des notes** | MISSING |
| Directeur département | **Gérer les emplois**, **Gérer inscrit**, **Consulter Dashboard**, Créer les offres | MISSING (offres lives under SuperAdmin) |
| Super admin | **Consulter Dashboard**, **Établir inscription**, **Gérer département**, **Administrer emploi de temps**, **Gérer les classes**, **Gérer les étudiants**, **Gérer les enseignants** | PARTIAL (dashboard + instituts/offres only) |
| Directeur établissement | **Gérer les salles (C/TP)**, **Créer les groupes TP** | MISSING |
| All | `<<include>> S'authentifier` | auth exists but flawed (see §3) |

### Missing class-diagram modules (diagramme classe.jpeg)
- `FichierVoeux` / `FicheVoeuxMatiere` / `FicheVoeuxEmploi` / `VoeuMatiere` / `VoeuEmploi` (vœux enseignant + voeux emploi) — not implemented at all, despite Hero page CTA "Dépôt des Vœux Enseignant".
- `DateInscription` — not implemented.
- `Absence.ajouter() / supprimer() / consulter()` service — not implemented.
- Role-based views for Enseignant, Secrétaire, DirecteurDepartement, DirecteurEtablissement — not implemented.

## 3. False logic to correct
1. `src/app/login/page.tsx` — no password verification: lookup by email only; any email in `registered_users` logs in regardless of password. Prefills password with `••••••••`.
2. `src/app/signup/page.tsx` — writes fields not in schema: `classe` on Etudiant, `institut` on DirecteurDepartement/DirecteurEtablissement/SuperAdmin.
3. `src/app/dashboard/page.tsx` — any non-SuperAdmin stored session is reset to DEFAULT_STUDENT (Enseignant/Secrétaire/Directeur logins collapse to student).
4. `src/app/dashboard/RoleSuperAdmin.tsx` — toast uses `animate-in fade-in slide-in-from-bottom-2` (tailwindcss-animate classes) but the plugin is not installed.
5. `src/app/dashboard/RoleEtudiant.tsx` — `DAYS` excludes `SAMEDI` though `Jour` includes it.
6. No route guards: `/dashboard` reachable without authentication.
7. No link between `EmploiDuTemps`/`Seance` and `Classe`/`GroupeTP`/`Matiere`/`Enseignant`/`Salle` in mock data (flat strings in `GridSession`).

## 4. Decisions (recommended)
- Keep localStorage mock (no backend/API) — consistent with current code.
- Build one role-based dashboard per actor: Étudiant (exists), Enseignant, Secrétaire, DirecteurDépartement, DirecteurÉtablissement, SuperAdmin (exists, extend).
- Correct auth to validate email+password against `registered_users`.
- Add a shared `src/lib/storage.ts` CRUD helper over localStorage for all schema entities.
- Implement the full vœux module (FichierVoeux + 2 subtypes + VoeuMatiere/VoeuEmploi).
- Keep UI language French; match existing styling conventions (globals.css tokens, lucide-icons).

## 5. Implementation tasks (ordered)
1. **Fix false logic** — login password validation; signup schema-conformant fields; RoleSuperAdmin toast classes; RoleEtudiant DAYS include Samedi.
2. **Auth & guards** — `src/lib/auth.ts` (login/logout/getSession/role-based redirect), route guards on `/dashboard`, Navbar conditional links.
3. **Storage layer** — `src/lib/storage.ts` generic typed CRUD for all schema entities (localStorage).
4. **Enseignant role** — `src/app/enseignant/` page: mes séances, ajouter/consulter absences (`Ajouter Abs` <<include>> Consulter absences).
5. **Secrétaire role** — `src/app/secretaire/` page: Gérer Fiche des notes (choisir, saisir et modifier).
6. **DirecteurDépartement role** — `src/app/directeur-departement/` page: Gérer les emplois, Gérer inscrit, Créer les offres, Consulter Dashboard.
7. **SuperAdmin extensions** — Établir inscription, Gérer département, Administrer emploi de temps, Gérer les classes, Gérer les étudiants, Gérer les enseignants.
8. **DirecteurÉtablissement role** — `src/app/directeur-etablissement/` page: Gérer les salles (C/TP), Créer les groupes TP.
9. **Vœux module** — FichierVoeux / FicheVoeuxMatiere (enseignant) / FicheVoeuxEmploi (étudiant) + VoeuMatiere / VoeuEmploi CRUD; wire to Hero CTA.
10. **Profile for all roles** — Gérer Profil (consulter/modifier données personnelles + changerMotDePasse) on every role dashboard.
11. **Validate** — `npm run lint`, `npm run build`, scenario walkthroughs per actor.

## 6. Validation
- Run `npx eslint src` (lint script is `eslint`).
- Run `npm run build` (Next.js build/typecheck).
- Manual scenarios: login as each role lands on correct dashboard; unauthorized access to `/dashboard` redirects to `/login`; enseignant can add an absence; secrétaire can edit a fiche de notes.

## 7. Open questions (recommended answers)
- Backend vs localStorage? → localStorage (recommended, matches existing code).
- Scope all 6 roles in this plan? → Yes (recommended; diagrams cover all).
- Password hashing? → Out of scope for mock (recommended; keep plain-text mock consistent with current code).

Plan file: `.kilo/plans/1794849288000-gestion-emploi-temps-missing-logic.md`. Ready for implementation by an implementation-capable agent.