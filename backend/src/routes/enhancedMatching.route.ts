import { Router } from "express";
import { EnhancedMatchingController } from "../controllers/enhancedMatching.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import Route from "../interfaces/route.interface";

class EnhancedMatchingRoute implements Route {
  public path = "/matches";
  public router = Router();
  public enhancedMatchingController = new EnhancedMatchingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Enhanced matching routes
    this.router.post(
      `${this.path}/enhanced`,
      AuthMiddleware.authenticate,
      this.enhancedMatchingController.performEnhancedMatch
    );
    this.router.post(
      `${this.path}/batch`,
      AuthMiddleware.authenticate,
      this.enhancedMatchingController.batchProcessMatches
    );

    // Resume-specific routes
    this.router.get(
      `${this.path}/resume/:resumeId`,
      AuthMiddleware.authenticate,
      this.enhancedMatchingController.getResumeMatches
    );
    this.router.get(
      `${this.path}/resume/:resumeId/insights`,
      AuthMiddleware.authenticate,
      this.enhancedMatchingController.getResumeInsights
    );

    // Job-specific routes
    this.router.get(
      `${this.path}/job/:jobId/top`,
      AuthMiddleware.authenticate,
      this.enhancedMatchingController.getTopMatchesForJob
    );

    // General routes
    this.router.get(
      `${this.path}`,
      AuthMiddleware.authenticate,
      this.enhancedMatchingController.getAllMatches
    );
    this.router.delete(
      `${this.path}/:matchId`,
      AuthMiddleware.authenticate,
      this.enhancedMatchingController.deleteMatch
    );
  }
}

export default EnhancedMatchingRoute;
