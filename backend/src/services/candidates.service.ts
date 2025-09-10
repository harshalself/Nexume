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

      // Get user's job IDs first to ensure we only show candidates relevant to this user
      const { data: candidateUserJobs } = await supabase
        .from("job_descriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("is_deleted", false);

      const candidateJobIds = candidateUserJobs?.map((job) => job.id) || [];

      if (candidateJobIds.length === 0) {
        logger.info("No jobs found for user");
        return null;
      }

      // Try to get candidate data through matches (same as getCandidates method)
      const { data: candidateMatches, error } = await supabase
        .from("matches")
        .select(
          `
          id,
          match_score,
          resume_id,
          job_id,
          match_details,
          matched_on,
          resumes (
            id,
            name,
            email,
            file_url,
            uploaded_at,
            parsed_data
          ),
          job_descriptions (
            id,
            title,
            company
          )
        `
        )
        .eq("resume_id", candidateId)
        .in("job_id", candidateJobIds);

      if (error || !candidateMatches || candidateMatches.length === 0) {
        logger.error("Candidate not found in matches:", error);
        return null;
      }

      // Get the resume data from the first match
      const firstMatch = candidateMatches[0];
      const resume = firstMatch.resumes as any;

      if (!resume) {
        logger.error("Resume data not found in match");
        return null;
      }

      // Process all matches for this candidate
      let best_match_score = 0;
      let best_match_job_title = undefined;
      const match_details: any[] = [];

      candidateMatches.forEach((match) => {
        if (match.match_score > best_match_score) {
          best_match_score = match.match_score;
          const job = match.job_descriptions as any;
          best_match_job_title = job?.title || "Unknown Job";
        }

        match_details.push({
          id: match.id,
          job_id: match.job_id,
          job_title: (match.job_descriptions as any)?.title || "Unknown Job",
          company:
            (match.job_descriptions as any)?.company || "Unknown Company",
          match_score: match.match_score,
          match_details: match.match_details,
          matched_on: match.matched_on,
        });
      });

      const candidateDetails: CandidateDetails = {
        id: resume.id,
        name: resume.name,
        email: resume.email,
        file_url: resume.file_url,
        uploaded_at: resume.uploaded_at,
        parsed_data: resume.parsed_data,
        best_match_score,
        best_match_job_title,
        total_matches: candidateMatches.length,
        matches: match_details,
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
        if (!resume) return; // Add null check

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
        if (!resume) return acc; // Add null check

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

  /**
   * Get performance statistics about candidates
   */
  public async getCandidatesStats(): Promise<any> {
    try {
      logger.info("Fetching candidates statistics");

      // Get total counts
      const { count: totalResumes } = await supabase
        .from("resumes")
        .select("*", { count: "exact", head: true })
        .eq("is_deleted", false);

      const { count: totalMatches } = await supabase
        .from("matches")
        .select("*", { count: "exact", head: true });

      const { count: totalJobs } = await supabase
        .from("job_descriptions")
        .select("*", { count: "exact", head: true })
        .eq("is_deleted", false);

      // Get average match score
      const { data: avgScore } = await supabase
        .from("matches")
        .select("match_score");

      const averageMatchScore =
        avgScore && avgScore.length > 0
          ? avgScore.reduce((sum, match) => sum + match.match_score, 0) /
            avgScore.length
          : 0;

      // Get top match score
      const { data: topMatch } = await supabase
        .from("matches")
        .select("match_score")
        .order("match_score", { ascending: false })
        .limit(1)
        .single();

      // Get recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { count: recentMatches } = await supabase
        .from("matches")
        .select("*", { count: "exact", head: true })
        .gte("matched_on", sevenDaysAgo.toISOString());

      const stats = {
        total_candidates: totalResumes || 0,
        total_matches: totalMatches || 0,
        total_jobs: totalJobs || 0,
        average_match_score: Math.round((averageMatchScore || 0) * 100) / 100,
        highest_match_score: topMatch?.match_score || 0,
        recent_matches_7_days: recentMatches || 0,
        performance_metrics: {
          matching_efficiency:
            totalMatches && totalResumes && totalJobs
              ? Math.round(
                  (totalMatches / (totalResumes * totalJobs)) * 100 * 100
                ) / 100
              : 0,
          average_matches_per_candidate:
            totalMatches && totalResumes
              ? Math.round((totalMatches / totalResumes) * 100) / 100
              : 0,
        },
      };

      logger.info("Candidates statistics retrieved successfully");
      return stats;
    } catch (error) {
      logger.error("Error in getCandidatesStats:", error);
      throw error;
    }
  }
}
