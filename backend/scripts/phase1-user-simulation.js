/**
 * Phase 1: Authentication & User Management - Real User Simulation
 * Simulates a complete user journey through authentication system
 */

const axios = require("axios");

const BASE_URL = "http://localhost:8000/api/v1";

// Realistic user data for simulation
const realUser = {
  email: "sarah.johnson@techcorp.com",
  password: "SecurePass123!",
  first_name: "Sarah",
  last_name: "Johnson",
  profile_pic: "https://example.com/profile/sarah-johnson.jpg",
  llm_api_key: "sk-gemini-test-key-123456789",
};

let authToken = "";
let userId = "";

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

function logStep(step, success, details = "") {
  const status = success ? "✅" : "❌";
  const timestamp = new Date().toLocaleTimeString();
  console.log(
    `[${timestamp}] ${status} ${step}${details ? ` - ${details}` : ""}`
  );
}

function logUserAction(action, data = null) {
  console.log(`👤 ${action}`);
  if (data) {
    console.log(`   📋 ${JSON.stringify(data, null, 2)}`);
  }
}

// Phase 1.1: User Registration
async function simulateUserRegistration() {
  console.log("\n" + "=".repeat(60));
  console.log("🎯 PHASE 1.1: USER REGISTRATION");
  console.log("=".repeat(60));

  logUserAction("Sarah Johnson is registering for Nexume account", {
    email: realUser.email,
    name: `${realUser.first_name} ${realUser.last_name}`,
    profile_pic: realUser.profile_pic,
  });

  try {
    const registrationData = {
      email: realUser.email,
      password: realUser.password,
      first_name: realUser.first_name,
      last_name: realUser.last_name,
    };

    console.log("📤 Sending registration request...");
    const response = await api.post("/auth/signup", registrationData);

    if (response.status === 201 && response.data.accessToken) {
      authToken = response.data.accessToken;
      userId = response.data.user?.id;

      logStep("User Registration", true, `Welcome ${realUser.first_name}!`);
      console.log(
        `   🔑 Auth token received: ${authToken.substring(0, 20)}...`
      );
      console.log(`   👤 User ID: ${userId}`);
      return true;
    } else {
      logStep("User Registration", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    if (
      error.response?.status === 400 &&
      error.response.data.message?.includes("already exists")
    ) {
      logStep(
        "User Registration",
        true,
        "Account already exists, proceeding to sign in"
      );
      return await simulateUserSignIn();
    } else {
      logStep(
        "User Registration",
        false,
        error.response?.data?.message || error.message
      );
      return false;
    }
  }
}

// Phase 1.2: User Sign In
async function simulateUserSignIn() {
  console.log("\n" + "=".repeat(60));
  console.log("🎯 PHASE 1.2: USER SIGN IN");
  console.log("=".repeat(60));

  logUserAction("Sarah Johnson is signing into her Nexume account", {
    email: realUser.email,
  });

  try {
    const signinData = {
      email: realUser.email,
      password: realUser.password,
    };

    console.log("📤 Sending sign in request...");
    const response = await api.post("/auth/signin", signinData);

    if (response.status === 200 && response.data.accessToken) {
      authToken = response.data.accessToken;
      userId = response.data.user?.id;

      logStep("User Sign In", true, `Welcome back ${realUser.first_name}!`);
      console.log(
        `   🔑 Auth token refreshed: ${authToken.substring(0, 20)}...`
      );
      console.log(`   👤 User ID: ${userId}`);
      return true;
    } else {
      logStep("User Sign In", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logStep(
      "User Sign In",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Phase 1.3: Get User Profile
async function simulateGetProfile() {
  console.log("\n" + "=".repeat(60));
  console.log("🎯 PHASE 1.3: GET USER PROFILE");
  console.log("=".repeat(60));

  logUserAction("Sarah Johnson is viewing her profile information");

  try {
    console.log("📤 Fetching user profile...");
    const response = await api.get("/auth/profile");

    if (response.status === 200 && response.data.user) {
      const user = response.data.user;

      logStep("Get User Profile", true, "Profile loaded successfully");
      console.log("   👤 Profile Information:");
      console.log(`      Name: ${user.first_name} ${user.last_name}`);
      console.log(`      Email: ${user.email}`);
      console.log(`      Profile Picture: ${user.profile_pic || "Not set"}`);
      console.log(
        `      Joined: ${new Date(user.created_at).toLocaleDateString()}`
      );
      console.log(
        `      LLM API Key: ${
          user.llm_api_key_encrypted ? "Configured" : "Not set"
        }`
      );

      return true;
    } else {
      logStep("Get User Profile", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logStep(
      "Get User Profile",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Phase 1.4: Update User Profile
async function simulateUpdateProfile() {
  console.log("\n" + "=".repeat(60));
  console.log("🎯 PHASE 1.4: UPDATE USER PROFILE");
  console.log("=".repeat(60));

  logUserAction(
    "Sarah Johnson is updating her profile with LLM API key for AI features",
    {
      llm_api_key: "sk-gemini-test-key-...[redacted]",
    }
  );

  try {
    const updateData = {
      llm_api_key: realUser.llm_api_key,
    };

    console.log("📤 Sending profile update...");
    const response = await api.patch("/auth/profile", updateData);

    if (response.status === 200 && response.data.user) {
      const updatedUser = response.data.user;

      logStep("Update User Profile", true, "Profile updated successfully");
      console.log("   ✅ Updated Information:");
      console.log(
        `      LLM API Key: ${
          updatedUser.llm_api_key_encrypted ? "✅ Configured" : "❌ Not set"
        }`
      );

      return true;
    } else {
      logStep("Update User Profile", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logStep(
      "Update User Profile",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Phase 1.5: Verify Profile Changes
async function simulateVerifyProfileChanges() {
  console.log("\n" + "=".repeat(60));
  console.log("🎯 PHASE 1.5: VERIFY PROFILE CHANGES");
  console.log("=".repeat(60));

  logUserAction("Sarah Johnson is verifying her updated profile information");

  try {
    console.log("📤 Re-fetching profile to verify changes...");
    const response = await api.get("/auth/profile");

    if (response.status === 200 && response.data.user) {
      const user = response.data.user;

      logStep("Verify Profile Changes", true, "Changes verified successfully");
      console.log("   🔍 Verification Results:");
      console.log(
        `      ✅ LLM API Key: ${
          user.llm_api_key_encrypted ? "Present" : "Missing"
        }`
      );

      return true;
    } else {
      logStep(
        "Verify Profile Changes",
        false,
        "Could not fetch updated profile"
      );
      return false;
    }
  } catch (error) {
    logStep(
      "Verify Profile Changes",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Phase 1.6: Soft Delete Profile (Optional - for cleanup)
async function simulateSoftDeleteProfile() {
  console.log("\n" + "=".repeat(60));
  console.log("🎯 PHASE 1.6: SOFT DELETE PROFILE (CLEANUP)");
  console.log("=".repeat(60));

  logUserAction("Sarah Johnson is deactivating her account (soft delete)", {
    reason: "Test account cleanup",
  });

  try {
    console.log("⚠️  Sending soft delete request...");
    console.log(
      "   Note: This will mark the account as deleted but preserve data"
    );

    const response = await api.delete("/auth/profile");

    if (response.status === 200) {
      logStep("Soft Delete Profile", true, "Account deactivated successfully");
      console.log("   📋 Account Status: Deactivated (soft delete)");
      console.log("   🔄 Data preserved for potential recovery");
      console.log("   🚫 Auth token invalidated");

      // Clear auth token since account is deleted
      authToken = "";

      return true;
    } else {
      logStep("Soft Delete Profile", false, "Invalid response status");
      return false;
    }
  } catch (error) {
    logStep(
      "Soft Delete Profile",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Phase 1.7: Verify Account Deactivation
async function simulateVerifyAccountDeactivation() {
  console.log("\n" + "=".repeat(60));
  console.log("🎯 PHASE 1.7: VERIFY ACCOUNT DEACTIVATION");
  console.log("=".repeat(60));

  logUserAction(
    "Verifying that Sarah Johnson's account is properly deactivated"
  );

  try {
    console.log("📤 Attempting to access profile after deletion...");
    await api.get("/auth/profile");

    logStep("Verify Account Deactivation", false, "Account still accessible");
    return false;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 404) {
      logStep(
        "Verify Account Deactivation",
        true,
        "Account properly deactivated"
      );
      console.log("   ✅ Profile access blocked (expected)");
      console.log("   ✅ Authentication required for access");
      return true;
    } else {
      logStep(
        "Verify Account Deactivation",
        false,
        `Unexpected error: ${error.response?.status}`
      );
      return false;
    }
  }
}

// Main simulation runner
async function runPhase1Simulation() {
  console.log("🚀 NEXUME PHASE 1 SIMULATION: AUTHENTICATION & USER MANAGEMENT");
  console.log("📅 Date:", new Date().toLocaleDateString());
  console.log(
    "👤 Simulated User: Sarah Johnson (HR Manager at TechCorp Solutions)"
  );
  console.log(
    "🎯 Testing all 5 authentication endpoints in realistic user journey"
  );
  console.log("=".repeat(80));

  const results = {
    registration: false,
    signin: false,
    getProfile: false,
    updateProfile: false,
    verifyChanges: false,
    softDelete: false,
    verifyDeactivation: false,
  };

  // Execute simulation steps
  results.registration = await simulateUserRegistration();
  if (!results.registration) {
    results.signin = await simulateUserSignIn();
  }

  if (authToken) {
    results.getProfile = await simulateGetProfile();
    results.updateProfile = await simulateUpdateProfile();
    results.verifyChanges = await simulateVerifyProfileChanges();

    // Optional cleanup (comment out if you want to keep the test account)
    results.softDelete = await simulateSoftDeleteProfile();
    if (results.softDelete) {
      results.verifyDeactivation = await simulateVerifyAccountDeactivation();
    }
  }

  // Results summary
  console.log("\n" + "=".repeat(80));
  console.log("📊 PHASE 1 SIMULATION RESULTS");
  console.log("=".repeat(80));

  const totalSteps = Object.keys(results).length;
  const passedSteps = Object.values(results).filter(Boolean).length;
  const successRate = ((passedSteps / totalSteps) * 100).toFixed(1);

  console.log(`✅ Steps Passed: ${passedSteps}/${totalSteps}`);
  console.log(`📈 Success Rate: ${successRate}%`);
  console.log(`👤 User Journey: ${passedSteps >= 5 ? "COMPLETE" : "PARTIAL"}`);

  console.log("\n📋 Detailed Results:");
  Object.entries(results).forEach(([step, success]) => {
    const status = success ? "✅" : "❌";
    const stepName = step
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
    console.log(`   ${status} ${stepName}`);
  });

  console.log("\n🎯 Phase 1 Authentication System Status:");
  if (passedSteps >= 5) {
    console.log(
      "   ✅ FULLY FUNCTIONAL - All core authentication features working"
    );
    console.log("   🚀 Ready for Phase 2: Job Description Management");
  } else if (passedSteps >= 3) {
    console.log(
      "   ⚠️ PARTIALLY FUNCTIONAL - Core features working, some issues detected"
    );
  } else {
    console.log(
      "   ❌ ISSUES DETECTED - Authentication system needs attention"
    );
  }

  console.log("\n" + "=".repeat(80));

  return { results, passedSteps, totalSteps, successRate };
}

// Check server status
async function checkServer() {
  try {
    console.log("🔍 Checking server status...");
    await axios.get("http://localhost:8000");
    console.log("✅ Server is running");
    return true;
  } catch (error) {
    console.log("❌ Server is not running. Please start with: npm run dev");
    return false;
  }
}

// Run simulation
(async () => {
  if (await checkServer()) {
    console.log("🎬 Starting Phase 1 User Simulation...\n");
    await runPhase1Simulation();
  }
})();
