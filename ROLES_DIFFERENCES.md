# Analyse Comparative des Rôles : Diagramme de Cas d'Utilisation vs Code `/dashboard`

Ce document dresse un état des lieux exhaustif et rigoureux comparant les fonctionnalités attribuées aux rôles dans le diagramme de cas d'utilisation (`public/diagramme cas.png`) avec l'implémentation actuelle sous `src/app/dashboard/`.

> **Règle d'héritage appliquée :**
> - Aucun héritage de rôles n'est appliqué, **à l'exception unique de : `Secrétaire` hérite des rôles / fonctionnalités de l' `Étudiant`**.
> - Chaque rôle doit posséder explicitement ses cas d'utilisation propres tels que définis par ses associations directes dans le diagramme.

---

## 1. Vue Synthétique par Rôle

| Rôle | Cas d'utilisation attendus (Diagramme + Règle spéciale) | Fonctionnalités actuellement implémentées dans `/dashboard` | Statut global |
| :--- | :--- | :--- | :--- |
| **Étudiant** | • S'authentifier<br>• Gérer Profil<br>• Consulter l'emploi de temps<br>• Consulter absences | • Consulter l'emploi du temps (`timetable`)<br>• Mes absences (`absences`)<br>• Mon profil (`profile`) | ⚠️ Partiellement conforme (manque affichage/édition spécifique du profil matricule/inscription) |
| **Enseignant** | • S'authentifier<br>• Gérer Profil<br>• Ajouter Abs (Ajouter absence) | • Mes séances (`seances`)<br>• Gérer les absences (`absences`)<br>• Mon profil (`profile`) | ⚠️ Logique excédentaire non présente sur le diagramme (`Mes séances`) |
| **Secrétaire** | • S'authentifier<br>• Gérer Profil<br>• Gérer Fiche des notes *(saisir, choisir, modifier)*<br>• *Hérite des rôles Étudiant :*<br>&nbsp;&nbsp;- Consulter l'emploi de temps<br>&nbsp;&nbsp;- Consulter absences | • Gérer Fiche des notes (`notes`)<br>• Mon profil (`profile`) | ❌ **Logiques manquantes :** Emploi du temps et consultation des absences non accessibles |
| **Directeur de Département** | • S'authentifier<br>• Gérer Profil<br>• Gérer les emplois<br>• Gérer inscrit<br>• Créer les offres<br>• Consulter Dashboard | • Gérer les emplois (`emplois`)<br>• Gérer inscrit (`inscrits`)<br>• Créer les offres (`offres`)<br>• Consulter Dashboard (`dashboard`)<br>• Mon profil (`profile`) | ✅ Conforme aux cas directs du diagramme |
| **Super Admin** | • S'authentifier<br>• Gérer Profil<br>• Établir inscription | ❌ **Non affiché dans la sidebar** du dashboard (`src/app/dashboard/page.tsx`).<br>Dans `RoleSuperAdmin.tsx`, il implémente à tort :<br>• Gérer les étudiants<br>• Gérer les enseignants<br>• Gérer les départements<br>• Gérer les classes<br>• Administrer emploi du temps | ❌ **Grave anomalie & Confusion de rôles :** Inaccessible depuis la sidebar ; possède les fonctionnalités qui appartiennent en réalité au Directeur d'Établissement ; n'a pas « Établir inscription » |
| **Directeur d'Établissement** | • S'authentifier<br>• Gérer Profil<br>• Établir inscription<br>• Gérer département<br>• Administrer emploi de temps<br>• Gérer les classes<br>• Gérer les étudiants<br>• Gérer les enseignants<br>• Gérer les salles (C/TP)<br>• Créer les groupes TP<br>• Consulter Dashboard | • Gérer les salles (`salles`)<br>• Créer les groupes TP (`groupes`)<br>• Mon profil (`profile`) | ❌ **Logiques manquantes majeures :** 8 fonctionnalités directes manquent complètement (voir détail ci-dessous) |

---

## 2. Détail des Problèmes et Faux Comportements par Rôle

### A. Directeur d'Établissement (`RoleDirecteurEtablissement`)
Le diagramme relie explicitement une multitude de cas d'utilisation directement au Directeur d'Établissement. Or, le code ne lui donne accès qu'à 2 éléments en plus du profil.

- **Logiques Manquantes :**
  1. ❌ **Gérer les enseignants** : Mentionné directement sur le diagramme, mais absent de la sidebar et du composant `RoleDirecteurEtablissement`.
  2. ❌ **Gérer les étudiants** : Relié directement au rôle dans le diagramme, absent dans le dashboard.
  3. ❌ **Gérer département** : Relié directement dans le diagramme, absent dans le dashboard.
  4. ❌ **Gérer les classes** : Relié directement dans le diagramme, absent dans le dashboard.
  5. ❌ **Administrer emploi de temps** : Relié directement dans le diagramme, absent dans le dashboard.
  6. ❌ **Établir inscription** : Relié directement dans le diagramme, absent dans le dashboard.
  7. ❌ **Consulter Dashboard** : Le diagramme montre une flèche reliant le Directeur d'Établissement vers « Consulter Dashboard ». Cet onglet n'existe pas dans son interface.

