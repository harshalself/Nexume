export interface Resume {
  id: number;
  filename: string;
  uploadedAt: string;
  status: "Uploaded" | "Processing" | "Failed";
}

export interface ResumeUploadData {
  file: File;
  status?: "Uploaded" | "Processing" | "Failed";
}
