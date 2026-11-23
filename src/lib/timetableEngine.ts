import { TIME_SLOTS, DAYS } from "./timetableService";

export type SeanceType = "COURS" | "TD" | "TP";

export interface FullSeanceRecord {
  id?: number;
  jour: string; // e.g. "LUNDI" or "Lundi"
  heure_debut: string; // "08:30:00" or "08:30"
  heure_fin: string; // "10:00:00" or "10:00"
  timeSlot?: string; // "08H30 10H00"
  type: SeanceType;
  color_variant?: string;
  matiere_id: number;
  salle_id?: number | null;
  classe_id?: number | null;
  enseignant_id?: string | null;
  matieres?: { id: number; code?: string; intitule: string } | null;
  salles?: { id: number; numero: string; capacite: number; type: string } | null;
  classes?: { id: number; nom: string; niveau?: string; effectif?: number } | null;
  profiles?: { id: string; nom: string; prenom: string; email?: string } | null;
}

export interface CandidateSeance {
  id?: number; // if editing an existing session
  jour: string; // "Lundi" or "LUNDI"
  timeSlot: string; // "08H30 10H00" or debut/fin
  heureDebut?: string;
  heureFin?: string;
  matiereId: number;
  type: SeanceType;
  classeId: number;
  enseignantId?: string | null;
  salleId?: number | null;
}

export interface ConflictReport {
  hasConflict: boolean;
  errors: string[];
  warnings: string[];
  details: {
    teacherBusy?: boolean;
    roomBusy?: boolean;
    classBusy?: boolean;
    capacityExceeded?: boolean;
    roomTypeMismatch?: boolean;
  };
}

// Normalize Day to uppercase enum format ("LUNDI", "MARDI", etc.)
export function normalizeJourToDb(day: string): string {
  if (!day) return "LUNDI";
  return day.trim().toUpperCase();
}

