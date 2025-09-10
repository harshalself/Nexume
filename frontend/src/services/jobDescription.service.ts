import axios from "../lib/axios";
import { JobDescriptionFormData } from "../lib/validation";

export type JobStatus = "Active" | "Inactive";

export interface JD {
  id: number;
  title: string;
  description: string;
  company?: string;
  location?: string;
  requirements?: string;
  status: JobStatus;
  created: string;
}

// For backward compatibility, we'll map the enhanced form data to the current API structure
export interface JDFormData {
  title: string;
  description: string;
  status: JobStatus;
}

export const getJobDescriptions = async (): Promise<JD[]> => {
  try {
    const res = await axios.get("/job-descriptions");
    return res.data.jobDescriptions || res.data || [];
  } catch (error: any) {
    console.error("Error fetching job descriptions:", error);
    if (error.response?.status === 401) {
      throw new Error("Please sign in to access your job descriptions");
    }
    throw new Error("Failed to fetch job descriptions");
  }
};

export const addJobDescription = async (
  data: JobDescriptionFormData
): Promise<JD> => {
  try {
    // For now, we'll send only the fields the API expects
    const apiData: JDFormData = {
      title: data.title,
      description: data.description,
      status: data.status,
    };
    const res = await axios.post("/job-descriptions", apiData);
    return res.data.jobDescription || res.data;
  } catch (error: any) {
    console.error("Error adding job description:", error);
    if (error.response?.status === 401) {
      throw new Error("Please sign in to create job descriptions");
    }
    throw new Error(
      error.response?.data?.message || "Failed to create job description"
    );
  }
};

export const updateJobDescription = async (
  id: number,
  data: JobDescriptionFormData
): Promise<JD> => {
  try {
    // For now, we'll send only the fields the API expects
    const apiData: JDFormData = {
      title: data.title,
      description: data.description,
      status: data.status,
    };
    const res = await axios.put(`/job-descriptions/${id}`, apiData);
    return res.data.jobDescription || res.data;
  } catch (error: any) {
    console.error("Error updating job description:", error);
    if (error.response?.status === 401) {
      throw new Error("Please sign in to update job descriptions");
    }
    if (error.response?.status === 404) {
      throw new Error("Job description not found");
    }
    throw new Error(
      error.response?.data?.message || "Failed to update job description"
    );
  }
};

export const deleteJobDescription = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`/job-descriptions/${id}`);
    return true;
  } catch (error: any) {
    console.error("Error deleting job description:", error);
    if (error.response?.status === 401) {
      throw new Error("Please sign in to delete job descriptions");
    }
    if (error.response?.status === 404) {
      throw new Error("Job description not found");
    }
    throw new Error(
      error.response?.data?.message || "Failed to delete job description"
    );
  }
};
