import { supabase } from "../utils/supabaseClient";
import { logger } from "../utils/logger";

export interface DashboardAnalytics {
  totalJobs: number;
  totalResumes: number;
  totalMatches: number;
  averageMatchScore: number;
  topMatchScore: number;
  jobsWithMatches: number;
  resumesWithMatches: number;
  recentActivity: number;
}

export interface JobAnalytics {
  id: string;
  title: string;
  created_at: string;
  totalMatches: number;
  averageMatchScore: number;
  topMatchScore: number;
  topCandidates: Array<{
    name: string;
    score: number;
  }>;
}

export interface ResumeAnalytics {
  totalResumes: number;
  resumesWithMatches: number;
  averageProcessingTime: number;
  processingSuccessRate: number;
  recentUploads: Array<{
    id: string;
    name: string;
    uploaded_at: string;
  }>;
}

export interface MatchAnalytics {
  totalMatches: number;
  averageScore: number;
  scoreDistribution: {
    high: number; // 80-100%
    medium: number; // 50-79%
    low: number; // 0-49%
  };
  matchTrends: Array<{
    date: string;
    count: number;
  }>;
}

export class AnalyticsService {
  /**
   * Get comprehensive dashboard analytics
   */
  public async getDashboardAnalytics(
    userId: string
  ): Promise<DashboardAnalytics> {
    try {
      logger.info(`Fetching dashboard analytics for user: ${userId}`);

      // Get basic counts with simpler queries
      const [jobsResult, resumesResult] = await Promise.all([
        supabase
          .from("job_descriptions")
          .select("id", { count: "exact" })
          .eq("user_id", userId)
          .eq("is_deleted", false),
        supabase
          .from("resumes")
          .select("id", { count: "exact" })
          .eq("is_deleted", false),
      ]);

      // Get matches for user's jobs separately
      const { data: userJobs } = await supabase
        .from("job_descriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("is_deleted", false);

      const jobIds = userJobs?.map((job) => job.id) || [];

      let matchesResult = { data: [], count: 0 };
      if (jobIds.length > 0) {
        matchesResult = await supabase
          .from("matches")
          .select("match_score", { count: "exact" })
          .in("job_id", jobIds);
      }

      const totalJobs = jobsResult.count || 0;
      const totalResumes = resumesResult.count || 0;
      const totalMatches = matchesResult.count || 0;

      // Calculate average match score
      let averageMatchScore = 0;
      if (matchesResult.data && matchesResult.data.length > 0) {
        const scores = matchesResult.data.map((m) => m.match_score || 0);
        averageMatchScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      }

      // Get top performing job and calculate additional metrics
      let topMatchScore = 0;
      let jobsWithMatches = 0;
      let resumesWithMatches = 0;

      if (matchesResult.data && matchesResult.data.length > 0) {
        const scores = matchesResult.data.map((m) => m.match_score || 0);
        topMatchScore = Math.max(...scores);
      }

      // Count jobs with matches
      if (jobIds.length > 0) {
        const { data: jobsWithMatchesData } = await supabase
          .from("matches")
          .select("job_id")
          .in("job_id", jobIds);

        const uniqueJobsWithMatches = new Set(
          jobsWithMatchesData?.map((m) => m.job_id) || []
        );
        jobsWithMatches = uniqueJobsWithMatches.size;
      }

      // Count resumes with matches
      if (jobIds.length > 0) {
        const { data: resumesWithMatchesData } = await supabase
          .from("matches")
          .select("resume_id")
          .in("job_id", jobIds);

        const uniqueResumesWithMatches = new Set(
          resumesWithMatchesData?.map((m) => m.resume_id) || []
        );
        resumesWithMatches = uniqueResumesWithMatches.size;
      }

      // Get recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { count: recentActivity } = await supabase
        .from("resumes")
        .select("id", { count: "exact" })
        .eq("is_deleted", false)
        .gte("uploaded_at", sevenDaysAgo.toISOString());

      return {
        totalJobs,
        totalResumes,
        totalMatches,
        averageMatchScore: Math.round(averageMatchScore * 100) / 100,
        topMatchScore: Math.round(topMatchScore * 100) / 100,
        jobsWithMatches,
        resumesWithMatches,
        recentActivity: recentActivity || 0,
      };
    } catch (error) {
      logger.error("Error in getDashboardAnalytics:", error);
      throw error;
    }
  }

  /**
   * Get job-specific analytics
   */
  public async getJobAnalytics(
    userId: string,
    timeframe?: string
  ): Promise<JobAnalytics[]> {
    try {
      logger.info(`Fetching job analytics for user: ${userId}`);

      // Get job performance data
      const { data: jobs } = await supabase
        .from("job_descriptions")
        .select(
          `
          id,
          title,
          created_at,
          matches (
            match_score,
            resumes (
              name
            )
          )
        `
        )
        .eq("user_id", userId)
        .eq("is_deleted", false);

      const jobAnalytics = (jobs || []).map((job) => {
        const matches = job.matches || [];
        const scores = matches.map((m) => m.match_score || 0);

        const topCandidates = matches
          .map((match) => ({
            name: (match.resumes as any)?.name || "Unknown",
            score: match.match_score || 0,
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        return {
          id: job.id,
          title: job.title,
          created_at: job.created_at,
          totalMatches: matches.length,
          averageMatchScore:
            scores.length > 0
              ? Math.round(
                  (scores.reduce((a, b) => a + b, 0) / scores.length) * 100
                ) / 100
              : 0,
          topMatchScore: scores.length > 0 ? Math.max(...scores) : 0,
          topCandidates,
        };
      });

      return jobAnalytics;
    } catch (error) {
      logger.error("Error in getJobAnalytics:", error);
      throw error;
    }
  }

  /**
   * Get resume analytics
   */
  public async getResumeAnalytics(
    userId: string,
    timeframe?: string
  ): Promise<ResumeAnalytics> {
    try {
      logger.info(`Fetching resume analytics for user: ${userId}`);

      // Get all resumes
      const { data: resumes } = await supabase
        .from("resumes")
        .select("id, name, uploaded_at, parsed_data")
        .eq("is_deleted", false)
        .order("uploaded_at", { ascending: false });

      const totalResumes = resumes?.length || 0;
      const processedResumes =
        resumes?.filter((r) => r.parsed_data).length || 0;

      // Get resumes with matches (need to check matches table)
      const { data: userJobs } = await supabase
        .from("job_descriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("is_deleted", false);

      const jobIds = userJobs?.map((job) => job.id) || [];

      let resumesWithMatches = 0;
      if (jobIds.length > 0) {
        const { data: matchedResumes } = await supabase
          .from("matches")
          .select("resume_id")
          .in("job_id", jobIds);

        const uniqueMatchedResumes = new Set(
          matchedResumes?.map((m) => m.resume_id) || []
        );
        resumesWithMatches = uniqueMatchedResumes.size;
      }

      // Get recent uploads (last 10)
      const recentUploads = (resumes || []).slice(0, 10).map((resume) => ({
        id: resume.id,
        name: resume.name,
        uploaded_at: resume.uploaded_at,
      }));

      // Calculate processing success rate
      const processingSuccessRate =
        totalResumes > 0
          ? Math.round((processedResumes / totalResumes) * 10000) / 100
          : 100;

      return {
        totalResumes,
        resumesWithMatches,
        averageProcessingTime: 2.5, // Placeholder - would need to track processing times
        processingSuccessRate,
        recentUploads,
      };
    } catch (error) {
      logger.error("Error in getResumeAnalytics:", error);
      throw error;
    }
  }

  /**
   * Get matching analytics
   */
  public async getMatchAnalytics(
    userId: string,
    timeframe?: string
  ): Promise<MatchAnalytics> {
    try {
      logger.info(`Fetching match analytics for user: ${userId}`);

      // Get matches for user's jobs
      const { data: userJobs } = await supabase
        .from("job_descriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("is_deleted", false);

      const jobIds = userJobs?.map((job) => job.id) || [];

      let matches = [];
      if (jobIds.length > 0) {
        const { data: matchData } = await supabase
          .from("matches")
          .select("match_score, matched_on")
          .in("job_id", jobIds);
        matches = matchData || [];
      }

      const totalMatches = matches.length;

      // Calculate average score
      let averageScore = 0;
      if (matches.length > 0) {
        const scores = matches.map((m) => m.match_score || 0);
        averageScore =
          Math.round(
            (scores.reduce((a, b) => a + b, 0) / scores.length) * 100
          ) / 100;
      }

      // Score distribution
      const scoreDistribution = {
        high: matches.filter((m) => (m.match_score || 0) >= 80).length,
        medium: matches.filter(
          (m) => (m.match_score || 0) >= 50 && (m.match_score || 0) < 80
        ).length,
        low: matches.filter((m) => (m.match_score || 0) < 50).length,
      };

      return {
        totalMatches,
        averageScore,
        scoreDistribution,
        matchTrends: [], // Simplified for now
      };
    } catch (error) {
      logger.error("Error in getMatchAnalytics:", error);
      throw error;
    }
  }
}
