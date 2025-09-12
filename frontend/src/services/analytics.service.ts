import apiClient from "../lib/axios";

// Analytics interfaces based on backend API responses
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

export interface AnalyticsApiResponse<T> {
  message: string;
  data: T;
}

class AnalyticsService {
  /**
   * Get dashboard overview analytics
   */
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    try {
      const response = await apiClient.get<
        AnalyticsApiResponse<DashboardAnalytics>
      >("/analytics/dashboard");
      return response.data.data;
    } catch (error: any) {
      console.error("Failed to fetch dashboard analytics:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch dashboard analytics"
      );
    }
  }

  /**
   * Get job performance analytics
   */
  async getJobAnalytics(timeframe?: string): Promise<JobAnalytics[]> {
    try {
      const params = timeframe ? { timeframe } : {};
      const response = await apiClient.get<
        AnalyticsApiResponse<JobAnalytics[]>
      >("/analytics/jobs", { params });
      return response.data.data;
    } catch (error: any) {
      console.error("Failed to fetch job analytics:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch job analytics"
      );
    }
  }

  /**
   * Get resume processing analytics
   */
  async getResumeAnalytics(timeframe?: string): Promise<ResumeAnalytics> {
    try {
      const params = timeframe ? { timeframe } : {};
      const response = await apiClient.get<
        AnalyticsApiResponse<ResumeAnalytics>
      >("/analytics/resumes", { params });
      return response.data.data;
    } catch (error: any) {
      console.error("Failed to fetch resume analytics:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch resume analytics"
      );
    }
  }

  /**
   * Get matching algorithm analytics
   */
  async getMatchAnalytics(timeframe?: string): Promise<MatchAnalytics> {
    try {
      const params = timeframe ? { timeframe } : {};
      const response = await apiClient.get<
        AnalyticsApiResponse<MatchAnalytics>
      >("/analytics/matches", { params });
      return response.data.data;
    } catch (error: any) {
      console.error("Failed to fetch match analytics:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch match analytics"
      );
    }
  }

  /**
   * Get all analytics data for comprehensive dashboard
   */
  async getAllAnalytics(timeframe?: string): Promise<{
    dashboard: DashboardAnalytics;
    jobs: JobAnalytics[];
    resumes: ResumeAnalytics;
    matches: MatchAnalytics;
  }> {
    try {
      const [dashboard, jobs, resumes, matches] = await Promise.all([
        this.getDashboardAnalytics(),
        this.getJobAnalytics(timeframe),
        this.getResumeAnalytics(timeframe),
        this.getMatchAnalytics(timeframe),
      ]);

      return { dashboard, jobs, resumes, matches };
    } catch (error: any) {
      console.error("Failed to fetch all analytics:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch analytics data"
      );
    }
  }
}

export const analyticsService = new AnalyticsService();
