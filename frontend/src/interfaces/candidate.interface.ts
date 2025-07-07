export interface Candidate {
  id: number;
  name: string;
  email: string;
  matchPercentage: number;
  resumeUrl: string;
  jobDescriptionId: number;
}

export interface CandidateFilter {
  jobDescriptionId: number;
}
