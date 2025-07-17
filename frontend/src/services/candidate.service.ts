export interface Candidate {
  id: number;
  name: string;
  email: string;
  matchPercentage: number;
  resumeUrl: string;
  jobDescriptionId: number;
}

const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    matchPercentage: 92,
    resumeUrl: "#",
    jobDescriptionId: 1,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    matchPercentage: 68,
    resumeUrl: "#",
    jobDescriptionId: 1,
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    matchPercentage: 45,
    resumeUrl: "#",
    jobDescriptionId: 2,
  },
];

export const getCandidates = async (
  jobDescriptionId?: number
): Promise<Candidate[]> => {
  if (jobDescriptionId) {
    return Promise.resolve(
      mockCandidates.filter((c) => c.jobDescriptionId === jobDescriptionId)
    );
  }
  return Promise.resolve([...mockCandidates]);
};

export const sendEmailToCandidate = async (
  candidateId: number
): Promise<boolean> => {
  // Mock sending email
  await new Promise((res) => setTimeout(res, 500));
  return Promise.resolve(true);
};
