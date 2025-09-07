export interface IResume {
  id: string;
  user_id: string;
  name?: string;
  email?: string;
  file_url: string;
  parsed_data?: string;
  is_deleted?: boolean;
  uploaded_at?: string;
}

export interface IResumeUploadPayload {
  name?: string;
  email?: string;
  file: Express.Multer.File;
}

export interface IResumeResponsePayload {
  resume: IResume;
  message: string;
}

export interface IResumeListPayload {
  resumes: IResume[];
  total: number;
}
