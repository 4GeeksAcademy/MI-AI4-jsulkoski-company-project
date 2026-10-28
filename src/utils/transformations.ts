import type {
  Candidate,
  CandidateStatus,
  EnglishLevel,
  SelectionProcess,
  SeniorityLevel,
  Vacancy,
} from "../types.js";

export interface CandidateMatch {
  candidate: Candidate;
  score: number;
}

export interface SkillCount {
  skill: string;
  count: number;
}

const seniorityOrder: SeniorityLevel[] = ["Junior", "Semi-Senior", "Senior", "Lead", "Executive"];
const englishOrder: EnglishLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2", "Native"];
const candidateStatuses: CandidateStatus[] = ["Active", "In process", "Hired", "Inactive"];

function normalizeSkill(skill: string): string {
  return skill.trim().toLocaleLowerCase();
}

function getSeniorityScore(candidate: SeniorityLevel, required: SeniorityLevel): number {
  const candidateRank = seniorityOrder.indexOf(candidate);
  const requiredRank = seniorityOrder.indexOf(required);

  if (candidateRank === requiredRank) return 15;
  return Math.abs(candidateRank - requiredRank) === 1 ? 7 : 0;
}

function getExperienceScore(candidateYears: number, vacancy: Vacancy): number {
  if (candidateYears >= vacancy.minYearsExperience && candidateYears <= vacancy.maxYearsExperience) {
    return 20;
  }

  const distance = candidateYears < vacancy.minYearsExperience
    ? vacancy.minYearsExperience - candidateYears
    : candidateYears - vacancy.maxYearsExperience;

  return distance <= 2 ? 10 : 0;
}

export function calculateCandidateScore(candidate: Candidate, vacancy: Vacancy): number {
  const candidateSkills = new Set(candidate.skills.map(normalizeSkill));
  const requiredSkills = [...new Set(vacancy.requiredSkills.map(normalizeSkill))];
  const matchedRequiredSkills = requiredSkills.filter((skill) => candidateSkills.has(skill)).length;

  let requiredSkillScore = 0;
  if (requiredSkills.length > 0 && matchedRequiredSkills === requiredSkills.length) {
    requiredSkillScore = 40;
  } else if (requiredSkills.length > 0 && matchedRequiredSkills / requiredSkills.length >= 0.5) {
    requiredSkillScore = 20;
  }

  const requiredSkillSet = new Set(requiredSkills);
  const matchedPreferredSkills = new Set(
    vacancy.preferredSkills
      .map(normalizeSkill)
      .filter((skill) => !requiredSkillSet.has(skill) && candidateSkills.has(skill)),
  ).size;
  const skillScore = Math.min(40, requiredSkillScore + Math.min(matchedPreferredSkills * 10, 20));

  const candidateEnglishRank = englishOrder.indexOf(candidate.englishLevel);
  const requiredEnglishRank = englishOrder.indexOf(vacancy.requiredEnglishLevel);
  const englishScore = candidateEnglishRank >= requiredEnglishRank ? 15 : 0;
  const salaryScore = candidate.expectedSalary >= vacancy.salaryRangeMin
    && candidate.expectedSalary <= vacancy.salaryRangeMax
    ? 10
    : candidate.expectedSalary > vacancy.salaryRangeMax
      && candidate.expectedSalary <= vacancy.salaryRangeMax * 1.2
      ? 5
      : 0;

  const totalScore = skillScore
    + getExperienceScore(candidate.yearsOfExperience, vacancy)
    + getSeniorityScore(candidate.seniority, vacancy.requiredSeniority)
    + englishScore
    + salaryScore;

  return Math.max(0, Math.min(100, totalScore));
}

export function rankCandidatesForVacancy(candidates: Candidate[], vacancy: Vacancy): CandidateMatch[] {
  return candidates
    .map((candidate) => ({ candidate, score: calculateCandidateScore(candidate, vacancy) }))
    .sort((first, second) => second.score - first.score);
}

export function groupCandidatesBySeniority(candidates: Candidate[]): Record<SeniorityLevel, Candidate[]> {
  const groups: Record<SeniorityLevel, Candidate[]> = {
    Junior: [],
    "Semi-Senior": [],
    Senior: [],
    Lead: [],
    Executive: [],
  };

  for (const candidate of candidates) groups[candidate.seniority].push(candidate);
  return groups;
}

export function countCandidatesByStatus(candidates: Candidate[]): Record<CandidateStatus, number> {
  const counts = Object.fromEntries(candidateStatuses.map((status) => [status, 0])) as Record<CandidateStatus, number>;

  for (const candidate of candidates) counts[candidate.status] += 1;
  return counts;
}

export function calculateAverageSalary(candidates: Candidate[]): number {
  if (candidates.length === 0) return 0;

  const totalSalary = candidates.reduce((total, candidate) => total + candidate.expectedSalary, 0);
  return Math.round((totalSalary / candidates.length) * 100) / 100;
}

export function findTopSkills(candidates: Candidate[], topN: number): SkillCount[] {
  if (!Number.isFinite(topN) || topN <= 0) return [];

  const counts = new Map<string, SkillCount>();
  for (const candidate of candidates) {
    const candidateSkills = new Set(candidate.skills.map(normalizeSkill));

    for (const normalizedSkill of candidateSkills) {
      const current = counts.get(normalizedSkill);
      if (current) current.count += 1;
      else {
        const displaySkill = candidate.skills.find((skill) => normalizeSkill(skill) === normalizedSkill);
        counts.set(normalizedSkill, { skill: displaySkill ?? normalizedSkill, count: 1 });
      }
    }
  }

  return [...counts.values()]
    .sort((first, second) => second.count - first.count)
    .slice(0, Math.floor(topN));
}

export function calculateVacancyFillRate(processes: SelectionProcess[]): number {
  if (processes.length === 0) return 0;

  const hiredCount = processes.filter((process) => process.stage === "Hired").length;
  return Math.round((hiredCount / processes.length) * 10000) / 100;
}