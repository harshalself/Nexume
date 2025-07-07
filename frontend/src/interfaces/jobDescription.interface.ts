export const JOB_STATUS_OPTIONS = ["Active", "Inactive"] as const;
export type JobStatus = (typeof JOB_STATUS_OPTIONS)[number];

export interface JD {
  id: number;
  title: string;
  description: string;
  status: JobStatus;
  created: string;
}

export type JDFormData = {
  title: string;
  description: string;
  status: JobStatus;
};