// Normalize Day to display format ("Lundi", "Mardi", etc.)
export function normalizeJourToDisplay(day: string): string {
  if (!day) return "Lundi";
  const lower = day.trim().toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

// Convert slot label ("08H30 10H00") to { heure_debut: "08:30:00", heure_fin: "10:00:00" }
export function slotLabelToTimes(slotLabel: string): { heure_debut: string; heure_fin: string } {
  const matched = TIME_SLOTS.find((s) => s.timeLabel === slotLabel);
  if (matched) {
    return {
      heure_debut: `${matched.debut}:00`,
      heure_fin: `${matched.fin}:00`,
    };
  }
  // fallback if given "08:30" or other formats
  const parts = slotLabel.replace(/[Hh]/g, ":").split(/\s+/);
  const debut = parts[0] ? (parts[0].includes(":") ? parts[0] : `${parts[0]}:00`) : "08:30:00";
  const fin = parts[1] ? (parts[1].includes(":") ? parts[1] : `${parts[1]}:00`) : "10:00:00";
  return {
    heure_debut: debut.length === 5 ? `${debut}:00` : debut,
    heure_fin: fin.length === 5 ? `${fin}:00` : fin,
  };
}

// Convert time to slot label ("08:30:00" -> "08H30 10H00")
export function timesToSlotLabel(heureDebut: string, heureFin: string): string {
  const d = (heureDebut || "08:30").slice(0, 5);
  const matched = TIME_SLOTS.find((s) => s.debut === d);
  if (matched) return matched.timeLabel;
  const f = (heureFin || "10:00").slice(0, 5);
  return `${d.replace(":", "H")} ${f.replace(":", "H")}`;
}

// Check time overlap between two intervals [start1, end1) and [start2, end2)
export function isTimeOverlapping(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = start1.slice(0, 5);
  const e1 = end1.slice(0, 5);
  const s2 = start2.slice(0, 5);
  const e2 = end2.slice(0, 5);

  return s1 < e2 && s2 < e1;
}

/**
 * Validates whether a candidate session conflicts with any existing session in the institution.
 */
export function validateSeanceConflicts(
  candidate: CandidateSeance,
  allExistingSeances: FullSeanceRecord[],
  context: {
    salles: Array<{ id: number; numero: string; capacite: number; type: string }>;
    classes: Array<{ id: number; nom: string; effectif?: number }>;
    teachers: Array<{ id: string; nom: string; prenom: string }>;
  }
): ConflictReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const details: ConflictReport["details"] = {};

  const candidateJour = normalizeJourToDb(candidate.jour);
  const times = candidate.heureDebut && candidate.heureFin
    ? { heure_debut: candidate.heureDebut, heure_fin: candidate.heureFin }
    : slotLabelToTimes(candidate.timeSlot);

  // Filter out the session itself if we are editing an existing session
  const otherSeances = allExistingSeances.filter((s) => !candidate.id || s.id !== candidate.id);

  // 1. Check Class Double-Booking (a class cannot have two sessions at the same time)
  if (candidate.classeId) {
    const classConflict = otherSeances.find(
      (s) =>
        s.classe_id === candidate.classeId &&
        normalizeJourToDb(s.jour) === candidateJour &&
        isTimeOverlapping(times.heure_debut, times.heure_fin, s.heure_debut, s.heure_fin)
    );

    if (classConflict) {
      details.classBusy = true;
      const mat = classConflict.matieres?.intitule || "un autre cours";
      errors.push(
        `La classe a déjà le cours "${mat}" prévu sur ce même créneau.`
      );
    }
  }

  // 2. Check Teacher Double-Booking (a teacher cannot teach two classes at the same time)
  if (candidate.enseignantId) {
    const teacherConflict = otherSeances.find(
      (s) =>
        s.enseignant_id === candidate.enseignantId &&
        normalizeJourToDb(s.jour) === candidateJour &&
        isTimeOverlapping(times.heure_debut, times.heure_fin, s.heure_debut, s.heure_fin)
    );

    if (teacherConflict) {
      details.teacherBusy = true;
      const teacherObj = context.teachers.find((t) => t.id === candidate.enseignantId);
      const teacherName = teacherObj ? `${teacherObj.prenom} ${teacherObj.nom}` : "Cet enseignant";
      const targetClass = teacherConflict.classes?.nom || "une autre classe";
      errors.push(
        `${teacherName} est déjà en cours avec la classe ${targetClass} sur ce créneau.`
      );
    }
  }

  // 3. Check Room Double-Booking (a room cannot host two sessions at the same time)
  if (candidate.salleId) {
    const roomConflict = otherSeances.find(
      (s) =>
        s.salle_id === candidate.salleId &&
        normalizeJourToDb(s.jour) === candidateJour &&
        isTimeOverlapping(times.heure_debut, times.heure_fin, s.heure_debut, s.heure_fin)
    );

    if (roomConflict) {
      details.roomBusy = true;
      const roomObj = context.salles.find((r) => r.id === candidate.salleId);
      const roomNum = roomObj ? `La salle ${roomObj.numero}` : "Cette salle";
      const occupiedBy = roomConflict.classes?.nom || "une autre classe";
      errors.push(
        `${roomNum} est déjà occupée par ${occupiedBy} sur ce créneau.`
      );
    }
  }

  // 4. Check Room Capacity vs Class Effectif (Warning)
  if (candidate.salleId && candidate.classeId) {
    const room = context.salles.find((r) => r.id === candidate.salleId);
    const classe = context.classes.find((c) => c.id === candidate.classeId);

    if (room && classe && (classe.effectif ?? 0) > room.capacite) {
      details.capacityExceeded = true;
      warnings.push(
        `Capacité insuffisante : la salle ${room.numero} compte ${room.capacite} places alors que la classe compte ${classe.effectif} étudiants.`
      );
    }
  }

  // 5. Check Room Type Mismatch (e.g. TP in a lecture hall)
  if (candidate.salleId && candidate.type) {
    const room = context.salles.find((r) => r.id === candidate.salleId);
    if (room) {
      if (candidate.type === "TP" && room.type !== "TP") {
        details.roomTypeMismatch = true;
        warnings.push(
          `Attention : la séance est un TP alors que la salle ${room.numero} est de type ${room.type}.`
        );
      }
    }
  }

  return {
    hasConflict: errors.length > 0,
    errors,
    warnings,
    details,
  };
}

