import assert from "node:assert/strict";

import {
  buildAutomaticApprovalPlan,
  buildDailyMission,
  calculatePreparationProgress,
  chooseNextAction,
  type OnboardingInput,
} from "../src/lib/mission/rules";

const onboarding: OnboardingInput = {
  idioma: "english",
  anoEscolar: "first",
  tempoDisponivel: "30m",
  jaParticipouPgm: false,
  objetivoPrincipal: "pass_exam",
};

const plan = buildAutomaticApprovalPlan(onboarding, [
  {
    title: "Rota de Aprovação em Inglês",
    href: "/trilhas/rota-ingles",
    language: "english",
  },
]);

assert.equal(plan.length, 4);
assert.equal(plan[0].tasks[0].href, "/diagnostico");
assert.equal(
  plan.some((week) =>
    week.tasks.some((task) => task.href === "/simulados/subjetivo-oficial"),
  ),
  true,
);

const mission = buildDailyMission(onboarding, {
  answeredQuestionsToday: 5,
  reviewedFlashcardsToday: 10,
  subjectiveSubmittedToday: 0,
  completedLessonsToday: 1,
  preferredLessonHref: "/trilhas/rota-ingles",
});

assert.equal(mission.tasks.length, 4);
assert.equal(mission.tasks.find((task) => task.id === "questions")?.target, 10);
assert.equal(mission.tasks.find((task) => task.id === "flashcards")?.completed, true);
assert.equal(mission.percentage, 63);

const preparation = calculatePreparationProgress({
  completedPaths: 2,
  totalPaths: 4,
  completedSimulationTemplates: 1,
  totalSimulationTemplates: 2,
  subjectiveSubmitted: 5,
  targetSubjectiveAnswers: 5,
  completedProgressItems: 10,
  totalProgressItems: 20,
});

assert.equal(preparation.percentage, 63);
assert.deepEqual(
  preparation.components.map((component) => component.percentage),
  [50, 50, 100, 50],
);

assert.equal(
  chooseNextAction({
    hasPaidAccess: true,
    onboardingCompleted: false,
    hasDiagnostic: false,
    completedSimulations: 0,
    subjectiveSubmitted: 0,
    completedPaths: 0,
  }).href,
  "/onboarding",
);

assert.equal(
  chooseNextAction({
    hasPaidAccess: true,
    onboardingCompleted: true,
    hasDiagnostic: true,
    completedSimulations: 0,
    subjectiveSubmitted: 0,
    completedPaths: 0,
  }).href,
  "/simulados",
);

console.log("Mission rules passed");
