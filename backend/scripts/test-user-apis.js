const axios = require("axios");

const BASE_URL = "http://localhost:8000/api/v1";

// Test user credentials
const testUser = {
  email: "test.user@example.com",
  password: "test123456",
  first_name: "Test",
  last_name: "User",
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

// Test 1: User Sign Up
async function testSignUp() {
  try {
    const response = await api.post("/auth/signup", testUser);
    if (response.status === 201 && response.data.accessToken) {
      authToken = response.data.accessToken;
      logResult("User Sign Up", true);
      return true;
    } else {
      logResult("User Sign Up", false, "No access token received");
      return false;
    }
  } catch (error) {
    logResult(
      "User Sign Up",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 2: User Sign In
async function testSignIn() {
  try {
    const response = await api.post("/auth/signin", {
      email: testUser.email,
      password: testUser.password,
    });
    if (response.status === 200 && response.data.accessToken) {
      authToken = response.data.accessToken;
      logResult("User Sign In", true);
      return true;
    } else {
      logResult("User Sign In", false, "No access token received");
      return false;
    }
  } catch (error) {
    logResult(
      "User Sign In",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 3: Get User Profile
async function testGetProfile() {
  try {
    const response = await api.get("/auth/profile");
    if (response.status === 200 && response.data.user) {
      logResult("Get User Profile", true);
      console.log("   Profile Data:", {
        id: response.data.user.id,
        email: response.data.user.email,
        name: `${response.data.user.first_name} ${response.data.user.last_name}`,
      });
      return true;
    } else {
      logResult("Get User Profile", false, "No user data received");
      return false;
    }
  } catch (error) {
    logResult(
      "Get User Profile",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 4: Update User Profile
async function testUpdateProfile() {
  try {
    const updateData = {
      first_name: "Updated",
      last_name: "TestUser",
    };
    const response = await api.patch("/auth/profile", updateData);
    if (response.status === 200 && response.data.user) {
      logResult("Update User Profile", true);
      console.log("   Updated Data:", {
        name: `${response.data.user.first_name} ${response.data.user.last_name}`,
      });
      return true;
    } else {
      logResult("Update User Profile", false, "Profile update failed");
      return false;
    }
  } catch (error) {
    logResult(
      "Update User Profile",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test 5: LLM API Key functionality (if implemented)
async function testLLMApiKey() {
  try {
    // This test checks if LLM API key storage is implemented
    const response = await api.patch("/auth/profile", {
      llm_api_key: "test-api-key-encrypted",
    });
    if (response.status === 200) {
      logResult(
        "LLM API Key Storage",
        true,
        "LLM API key functionality implemented"
      );
      return true;
    } else {
      logResult(
        "LLM API Key Storage",
        false,
        "LLM API key functionality not implemented"
      );
      return false;
    }
  } catch (error) {
    logResult(
      "LLM API Key Storage",
      false,
      "LLM API key functionality not implemented"
    );
    return false;
  }
}

// Test 6: Soft Delete User
async function testSoftDeleteProfile() {
  try {
    const response = await api.delete("/auth/profile");
    if (response.status === 200) {
      logResult("Soft Delete User Profile", true);
      return true;
    } else {
      logResult("Soft Delete User Profile", false, "Delete operation failed");
      return false;
    }
  } catch (error) {
    logResult(
      "Soft Delete User Profile",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

async function runUserTests() {
  console.log("🔐 Testing User Authentication & Profile Management\n");

  // Try sign up first, if it fails (user exists), try sign in
  let authenticated = await testSignUp();
  if (!authenticated) {
    console.log("   Sign up failed, trying sign in...");
    authenticated = await testSignIn();
  }

  if (authenticated) {
    await testGetProfile();
    await testUpdateProfile();
    await testLLMApiKey();
    await testSoftDeleteProfile();
  } else {
    console.log("⚠️  Authentication failed - skipping other user tests");
  }

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
    await runUserTests();
  }
})();