/**
 * Returns available rooms for a given day and time slot.
 */
export function getAvailableRoomsForSlot(
  jour: string,
  timeSlot: string,
  existingSeances: FullSeanceRecord[],
  allSalles: Array<{ id: number; numero: string; capacite: number; type: string }>,
  excludeSeanceId?: number,
  minCapacity?: number,
  preferredType?: SeanceType
) {
  const normJour = normalizeJourToDb(jour);
  const times = slotLabelToTimes(timeSlot);

  return allSalles.filter((salle) => {
    // Check if room is booked
    const isBooked = existingSeances.some(
      (s) =>
        (!excludeSeanceId || s.id !== excludeSeanceId) &&
        s.salle_id === salle.id &&
        normalizeJourToDb(s.jour) === normJour &&
        isTimeOverlapping(times.heure_debut, times.heure_fin, s.heure_debut, s.heure_fin)
    );

    if (isBooked) return false;
    if (minCapacity && salle.capacite < minCapacity) return false;
    return true;
  });
}

/**
 * Returns available teachers for a given day and time slot.
 */
export function getAvailableTeachersForSlot(
  jour: string,
  timeSlot: string,
  existingSeances: FullSeanceRecord[],
  allTeachers: Array<{ id: string; nom: string; prenom: string }>,
  excludeSeanceId?: number
) {
  const normJour = normalizeJourToDb(jour);
  const times = slotLabelToTimes(timeSlot);

  return allTeachers.filter((teacher) => {
    const isBusy = existingSeances.some(
      (s) =>
        (!excludeSeanceId || s.id !== excludeSeanceId) &&
        s.enseignant_id === teacher.id &&
        normalizeJourToDb(s.jour) === normJour &&
        isTimeOverlapping(times.heure_debut, times.heure_fin, s.heure_debut, s.heure_fin)
    );
    return !isBusy;
  });
}

// --------------------------------------------------------------------------
// AUTOMATIC TIMETABLE GENERATION ALGORITHM
// --------------------------------------------------------------------------

export interface SubjectCurriculumRequirement {
  matiereId: number;
  code?: string;
  intitule: string;
  coursCount: number;
  tdCount: number;
  tpCount: number;
  preferredTeacherId?: string | null;
}

export interface AutoGeneratorOptions {
  days?: readonly string[]; // default DAYS
  timeSlots?: typeof TIME_SLOTS;
  maxSessionsPerDay?: number;
  avoidConsecutiveSameSubject?: boolean;
}

export interface GeneratedSeance {
  jour: string; // "Lundi"
  timeSlot: string; // "08H30 10H00"
  heure_debut: string;
  heure_fin: string;
  type: SeanceType;
  color_variant: "blue" | "emerald" | "purple" | "amber";
  matiere_id: number;
  salle_id: number;
  classe_id: number;
  enseignant_id: string;
  matiere_intitule: string;
  salle_numero: string;
  enseignant_nom: string;
}

export interface UnplacedSessionNeed {
  matiereIntitule: string;
  type: SeanceType;
  reason: string;
}

export interface AutoGenerateResult {
  success: boolean;
  totalRequested: number;
  placedCount: number;
  scheduled: GeneratedSeance[];
  unplaced: UnplacedSessionNeed[];
  message: string;
}

/**
 * Backtracking Heuristic Engine to generate optimal conflict-free timetable slots.
 */
