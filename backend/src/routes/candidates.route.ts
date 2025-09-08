import { Router } from "express";
import { CandidatesController } from "../controllers/candidates.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import Route from "../interfaces/route.interface";

class CandidatesRoute implements Route {
  public path = "/candidates";
  public router = Router();
  public candidatesController = new CandidatesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get all candidates with optional filtering
    this.router.get(
      `${this.path}`,
      AuthMiddleware.authenticate,
      this.candidatesController.getCandidates
    );

    // Get candidates for a specific job
    this.router.get(
      `${this.path}/job/:jobId`,
      AuthMiddleware.authenticate,
      this.candidatesController.getCandidatesForJob
    );

    // Get candidate details with match history
    this.router.get(
      `${this.path}/:candidateId`,
      AuthMiddleware.authenticate,
      this.candidatesController.getCandidateDetails
    );

    // Get top candidates (best matches overall)
    this.router.get(
      `${this.path}/top/:limit`,
      AuthMiddleware.authenticate,
      this.candidatesController.getTopCandidates
    );
  }
}

export default CandidatesRoute;
