import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import Route from "../interfaces/route.interface";

class AnalyticsRoute implements Route {
  public path = "/analytics";
  public router = Router();
  public analyticsController = new AnalyticsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Dashboard analytics endpoint
    this.router.get(
      `${this.path}/dashboard`,
      AuthMiddleware.authenticate,
      this.analyticsController.getDashboardAnalytics
    );

    // Job analytics
    this.router.get(
      `${this.path}/jobs`,
      AuthMiddleware.authenticate,
      this.analyticsController.getJobAnalytics
    );

    // Resume analytics
    this.router.get(
      `${this.path}/resumes`,
      AuthMiddleware.authenticate,
      this.analyticsController.getResumeAnalytics
    );

    // Matching analytics
    this.router.get(
      `${this.path}/matches`,
      AuthMiddleware.authenticate,
      this.analyticsController.getMatchAnalytics
    );
  }
}

export default AnalyticsRoute;
