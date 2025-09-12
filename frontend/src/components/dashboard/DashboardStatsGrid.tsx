import React from "react";
import { DashboardAnalytics } from "../../services/analytics.service";
import {
  Briefcase,
  FileText,
  Target,
  TrendingUp,
  Award,
  Users,
  CheckCircle,
  Activity,
} from "lucide-react";

interface DashboardStatsGridProps {
  analytics: DashboardAnalytics;
  loading?: boolean;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-10 w-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({
  analytics,
  loading,
}) => {
  const stats = [
    {
      title: "Total Jobs",
      value: analytics.totalJobs,
      icon: <Briefcase className="h-5 w-5 text-blue-600" />,
      description: "Active job descriptions",
    },
    {
      title: "Total Resumes",
      value: analytics.totalResumes,
      icon: <FileText className="h-5 w-5 text-green-600" />,
      description: "Uploaded candidate resumes",
    },
    {
      title: "Total Matches",
      value: analytics.totalMatches,
      icon: <Target className="h-5 w-5 text-purple-600" />,
      description: "Generated matches",
    },
    {
      title: "Average Score",
      value: `${analytics.averageMatchScore}%`,
      icon: <TrendingUp className="h-5 w-5 text-orange-600" />,
      description: "Average match score",
    },
    {
      title: "Top Score",
      value: `${analytics.topMatchScore}%`,
      icon: <Award className="h-5 w-5 text-yellow-600" />,
      description: "Highest match score",
    },
    {
      title: "Jobs with Matches",
      value: analytics.jobsWithMatches,
      icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
      description: "Jobs that have candidates",
    },
    {
      title: "Matched Resumes",
      value: analytics.resumesWithMatches,
      icon: <Users className="h-5 w-5 text-indigo-600" />,
      description: "Resumes with job matches",
    },
    {
      title: "Recent Activity",
      value: analytics.recentActivity,
      icon: <Activity className="h-5 w-5 text-red-600" />,
      description: "New uploads (7 days)",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default DashboardStatsGrid;
