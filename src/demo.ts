import {
  filterCandidatesByAvailability,
  filterCandidatesByExperience,
  filterCandidatesBySeniority,
  filterCandidatesBySkills,
  sortCandidatesByExperience,
  sortCandidatesBySalary,
} from "./utils/collections.js";
import {
  binarySearchCandidateBySalary,
  findCandidateByEmail,
  findCandidateById,
} from "./utils/search.js";
import {
  calculateAverageSalary,
  calculateCandidateScore,
  calculateVacancyFillRate,
  countCandidatesByStatus,
  findTopSkills,
  groupCandidatesBySeniority,
  rankCandidatesForVacancy,
} from "./utils/transformations.js";
import { validateCandidate, validateVacancy } from "./utils/validations.js";
import { sampleCandidates, sampleSelectionProcesses, sampleVacancy } from "./data/sampleData.js";
import type { AvailabilityStatus, SeniorityLevel } from "./types.js";

function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing demo element: #${id}`);
  return element as T;
}

const results = getElement<HTMLElement>("results");
const candidateCount = getElement<HTMLElement>("candidate-count");
candidateCount.textContent = String(sampleCandidates.length);

function showResult(result: unknown): void {
  results.textContent = JSON.stringify(result, null, 2);
}

getElement<HTMLButtonElement>("filter-skills").addEventListener("click", () => {
  const requiredSkills = getElement<HTMLInputElement>("skills-query").value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
  showResult(filterCandidatesBySkills(sampleCandidates, requiredSkills));
});

getElement<HTMLButtonElement>("filter-seniority").addEventListener("click", () => {
  const seniority = getElement<HTMLSelectElement>("seniority-query").value as SeniorityLevel;
  showResult(filterCandidatesBySeniority(sampleCandidates, seniority));
});

getElement<HTMLButtonElement>("filter-experience").addEventListener("click", () => {
  const minYearsExperience = Number(getElement<HTMLInputElement>("experience-min").value);
  const maxYearsExperience = Number(getElement<HTMLInputElement>("experience-max").value);
  showResult(filterCandidatesByExperience(sampleCandidates, minYearsExperience, maxYearsExperience));
});

getElement<HTMLButtonElement>("filter-availability").addEventListener("click", () => {
  const selectedStatuses = Array.from(
    getElement<HTMLSelectElement>("availability-query").selectedOptions,
    (option) => option.value as AvailabilityStatus,
  );
  showResult(filterCandidatesByAvailability(sampleCandidates, selectedStatuses));
});

getElement<HTMLButtonElement>("sort-salary-asc").addEventListener("click", () => {
  showResult(sortCandidatesBySalary(sampleCandidates, "asc"));
});

getElement<HTMLButtonElement>("sort-salary-desc").addEventListener("click", () => {
  showResult(sortCandidatesBySalary(sampleCandidates, "desc"));
});

getElement<HTMLButtonElement>("sort-experience-asc").addEventListener("click", () => {
  showResult(sortCandidatesByExperience(sampleCandidates, "asc"));
});

getElement<HTMLButtonElement>("sort-experience-desc").addEventListener("click", () => {
  showResult(sortCandidatesByExperience(sampleCandidates, "desc"));
});

getElement<HTMLButtonElement>("search-candidate").addEventListener("click", () => {
  const searchType = getElement<HTMLSelectElement>("search-type").value;
  const query = getElement<HTMLInputElement>("search-query").value.trim();

  if (searchType === "id") {
    showResult(findCandidateById(sampleCandidates, query));
  } else if (searchType === "email") {
    showResult(findCandidateByEmail(sampleCandidates, query));
  } else {
    const targetSalary = Number(query);
    if (!query || !Number.isFinite(targetSalary)) {
      showResult({ error: "Enter a valid expected salary." });
      return;
    }

    const sortedCandidates = sortCandidatesBySalary(sampleCandidates, "asc");
    const index = binarySearchCandidateBySalary(sortedCandidates, targetSalary);
    showResult({ index, candidate: index === -1 ? null : sortedCandidates[index] });
  }
});

getElement<HTMLButtonElement>("rank-candidates").addEventListener("click", () => {
  showResult(rankCandidatesForVacancy(sampleCandidates, sampleVacancy));
});

getElement<HTMLButtonElement>("show-reports").addEventListener("click", () => {
  showResult({
    candidateStatusCounts: countCandidatesByStatus(sampleCandidates),
    averageExpectedSalary: calculateAverageSalary(sampleCandidates),
    topSkills: findTopSkills(sampleCandidates, 5),
    vacancyFillRate: calculateVacancyFillRate(sampleSelectionProcesses),
    candidatesBySeniority: groupCandidatesBySeniority(sampleCandidates),
    candidateScores: sampleCandidates.map((candidate) => ({
      id: candidate.id,
      score: calculateCandidateScore(candidate, sampleVacancy),
    })),
  });
});

getElement<HTMLButtonElement>("validate-samples").addEventListener("click", () => {
  showResult({
    candidates: sampleCandidates.map((candidate) => ({
      id: candidate.id,
      ...validateCandidate(candidate),
    })),
    vacancy: validateVacancy(sampleVacancy),
  });
});