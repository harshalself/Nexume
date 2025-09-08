import { supabase } from "../utils/supabaseClient";
import { logger } from "../utils/logger";

export interface CandidateFilter {
  status?: string;
  minScore?: number;
  limit?: number;
  offset?: number;
}

export interface JobCandidateFilter {
  minScore?: number;
  limit?: number;
}

export interface CandidateData {
  id: string;
  name: string;
  email: string;
  file_url: string;
  uploaded_at: string;
  best_match_score?: number;
  best_match_job_title?: string;
  total_matches: number;
}

export interface CandidateDetails extends CandidateData {
  parsed_data: any;
  matches: Array<{
    id: string;
    job_id: string;
    job_title: string;
    company?: string;
    match_score: number;
    match_details: any;
    matched_on: string;
  }>;
}

export class CandidatesService {
  /**
   * Get all candidates for a user with optional filtering
   */
  public async getCandidates(
    userId: string,
    filters: CandidateFilter
  ): Promise<CandidateData[]> {
    try {
      logger.info(`Fetching candidates for user: ${userId}`);

      // First get user's job IDs
      const { data: userJobs } = await supabase
        .from("job_descriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("is_deleted", false);

      const jobIds = userJobs?.map((job) => job.id) || [];

      if (jobIds.length === 0) {
        return [];
      }

      // Get matches for these jobs
      const { data: matches } = await supabase
        .from("matches")
        .select(
          `
          match_score,
          resume_id,
          resumes (
            id,
            name,
            email,
            file_url,
            uploaded_at
          )
        `
        )
        .in("job_id", jobIds);

      if (!matches || matches.length === 0) {
        return [];
      }

      // Group by resume and find best match
      const candidateMap = new Map<string, CandidateData>();

      matches.forEach((match) => {
        const resume = match.resumes as any;
        if (!resume) return;

        const resumeId = resume.id;
        const currentBest = candidateMap.get(resumeId);

        if (!currentBest || match.match_score > currentBest.best_match_score!) {
          candidateMap.set(resumeId, {
            id: resume.id,
            name: resume.name,
            email: resume.email,
            file_url: resume.file_url,
            uploaded_at: resume.uploaded_at,
            best_match_score: match.match_score,
            best_match_job_title: "", // Would need job title lookup
            total_matches: 1,
          });
        }
      });

      // Convert to array and apply filters
      let candidates = Array.from(candidateMap.values());

      if (filters.minScore) {
        candidates = candidates.filter(
          (c) => (c.best_match_score || 0) >= filters.minScore!
        );
      }

      // Sort by best match score
      candidates.sort(
        (a, b) => (b.best_match_score || 0) - (a.best_match_score || 0)
      );

      // Apply pagination
      if (filters.offset) {
        candidates = candidates.slice(filters.offset);
      }
      if (filters.limit) {
        candidates = candidates.slice(0, filters.limit);
      }

      logger.info(`Found ${candidates.length} candidates for user: ${userId}`);
      return candidates;
    } catch (error) {
      logger.error("Error in getCandidates:", error);
      throw error;
    }
  }

  /**
   * Get candidates for a specific job
   */
  public async getCandidatesForJob(
    userId: string,
    jobId: string,
    filters: JobCandidateFilter
  ): Promise<any[]> {
    try {
      logger.info(`Fetching candidates for job: ${jobId}, user: ${userId}`);

      // First verify the job belongs to the user
      const { data: job, error: jobError } = await supabase
        .from("job_descriptions")
        .select("id, title, company")
        .eq("id", jobId)
        .eq("user_id", userId)
        .eq("is_deleted", false)
        .single();

      if (jobError || !job) {
        throw new Error("Job not found or access denied");
      }

      let query = supabase
        .from("matches")
        .select(
          `
          id,
          match_score,
          match_details,
          matched_on,
          resumes (
            id,
            name,
            email,
            file_url,
            uploaded_at
          )
        `
        )
        .eq("job_id", jobId);

      // Apply minimum score filter
      if (filters.minScore) {
        query = query.gte("match_score", filters.minScore);
      }

      // Apply limit
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      // Order by match score
      query = query.order("match_score", { ascending: false });

      const { data: matches, error } = await query;

      if (error) {
        logger.error("Error fetching job candidates:", error);
        throw new Error(`Failed to fetch candidates: ${error.message}`);
      }

      const candidates = (matches || []).map((match) => {
        const resume = match.resumes as any;
        return {
          id: resume.id,
          name: resume.name,
          email: resume.email,
          file_url: resume.file_url,
          uploaded_at: resume.uploaded_at,
          match_score: match.match_score,
          match_details: match.match_details,
          matched_on: match.matched_on,
          job: {
            id: jobId,
            title: job.title,
            company: job.company,
          },
        };
      });

      logger.info(`Found ${candidates.length} candidates for job: ${jobId}`);
      return candidates;
    } catch (error) {
      logger.error("Error in getCandidatesForJob:", error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific candidate
   */
  public async getCandidateDetails(
    userId: string,
    candidateId: string
  ): Promise<CandidateDetails | null> {
    try {
      logger.info(
        `Fetching candidate details: ${candidateId} for user: ${userId}`
      );

      const { data: resume, error } = await supabase
        .from("resumes")
        .select(
          `
          id,
          name,
          email,
          file_url,
          uploaded_at,
          parsed_data
        `
        )
        .eq("id", candidateId)
        .eq("is_deleted", false)
        .single();

      if (error || !resume) {
        logger.error("Candidate not found:", error);
        return null;
      }

      // Get matches for this resume with user's jobs
      const { data: userJobs } = await supabase
        .from("job_descriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("is_deleted", false);

      const jobIds = userJobs?.map((job) => job.id) || [];

      if (jobIds.length === 0) {
        throw new Error("Access denied to this candidate");
      }

      const { data: matches } = await supabase
        .from("matches")
        .select(
          `
          id,
          match_score,
          match_details,
          matched_on,
          job_descriptions (
            id,
            title,
            company
          )
        `
        )
        .eq("resume_id", candidateId)
        .in("job_id", jobIds);

      const candidateDetails: CandidateDetails = {
        id: resume.id,
        name: resume.name,
        email: resume.email,
        file_url: resume.file_url,
        uploaded_at: resume.uploaded_at,
        parsed_data: resume.parsed_data,
        best_match_score:
          matches && matches.length > 0
            ? Math.max(...matches.map((m) => m.match_score), 0)
            : 0,
        best_match_job_title:
          matches && matches.length > 0
            ? (
                matches.find(
                  (m) =>
                    m.match_score ===
                    Math.max(...matches.map((match) => match.match_score))
                )?.job_descriptions as any
              )?.title
            : undefined,
        total_matches: matches?.length || 0,
        matches: (matches || []).map((match) => {
          const job = match.job_descriptions as any;
          return {
            id: match.id,
            job_id: job.id,
            job_title: job.title,
            company: job.company,
            match_score: match.match_score,
            match_details: match.match_details,
            matched_on: match.matched_on,
          };
        }),
      };

      return candidateDetails;
    } catch (error) {
      logger.error("Error in getCandidateDetails:", error);
      throw error;
    }
  }

  /**
   * Get top candidates across all jobs for a user
   */
  public async getTopCandidates(
    userId: string,
    limit: number = 10
  ): Promise<CandidateData[]> {
    try {
      logger.info(`Fetching top ${limit} candidates for user: ${userId}`);

      // Get user's job IDs first
      const { data: userJobs } = await supabase
        .from("job_descriptions")
        .select("id, title")
        .eq("user_id", userId)
        .eq("is_deleted", false);

      const jobIds = userJobs?.map((job) => job.id) || [];

      if (jobIds.length === 0) {
        return [];
      }

      // Get all matches for user's jobs
      const { data: matches } = await supabase
        .from("matches")
        .select(
          `
          match_score,
          job_id,
          resumes (
            id,
            name,
            email,
            file_url,
            uploaded_at
          )
        `
        )
        .in("job_id", jobIds)
        .eq("resumes.is_deleted", false)
        .order("match_score", { ascending: false });

      if (!matches || matches.length === 0) {
        return [];
      }

      // Group by resume and get the best match for each
      const candidateMap = new Map<string, any>();

      matches.forEach((match) => {
        const resume = match.resumes as any;
        const resumeId = resume.id;
        const jobTitle =
          userJobs?.find((j) => j.id === match.job_id)?.title || "";

        if (
          !candidateMap.has(resumeId) ||
          candidateMap.get(resumeId).best_match_score < match.match_score
        ) {
          candidateMap.set(resumeId, {
            id: resume.id,
            name: resume.name,
            email: resume.email,
            file_url: resume.file_url,
            uploaded_at: resume.uploaded_at,
            best_match_score: match.match_score,
            best_match_job_title: jobTitle,
            total_matches: 1, // Will be corrected below
          });
        }
      });

      // Count total matches for each candidate
      const candidateMatchCounts = matches.reduce((acc, match) => {
        const resume = match.resumes as any;
        const resumeId = resume.id;
        acc[resumeId] = (acc[resumeId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Update total matches and convert to array
      const topCandidates = Array.from(candidateMap.values())
        .map((candidate) => ({
          ...candidate,
          total_matches: candidateMatchCounts[candidate.id] || 0,
        }))
        .sort((a, b) => b.best_match_score - a.best_match_score)
        .slice(0, limit);

      logger.info(
        `Found ${topCandidates.length} top candidates for user: ${userId}`
      );
      return topCandidates;
    } catch (error) {
      logger.error("Error in getTopCandidates:", error);
      throw error;
    }
  }
}
