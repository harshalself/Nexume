const axios = require("axios");

const BASE_URL = "http://localhost:8000/api/v1";

// Store authentication data
let authData = {
  token: null,
  userId: null,
  testUser: {
    email: "test@example.com",
    password: "test123456",
    first_name: "Test",
    last_name: "User",
  },
};

// API testing utilities
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (authData.token) {
    config.headers.Authorization = `Bearer ${authData.token}`;
  }
  return config;
});

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  tests: [],
};

function logTest(name, passed, details = "") {
  testResults.tests.push({ name, passed, details });
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${name}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${name} - ${details}`);
  }
}

// Test functions
async function testUserSignUp() {
  try {
    const response = await api.post("/auth/signup", authData.testUser);
    if (
      response.status === 201 &&
      response.data.user &&
      response.data.accessToken
    ) {
      authData.token = response.data.accessToken;
      authData.userId = response.data.user.id;
      logTest("User Sign Up", true);
      return true;
    } else {
      logTest("User Sign Up", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logTest(
      "User Sign Up",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

async function testUserSignIn() {
  try {
    const response = await api.post("/auth/signin", {
      email: authData.testUser.email,
      password: authData.testUser.password,
    });
    if (
      response.status === 200 &&
      response.data.user &&
      response.data.accessToken
    ) {
      authData.token = response.data.accessToken;
      authData.userId = response.data.user.id;
      logTest("User Sign In", true);
      return true;
    } else {
      logTest("User Sign In", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logTest(
      "User Sign In",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

async function testGetProfile() {
  try {
    const response = await api.get("/auth/profile");
    if (response.status === 200 && response.data.user) {
      logTest("Get Profile", true);
      return true;
    } else {
      logTest("Get Profile", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logTest(
      "Get Profile",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

async function testUpdateProfile() {
  try {
    const response = await api.patch("/auth/profile", {
      first_name: "UpdatedTest",
      last_name: "UpdatedUser",
    });
    if (response.status === 200 && response.data.user) {
      logTest("Update Profile", true);
      return true;
    } else {
      logTest("Update Profile", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logTest(
      "Update Profile",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

async function testCreateJobDescription() {
  try {
    const response = await api.post("/job-descriptions", {
      title: "Senior Software Engineer",
      description:
        "We are looking for a senior software engineer with 5+ years of experience in Node.js and React.",
      status: "active",
    });
    if (response.status === 201 && response.data.jobDescription) {
      global.testJobId = response.data.jobDescription.id;
      logTest("Create Job Description", true);
      return true;
    } else {
      logTest("Create Job Description", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logTest(
      "Create Job Description",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

async function testGetJobDescriptions() {
  try {
    const response = await api.get("/job-descriptions");
    if (
      response.status === 200 &&
      Array.isArray(response.data.jobDescriptions)
    ) {
      logTest("Get Job Descriptions", true);
      return true;
    } else {
      logTest("Get Job Descriptions", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logTest(
      "Get Job Descriptions",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

async function testGetJobDescriptionById() {
  if (!global.testJobId) {
    logTest(
      "Get Job Description By ID",
      false,
      "No job ID available from create test"
    );
    return false;
  }

  try {
    const response = await api.get(`/job-descriptions/${global.testJobId}`);
    if (response.status === 200 && response.data.jobDescription) {
      logTest("Get Job Description By ID", true);
      return true;
    } else {
      logTest("Get Job Description By ID", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logTest(
      "Get Job Description By ID",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

async function testUpdateJobDescription() {
  if (!global.testJobId) {
    logTest(
      "Update Job Description",
      false,
      "No job ID available from create test"
    );
    return false;
  }

  try {
    const response = await api.put(`/job-descriptions/${global.testJobId}`, {
      title: "Updated Senior Software Engineer",
      description: "Updated description for senior software engineer position.",
    });
    if (response.status === 200 && response.data.jobDescription) {
      logTest("Update Job Description", true);
      return true;
    } else {
      logTest("Update Job Description", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logTest(
      "Update Job Description",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

async function testDeleteJobDescription() {
  if (!global.testJobId) {
    logTest(
      "Delete Job Description",
      false,
      "No job ID available from create test"
    );
    return false;
  }

  try {
    const response = await api.delete(`/job-descriptions/${global.testJobId}`);
    if (response.status === 200) {
      logTest("Delete Job Description (Soft Delete)", true);
      return true;
    } else {
      logTest(
        "Delete Job Description (Soft Delete)",
        false,
        "Invalid response status"
      );
      return false;
    }
  } catch (error) {
    logTest(
      "Delete Job Description (Soft Delete)",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

async function testDeleteProfile() {
  try {
    const response = await api.delete("/auth/profile");
    if (response.status === 200) {
      logTest("Delete Profile (Soft Delete)", true);
      return true;
    } else {
      logTest("Delete Profile (Soft Delete)", false, "Invalid response status");
      return false;
    }
  } catch (error) {
    logTest(
      "Delete Profile (Soft Delete)",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log("🚀 Starting API Tests...\n");

  // Test User Authentication
  console.log("📝 Testing User Authentication:");
  await testUserSignUp();

  // If signup fails, try signin with existing user
  if (!authData.token) {
    await testUserSignIn();
  }

  if (authData.token) {
    await testGetProfile();
    await testUpdateProfile();
  }

  console.log("\n📋 Testing Job Description CRUD:");
  if (authData.token) {
    await testCreateJobDescription();
    await testGetJobDescriptions();
    await testGetJobDescriptionById();
    await testUpdateJobDescription();
    await testDeleteJobDescription();
  } else {
    console.log("⚠️  Skipping Job Description tests - no authentication token");
  }

  console.log("\n🗑️  Testing Cleanup:");
  if (authData.token) {
    await testDeleteProfile();
  }

  // Print summary
  console.log("\n📊 Test Summary:");
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(
    `📈 Success Rate: ${(
      (testResults.passed / (testResults.passed + testResults.failed)) *
      100
    ).toFixed(1)}%\n`
  );

  // Print detailed results
  console.log("📋 Detailed Results:");
  testResults.tests.forEach((test) => {
    const status = test.passed ? "✅" : "❌";
    console.log(
      `${status} ${test.name}${test.details ? ` - ${test.details}` : ""}`
    );
  });
}

// Check if server is running
async function checkServer() {
  try {
    const response = await axios.get("http://localhost:8000");
    if (response.status === 200) {
      console.log("✅ Server is running\n");
      return true;
    }
  } catch (error) {
    console.log("❌ Server is not running. Please start the server first.");
    console.log("   Run: npm run dev\n");
    return false;
  }
}

// Run the tests
(async () => {
  if (await checkServer()) {
    await runTests();
  }
})();
