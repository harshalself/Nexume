import React from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  FileText,
  Users,
  BarChart3,
  Zap,
  Target,
  TrendingUp,
  Settings,
} from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color?: string;
}

interface QuickActionsProps {
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  className = "",
}) => {
  const quickActions: QuickAction[] = [
    {
      id: "create-job",
      label: "Create Job Description",
      description: "Add a new job posting for candidate matching",
      icon: <Plus className="h-5 w-5" />,
      href: "/dashboard/job-descriptions",
      color: "from-blue-50 to-blue-100 border-blue-200",
    },
    {
      id: "upload-resume",
      label: "Upload Resumes",
      description: "Add candidate resumes for processing",
      icon: <FileText className="h-5 w-5" />,
      href: "/dashboard/resumes",
      color: "from-green-50 to-green-100 border-green-200",
    },
    {
      id: "view-candidates",
      label: "View Candidates",
      description: "Browse and manage candidate profiles",
      icon: <Users className="h-5 w-5" />,
      href: "/dashboard/candidates",
      color: "from-purple-50 to-purple-100 border-purple-200",
    },
    {
      id: "run-matching",
      label: "Run Matching",
      description: "Execute AI-powered job-candidate matching",
      icon: <Zap className="h-5 w-5" />,
      href: "/dashboard/matching",
      color: "from-yellow-50 to-yellow-100 border-yellow-200",
    },
    {
      id: "view-matches",
      label: "View Matches",
      description: "Review matching results and scores",
      icon: <Target className="h-5 w-5" />,
      href: "/dashboard/matches",
      color: "from-red-50 to-red-100 border-red-200",
    },
    {
      id: "analytics",
      label: "Detailed Analytics",
      description: "View comprehensive performance insights",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/dashboard/analytics",
      color: "from-indigo-50 to-indigo-100 border-indigo-200",
    },
  ];

  return (
    <div className={`card-hover p-6 rounded-lg bg-white ${className}`}>
      <div className="flex items-center justify-between pb-4">
        <div>
          <h2 className="text-xl font-bold text-card-foreground">
            Quick Actions
          </h2>
          <p className="text-sm text-muted-foreground">
            Common tasks and shortcuts to get you started
          </p>
        </div>
        <TrendingUp className="h-5 w-5 text-blue-600" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.id}
            to={action.href}
            className={`group p-4 rounded-lg border transition-all duration-200 hover:shadow-md hover:bg-gradient-to-r ${
              action.color ||
              "hover:from-gray-50 hover:to-gray-100 hover:border-gray-200"
            }`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow">
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                  {action.label}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {action.description}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Need help getting started?
          </span>
          <Link
            to="/help"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
            <Settings className="h-4 w-4" />
            <span>View Documentation</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
