import { supabase } from "../utils/supabaseClient";
import { logger } from "../utils/logger";

export interface DashboardAnalytics {
  totalJobs: number;
  totalResumes: number;
  totalMatches: number;
  averageMatchScore: number;
  topJob: {
    id: string;
    title: string;
    matchCount: number;
  } | null;
  recentUploads: number;
  matchingTrends: {
    period: string;
    count: number;
  }[];
}

export interface JobAnalytics {
  jobPerformance: Array<{
    id: string;
    title: string;
    company?: string;
    totalMatches: number;
    averageScore: number;
    topScore: number;
  }>;
  matchDistribution: {
    excellent: number; // 80-100%
    good: number; // 60-79%
    fair: number; // 40-59%
    poor: number; // 0-39%
  };
}

export interface ResumeAnalytics {
  uploadTrends: Array<{
    date: string;
    count: number;
  }>;
  processingStats: {
    total: number;
    processed: number;
    pending: number;
    failed: number;
  };
  topKeywords: Array<{
    keyword: string;
    frequency: number;
  }>;
}

export interface MatchAnalytics {
  scoreDistribution: Array<{
    range: string;
    count: number;
  }>;
  matchingTrends: Array<{
    date: string;
    matches: number;
    avgScore: number;
  }>;
  topPerformers: Array<{
    resumeId: string;
    candidateName: string;
    bestScore: number;
    totalMatches: number;
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

      // Get top performing job
      const { data: topJobData } = await supabase
        .from("job_descriptions")
        .select(
          `
          id,
          title,
          matches(count)
        `
        )
        .eq("user_id", userId)
        .eq("is_deleted", false)
        .order("matches.count", { ascending: false })
        .limit(1);

      const topJob =
        topJobData && topJobData.length > 0
          ? {
              id: topJobData[0].id,
              title: topJobData[0].title,
              matchCount: topJobData[0].matches?.length || 0,
            }
          : null;

      // Get recent uploads (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { count: recentUploads } = await supabase
        .from("resumes")
        .select("id", { count: "exact" })
        .eq("is_deleted", false)
        .gte("uploaded_at", sevenDaysAgo.toISOString());

      return {
        totalJobs,
        totalResumes,
        totalMatches,
        averageMatchScore: Math.round(averageMatchScore * 100) / 100,
        topJob,
        recentUploads: recentUploads || 0,
        matchingTrends: [], // Simplified for now
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
  ): Promise<JobAnalytics> {
    try {
      logger.info(`Fetching job analytics for user: ${userId}`);

      // Get job performance data
      const { data: jobs } = await supabase
        .from("job_descriptions")
        .select(
          `
          id,
          title,
          company,
          matches (
            match_score
          )
        `
        )
        .eq("user_id", userId)
        .eq("is_deleted", false);

      const jobPerformance = (jobs || []).map((job) => {
        const matches = job.matches || [];
        const scores = matches.map((m) => m.match_score || 0);

        return {
          id: job.id,
          title: job.title,
          company: job.company,
          totalMatches: matches.length,
          averageScore:
            scores.length > 0
              ? scores.reduce((a, b) => a + b, 0) / scores.length
              : 0,
          topScore: scores.length > 0 ? Math.max(...scores) : 0,
        };
      });

      // Calculate match distribution
      const allMatches = jobs?.flatMap((job) => job.matches) || [];
      const matchDistribution = {
        excellent: allMatches.filter((m) => (m.match_score || 0) >= 80).length,
        good: allMatches.filter(
          (m) => (m.match_score || 0) >= 60 && (m.match_score || 0) < 80
        ).length,
        fair: allMatches.filter(
          (m) => (m.match_score || 0) >= 40 && (m.match_score || 0) < 60
        ).length,
        poor: allMatches.filter((m) => (m.match_score || 0) < 40).length,
      };

      return {
        jobPerformance,
        matchDistribution,
      };
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

      // Get upload trends (simplified)
      const { data: resumes } = await supabase
        .from("resumes")
        .select("uploaded_at, parsed_data")
        .eq("is_deleted", false)
        .order("uploaded_at", { ascending: false });

      const processingStats = {
        total: resumes?.length || 0,
        processed: resumes?.filter((r) => r.parsed_data).length || 0,
        pending: resumes?.filter((r) => !r.parsed_data).length || 0,
        failed: 0, // Would need to track processing failures
      };

      return {
        uploadTrends: [], // Simplified for now
        processingStats,
        topKeywords: [], // Would extract from parsed_data
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
          .select(
            `
            match_score,
            matched_on,
            resumes (
              id,
              name
            )
          `
          )
          .in("job_id", jobIds);
        matches = matchData || [];
      }

      // Score distribution
      const scoreDistribution = [
        {
          range: "80-100%",
          count: matches?.filter((m) => (m.match_score || 0) >= 80).length || 0,
        },
        {
          range: "60-79%",
          count:
            matches?.filter(
              (m) => (m.match_score || 0) >= 60 && (m.match_score || 0) < 80
            ).length || 0,
        },
        {
          range: "40-59%",
          count:
            matches?.filter(
              (m) => (m.match_score || 0) >= 40 && (m.match_score || 0) < 60
            ).length || 0,
        },
        {
          range: "0-39%",
          count: matches?.filter((m) => (m.match_score || 0) < 40).length || 0,
        },
      ];

      return {
        scoreDistribution,
        matchingTrends: [], // Simplified for now
        topPerformers: [], // Simplified for now
      };
    } catch (error) {
      logger.error("Error in getMatchAnalytics:", error);
      throw error;
    }
  }
}
