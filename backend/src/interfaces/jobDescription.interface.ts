export interface IJobDescription {
  id: string;
  user_id: string;
  title: string;
  description: string;
  company?: string;
  status: string;
  is_deleted: boolean;
  created_at: string;
}
