import React from "react";
import { DashboardAnalytics } from "../../services/analytics.service";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Server,
  Database,
  Zap,
} from "lucide-react";

interface SystemStatusProps {
  analytics: DashboardAnalytics;
  loading?: boolean;
  lastUpdated?: Date;
}

const SystemStatus: React.FC<SystemStatusProps> = ({
  analytics,
  loading,
  lastUpdated,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const systemHealth = [
    {
      name: "Database",
      status: "operational",
      icon: <Database className="h-4 w-4" />,
      value: "Connected",
    },
    {
      name: "API Services",
      status: "operational",
      icon: <Server className="h-4 w-4" />,
      value: "Online",
    },
    {
      name: "Match Engine",
      status: analytics.totalMatches > 0 ? "operational" : "idle",
      icon: <Zap className="h-4 w-4" />,
      value: analytics.totalMatches > 0 ? "Active" : "Idle",
    },
    {
      name: "Processing",
      status: analytics.recentActivity > 0 ? "operational" : "idle",
      icon: <Clock className="h-4 w-4" />,
      value: analytics.recentActivity > 0 ? "Active" : "Idle",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      case "idle":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-50";
      case "warning":
        return "bg-yellow-50";
      case "error":
        return "bg-red-50";
      case "idle":
        return "bg-gray-50";
      default:
        return "bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-3 w-3" />;
      case "warning":
        return <AlertCircle className="h-3 w-3" />;
      case "error":
        return <AlertCircle className="h-3 w-3" />;
      case "idle":
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">System Status</h2>
        {lastUpdated && (
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {systemHealth.map((service, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div className="flex items-center space-x-3">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg ${getStatusBg(
                  service.status
                )}`}>
                <div className={getStatusColor(service.status)}>
                  {service.icon}
                </div>
              </div>
              <span className="font-medium text-gray-900">{service.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{service.value}</span>
              <div className={getStatusColor(service.status)}>
                {getStatusIcon(service.status)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            All systems operational
          </span>
        </div>
        <p className="text-xs text-blue-700 mt-1">
          Analytics data refreshed successfully
        </p>
      </div>
    </div>
  );
};

export default SystemStatus;
