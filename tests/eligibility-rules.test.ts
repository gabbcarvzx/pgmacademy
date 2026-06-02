import assert from "node:assert/strict";

import { evaluateEligibility, type EligibilityInput } from "../src/lib/eligibility/rules";

const baseInput: EligibilityInput = {
  birthDate: "2010-06-15",
  schoolYear: "first",
  hasStateSchoolEnrollment: true,
  hasActiveSiepeEnrollment: true,
  isExcludedSchool: false,
  attendancePercent: 92,
  portugueseAverage: 8,
  mathAverage: 7.5,
  humanitiesAverage: 8.2,
  hasPartialProgression: false,
  wasPreviouslySelected: false,
};

assert.equal(evaluateEligibility(baseInput).status, "eligible");

assert.equal(
  evaluateEligibility({
    ...baseInput,
    birthDate: "2008-12-31",
  }).status,
  "ineligible",
);

assert.equal(
  evaluateEligibility({
    ...baseInput,
    attendancePercent: 74,
  }).status,
  "partial",
);

assert.equal(
  evaluateEligibility({
    ...baseInput,
    hasPartialProgression: true,
  }).status,
  "ineligible",
);

assert.equal(
  evaluateEligibility({
    ...baseInput,
    schoolYear: "other",
  }).status,
  "ineligible",
);

console.log("Eligibility rules passed");
