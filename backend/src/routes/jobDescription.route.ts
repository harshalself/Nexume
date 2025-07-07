import { Router } from "express";
import Route from "../interfaces/route.interface";
import { JobDescriptionController } from "../controllers/jobDescription.controller";
import validationMiddleware from "../middlewares/validation.middleware";
import {
  JobDescriptionCreateDto,
  JobDescriptionUpdateDto,
} from "../dtos/jobDescription.dto";

class JobDescriptionRoute implements Route {
  public path = "/job-descriptions";
  public router = Router();
  public jobDescriptionController = new JobDescriptionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      validationMiddleware(JobDescriptionCreateDto, "body", false, []),
      this.jobDescriptionController.createJobDescription
    );
    this.router.get(
      `${this.path}`,
      this.jobDescriptionController.getJobDescriptions
    );
    this.router.get(
      `${this.path}/:id`,
      this.jobDescriptionController.getJobDescriptionById
    );
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(JobDescriptionUpdateDto, "body", true, []),
      this.jobDescriptionController.updateJobDescription
    );
    this.router.delete(
      `${this.path}/:id`,
      this.jobDescriptionController.softDeleteJobDescription
    );
  }
}

export default JobDescriptionRoute;
