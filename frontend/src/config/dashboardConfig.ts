import { Home, FileText, Upload, Users, User, Settings } from "lucide-react";

export const dashboardNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  {
    name: "Job Descriptions",
    href: "/dashboard/job-descriptions",
    icon: FileText,
  },
  { name: "Resume Upload", href: "/dashboard/resume-upload", icon: Upload },
  { name: "Candidates", href: "/dashboard/candidates", icon: Users },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const dashboardBottomNavigation = [];

export const dashboardPathMap: Record<string, string> = {
  dashboard: "Dashboard",
  "job-descriptions": "Job Descriptions",
  "resume-upload": "Resume Upload",
  candidates: "Candidates",
  profile: "Profile",
  settings: "Settings",
};

export const dashboardUserMenuOptions = [
  { label: "Profile", to: "/dashboard/profile" },
  { label: "Settings", to: "/dashboard/settings" },
  { label: "Logout", to: "#logout" },
];

export const dashboardSearchPlaceholder = "Search...";

export const dashboardUser = {
  name: "User Name",
  avatarInitial: "U",
};

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  date: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const dashboardNotifications: NotificationItem[] = [];
