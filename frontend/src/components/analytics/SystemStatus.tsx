import React from "react";
import { DashboardAnalytics } from "../../services/analytics.service";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface SystemStatusProps {
  analytics: DashboardAnalytics;
  loading?: boolean;
  lastUpdated?: Date | null;
  className?: string;
}

interface StatusIndicator {
  label: string;
  status: "excellent" | "good" | "warning" | "error";
  value: string;
  description: string;
  trend?: "up" | "down" | "stable";
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  analytics,
  loading = false,
  lastUpdated,
  className = "",
}) => {
  if (loading) {
    return (
      <div className={`card-hover p-6 rounded-lg bg-white ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate system health indicators
  const indicators: StatusIndicator[] = [
    {
      label: "Match Quality",
      status:
        analytics.averageMatchScore >= 70
          ? "excellent"
          : analytics.averageMatchScore >= 50
          ? "good"
          : analytics.averageMatchScore >= 30
          ? "warning"
          : "error",
      value: `${analytics.averageMatchScore.toFixed(1)}%`,
      description:
        analytics.averageMatchScore >= 70
          ? "Excellent matching quality"
          : analytics.averageMatchScore >= 50
          ? "Good matching quality"
          : analytics.averageMatchScore >= 30
          ? "Average matching quality"
          : "Poor matching quality",
      trend:
        analytics.averageMatchScore >= analytics.topMatchScore * 0.6
          ? "up"
          : "down",
    },
    {
      label: "System Utilization",
      status: (() => {
        const utilization =
          analytics.totalJobs > 0 && analytics.totalResumes > 0
            ? ((analytics.jobsWithMatches / analytics.totalJobs +
                analytics.resumesWithMatches / analytics.totalResumes) /
                2) *
              100
            : 0;
        return utilization >= 70
          ? "excellent"
          : utilization >= 50
          ? "good"
          : utilization >= 30
          ? "warning"
          : "error";
      })(),
      value: (() => {
        const utilization =
          analytics.totalJobs > 0 && analytics.totalResumes > 0
            ? ((analytics.jobsWithMatches / analytics.totalJobs +
                analytics.resumesWithMatches / analytics.totalResumes) /
                2) *
              100
            : 0;
        return `${utilization.toFixed(1)}%`;
      })(),
      description: (() => {
        const utilization =
          analytics.totalJobs > 0 && analytics.totalResumes > 0
            ? ((analytics.jobsWithMatches / analytics.totalJobs +
                analytics.resumesWithMatches / analytics.totalResumes) /
                2) *
              100
            : 0;
        return utilization >= 70
          ? "High system utilization"
          : utilization >= 50
          ? "Good system utilization"
          : utilization >= 30
          ? "Moderate system utilization"
          : "Low system utilization";
      })(),
      trend: "stable",
    },
    {
      label: "Recent Activity",
      status:
        analytics.recentActivity >= 20
          ? "excellent"
          : analytics.recentActivity >= 10
          ? "good"
          : analytics.recentActivity >= 5
          ? "warning"
          : "error",
      value: `${analytics.recentActivity} actions`,
      description:
        analytics.recentActivity >= 20
          ? "High user engagement"
          : analytics.recentActivity >= 10
          ? "Good user engagement"
          : analytics.recentActivity >= 5
          ? "Moderate user engagement"
          : "Low user engagement",
      trend:
        analytics.recentActivity >= 10
          ? "up"
          : analytics.recentActivity >= 5
          ? "stable"
          : "down",
    },
    {
      label: "Matching Efficiency",
      status: (() => {
        const efficiency =
          analytics.totalJobs > 0 && analytics.totalResumes > 0
            ? (analytics.totalMatches /
                (analytics.totalJobs * analytics.totalResumes)) *
              100
            : 0;
        return efficiency >= 2
          ? "excellent"
          : efficiency >= 1
          ? "good"
          : efficiency >= 0.5
          ? "warning"
          : "error";
      })(),
      value: (() => {
        const efficiency =
          analytics.totalJobs > 0 && analytics.totalResumes > 0
            ? (analytics.totalMatches /
                (analytics.totalJobs * analytics.totalResumes)) *
              100
            : 0;
        return `${efficiency.toFixed(2)}%`;
      })(),
      description: (() => {
        const efficiency =
          analytics.totalJobs > 0 && analytics.totalResumes > 0
            ? (analytics.totalMatches /
                (analytics.totalJobs * analytics.totalResumes)) *
              100
            : 0;
        return efficiency >= 2
          ? "Excellent matching efficiency"
          : efficiency >= 1
          ? "Good matching efficiency"
          : efficiency >= 0.5
          ? "Average matching efficiency"
          : "Low matching efficiency";
      })(),
      trend: "stable",
    },
  ];

  const getStatusIcon = (status: StatusIndicator["status"]) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "good":
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTrendIcon = (trend: StatusIndicator["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "stable":
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: StatusIndicator["status"]) => {
    switch (status) {
      case "excellent":
        return "text-green-700 bg-green-50 border-green-200";
      case "good":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "warning":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "error":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  // Overall system health
  const excellentCount = indicators.filter(
    (i) => i.status === "excellent"
  ).length;
  const goodCount = indicators.filter((i) => i.status === "good").length;
  const warningCount = indicators.filter((i) => i.status === "warning").length;
  const errorCount = indicators.filter((i) => i.status === "error").length;

  const overallStatus =
    excellentCount >= 3
      ? "excellent"
      : excellentCount + goodCount >= 3
      ? "good"
      : warningCount >= 2
      ? "warning"
      : "error";

  const overallStatusText =
    overallStatus === "excellent"
      ? "System Optimal"
      : overallStatus === "good"
      ? "System Healthy"
      : overallStatus === "warning"
      ? "Needs Attention"
      : "Critical Issues";

  return (
    <div className={`card-hover p-6 rounded-lg bg-white ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-card-foreground">
            System Status
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time health monitoring and performance indicators
          </p>
        </div>
        <div
          className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(
            overallStatus
          )}`}>
          {getStatusIcon(overallStatus)}
          <span className="text-sm font-medium">{overallStatusText}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {indicators.map((indicator, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
            <div className="flex items-center space-x-3">
              {getStatusIcon(indicator.status)}
              <div>
                <div className="font-medium text-card-foreground">
                  {indicator.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {indicator.description}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-card-foreground">
                {indicator.value}
              </div>
              <div className="flex items-center justify-end mt-1">
                {getTrendIcon(indicator.trend)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Last updated:{" "}
            {lastUpdated ? lastUpdated.toLocaleTimeString() : "Never"}
          </span>
          <div className="flex items-center space-x-4">
            <span className="text-green-600">
              ● {excellentCount + goodCount} Healthy
            </span>
            {warningCount > 0 && (
              <span className="text-yellow-600">● {warningCount} Warning</span>
            )}
            {errorCount > 0 && (
              <span className="text-red-600">● {errorCount} Error</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