export function autoGenerateTimetable(
  classe: { id: number; nom: string; effectif?: number },
  requirements: SubjectCurriculumRequirement[],
  allExistingSeances: FullSeanceRecord[],
  context: {
    salles: Array<{ id: number; numero: string; capacite: number; type: string }>;
    teachers: Array<{ id: string; nom: string; prenom: string }>;
    matieres: Array<{ id: number; intitule: string; code: string }>;
  },
  options?: AutoGeneratorOptions
): AutoGenerateResult {
  const workingDays = options?.days || ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  const workingSlots = options?.timeSlots || TIME_SLOTS;
  const maxSessionsPerDay = options?.maxSessionsPerDay || 4;

  // Flatten requirements into individual session items
  interface SessionItem {
    id: string;
    matiereId: number;
    matiereIntitule: string;
    type: SeanceType;
    preferredTeacherId?: string | null;
    priority: number; // Higher priority scheduled first
  }

  const sessionQueue: SessionItem[] = [];
  let itemCounter = 0;

  for (const req of requirements) {
    for (let i = 0; i < req.tpCount; i++) {
      sessionQueue.push({
        id: `tp-${req.matiereId}-${itemCounter++}`,
        matiereId: req.matiereId,
        matiereIntitule: req.intitule,
        type: "TP",
        preferredTeacherId: req.preferredTeacherId,
        priority: 10, // TP requires specific labs, place first!
      });
    }
    for (let i = 0; i < req.coursCount; i++) {
      sessionQueue.push({
        id: `cours-${req.matiereId}-${itemCounter++}`,
        matiereId: req.matiereId,
        matiereIntitule: req.intitule,
        type: "COURS",
        preferredTeacherId: req.preferredTeacherId,
        priority: 5,
      });
    }
    for (let i = 0; i < req.tdCount; i++) {
      sessionQueue.push({
        id: `td-${req.matiereId}-${itemCounter++}`,
        matiereId: req.matiereId,
        matiereIntitule: req.intitule,
        type: "TD",
        preferredTeacherId: req.preferredTeacherId,
        priority: 3,
      });
    }
  }

  // Sort queue by priority descending
  sessionQueue.sort((a, b) => b.priority - a.priority);

  // Cloned state of existing seances across institution
  const currentInstitutionSeances: FullSeanceRecord[] = [
    // exclude any existing sessions of this exact class to replace them cleanly
    ...allExistingSeances.filter((s) => s.classe_id !== classe.id),
  ];

  const scheduledResults: GeneratedSeance[] = [];
  const unplacedList: UnplacedSessionNeed[] = [];

  // Track sessions count per day for this class to ensure even distribution
  const sessionsPerDay: Record<string, number> = {};
  for (const d of workingDays) sessionsPerDay[d] = 0;

  // Color mapping helper
  const getColorVariant = (type: SeanceType): "blue" | "emerald" | "purple" | "amber" => {
    switch (type) {
      case "COURS":
        return "blue";
      case "TP":
        return "purple";
      case "TD":
        return "emerald";
      default:
        return "blue";
    }
  };

  // Process each session in queue
  for (const item of sessionQueue) {
    let placed = false;
    let failureReason = "Aucun créneau libre compatible trouvé";

    // Sort days by current load (least loaded day first)
    const sortedDays = [...workingDays].sort(
      (a, b) => (sessionsPerDay[a] || 0) - (sessionsPerDay[b] || 0)
    );

    dayLoop: for (const day of sortedDays) {
      if (sessionsPerDay[day] >= maxSessionsPerDay) continue;

      // Check if class already has a session of this same subject today (avoid 2x same subject on same day)
      const sameSubjectToday = scheduledResults.some(
        (s) => s.jour === day && s.matiere_id === item.matiereId
      );
      if (sameSubjectToday && workingDays.length > 2) {
        continue; // Try placing on another day first
      }

      for (const slot of workingSlots) {
        const times = slotLabelToTimes(slot.timeLabel);

        // Check 1: Is Class free at this slot?
        const isClassBusy = currentInstitutionSeances.some(
          (s) =>
            s.classe_id === classe.id &&
            normalizeJourToDb(s.jour) === normalizeJourToDb(day) &&
            isTimeOverlapping(times.heure_debut, times.heure_fin, s.heure_debut, s.heure_fin)
        );
        if (isClassBusy) continue;

        // Check 2: Find a suitable and free Room
        // Filter rooms matching session type and capacity
        const candidateRooms = context.salles
          .filter((salle) => {
            if (item.type === "TP") {
              return salle.type === "TP";
            }
            return salle.type === "COURS";
          })
          .sort((a, b) => {
            // Pick room with capacity closest to effectif to avoid wasting giant amphis
            const eff = classe.effectif || 30;
            return Math.abs(a.capacite - eff) - Math.abs(b.capacite - eff);
          });

        const freeRoom = candidateRooms.find((salle) => {
          return !currentInstitutionSeances.some(
            (s) =>
              s.salle_id === salle.id &&
              normalizeJourToDb(s.jour) === normalizeJourToDb(day) &&
              isTimeOverlapping(times.heure_debut, times.heure_fin, s.heure_debut, s.heure_fin)
          );
        });

        if (!freeRoom) {
          failureReason = `Aucune salle disponible pour ${item.type} à ${slot.timeLabel}`;
          continue;
        }

        // Check 3: Find a free Teacher
        // If preferred teacher is specified, test them first
        let chosenTeacher: { id: string; nom: string; prenom: string } | undefined;

        if (item.preferredTeacherId) {
          const pref = context.teachers.find((t) => t.id === item.preferredTeacherId);
          if (pref) {
            const isBusy = currentInstitutionSeances.some(
              (s) =>
                s.enseignant_id === pref.id &&
                normalizeJourToDb(s.jour) === normalizeJourToDb(day) &&
                isTimeOverlapping(times.heure_debut, times.heure_fin, s.heure_debut, s.heure_fin)
            );
            if (!isBusy) chosenTeacher = pref;
          }
        }

        // If no preferred teacher or preferred teacher is busy, pick any free teacher
        if (!chosenTeacher && context.teachers.length > 0) {
          chosenTeacher = context.teachers.find((t) => {
            return !currentInstitutionSeances.some(
              (s) =>
                s.enseignant_id === t.id &&
                normalizeJourToDb(s.jour) === normalizeJourToDb(day) &&
                isTimeOverlapping(times.heure_debut, times.heure_fin, s.heure_debut, s.heure_fin)
            );
          });
        }

        if (!chosenTeacher) {
          failureReason = `Tous les enseignants sont occupés à ${slot.timeLabel}`;
          continue;
        }

        // Found a valid slot, room, and teacher!
        const newRecord: GeneratedSeance = {
          jour: day,
          timeSlot: slot.timeLabel,
          heure_debut: times.heure_debut,
          heure_fin: times.heure_fin,
          type: item.type,
          color_variant: getColorVariant(item.type),
          matiere_id: item.matiereId,
          salle_id: freeRoom.id,
          classe_id: classe.id,
          enseignant_id: chosenTeacher.id,
          matiere_intitule: item.matiereIntitule,
          salle_numero: freeRoom.numero,
          enseignant_nom: `${chosenTeacher.prenom} ${chosenTeacher.nom}`.trim(),
        };

        // Add to scheduled list and simulated database
        scheduledResults.push(newRecord);
        currentInstitutionSeances.push({
          jour: normalizeJourToDb(day),
          heure_debut: times.heure_debut,
          heure_fin: times.heure_fin,
          type: item.type,
          matiere_id: item.matiereId,
          salle_id: freeRoom.id,
          classe_id: classe.id,
          enseignant_id: chosenTeacher.id,
        });

        sessionsPerDay[day] = (sessionsPerDay[day] || 0) + 1;
        placed = true;
        break dayLoop;
      }
    }

    if (!placed) {
      unplacedList.push({
        matiereIntitule: item.matiereIntitule,
        type: item.type,
        reason: failureReason,
      });
    }
  }

  const success = unplacedList.length === 0;
  const message = success
    ? `Succès ! Toutes les ${scheduledResults.length} séances ont été générées et optimisées sans aucun conflit.`
    : `${scheduledResults.length} sur ${sessionQueue.length} séances ont été planifiées (${unplacedList.length} n'ont pas pu être placées).`;

  return {
    success,
    totalRequested: sessionQueue.length,
    placedCount: scheduledResults.length,
    scheduled: scheduledResults,
    unplaced: unplacedList,
    message,
  };
}
