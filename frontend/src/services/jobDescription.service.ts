// Mock Job Description Service
import {
  JD,
  JDFormData,
  JobStatus,
} from "../interfaces/jobDescription.interface";

let mockJobDescriptions: JD[] = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "Responsible for building UI components.",
    status: "Active",
    created: "2024-06-01",
  },
  {
    id: 2,
    title: "Backend Engineer",
    description: "Develop and maintain backend services.",
    status: "Inactive",
    created: "2024-05-28",
  },
];

export const getJobDescriptions = async (): Promise<JD[]> => {
  return Promise.resolve([...mockJobDescriptions]);
};

export const addJobDescription = async (data: JDFormData): Promise<JD> => {
  const newJD: JD = {
    id: Date.now(),
    ...data,
    created: new Date().toISOString().slice(0, 10),
  };
  mockJobDescriptions.push(newJD);
  return Promise.resolve(newJD);
};

export const updateJobDescription = async (
  id: number,
  data: JDFormData
): Promise<JD | null> => {
  const idx = mockJobDescriptions.findIndex((jd) => jd.id === id);
  if (idx === -1) return null;
  mockJobDescriptions[idx] = { ...mockJobDescriptions[idx], ...data };
  return Promise.resolve(mockJobDescriptions[idx]);
};

export const deleteJobDescription = async (id: number): Promise<boolean> => {
  const idx = mockJobDescriptions.findIndex((jd) => jd.id === id);
  if (idx === -1) return false;
  mockJobDescriptions.splice(idx, 1);
  return Promise.resolve(true);
};
