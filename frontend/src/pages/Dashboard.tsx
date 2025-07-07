import React from "react";
import { useDashboard } from "../hooks/useDashboard";

const Dashboard = () => {
  const { stats, quickActions, loading, error } = useDashboard();

  if (loading)
    return <div className="p-8 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your AI chatbot performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="card-hover border-0 shadow-sm hover:shadow-lg transition-all duration-300 p-4 rounded-lg bg-white">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </div>
              {/* Replace with icon component if needed */}
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                {stat.icon}
              </div>
            </div>
            <div className="pt-0">
              <div className="text-2xl font-bold text-card-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <p className="text-xs text-success mt-1 font-medium">
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card-hover p-4 rounded-lg bg-white">
        <div className="pb-3 text-card-foreground font-bold text-lg">
          Quick Actions
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              className="w-full text-left p-3 rounded-lg border hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-200 transition-all duration-200 group">
              <div className="font-medium text-card-foreground group-hover:text-primary">
                {action.label}
              </div>
              <div className="text-sm text-muted-foreground">
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
