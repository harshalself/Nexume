// Placeholder service for dashboard data
export const getDashboardStats = async () => {
  // Replace with real API call later
  return Promise.resolve([
    {
      title: "Active Chatbots",
      value: "12",
      description: "Currently deployed",
      icon: "Bot",
      trend: "+2 this month",
      color: "text-primary",
      bgColor: "bg-muted",
    },
    // ...add more mock stats as needed
  ]);
};

export const getDashboardQuickActions = async () => {
  // Replace with real API call later
  return Promise.resolve([
    {
      label: "Create New Chatbot",
      description: "Start building a new AI assistant",
    },
    // ...add more mock actions as needed
  ]);
};
