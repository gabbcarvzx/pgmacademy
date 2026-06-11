export const objectiveOptionLabels = ["A", "B", "C", "D", "E"] as const;

export type ObjectiveOptionLabel = (typeof objectiveOptionLabels)[number];

type ObjectiveLanguage =
  | "english"
  | "spanish"
  | "portuguese"
  | "mixed"
  | "psychosocial";

const languageStartSequence = {
  english: 1,
  spanish: 36,
  portuguese: 61,
  mixed: 81,
  psychosocial: 91,
} satisfies Record<ObjectiveLanguage, number>;

const languageAnswerOffset = {
  english: 0,
  spanish: 1,
  portuguese: 2,
  mixed: 3,
  psychosocial: 4,
} satisfies Record<ObjectiveLanguage, number>;

export function sequenceFromObjectiveEditorialId(editorialId: string | null) {
  if (!editorialId) {
    return null;
  }

  const sequence = Number(editorialId.match(/^OBJ-SCALE-(\d{3})$/)?.[1]);
  return Number.isInteger(sequence) ? sequence : null;
}

export function balancedCorrectLabelForObjectiveQuestion(input: {
  editorialId: string | null;
  language: ObjectiveLanguage;
}): ObjectiveOptionLabel | null {
  const sequence = sequenceFromObjectiveEditorialId(input.editorialId);

  if (!sequence) {
    return null;
  }

  const startSequence = languageStartSequence[input.language];
  const localIndex = Math.max(sequence - startSequence, 0);
  const labelIndex =
    (localIndex + languageAnswerOffset[input.language]) %
    objectiveOptionLabels.length;

  return objectiveOptionLabels[labelIndex];
}

export function compareObjectiveOptionLabels(
  a: ObjectiveOptionLabel | string,
  b: ObjectiveOptionLabel | string,
) {
  const aIndex = objectiveOptionLabels.indexOf(a as ObjectiveOptionLabel);
  const bIndex = objectiveOptionLabels.indexOf(b as ObjectiveOptionLabel);

  return (
    (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) -
    (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex)
  );
}
