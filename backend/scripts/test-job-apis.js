const axios = require("axios");

const BASE_URL = "http://localhost:8000/api/v1";

// Test user credentials for authentication
const testUser = {
  email: "job.test@example.com",
  password: "test123456",
  first_name: "Job",
  last_name: "Tester",
};

let authToken = null;
let createdJobIds = [];

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

// Setup authentication
async function setupAuth() {
  try {
    // Try sign up first
    let response = await api.post("/auth/signup", testUser);
    if (response.status === 201 && response.data.accessToken) {
      authToken = response.data.accessToken;
      return true;
    }
  } catch (error) {
    // If signup fails, try signin
    try {
      const response = await api.post("/auth/signin", {
        email: testUser.email,
        password: testUser.password,
      });
      if (response.status === 200 && response.data.accessToken) {
        authToken = response.data.accessToken;
        return true;
      }
    } catch (signinError) {
      console.log("❌ Authentication failed");
      return false;
    }
  }
  return false;
}

// Test 1: Create Job Description
async function testCreateJobDescription() {
  try {
    const jobData = {
      title: "Senior Full Stack Developer",
      description:
        "We are looking for a senior full stack developer with expertise in React, Node.js, and PostgreSQL. Must have 5+ years of experience.",
      status: "active",
    };

    const response = await api.post("/job-descriptions", jobData);
    if (response.status === 201 && response.data.jobDescription) {
      createdJobIds.push(response.data.jobDescription.id);
      logResult("Create Job Description", true);
      console.log("   Created Job ID:", response.data.jobDescription.id);
      console.log("   Title:", response.data.jobDescription.title);
      return true;
    } else {
      logResult("Create Job Description", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logResult(
      "Create Job Description",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 2: Create Multiple Job Descriptions
async function testCreateMultipleJobs() {
  const jobs = [
    {
      title: "Frontend Developer",
      description: "React developer with 3+ years experience",
      status: "active",
    },
    {
      title: "Backend Developer",
      description: "Node.js developer with API design experience",
      status: "active",
    },
    {
      title: "DevOps Engineer",
      description: "AWS and Docker experience required",
      status: "inactive",
    },
  ];

  let successCount = 0;

  for (const job of jobs) {
    try {
      const response = await api.post("/job-descriptions", job);
      if (response.status === 201 && response.data.jobDescription) {
        createdJobIds.push(response.data.jobDescription.id);
        successCount++;
      }
    } catch (error) {
      // Continue with other jobs even if one fails
    }
  }

  logResult(
    "Create Multiple Job Descriptions",
    successCount === jobs.length,
    `${successCount}/${jobs.length} created`
  );
  return successCount > 0;
}

// Test 3: Get All Job Descriptions
async function testGetJobDescriptions() {
  try {
    const response = await api.get("/job-descriptions");
    if (
      response.status === 200 &&
      Array.isArray(response.data.jobDescriptions)
    ) {
      logResult("Get All Job Descriptions", true);
      console.log("   Total Jobs Found:", response.data.jobDescriptions.length);
      return true;
    } else {
      logResult(
        "Get All Job Descriptions",
        false,
        "Invalid response structure"
      );
      return false;
    }
  } catch (error) {
    logResult(
      "Get All Job Descriptions",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 4: Get Job Description by ID
async function testGetJobDescriptionById() {
  if (createdJobIds.length === 0) {
    logResult("Get Job Description by ID", false, "No job IDs available");
    return false;
  }

  try {
    const jobId = createdJobIds[0];
    const response = await api.get(`/job-descriptions/${jobId}`);
    if (response.status === 200 && response.data.jobDescription) {
      logResult("Get Job Description by ID", true);
      console.log("   Job Title:", response.data.jobDescription.title);
      return true;
    } else {
      logResult(
        "Get Job Description by ID",
        false,
        "Invalid response structure"
      );
      return false;
    }
  } catch (error) {
    logResult(
      "Get Job Description by ID",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 5: Update Job Description
async function testUpdateJobDescription() {
  if (createdJobIds.length === 0) {
    logResult("Update Job Description", false, "No job IDs available");
    return false;
  }

  try {
    const jobId = createdJobIds[0];
    const updateData = {
      title: "Updated Senior Full Stack Developer",
      description:
        "Updated job description with new requirements including TypeScript expertise.",
      status: "active",
    };

    const response = await api.put(`/job-descriptions/${jobId}`, updateData);
    if (response.status === 200 && response.data.jobDescription) {
      logResult("Update Job Description", true);
      console.log("   Updated Title:", response.data.jobDescription.title);
      return true;
    } else {
      logResult("Update Job Description", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logResult(
      "Update Job Description",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 6: Soft Delete Job Description
async function testSoftDeleteJobDescription() {
  if (createdJobIds.length === 0) {
    logResult("Soft Delete Job Description", false, "No job IDs available");
    return false;
  }

  try {
    const jobId = createdJobIds[createdJobIds.length - 1]; // Delete the last created job
    const response = await api.delete(`/job-descriptions/${jobId}`);
    if (response.status === 200) {
      logResult("Soft Delete Job Description", true);
      return true;
    } else {
      logResult(
        "Soft Delete Job Description",
        false,
        "Invalid response status"
      );
      return false;
    }
  } catch (error) {
    logResult(
      "Soft Delete Job Description",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 7: Verify Job is Soft Deleted (should not appear in list)
async function testVerifySoftDelete() {
  if (createdJobIds.length === 0) {
    logResult("Verify Soft Delete", false, "No job IDs available");
    return false;
  }

  try {
    const deletedJobId = createdJobIds[createdJobIds.length - 1];
    const response = await api.get(`/job-descriptions/${deletedJobId}`);

    // If we get a 404 or the job is marked as deleted, soft delete is working
    logResult(
      "Verify Soft Delete",
      false,
      "Job still accessible after soft delete"
    );
    return false;
  } catch (error) {
    if (error.response?.status === 404) {
      logResult(
        "Verify Soft Delete",
        true,
        "Job correctly hidden after soft delete"
      );
      return true;
    } else {
      logResult(
        "Verify Soft Delete",
        false,
        error.response?.data?.message || error.message
      );
      return false;
    }
  }
}

async function runJobDescriptionTests() {
  console.log("📋 Testing Job Description CRUD Operations\n");

  // Setup authentication
  if (!(await setupAuth())) {
    console.log("⚠️  Authentication failed - cannot run job description tests");
    return;
  }

  console.log("✅ Authentication successful\n");

  // Run tests
  await testCreateJobDescription();
  await testCreateMultipleJobs();
  await testGetJobDescriptions();
  await testGetJobDescriptionById();
  await testUpdateJobDescription();
  await testSoftDeleteJobDescription();
  await testVerifySoftDelete();

  console.log("\n📊 Job Description Test Summary:");
  console.log(
    `   Created ${createdJobIds.length} job descriptions for testing`
  );
  console.log("\n" + "=".repeat(50));
}

// Check if server is running
async function checkServer() {
  try {
    const response = await axios.get("http://localhost:8000");
    return response.status === 200;
  } catch (error) {
    console.log("❌ Server is not running. Please start the server first.");
    console.log("   Run: npm run dev");
    return false;
  }
}

// Run tests
(async () => {
  if (await checkServer()) {
    await runJobDescriptionTests();
  }
})();
