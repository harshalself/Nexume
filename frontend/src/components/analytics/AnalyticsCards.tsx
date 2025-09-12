import React from "react";
import { DashboardAnalytics } from "../../services/analytics.service";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: string;
  icon: React.ReactNode;
  className?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  className = "",
}) => {
  return (
    <div
      className={`card-hover border-0 shadow-sm hover:shadow-lg transition-all duration-300 p-4 rounded-lg bg-white ${className}`}>
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="p-2 rounded-lg bg-blue-50">{icon}</div>
      </div>
      <div className="pt-0">
        <div className="text-2xl font-bold text-card-foreground">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <p className="text-xs text-blue-600 mt-1 font-medium">{trend}</p>
        )}
      </div>
    </div>
  );
};

interface DashboardStatsGridProps {
  analytics: DashboardAnalytics;
  loading?: boolean;
}

export const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({
  analytics,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg p-4 h-24"></div>
          </div>
        ))}
      </div>
    );
  }

  // Calculate derived metrics
  const jobMatchRate =
    analytics.totalJobs > 0
      ? (analytics.jobsWithMatches / analytics.totalJobs) * 100
      : 0;

  const resumeMatchRate =
    analytics.totalResumes > 0
      ? (analytics.resumesWithMatches / analytics.totalResumes) * 100
      : 0;

  const systemEfficiency =
    analytics.totalJobs > 0 && analytics.totalResumes > 0
      ? (analytics.totalMatches /
          (analytics.totalJobs * analytics.totalResumes)) *
        100
      : 0;

  const avgMatchesPerJob =
    analytics.totalJobs > 0 ? analytics.totalMatches / analytics.totalJobs : 0;

  const cards = [
    {
      title: "Total Jobs",
      value: analytics.totalJobs,
      description: "Job descriptions created",
      trend: `${analytics.jobsWithMatches} with matches (${jobMatchRate.toFixed(
        1
      )}%)`,
      icon: (
        <svg
          className="h-4 w-4 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 8v10l4-2 4 2V8"
          />
        </svg>
      ),
    },
    {
      title: "Total Resumes",
      value: analytics.totalResumes,
      description: "Resumes uploaded",
      trend: `${
        analytics.resumesWithMatches
      } matched (${resumeMatchRate.toFixed(1)}%)`,
      icon: (
        <svg
          className="h-4 w-4 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "Total Matches",
      value: analytics.totalMatches,
      description: "Job-resume matches generated",
      trend: `${avgMatchesPerJob.toFixed(1)} matches per job`,
      icon: (
        <svg
          className="h-4 w-4 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Match Quality",
      value: `${analytics.averageMatchScore.toFixed(1)}%`,
      description: "Average match score",
      trend: `Best match: ${analytics.topMatchScore.toFixed(1)}%`,
      icon: (
        <svg
          className="h-4 w-4 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "System Efficiency",
      value: `${systemEfficiency.toFixed(2)}%`,
      description: "Overall matching efficiency",
      trend:
        systemEfficiency >= 2
          ? "Excellent"
          : systemEfficiency >= 1
          ? "Good"
          : "Needs improvement",
      icon: (
        <svg
          className="h-4 w-4 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      title: "Job Utilization",
      value: `${jobMatchRate.toFixed(1)}%`,
      description: "Jobs with matches",
      trend:
        jobMatchRate >= 70
          ? "Excellent"
          : jobMatchRate >= 50
          ? "Good"
          : "Needs improvement",
      icon: (
        <svg
          className="h-4 w-4 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Resume Utilization",
      value: `${resumeMatchRate.toFixed(1)}%`,
      description: "Resumes with matches",
      trend:
        resumeMatchRate >= 70
          ? "Excellent"
          : resumeMatchRate >= 50
          ? "Good"
          : "Needs improvement",
      icon: (
        <svg
          className="h-4 w-4 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
      ),
    },
    {
      title: "Recent Activity",
      value: analytics.recentActivity,
      description: "Last 7 days",
      trend:
        analytics.recentActivity >= 10
          ? "High activity"
          : analytics.recentActivity >= 5
          ? "Moderate activity"
          : "Low activity",
      icon: (
        <svg
          className="h-4 w-4 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <AnalyticsCard
          key={index}
          title={card.title}
          value={card.value}
          description={card.description}
          trend={card.trend}
          icon={card.icon}
        />
      ))}
    </div>
  );
};
