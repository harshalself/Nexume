const appConfig = {
  API_BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  appName: "Nexume",
  logo: "/nexume-logo.png",
  // Add more config as needed (e.g., API endpoints, feature flags)
};

export default appConfig;
