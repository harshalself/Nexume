import { supabase } from "../utils/supabaseClient";
import { JobDescriptionCreateDto } from "../dtos/jobDescription.dto";
import { IJobDescription } from "../interfaces/jobDescription.interface";
import HttpException from "../exceptions/HttpException";

export class JobDescriptionService {
  public async createJobDescription(
    userId: string,
    dto: JobDescriptionCreateDto
  ): Promise<IJobDescription> {
    const { title, description, status } = dto;
    const { data, error } = await supabase
      .from("job_descriptions")
      .insert([
        {
          user_id: userId,
          title,
          description,
          status: status || "active",
          is_deleted: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();
    if (error || !data) {
      throw new HttpException(
        400,
        error?.message || "Failed to create job description"
      );
    }
    return data as IJobDescription;
  }

  public async getJobDescriptionsByUser(userId: string) {
    const { data, error } = await supabase
      .from("job_descriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("is_deleted", false);
    if (error) throw new HttpException(500, error.message);
    return data;
  }

  public async getJobDescriptionById(id: string, userId: string) {
    const { data, error } = await supabase
      .from("job_descriptions")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .single();
    if (error) throw new HttpException(404, "Job description not found");
    return data;
  }

  public async updateJobDescription(
    id: string,
    userId: string,
    dto: Partial<IJobDescription>
  ) {
    const { data, error } = await supabase
      .from("job_descriptions")
      .update(dto)
      .eq("id", id)
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .select("*")
      .single();
    if (error)
      throw new HttpException(404, "Job description not found or not updated");
    return data;
  }

  public async softDeleteJobDescription(id: string, userId: string) {
    const { data, error } = await supabase
      .from("job_descriptions")
      .update({ is_deleted: true })
      .eq("id", id)
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .select("*")
      .single();
    if (error)
      throw new HttpException(
        404,
        "Job description not found or already deleted"
      );
    return data;
  }
}
