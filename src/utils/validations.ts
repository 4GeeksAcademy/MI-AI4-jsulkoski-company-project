import type { Candidate, Vacancy } from "../types.js";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateCandidate(candidate: Candidate): ValidationResult {
  const errors: string[] = [];

  if (!Number.isFinite(candidate.yearsOfExperience)
    || candidate.yearsOfExperience < 0
    || candidate.yearsOfExperience > 50) {
    errors.push("yearsOfExperience must be between 0 and 50.");
  }

  if (!Number.isFinite(candidate.currentSalary) || candidate.currentSalary <= 0) {
    errors.push("currentSalary must be greater than 0.");
  }

  if (!Number.isFinite(candidate.expectedSalary) || candidate.expectedSalary <= 0) {
    errors.push("expectedSalary must be greater than 0.");
  }

  if (!Array.isArray(candidate.skills) || candidate.skills.length === 0) {
    errors.push("skills must contain at least one skill.");
  }

  if (!isValidEmail(candidate.email)) errors.push("email must be a valid email address.");
  if (candidate.phone.trim().length === 0) errors.push("phone must not be empty.");

  return { valid: errors.length === 0, errors };
}

export function validateVacancy(vacancy: Vacancy): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(vacancy.requiredSkills) || vacancy.requiredSkills.length === 0) {
    errors.push("requiredSkills must contain at least one skill.");
  }

  if (!Number.isFinite(vacancy.minYearsExperience) || vacancy.minYearsExperience < 0) {
    errors.push("minYearsExperience must be greater than or equal to 0.");
  }

  if (!Number.isFinite(vacancy.maxYearsExperience)
    || vacancy.maxYearsExperience < vacancy.minYearsExperience) {
    errors.push("maxYearsExperience must be greater than or equal to minYearsExperience.");
  }

  if (!Number.isFinite(vacancy.salaryRangeMin) || vacancy.salaryRangeMin <= 0) {
    errors.push("salaryRangeMin must be greater than 0.");
  }

  if (!Number.isFinite(vacancy.salaryRangeMax) || vacancy.salaryRangeMax <= 0) {
    errors.push("salaryRangeMax must be greater than 0.");
  }

  if (vacancy.salaryRangeMax < vacancy.salaryRangeMin) {
    errors.push("salaryRangeMax must be greater than or equal to salaryRangeMin.");
  }

  return { valid: errors.length === 0, errors };
}