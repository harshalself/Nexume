/**
 * Quick test to debug authentication issue
 */

const axios = require("axios");

const BASE_URL = "http://localhost:8000/api/v1";

const testUser = {
  email: "test.user@example.com",
  password: "TestPassword123!",
};

async function debugAuth() {
  console.log("Testing authentication...");

  try {
    // Try to sign up first
    console.log("1. Trying sign up...");
    const signupResponse = await axios.post(
      `${BASE_URL}/auth/signup`,
      testUser
    );
    console.log("Signup successful:", signupResponse.data);
  } catch (signupError) {
    console.log(
      "Signup failed (user may already exist):",
      signupError.response?.data || signupError.message
    );
  }

  try {
    // Try to sign in
    console.log("2. Trying sign in...");
    const signinResponse = await axios.post(
      `${BASE_URL}/auth/signin`,
      testUser
    );
    console.log("Signin successful:", signinResponse.data);

    if (signinResponse.data.data && signinResponse.data.data.token) {
      console.log(
        "✅ Auth token received:",
        signinResponse.data.data.token.substring(0, 20) + "..."
      );
    } else {
      console.log("❌ No token in response structure");
    }
  } catch (signinError) {
    console.log(
      "Signin failed:",
      signinError.response?.data || signinError.message
    );
    console.log("Response status:", signinError.response?.status);
  }
}

debugAuth();
