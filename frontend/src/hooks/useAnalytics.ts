import { useState, useEffect, useCallback } from "react";
import {
  analyticsService,
  DashboardAnalytics,
  JobAnalytics,
  ResumeAnalytics,
  MatchAnalytics,
} from "../services/analytics.service";

interface UseAnalyticsReturn {
  dashboardData: DashboardAnalytics | null;
  jobData: JobAnalytics[];
  resumeData: ResumeAnalytics | null;
  matchData: MatchAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export const useAnalytics = (
  autoRefresh: boolean = false,
  refreshInterval: number = 30000
): UseAnalyticsReturn => {
  const [dashboardData, setDashboardData] = useState<DashboardAnalytics | null>(
    null
  );
  const [jobData, setJobData] = useState<JobAnalytics[]>([]);
  const [resumeData, setResumeData] = useState<ResumeAnalytics | null>(null);
  const [matchData, setMatchData] = useState<MatchAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const analytics = await analyticsService.getAllAnalytics();

      setDashboardData(analytics.dashboard);
      setJobData(analytics.jobs);
      setResumeData(analytics.resumes);
      setMatchData(analytics.matches);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || "Failed to fetch analytics data");
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  // Initial fetch
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchAnalytics();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchAnalytics]);

  return {
    dashboardData,
    jobData,
    resumeData,
    matchData,
    loading,
    error,
    refetch,
    lastUpdated,
  };
};

// Hook specifically for dashboard analytics only (faster loading)
export const useDashboardAnalytics = (
  autoRefresh: boolean = false,
  refreshInterval: number = 30000
) => {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDashboardAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const analytics = await analyticsService.getDashboardAnalytics();
      setData(analytics);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || "Failed to fetch dashboard analytics");
      console.error("Dashboard analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchDashboardAnalytics();
  }, [fetchDashboardAnalytics]);

  // Initial fetch
  useEffect(() => {
    fetchDashboardAnalytics();
  }, [fetchDashboardAnalytics]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchDashboardAnalytics();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchDashboardAnalytics]);

  return {
    data,
    loading,
    error,
    refetch,
    lastUpdated,
  };
};
