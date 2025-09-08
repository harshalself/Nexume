import { Request, Response, NextFunction } from "express";
import { CandidatesService } from "../services/candidates.service";
import { AuthenticatedRequest } from "../interfaces/auth.interface";
import HttpException from "../exceptions/HttpException";

export class CandidatesController {
  public candidatesService = new CandidatesService();

  /**
   * Get all candidates with optional filtering
   * GET /api/candidates
   */
  public getCandidates = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const { status, minScore, limit, offset } = req.query;

      const candidates = await this.candidatesService.getCandidates(userId, {
        status: status as string,
        minScore: minScore ? Number(minScore) : undefined,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });

      res.status(200).json({
        message: "Candidates retrieved successfully",
        candidates,
        total: candidates.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get candidates for a specific job
   * GET /api/candidates/job/:jobId
   */
  public getCandidatesForJob = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const { jobId } = req.params;
      const { minScore, limit } = req.query;

      if (!jobId) {
        throw new HttpException(400, "Job ID is required");
      }

      const candidates = await this.candidatesService.getCandidatesForJob(
        userId,
        jobId,
        {
          minScore: minScore ? Number(minScore) : undefined,
          limit: limit ? Number(limit) : undefined,
        }
      );

      res.status(200).json({
        message: "Job candidates retrieved successfully",
        jobId,
        candidates,
        total: candidates.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get candidate details with match history
   * GET /api/candidates/:candidateId
   */
  public getCandidateDetails = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const { candidateId } = req.params;

      if (!candidateId) {
        throw new HttpException(400, "Candidate ID is required");
      }

      const candidateDetails = await this.candidatesService.getCandidateDetails(
        userId,
        candidateId
      );

      if (!candidateDetails) {
        throw new HttpException(404, "Candidate not found");
      }

      res.status(200).json({
        message: "Candidate details retrieved successfully",
        candidate: candidateDetails,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get top candidates (best matches overall)
   * GET /api/candidates/top/:limit
   */
  public getTopCandidates = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const { limit } = req.params;

      const topCandidates = await this.candidatesService.getTopCandidates(
        userId,
        Number(limit) || 10
      );

      res.status(200).json({
        message: "Top candidates retrieved successfully",
        candidates: topCandidates,
        total: topCandidates.length,
      });
    } catch (error) {
      next(error);
    }
  };
}
