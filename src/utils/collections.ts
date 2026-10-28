import type { AvailabilityStatus, Candidate, SeniorityLevel } from "../types.js";

function normalizeSkill(skill: string): string {
  return skill.trim().toLocaleLowerCase();
}

export function filterCandidatesBySkills(
  candidates: Candidate[],
  requiredSkills: string[],
): Candidate[] {
  const normalizedRequiredSkills = requiredSkills.map(normalizeSkill);

  return candidates.filter((candidate) => {
    const candidateSkills = new Set(candidate.skills.map(normalizeSkill));
    return normalizedRequiredSkills.every((skill) => candidateSkills.has(skill));
  });
}

export function filterCandidatesBySeniority(
  candidates: Candidate[],
  seniority: SeniorityLevel,
): Candidate[] {
  return candidates.filter((candidate) => candidate.seniority === seniority);
}

export function filterCandidatesByExperience(
  candidates: Candidate[],
  minYearsExperience: number,
  maxYearsExperience: number,
): Candidate[] {
  return candidates.filter((candidate) =>
    candidate.yearsOfExperience >= minYearsExperience
    && candidate.yearsOfExperience <= maxYearsExperience,
  );
}

export function filterCandidatesByAvailability(
  candidates: Candidate[],
  availability: AvailabilityStatus[],
): Candidate[] {
  const acceptedStatuses = new Set(availability);
  return candidates.filter((candidate) => acceptedStatuses.has(candidate.availability));
}

export function sortCandidatesBySalary(
  candidates: Candidate[],
  order: "asc" | "desc",
): Candidate[] {
  return [...candidates].sort((first, second) => {
    const difference = first.expectedSalary - second.expectedSalary;
    return order === "asc" ? difference : -difference;
  });
}

export function sortCandidatesByExperience(
  candidates: Candidate[],
  order: "asc" | "desc",
): Candidate[] {
  return [...candidates].sort((first, second) => {
    const difference = first.yearsOfExperience - second.yearsOfExperience;
    return order === "asc" ? difference : -difference;
  });
}