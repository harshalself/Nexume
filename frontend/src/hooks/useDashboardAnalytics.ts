import { useState, useEffect, useCallback } from "react";
import {
  analyticsService,
  DashboardAnalytics,
} from "../services/analytics.service";

interface UseDashboardAnalyticsReturn {
  data: DashboardAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

/**
 * Custom hook for managing dashboard analytics data
 */
export const useDashboardAnalytics = (
  autoRefresh = false,
  refreshInterval = 30000 // 30 seconds
): UseDashboardAnalyticsReturn => {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const analytics = await analyticsService.getDashboardAnalytics();
      setData(analytics);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error("Failed to fetch dashboard analytics:", err);
      setError(err.message || "Failed to load analytics data");
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

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      if (!loading) {
        fetchAnalytics();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loading, fetchAnalytics]);

  return {
    data,
    loading,
    error,
    refetch,
    lastUpdated,
  };
};
