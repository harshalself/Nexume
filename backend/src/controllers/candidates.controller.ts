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

      // Validate minScore parameter
      if (
        minScore &&
        (isNaN(Number(minScore)) ||
          Number(minScore) < 0 ||
          Number(minScore) > 100)
      ) {
        throw new HttpException(
          400,
          "minScore must be a number between 0 and 100"
        );
      }

      // Validate limit parameter
      if (limit && (isNaN(Number(limit)) || Number(limit) < 0)) {
        throw new HttpException(400, "limit must be a positive number");
      }

      // Validate offset parameter
      if (offset && (isNaN(Number(offset)) || Number(offset) < 0)) {
        throw new HttpException(400, "offset must be a positive number");
      }

      const candidates = await this.candidatesService.getCandidates(userId, {
        status: status as string,
        minScore: minScore ? Number(minScore) : undefined,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });

      res.status(200).json({
        message: "Candidates retrieved successfully",
        data: candidates,
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

      // Validate minScore parameter
      if (
        minScore &&
        (isNaN(Number(minScore)) ||
          Number(minScore) < 0 ||
          Number(minScore) > 100)
      ) {
        throw new HttpException(
          400,
          "minScore must be a number between 0 and 100"
        );
      }

      // Validate limit parameter
      if (limit && (isNaN(Number(limit)) || Number(limit) < 0)) {
        throw new HttpException(400, "limit must be a positive number");
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
        data: candidates,
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
        data: candidateDetails,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get top candidates (best matches overall)
   * GET /api/candidates/top
   */
  public getTopCandidates = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const { limit } = req.query;

      // Validate limit parameter
      const limitNum = limit ? Number(limit) : 10;
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        throw new HttpException(
          400,
          "limit must be a number between 1 and 100"
        );
      }

      const topCandidates = await this.candidatesService.getTopCandidates(
        userId,
        limitNum
      );

      res.status(200).json({
        message: "Top candidates retrieved successfully",
        data: topCandidates,
        total: topCandidates.length,
      });
    } catch (error) {
      next(error);
    }
  };

  public getCandidatesStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const stats = await this.candidatesService.getCandidatesStats();
      res.status(200).json({
        message: "Candidates statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };
}
