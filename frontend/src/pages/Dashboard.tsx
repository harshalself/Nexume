import React from "react";
import { useDashboard } from "../hooks/useDashboard";

const Dashboard = () => {
  const { stats, quickActions, loading, error } = useDashboard();

  if (loading)
    return <div className="p-8 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your resume matching system
          performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="card-hover border shadow-sm hover:shadow-lg transition-all duration-300 p-6 rounded-lg bg-white">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </div>
              {/* Icon */}
              <div className={`p-2 rounded-lg ${stat.bgColor} text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <div className="pt-2">
              <div className="text-3xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {stat.description}
              </p>
              <p className="text-sm text-blue-600 mt-2 font-medium">
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="border shadow-sm p-6 rounded-lg bg-white">
        <div className="pb-4 text-gray-900 font-bold text-xl">
          Quick Actions
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              className="w-full text-left p-4 rounded-lg border hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-200 transition-all duration-200 group">
              <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                {action.label}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {action.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
