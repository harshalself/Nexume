import { Request, Response, NextFunction } from "express";
import { AnalyticsService } from "../services/analytics.service";
import { AuthenticatedRequest } from "../interfaces/auth.interface";

export class AnalyticsController {
  public analyticsService = new AnalyticsService();

  /**
   * Get dashboard analytics overview
   * GET /api/analytics/dashboard
   */
  public getDashboardAnalytics = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;

      const analytics = await this.analyticsService.getDashboardAnalytics(
        userId
      );

      res.status(200).json({
        message: "Dashboard analytics retrieved successfully",
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get job-specific analytics
   * GET /api/analytics/jobs
   */
  public getJobAnalytics = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const { timeframe } = req.query;

      const jobAnalytics = await this.analyticsService.getJobAnalytics(
        userId,
        timeframe as string
      );

      res.status(200).json({
        message: "Job analytics retrieved successfully",
        data: jobAnalytics,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get resume analytics
   * GET /api/analytics/resumes
   */
  public getResumeAnalytics = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const { timeframe } = req.query;

      const resumeAnalytics = await this.analyticsService.getResumeAnalytics(
        userId,
        timeframe as string
      );

      res.status(200).json({
        message: "Resume analytics retrieved successfully",
        data: resumeAnalytics,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get matching analytics
   * GET /api/analytics/matches
   */
  public getMatchAnalytics = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const { timeframe } = req.query;

      const matchAnalytics = await this.analyticsService.getMatchAnalytics(
        userId,
        timeframe as string
      );

      res.status(200).json({
        message: "Match analytics retrieved successfully",
        data: matchAnalytics,
      });
    } catch (error) {
      next(error);
    }
  };
}