---

### B. Super Admin (`RoleSuperAdmin` & `page.tsx`)
1. ❌ **Rôle orphelin dans la navigation (`src/app/dashboard/page.tsx`)** :
   - Dans `src/app/dashboard/page.tsx`, la barre latérale (`<nav>`) contient des conditions pour `Etudiant`, `Enseignant`, `Secretaire`, `DirecteurDepartement` et `DirecteurEtablissement`, **mais aucune entrée pour `SuperAdmin`** ! Un utilisateur connecté avec le rôle `SuperAdmin` se retrouve avec une sidebar vide sous "Espace SuperAdmin".
2. ❌ **Attribution erronée des fonctionnalités (Inversion / Fausse logique)** :
   - Dans le diagramme, le `Super Admin` n'a qu'un seul cas d'utilisation direct connecté : **Établir inscription** (en plus de s'authentifier / gérer profil).
   - Dans `RoleSuperAdmin.tsx`, on lui a implémenté à tort les onglets :
     - `etudiants` (Gérer les étudiants)
     - `enseignants` (Gérer les enseignants)
     - `departements` (Gérer les départements)
     - `classes` (Gérer les classes)
     - `emplois` (Administrer emploi du temps)
   - Ces 5 fonctionnalités appartiennent dans le diagramme au **Directeur d'Établissement**.
3. ❌ **Cas manquant :**
   - L'action **Établir inscription** (présente sur le diagramme pour le Super Admin) n'est pas présente dans `RoleSuperAdmin.tsx`.

---

### C. Secrétaire (`RoleSecretaire`)
Selon la consigne : *"The only heritage is that secretair have the same roles of the etudiant !"*
Dans le diagramme :
- Cas propre à la secrétaire : **Gérer Fiche des notes (choisir, saisir et modifier)**.
- Cas de l'étudiant à hériter : **Consulter l'emploi de temps** et **Consulter absences**.

- **État dans le code :**
  - Dans `src/app/dashboard/page.tsx`, la secrétaire ne dispose que de l'onglet `notes` ("Gérer Fiche des notes") et `profile`.
- **Logiques Manquantes :**
  1. ❌ **Consulter l'emploi de temps** : Onglet absent de la sidebar et du composant pour la secrétaire.
  2. ❌ **Consulter absences** : Onglet absent de la sidebar et du composant pour la secrétaire.

---

### D. Enseignant (`RoleEnseignant`)
Dans le diagramme, l'enseignant a pour cas d'utilisation directs :
- **Ajouter Abs** (`<<include>>` vers S'authentifier)
- **Gérer Profil**
- **S'authentifier**

- **Faux comportement / Logique excédentaire :**
  - L'onglet **Mes séances** (`seances`) est affiché et constitue la vue principale. Ce cas d'utilisation n'apparaît pas sous cette forme dans le diagramme de cas d'utilisation.
  - L'enseignant n'a pas accès à la « Fiche des notes » (ce qui est conforme au diagramme, réservé à la secrétaire), mais la consultation de son propre emploi du temps n'est pas non plus explicitement liée à l'Enseignant dans le diagramme (hors héritage qui a été expressément exclu).

---

### E. Directeur de Département (`RoleDirecteurDepartement`)
Dans le diagramme, les cas reliés sont :
- **Gérer les emplois**
- **Gérer inscrit**
- **Créer les offres**
- **Consulter Dashboard**
- **Gérer Profil** / **S'authentifier**

- **État dans le code :**
  - Conforme aux fonctionnalités modélisées : le composant et la barre latérale exposent bien ces 4 modules métier plus le profil.

---

## 3. Synthèse des Incohérences Globales

1. **Sidebar incomplète (`src/app/dashboard/page.tsx`)** :
   - Le rôle `SuperAdmin` n'a aucun bouton d'action dans le menu de gauche (`currentUser.role === "SuperAdmin"` est complètement absent).
   - Les boutons pour la `Secretaire` ne reprennent pas les écrans de l'étudiant (`timetable`, `absences`).
   - Le rôle `DirecteurEtablissement` n'a que 2 boutons sur les 8 actions métier prévues par le diagramme.

2. **Interversion entre Directeur d'Établissement et Super Admin** :
   - Le code a implémenté la gestion des départements, des classes, des enseignants, des étudiants et l'administration des emplois du temps au niveau de `RoleSuperAdmin.tsx`, alors que le diagramme de cas d'utilisation relie explicitement tous ces cas au **Directeur d'Établissement**.

3. **Cas d'utilisation « Établir inscription » manquant** :
   - Relié dans le diagramme à la fois au **Super Admin** et au **Directeur d'Établissement**, ce cas d'utilisation n'existe sous aucun de ces deux rôles dans le dashboard.
