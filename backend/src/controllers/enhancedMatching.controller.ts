import { Request, Response, NextFunction } from "express";
import { EnhancedMatchingService } from "../services/enhancedMatching.service";
import HttpException from "../exceptions/HttpException";
import { AuthenticatedRequest } from "../interfaces/auth.interface";

export class EnhancedMatchingController {
  public enhancedMatchingService = new EnhancedMatchingService();

  /**
   * Perform enhanced matching between resume and job
   * POST /api/matches/enhanced
   */
  public performEnhancedMatch = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { resumeId, jobId } = req.body;

      if (!resumeId || !jobId) {
        throw new HttpException(400, "Resume ID and Job ID are required");
      }

      // Perform enhanced matching
      const matchAnalysis = await this.enhancedMatchingService.performEnhancedMatch(resumeId, jobId);

      // Save the result to database
      const savedMatch = await this.enhancedMatchingService.saveMatchResult(resumeId, jobId, matchAnalysis);

      res.status(200).json({
        message: "Enhanced matching completed successfully",
        match: savedMatch,
        analysis: matchAnalysis,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get match results for a resume
   * GET /api/matches/resume/:resumeId
   */
  public getResumeMatches = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { resumeId } = req.params;

      const matches = await this.enhancedMatchingService.getMatchResults(resumeId);

      res.status(200).json({
        message: "Resume matches retrieved successfully",
        matches,
        count: matches.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get top matching resumes for a job
   * GET /api/matches/job/:jobId/top
   */
  public getTopMatchesForJob = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { jobId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const matches = await this.enhancedMatchingService.getTopMatchesForJob(jobId, limit);

      res.status(200).json({
        message: "Top matches retrieved successfully",
        matches,
        count: matches.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Generate comprehensive insights for a resume
   * GET /api/matches/resume/:resumeId/insights
   */
  public getResumeInsights = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { resumeId } = req.params;

      const insights = await this.enhancedMatchingService.generateResumeInsights(resumeId);

      res.status(200).json({
        message: "Resume insights generated successfully",
        insights,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all matches with filters
   * GET /api/matches
   */
  public getAllMatches = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { resumeId, jobId, minScore, maxScore, limit = 20, offset = 0 } = req.query;

      let matches;

      if (resumeId) {
        matches = await this.enhancedMatchingService.getMatchResults(resumeId as string);
      } else if (jobId) {
        matches = await this.enhancedMatchingService.getTopMatchesForJob(
          jobId as string,
          parseInt(limit as string)
        );
      } else {
        // Get recent matches (would need service method)
        matches = [];
      }

      // Apply score filters if provided
      if (minScore || maxScore) {
        matches = matches.filter((match) => {
          if (minScore && match.match_score < parseInt(minScore as string)) return false;
          if (maxScore && match.match_score > parseInt(maxScore as string)) return false;
          return true;
        });
      }

      res.status(200).json({
        message: "Matches retrieved successfully",
        matches,
        count: matches.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a match result
   * DELETE /api/matches/:matchId
   */
  public deleteMatch = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { matchId } = req.params;

      // This would need to be implemented in the service
      // For now, just return a placeholder
      res.status(200).json({
        message: "Match deletion feature coming soon",
        matchId,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Batch process multiple resume-job matches
   * POST /api/matches/batch
   */
  public batchProcessMatches = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { matches } = req.body; // Array of {resumeId, jobId}

      if (!Array.isArray(matches) || matches.length === 0) {
        throw new HttpException(400, "Matches array is required and must not be empty");
      }

      const results = [];
      const errors = [];

      // Process matches sequentially to avoid overwhelming the AI API
      for (const match of matches) {
        try {
          const { resumeId, jobId } = match;

          if (!resumeId || !jobId) {
            errors.push({ match, error: "Resume ID and Job ID are required" });
            continue;
          }

          const matchAnalysis = await this.enhancedMatchingService.performEnhancedMatch(resumeId, jobId);
          const savedMatch = await this.enhancedMatchingService.saveMatchResult(resumeId, jobId, matchAnalysis);

          results.push(savedMatch);
        } catch (error: any) {
          errors.push({ match, error: error.message });
        }
      }

      res.status(200).json({
        message: "Batch processing completed",
        successful: results.length,
        failed: errors.length,
        results,
        errors,
      });
    } catch (error) {
      next(error);
    }
  };
}
