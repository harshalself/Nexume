import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { ResumeUploadDto, ResumeUpdateDto } from "../dtos/resume.dto";
import { ResumeService } from "../services/resume.service";
import HttpException from "../exceptions/HttpException";
import { AuthenticatedRequest } from "../interfaces/auth.interface";

export class ResumeController {
  public resumeService = new ResumeService();

  /**
   * Upload a new resume
   */
  public uploadResume = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new HttpException(401, "Unauthorized");

      // Check if file was uploaded
      if (!req.file) {
        throw new HttpException(400, "No file uploaded");
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new HttpException(
          400,
          "Invalid file type. Only PDF, DOC, and DOCX files are allowed"
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        throw new HttpException(
          400,
          "File size too large. Maximum size is 5MB"
        );
      }

      const dto = Object.assign(new ResumeUploadDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return next(new HttpException(400, "Validation failed"));
      }

      const resume = await this.resumeService.uploadResume(userId, {
        ...dto,
        file: req.file,
      });

      res.status(201).json({
        message: "Resume uploaded successfully",
        resume,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all resumes for the authenticated user
   */
  public getResumes = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new HttpException(401, "Unauthorized");

      const resumes = await this.resumeService.getResumesByUser(userId);

      res.status(200).json({
        message: "Resumes fetched successfully",
        resumes,
        total: resumes.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a specific resume by ID
   */
  public getResumeById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new HttpException(401, "Unauthorized");

      const { id } = req.params;
      const resume = await this.resumeService.getResumeById(id, userId);

      res.status(200).json({
        message: "Resume fetched successfully",
        resume,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update resume metadata
   */
  public updateResume = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new HttpException(401, "Unauthorized");

      const { id } = req.params;
      const dto = Object.assign(new ResumeUpdateDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return next(new HttpException(400, "Validation failed"));
      }

      const resume = await this.resumeService.updateResume(id, userId, dto);

      res.status(200).json({
        message: "Resume updated successfully",
        resume,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Soft delete a resume
   */
  public deleteResume = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new HttpException(401, "Unauthorized");

      const { id } = req.params;
      await this.resumeService.softDeleteResume(id, userId);

      res.status(200).json({
        message: "Resume deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
