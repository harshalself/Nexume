/**
 * Analytics API Test Suite
 * Tests analytics dashboard functionality
 */

const axios = require("axios");

const BASE_URL = "http://localhost:8000/api/v1";

// Test user credentials
const testUser = {
  email: "test.analytics@example.com",
  password: "TestPassword123!",
  first_name: "Test",
  last_name: "Analytics",
};

let authToken = null;
let testJobId = null;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

function logResult(test, success, details = "") {
  const status = success ? "✅" : "❌";
  console.log(`${status} ${test}${details ? ` - ${details}` : ""}`);
}

// Test 1: User Authentication
async function testAuthentication() {
  try {
    // Try to sign up first
    try {
      const signupResponse = await api.post("/auth/signup", testUser);
      if (signupResponse.status === 201 && signupResponse.data.accessToken) {
        authToken = signupResponse.data.accessToken;
        logResult("User Sign Up", true);
        return true;
      }
    } catch (signupError) {
      // If signup fails, try sign in (user might already exist)
      if (signupError.response?.status === 400) {
        const signinResponse = await api.post("/auth/signin", {
          email: testUser.email,
          password: testUser.password,
        });
        if (signinResponse.status === 200 && signinResponse.data.accessToken) {
          authToken = signinResponse.data.accessToken;
          logResult("User Sign In", true, "Used existing account");
          return true;
        }
      }
      throw signupError;
    }
  } catch (error) {
    logResult(
      "User Authentication",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 2: Create Test Job for Analytics
async function testCreateJob() {
  try {
    const jobData = {
      title: "Analytics Test Job",
      company: "Analytics Corp",
      description: `Test job for analytics functionality.

Required Skills:
- Data Analysis
- SQL, Python
- Tableau, PowerBI
- Machine Learning
- Statistics

Qualifications:
- Data Science background
- 3+ years experience
- Strong analytical skills`,
      requirements: ["Python", "SQL", "Data Analysis"],
      location: "Remote",
    };

    const response = await api.post("/job-descriptions", jobData);
    if (response.status === 201 && response.data.jobDescription) {
      testJobId = response.data.jobDescription.id;
      logResult("Create Test Job", true, `Job ID: ${testJobId}`);
      return true;
    } else {
      logResult("Create Test Job", false, "No job ID received");
      return false;
    }
  } catch (error) {
    logResult(
      "Create Test Job",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 3: Dashboard Analytics
async function testDashboardAnalytics() {
  try {
    const response = await api.get("/analytics/dashboard");

    if (response.status === 200 && response.data.data) {
      const analytics = response.data.data;

      // Validate required fields
      const requiredFields = [
        "totalJobs",
        "totalResumes",
        "totalMatches",
        "averageMatchScore",
        "topMatchScore",
        "jobsWithMatches",
        "resumesWithMatches",
        "recentActivity",
      ];

      const missingFields = requiredFields.filter(
        (field) => analytics[field] === undefined && analytics[field] !== 0
      );

      if (missingFields.length === 0) {
        logResult(
          "Dashboard Analytics",
          true,
          `Jobs: ${analytics.totalJobs}, Resumes: ${analytics.totalResumes}, Matches: ${analytics.totalMatches}`
        );
        return true;
      } else {
        logResult(
          "Dashboard Analytics",
          false,
          `Missing fields: ${missingFields.join(", ")}`
        );
        return false;
      }
    } else {
      logResult("Dashboard Analytics", false, `Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logResult(
      "Dashboard Analytics",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 4: Job Analytics
async function testJobAnalytics() {
  try {
    const response = await api.get("/analytics/jobs");

    if (response.status === 200) {
      const jobAnalytics = response.data.data || [];

      if (Array.isArray(jobAnalytics)) {
        // Validate structure if jobs exist
        if (jobAnalytics.length > 0) {
          const firstJob = jobAnalytics[0];
          const requiredFields = [
            "id",
            "title",
            "created_at",
            "totalMatches",
            "averageMatchScore",
            "topMatchScore",
            "topCandidates",
          ];

          const missingFields = requiredFields.filter(
            (field) => firstJob[field] === undefined
          );

          if (missingFields.length === 0) {
            logResult(
              "Job Analytics",
              true,
              `Found ${jobAnalytics.length} job(s) with analytics`
            );
            return true;
          } else {
            logResult(
              "Job Analytics",
              false,
              `Missing fields: ${missingFields.join(", ")}`
            );
            return false;
          }
        } else {
          logResult("Job Analytics", true, "No jobs found (empty state)");
          return true;
        }
      } else {
        logResult("Job Analytics", false, "Response data is not an array");
        return false;
      }
    } else {
      logResult("Job Analytics", false, `Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logResult(
      "Job Analytics",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 5: Resume Analytics
async function testResumeAnalytics() {
  try {
    const response = await api.get("/analytics/resumes");

    if (response.status === 200 && response.data.data) {
      const resumeAnalytics = response.data.data;

      // Validate required fields
      const requiredFields = [
        "totalResumes",
        "resumesWithMatches",
        "averageProcessingTime",
        "processingSuccessRate",
        "recentUploads",
      ];

      const missingFields = requiredFields.filter(
        (field) =>
          resumeAnalytics[field] === undefined && resumeAnalytics[field] !== 0
      );

      if (missingFields.length === 0) {
        logResult(
          "Resume Analytics",
          true,
          `Total: ${resumeAnalytics.totalResumes}, With matches: ${resumeAnalytics.resumesWithMatches}`
        );
        return true;
      } else {
        logResult(
          "Resume Analytics",
          false,
          `Missing fields: ${missingFields.join(", ")}`
        );
        return false;
      }
    } else {
      logResult("Resume Analytics", false, `Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logResult(
      "Resume Analytics",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 6: Match Analytics
async function testMatchAnalytics() {
  try {
    const response = await api.get("/analytics/matches");

    if (response.status === 200 && response.data.data) {
      const matchAnalytics = response.data.data;

      // Validate required fields
      const requiredFields = [
        "totalMatches",
        "averageScore",
        "scoreDistribution",
        "matchTrends",
      ];

      const missingFields = requiredFields.filter(
        (field) =>
          matchAnalytics[field] === undefined && matchAnalytics[field] !== 0
      );

      if (missingFields.length === 0) {
        // Validate score distribution structure
        const scoreDistribution = matchAnalytics.scoreDistribution;
        if (
          scoreDistribution &&
          typeof scoreDistribution.high === "number" &&
          typeof scoreDistribution.medium === "number" &&
          typeof scoreDistribution.low === "number"
        ) {
          logResult(
            "Match Analytics",
            true,
            `Total: ${matchAnalytics.totalMatches}, Avg Score: ${matchAnalytics.averageScore}`
          );
          return true;
        } else {
          logResult(
            "Match Analytics",
            false,
            "Invalid score distribution structure"
          );
          return false;
        }
      } else {
        logResult(
          "Match Analytics",
          false,
          `Missing fields: ${missingFields.join(", ")}`
        );
        return false;
      }
    } else {
      logResult("Match Analytics", false, `Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logResult(
      "Match Analytics",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 7: Analytics Performance Test
async function testAnalyticsPerformance() {
  try {
    const startTime = Date.now();

    // Make concurrent requests to all analytics endpoints
    const promises = [
      api.get("/analytics/dashboard"),
      api.get("/analytics/jobs"),
      api.get("/analytics/resumes"),
      api.get("/analytics/matches"),
    ];

    const responses = await Promise.all(promises);
    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // All should be successful
    const allSuccessful = responses.every(
      (response) => response.status === 200
    );

    if (allSuccessful && totalTime < 5000) {
      // Should complete within 5 seconds
      logResult(
        "Analytics Performance",
        true,
        `All endpoints responded in ${totalTime}ms`
      );
      return true;
    } else if (!allSuccessful) {
      logResult("Analytics Performance", false, "Some endpoints failed");
      return false;
    } else {
      logResult("Analytics Performance", false, `Too slow: ${totalTime}ms`);
      return false;
    }
  } catch (error) {
    logResult(
      "Analytics Performance",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 8: Error Handling - Invalid Endpoints
async function testErrorHandling() {
  try {
    // Test invalid analytics endpoint
    const response = await api.get("/analytics/invalid");

    logResult(
      "Error Handling",
      false,
      "Should have returned 404 for invalid endpoint"
    );
    return false;
  } catch (error) {
    if (error.response?.status === 404) {
      logResult(
        "Error Handling",
        true,
        "Correctly handles invalid endpoints (404)"
      );
      return true;
    } else {
      logResult(
        "Error Handling",
        false,
        `Expected 404, got ${error.response?.status}`
      );
      return false;
    }
  }
}

// Test 9: Unauthorized Access
async function testUnauthorizedAccess() {
  try {
    // Create API instance without token
    const unauthorizedApi = axios.create({
      baseURL: BASE_URL,
      headers: { "Content-Type": "application/json" },
    });

    const response = await unauthorizedApi.get("/analytics/dashboard");

    logResult(
      "Unauthorized Access",
      false,
      "Should have rejected unauthorized request"
    );
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      logResult(
        "Unauthorized Access",
        true,
        "Correctly requires authentication (401)"
      );
      return true;
    } else {
      logResult(
        "Unauthorized Access",
        false,
        `Expected 401, got ${error.response?.status}`
      );
      return false;
    }
  }
}

// Clean up test data
async function cleanup() {
  try {
    if (testJobId) {
      await api.delete(`/job-descriptions/${testJobId}`);
      logResult("Cleanup", true, "Test job deleted");
    }
  } catch (error) {
    logResult("Cleanup", false, "Failed to cleanup test data");
  }
}

// Main test runner
async function runAnalyticsTests() {
  console.log("📊 Analytics API Test Suite");
  console.log("=".repeat(40));

  const tests = [
    { name: "Authentication", fn: testAuthentication },
    { name: "Create Test Job", fn: testCreateJob },
    { name: "Dashboard Analytics", fn: testDashboardAnalytics },
    { name: "Job Analytics", fn: testJobAnalytics },
    { name: "Resume Analytics", fn: testResumeAnalytics },
    { name: "Match Analytics", fn: testMatchAnalytics },
    { name: "Analytics Performance", fn: testAnalyticsPerformance },
    { name: "Error Handling", fn: testErrorHandling },
    { name: "Unauthorized Access", fn: testUnauthorizedAccess },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) passed++;
      else failed++;
    } catch (error) {
      console.error(`💥 Test "${test.name}" crashed:`, error.message);
      failed++;
    }
  }

  // Cleanup
  await cleanup();

  console.log("=".repeat(40));
  console.log(`📊 Analytics API Test Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(
    `📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`
  );
  console.log("=".repeat(40));

  return { passed, failed };
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAnalyticsTests().catch((error) => {
    console.error("💥 Test suite crashed:", error);
    process.exit(1);
  });
}

module.exports = { runAnalyticsTests };
