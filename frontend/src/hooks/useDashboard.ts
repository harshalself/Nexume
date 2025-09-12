import { useMemo } from "react";
import { useDashboardAnalytics } from "./useDashboardAnalytics";
import { getDashboardQuickActions } from "../services/dashboard.service";
import { useEffect, useState } from "react";

export const useDashboard = () => {
  const {
    data: analyticsData,
    loading: analyticsLoading,
    error: analyticsError,
  } = useDashboardAnalytics(true, 30000);
  const [quickActions, setQuickActions] = useState<any[]>([]);
  const [actionsLoading, setActionsLoading] = useState(true);
  const [actionsError, setActionsError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardQuickActions()
      .then((actionsData) => {
        setQuickActions(actionsData);
        setActionsLoading(false);
      })
      .catch((err) => {
        setActionsError(err.message || "Failed to load quick actions");
        setActionsLoading(false);
      });
  }, []);

  const stats = useMemo(() => {
    if (!analyticsData) return [];

    return [
      {
        title: "Total Jobs",
        value: analyticsData.totalJobs.toString(),
        description: "Job descriptions created",
        trend: `${analyticsData.jobsWithMatches} with matches`,
        icon: "💼",
        bgColor: "bg-blue-50",
      },
      {
        title: "Total Resumes",
        value: analyticsData.totalResumes.toString(),
        description: "Resumes uploaded",
        trend: `${analyticsData.resumesWithMatches} matched`,
        icon: "📄",
        bgColor: "bg-green-50",
      },
      {
        title: "Match Quality",
        value: `${analyticsData.averageMatchScore.toFixed(1)}%`,
        description: "Average match score",
        trend: `Best: ${analyticsData.topMatchScore.toFixed(1)}%`,
        icon: "🎯",
        bgColor: "bg-purple-50",
      },
    ];
  }, [analyticsData]);

  const loading = analyticsLoading || actionsLoading;
  const error = analyticsError || actionsError;

  return { stats, quickActions, loading, error };
};
