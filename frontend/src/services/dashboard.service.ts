// Placeholder service for dashboard data
export const getDashboardStats = async () => {
  // This function is no longer used - replaced by analytics API
  return Promise.resolve([]);
};

export const getDashboardQuickActions = async () => {
  // Replace with real API call later
  return Promise.resolve([
    {
      label: "Create Job Description",
      description: "Add a new job posting to find candidates",
    },
    {
      label: "Upload Resume",
      description: "Add candidate resumes to the system",
    },
    {
      label: "View Analytics",
      description: "Detailed insights and performance metrics",
    },
  ]);
};
