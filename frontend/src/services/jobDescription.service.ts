import axios from "../lib/axios";

export type JobStatus = "Active" | "Inactive";

export interface JD {
  id: number;
  title: string;
  description: string;
  status: JobStatus;
  created: string;
}

export interface JDFormData {
  title: string;
  description: string;
  status: JobStatus;
}

export const getJobDescriptions = async (): Promise<JD[]> => {
  const res = await axios.get("/job-descriptions");
  return res.data.jobDescriptions;
};

export const addJobDescription = async (data: JDFormData): Promise<JD> => {
  const res = await axios.post("/job-descriptions", data);
  return res.data.jobDescription;
};

export const updateJobDescription = async (
  id: number,
  data: JDFormData
): Promise<JD> => {
  const res = await axios.put(`/job-descriptions/${id}`, data);
  return res.data.jobDescription;
};

export const deleteJobDescription = async (id: number): Promise<boolean> => {
  await axios.delete(`/job-descriptions/${id}`);
  return true;
};
