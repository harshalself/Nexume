const axios = require("axios");

// Configuration
const BASE_URL = "http://localhost:8000/api/v1";
const TEST_EMAIL = "test.user@example.com";
const TEST_PASSWORD = "test123456";

let authToken = "";

// Test Enhanced Matching Endpoints
const testEnhancedMatching = async () => {
  try {
    console.log("🧪 Testing Enhanced Matching System (Step 5)...\n");

    // 1. Login to get auth token
    console.log("1. Authenticating user...");
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/signin`, {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });

      console.log("Login response:", loginResponse.data);
      authToken = loginResponse.data.accessToken;
      console.log("✅ Authentication successful\n");
    } catch (loginError) {
      console.error("Login error details:", {
        status: loginError.response?.status,
        statusText: loginError.response?.statusText,
        data: loginError.response?.data,
        message: loginError.message,
      });
      return;
    }

    // 2. Test Enhanced Match Generation
    console.log("2. Testing enhanced match generation...");
    const generateResponse = await axios.post(
      `${BASE_URL}/matches/enhanced`,
      {
        jobDescriptionId: "1", // Using existing job ID
        useAi: true,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log(`Generate response status: ${generateResponse.status}`);
    console.log("✅ Enhanced match generation successful");
    console.log(
      `Generated ${generateResponse.data.data?.length || 0} matches\n`
    );

    // 3. Test Getting Enhanced Matches for Job
    console.log("3. Testing get enhanced matches for job...");
    const getMatchesResponse = await axios.get(
      `${BASE_URL}/matches/job/1/top`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log(`Get matches response status: ${getMatchesResponse.status}`);
    console.log("✅ Get enhanced matches successful");
    console.log(`Found ${getMatchesResponse.data.data?.length || 0} matches\n`);

    // 4. Test Get All Enhanced Matches
    console.log("4. Testing get all enhanced matches...");
    const getAllResponse = await axios.get(`${BASE_URL}/matches/`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    console.log(`Get all matches response status: ${getAllResponse.status}`);
    console.log("✅ Get all enhanced matches successful");
    console.log(`Total matches: ${getAllResponse.data.data?.length || 0}\n`);

    console.log("🎉 Enhanced matching tests completed!\n");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
  }
};

// Run the tests
testEnhancedMatching();
