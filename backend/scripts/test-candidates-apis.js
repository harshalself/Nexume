/**
 * Candidates API Test Suite
 * Tests candidate management functionality
 */

const axios = require("axios");

const BASE_URL = "http://localhost:8000/api/v1";

// Test user credentials
const testUser = {
  email: "test.candidates@example.com",
  password: "TestPassword123!",
  first_name: "Test",
  last_name: "Candidates",
};

let authToken = null;
let testJobId = null;
let testResumeId = null;

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

// Test 2: Create Test Job
async function testCreateJob() {
  try {
    const jobData = {
      title: "Senior Full Stack Developer",
      company: "Test Tech Corp",
      description: `We are looking for an experienced Full Stack Developer to join our team.

Required Skills:
- JavaScript, TypeScript, Node.js
- React, Angular, Vue.js
- Python, Java
- MongoDB, PostgreSQL, MySQL
- AWS, Docker, Kubernetes
- Git, CI/CD, Agile methodologies

Qualifications:
- Bachelor's degree in Computer Science
- 5+ years of web development experience
- Strong problem-solving skills
- Experience with microservices architecture`,
      requirements: ["JavaScript", "React", "Node.js", "5+ years experience"],
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

// Test 3: Get All Candidates (Empty State)
async function testGetAllCandidates() {
  try {
    const response = await api.get("/candidates");

    if (response.status === 200) {
      const candidates = response.data.data || response.data.candidates || [];
      logResult(
        "Get All Candidates",
        true,
        `Found ${candidates.length} candidates`
      );
      return true;
    } else {
      logResult("Get All Candidates", false, `Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logResult(
      "Get All Candidates",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 4: Get Candidates with Filters
async function testGetCandidatesWithFilters() {
  try {
    const response = await api.get("/candidates?minScore=50&limit=10&offset=0");

    if (response.status === 200) {
      const candidates = response.data.data || response.data.candidates || [];
      logResult(
        "Get Candidates with Filters",
        true,
        `Found ${candidates.length} candidates (minScore: 50)`
      );
      return true;
    } else {
      logResult(
        "Get Candidates with Filters",
        false,
        `Status: ${response.status}`
      );
      return false;
    }
  } catch (error) {
    logResult(
      "Get Candidates with Filters",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 5: Get Candidates for Specific Job
async function testGetCandidatesForJob() {
  try {
    if (!testJobId) {
      logResult("Get Candidates for Job", false, "No test job ID available");
      return false;
    }

    const response = await api.get(`/candidates/job/${testJobId}?limit=5`);

    if (response.status === 200) {
      const candidates = response.data.data || response.data.candidates || [];
      logResult(
        "Get Candidates for Job",
        true,
        `Found ${candidates.length} candidates for job`
      );
      return true;
    } else {
      logResult("Get Candidates for Job", false, `Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logResult(
      "Get Candidates for Job",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 6: Get Top Candidates
async function testGetTopCandidates() {
  try {
    const response = await api.get("/candidates/top?limit=10");

    if (response.status === 200) {
      const candidates = response.data.data || response.data.candidates || [];
      logResult(
        "Get Top Candidates",
        true,
        `Found ${candidates.length} top candidates`
      );
      return true;
    } else {
      logResult("Get Top Candidates", false, `Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logResult(
      "Get Top Candidates",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 7: Get Candidate Details (Will test with non-existent ID)
async function testGetCandidateDetails() {
  try {
    // Test with a sample UUID format
    const testCandidateId = "00000000-0000-0000-0000-000000000000";
    const response = await api.get(`/candidates/${testCandidateId}`);

    if (response.status === 200) {
      logResult("Get Candidate Details", true, "Candidate details retrieved");
      return true;
    } else {
      logResult("Get Candidate Details", false, `Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    // 404 is expected for non-existent candidate
    if (error.response?.status === 404) {
      logResult(
        "Get Candidate Details",
        true,
        "Correctly handles non-existent candidate (404)"
      );
      return true;
    } else {
      logResult(
        "Get Candidate Details",
        false,
        error.response?.data?.message || error.message
      );
      return false;
    }
  }
}

// Test 8: Error Handling - Invalid Parameters
async function testErrorHandling() {
  try {
    // Test with invalid minScore
    const response = await api.get("/candidates?minScore=150");

    logResult("Error Handling", false, "Should have rejected invalid minScore");
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      logResult("Error Handling", true, "Correctly validates parameters (400)");
      return true;
    } else {
      logResult(
        "Error Handling",
        false,
        `Expected 400, got ${error.response?.status}`
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

    const response = await unauthorizedApi.get("/candidates");

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
async function runCandidatesTests() {
  console.log("🧪 Candidates API Test Suite");
  console.log("=".repeat(40));

  const tests = [
    { name: "Authentication", fn: testAuthentication },
    { name: "Create Test Job", fn: testCreateJob },
    { name: "Get All Candidates", fn: testGetAllCandidates },
    { name: "Get Candidates with Filters", fn: testGetCandidatesWithFilters },
    { name: "Get Candidates for Job", fn: testGetCandidatesForJob },
    { name: "Get Top Candidates", fn: testGetTopCandidates },
    { name: "Get Candidate Details", fn: testGetCandidateDetails },
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
  console.log(`📊 Candidates API Test Results:`);
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
  runCandidatesTests().catch((error) => {
    console.error("💥 Test suite crashed:", error);
    process.exit(1);
  });
}

module.exports = { runCandidatesTests };
