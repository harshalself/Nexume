const axios = require("axios");

const BASE_URL = "http://localhost:8000/api/v1";

// Test user credentials
const testUser = {
  email: "gemini.test@example.com",
  password: "test123456",
  first_name: "Gemini",
  last_name: "Tester",
};

let authToken = null;

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
    let response = await api.post("/auth/signup", testUser);
    if (response.status === 201 && response.data.accessToken) {
      authToken = response.data.accessToken;
      return true;
    }
  } catch (error) {
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

// Test Gemini API integration
async function testGeminiIntegration() {
  try {
    // This endpoint doesn't exist yet, but we'll create it next
    const response = await api.get("/test/gemini");
    if (response.status === 200 && response.data.success) {
      logResult("Gemini API Integration", true, "API responding correctly");
      console.log("   Response:", response.data.response);
      return true;
    } else {
      logResult("Gemini API Integration", false, "Invalid response");
      return false;
    }
  } catch (error) {
    if (error.response?.status === 404) {
      logResult(
        "Gemini API Integration",
        false,
        "Test endpoint not implemented yet"
      );
    } else {
      logResult(
        "Gemini API Integration",
        false,
        error.response?.data?.message || error.message
      );
    }
    return false;
  }
}

async function runGeminiTests() {
  console.log("🤖 Testing Gemini AI Integration\n");

  // Setup authentication
  if (!(await setupAuth())) {
    console.log("⚠️  Authentication failed - cannot run Gemini tests");
    return;
  }

  console.log("✅ Authentication successful\n");

  // Test Gemini integration
  await testGeminiIntegration();

  console.log("\n🎯 Next: Implement test endpoint in backend");
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
    await runGeminiTests();
  }
})();
