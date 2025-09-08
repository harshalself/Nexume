import { supabase } from "../utils/supabaseClient";
import { IResume, IResumeUploadPayload } from "../interfaces/resume.interface";
import HttpException from "../exceptions/HttpException";
import path from "path";
import ResumeProcessingService from "./resumeProcessing.service";

export class ResumeService {
  private resumeProcessingService = new ResumeProcessingService();
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

      // Process the resume file to extract text
      let processedData = null;
      try {
        const extractedText =
          await this.resumeProcessingService.extractTextFromFile(
            payload.file.buffer,
            payload.file.mimetype
          );

        const processedResume =
          this.resumeProcessingService.processResumeText(extractedText);
        processedData = JSON.stringify(processedResume);

        console.log(
          `✅ Resume text processed successfully. Word count: ${processedResume.wordCount}`
        );
      } catch (processingError) {
        console.warn(
          `⚠️ Resume text processing failed: ${processingError.message}`
        );
        // Continue with upload even if text processing fails
      }

      // Create database record
      const { data, error } = await supabase
        .from("resumes")
        .insert([
          {
            user_id: userId,
            name: payload.name || null,
            email: payload.email || null,
            file_url: urlData.publicUrl,
            parsed_data: processedData,
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

  /**
   * Process an existing resume to extract text (if not already processed)
   */
  public async processExistingResume(
    id: string,
    userId: string
  ): Promise<IResume> {
    try {
      // Get the resume
      const resume = await this.getResumeById(id, userId);

      if (resume.parsed_data) {
        throw new HttpException(400, "Resume already processed");
      }

      // Download the file from storage
      const fileBuffer = await this.downloadResumeFile(resume.file_url);

      // Determine file type from URL or store in database
      const fileExtension = resume.file_url.split(".").pop()?.toLowerCase();
      let mimeType = "application/pdf"; // Default to PDF

      if (fileExtension === "docx") {
        mimeType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      } else if (fileExtension === "doc") {
        mimeType = "application/msword";
      }

      // Extract and process text
      const extractedText =
        await this.resumeProcessingService.extractTextFromFile(
          fileBuffer,
          mimeType
        );

      const processedResume =
        this.resumeProcessingService.processResumeText(extractedText);
      const processedData = JSON.stringify(processedResume);

      // Update the resume with processed data
      const updatedResume = await this.updateResume(id, userId, {
        parsed_data: processedData,
      });

      return updatedResume;
    } catch (error) {
      console.error("Resume processing error:", error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        500,
        `Resume processing failed: ${error.message}`
      );
    }
  }

  /**
   * Match a resume against a job description
   */
  public async matchResumeToJob(
    resumeId: string,
    jobDescription: string,
    userId: string
  ): Promise<{
    resumeId: string;
    jobDescription: string;
    analysis: {
      score: number;
      matchedKeywords: string[];
      missingKeywords: string[];
      strengths: string[];
      recommendations: string[];
    };
    enhancedAnalysis?: any;
  }> {
    try {
      // Get the resume
      const resume = await this.getResumeById(resumeId, userId);

      let resumeText = "";

      if (resume.parsed_data) {
        // Use already processed data
        const processedData = JSON.parse(resume.parsed_data);
        resumeText = processedData.text;
      } else {
        // Process the resume on-the-fly
        const fileBuffer = await this.downloadResumeFile(resume.file_url);
        const fileExtension = resume.file_url.split(".").pop()?.toLowerCase();
        let mimeType = "application/pdf";

        if (fileExtension === "docx") {
          mimeType =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if (fileExtension === "doc") {
          mimeType = "application/msword";
        }

        resumeText = await this.resumeProcessingService.extractTextFromFile(
          fileBuffer,
          mimeType
        );
      }

      // Generate basic match analysis
      const analysis = this.resumeProcessingService.generateMatchAnalysis(
        resumeText,
        jobDescription
      );

      return {
        resumeId,
        jobDescription,
        analysis,
      };
    } catch (error) {
      console.error("Resume matching error:", error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, `Resume matching failed: ${error.message}`);
    }
  }

  /**
   * Download resume file from storage
   */
  private async downloadResumeFile(fileUrl: string): Promise<Buffer> {
    try {
      // Extract file path from URL
      const urlParts = fileUrl.split("/");
      const filePath = urlParts.slice(-2).join("/"); // Get "resumes/filename"

      const { data, error } = await supabase.storage
        .from("resumes")
        .download(filePath);

      if (error) {
        throw new Error(`File download failed: ${error.message}`);
      }

      return Buffer.from(await data.arrayBuffer());
    } catch (error) {
      throw new Error(`Failed to download resume file: ${error.message}`);
    }
  }
}
