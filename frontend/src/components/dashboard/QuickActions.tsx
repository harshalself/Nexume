import React from "react";
import { Plus, Search, FileText, Target, Users, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Create Job",
      description: "Add a new job description",
      icon: <Plus className="h-5 w-5" />,
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () => navigate("/dashboard/job-descriptions"),
    },
    {
      title: "Upload Resume",
      description: "Add candidate resumes",
      icon: <FileText className="h-5 w-5" />,
      color: "bg-green-600 hover:bg-green-700",
      onClick: () => navigate("/dashboard/resumes"),
    },
    {
      title: "Run Matching",
      description: "Find candidate matches",
      icon: <Target className="h-5 w-5" />,
      color: "bg-purple-600 hover:bg-purple-700",
      onClick: () => navigate("/dashboard/matching"),
    },
    {
      title: "View Analytics",
      description: "Detailed performance metrics",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "bg-orange-600 hover:bg-orange-700",
      onClick: () => navigate("/dashboard/analytics"),
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} text-white p-4 rounded-lg transition-colors text-left group`}>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">{action.icon}</div>
              <div>
                <h3 className="font-medium">{action.title}</h3>
                <p className="text-sm text-white/80">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Search className="h-4 w-4" />
          <span>
            Tip: Use the search bar to quickly find jobs, candidates, or matches
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
