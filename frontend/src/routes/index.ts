import * as React from "react";
// Import all page components
const Home = React.lazy(() => import("../pages/home/Home"));
const Pricing = React.lazy(() => import("../pages/home/Pricing"));
const Docs = React.lazy(() => import("../pages/home/Docs"));
const AboutUs = React.lazy(() => import("../pages/home/AboutUs"));
const ContactUs = React.lazy(() => import("../pages/home/ContactUs"));
const SignIn = React.lazy(() => import("../pages/auth/SignIn"));
const SignUp = React.lazy(() => import("../pages/auth/SignUp"));
const ForgotPassword = React.lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = React.lazy(() => import("../pages/auth/ResetPassword"));
const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const JobDescriptions = React.lazy(
  () => import("../pages/dashboard/JobDescriptions")
);
const ResumeUpload = React.lazy(
  () => import("../pages/dashboard/ResumeUpload")
);
const Candidates = React.lazy(() => import("../pages/dashboard/Candidates"));
const Profile = React.lazy(() => import("../pages/dashboard/Profile"));
const Settings = React.lazy(() => import("../pages/dashboard/Settings"));

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
}

export const publicRoutes: RouteConfig[] = [
  { path: "/", element: Home },
  { path: "/pricing", element: Pricing },
  { path: "/docs", element: Docs },
  { path: "/about-us", element: AboutUs },
  { path: "/contact-us", element: ContactUs },
  { path: "/signin", element: SignIn },
  { path: "/signup", element: SignUp },
  { path: "/forgot-password", element: ForgotPassword },
  { path: "/reset-password", element: ResetPassword },
];

export const protectedRoutes: RouteConfig[] = [
  { path: "/dashboard", element: Dashboard },
  { path: "/dashboard/job-descriptions", element: JobDescriptions },
  { path: "/dashboard/resume-upload", element: ResumeUpload },
  { path: "/dashboard/candidates", element: Candidates },
  { path: "/dashboard/profile", element: Profile },
  { path: "/dashboard/settings", element: Settings },
];
