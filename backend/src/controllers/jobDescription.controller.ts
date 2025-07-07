import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import {
  JobDescriptionCreateDto,
  JobDescriptionUpdateDto,
} from "../dtos/jobDescription.dto";
import { JobDescriptionService } from "../services/jobDescription.service";
import HttpException from "../exceptions/HttpException";
import { AuthenticatedRequest } from "../interfaces/auth.interface";

export class JobDescriptionController {
  public jobDescriptionService = new JobDescriptionService();

  public createJobDescription = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = Object.assign(new JobDescriptionCreateDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return next(new HttpException(400, "Validation failed"));
      }
      const userId = req.user?.id;
      if (!userId) throw new HttpException(401, "Unauthorized");
      const jobDescription =
        await this.jobDescriptionService.createJobDescription(userId, dto);
      res.status(201).json({
        message: "Job description created successfully",
        jobDescription,
      });
    } catch (error) {
      next(error);
    }
  };

  public getJobDescriptions = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new HttpException(401, "Unauthorized");
      const jobDescriptions =
        await this.jobDescriptionService.getJobDescriptionsByUser(userId);
      res.status(200).json({ jobDescriptions });
    } catch (error) {
      next(error);
    }
  };

  public getJobDescriptionById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new HttpException(401, "Unauthorized");
      const { id } = req.params;
      const jobDescription =
        await this.jobDescriptionService.getJobDescriptionById(id, userId);
      res.status(200).json({ jobDescription });
    } catch (error) {
      next(error);
    }
  };

  public updateJobDescription = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new HttpException(401, "Unauthorized");
      const { id } = req.params;
      const dto = Object.assign(new JobDescriptionUpdateDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return next(new HttpException(400, "Validation failed"));
      }
      const jobDescription =
        await this.jobDescriptionService.updateJobDescription(id, userId, dto);
      res.status(200).json({
        message: "Job description updated successfully",
        jobDescription,
      });
    } catch (error) {
      next(error);
    }
  };

  public softDeleteJobDescription = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new HttpException(401, "Unauthorized");
      const { id } = req.params;
      await this.jobDescriptionService.softDeleteJobDescription(id, userId);
      res
        .status(200)
        .json({
          message: "Job description deleted (soft delete) successfully",
        });
    } catch (error) {
      next(error);
    }
  };
}
