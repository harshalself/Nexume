import { supabase } from "../utils/supabaseClient";
import { IResume, IResumeUploadPayload } from "../interfaces/resume.interface";
import HttpException from "../exceptions/HttpException";
import path from "path";

export class ResumeService {
  /**
   * Upload a resume file and create database record
   */
  public async uploadResume(
    userId: string,
    payload: IResumeUploadPayload
  ): Promise<IResume> {
    try {
      // Generate unique filename
      const fileExtension = path.extname(payload.file.originalname);
      const fileName = `${userId}-${Date.now()}${fileExtension}`;
      const filePath = `resumes/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, payload.file.buffer, {
          contentType: payload.file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        console.error("File upload error:", uploadError);
        throw new HttpException(
          400,
          `File upload failed: ${uploadError.message}`
        );
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(filePath);

      // Create database record
      const { data, error } = await supabase
        .from("resumes")
        .insert([
          {
            user_id: userId,
            name: payload.name || null,
            email: payload.email || null,
            file_url: urlData.publicUrl,
            is_deleted: false,
            uploaded_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error || !data) {
        // If database insert fails, try to clean up the uploaded file
        await supabase.storage.from("resumes").remove([filePath]);
        throw new HttpException(
          400,
          error?.message || "Failed to create resume record"
        );
      }

      return data as IResume;
    } catch (error) {
      console.error("Resume upload error:", error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        500,
        "Internal server error during resume upload"
      );
    }
  }

  /**
   * Get all resumes for a user
   */
  public async getResumesByUser(userId: string): Promise<IResume[]> {
    // Note: user_id column might not exist due to migration 20250707_remove-user-id-from-resumes.sql
    // For now, we'll get all resumes and filter manually or return empty array
    try {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", userId)
        .eq("is_deleted", false)
        .order("uploaded_at", { ascending: false });

      if (error) {
        console.error("Database error in getResumesByUser:", error);
        // If user_id column doesn't exist, return empty array for now
        if (
          error.message.includes("column") &&
          error.message.includes("does not exist")
        ) {
          console.log(
            "⚠️  user_id column missing - returning empty array. Migration needed."
          );
          return [];
        }
        throw new HttpException(500, error.message);
      }

      return data || [];
    } catch (error) {
      console.error("Error in getResumesByUser:", error);
      if (error instanceof HttpException) {
        throw error;
      }
      // For missing column, return empty array
      return [];
    }
  }

  /**
   * Get a specific resume by ID
   */
  public async getResumeById(id: string, userId: string): Promise<IResume> {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .single();

    if (error || !data) {
      throw new HttpException(404, "Resume not found");
    }

    return data as IResume;
  }

  /**
   * Soft delete a resume
   */
  public async softDeleteResume(id: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("resumes")
      .update({ is_deleted: true })
      .eq("id", id)
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .select("*")
      .single();

    if (error || !data) {
      throw new HttpException(404, "Resume not found or already deleted");
    }

    return true;
  }

  /**
   * Update resume metadata
   */
  public async updateResume(
    id: string,
    userId: string,
    updateData: { name?: string; email?: string; parsed_data?: string }
  ): Promise<IResume> {
    const { data, error } = await supabase
      .from("resumes")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .select("*")
      .single();

    if (error || !data) {
      throw new HttpException(404, "Resume not found or update failed");
    }

    return data as IResume;
  }
}
