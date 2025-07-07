import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getDashboardQuickActions,
} from "../services/dashboard.service";

export const useDashboard = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [quickActions, setQuickActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getDashboardStats(), getDashboardQuickActions()])
      .then(([statsData, actionsData]) => {
        setStats(statsData);
        setQuickActions(actionsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  return { stats, quickActions, loading, error };
};
