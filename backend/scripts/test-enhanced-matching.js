const axios = require("axios");

// Configuration
const BASE_URL = "http://localhost:8000/api/v1";
const TEST_EMAIL = "test.processing@example.com"; // Use same user as resume processing
const TEST_PASSWORD = "TestPassword123!";

let authToken = "";
let testJobId = "";
let testResumeId = "";

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

    // 2. Get available job and resume IDs
    console.log("2. Getting available test data...");
    try {
      // Get jobs
      const jobsResponse = await axios.get(`${BASE_URL}/job-descriptions`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const jobs = jobsResponse.data?.jobDescriptions || [];

      // Get resumes
      const resumesResponse = await axios.get(`${BASE_URL}/resumes`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const resumes = resumesResponse.data?.resumes || [];

      if (jobs.length === 0 || resumes.length === 0) {
        console.log("⚠️  No test data available. Creating test data first...");

        // Create a test job
        const jobResponse = await axios.post(
          `${BASE_URL}/job-descriptions`,
          {
            title: "Enhanced Matching Test Job",
            description:
              "Looking for a skilled developer with experience in JavaScript, React, Node.js, and API development. Must have experience with testing frameworks and backend development.",
          },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        testJobId = jobResponse.data.jobDescription.id;
        console.log(`✅ Created test job with ID: ${testJobId}`);

        // For resume, we'll use one from the resume processing test
        const resumesResponse2 = await axios.get(`${BASE_URL}/resumes`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const availableResumes = resumesResponse2.data?.resumes || [];

        if (availableResumes.length > 0) {
          // Find a processed resume (one with extracted_text)
          const processedResume = availableResumes.find(
            (resume) =>
              resume.extracted_text && resume.extracted_text.length > 0
          );
          if (processedResume) {
            testResumeId = processedResume.id;
            console.log(`✅ Using processed resume with ID: ${testResumeId}`);
          } else {
            testResumeId = availableResumes[0].id;
            console.log(`✅ Using existing resume with ID: ${testResumeId}`);
          }
        } else {
          console.log("❌ No resumes available for testing");
          return;
        }
      } else {
        testJobId = jobs[0].id;
        // Find a processed resume from available resumes
        const processedResume = resumes.find(
          (resume) => resume.extracted_text && resume.extracted_text.length > 0
        );
        if (processedResume) {
          testResumeId = processedResume.id;
          console.log(
            `✅ Using job ID: ${testJobId} and processed resume ID: ${testResumeId}`
          );
        } else {
          testResumeId = resumes[0].id;
          console.log(
            `✅ Using job ID: ${testJobId} and resume ID: ${testResumeId} (may need processing)`
          );
        }
      }
    } catch (error) {
      console.error("❌ Error getting test data:", error.message);
      return;
    }

    // 3. Test Enhanced Match Generation
    console.log("\n3. Testing enhanced match generation...");
    try {
      const generateResponse = await axios.post(
        `${BASE_URL}/matches/enhanced`,
        {
          resumeId: testResumeId,
          jobId: testJobId,
          useAi: true,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log(`✅ Enhanced match generation successful`);
      console.log(`Generate response status: ${generateResponse.status}`);
      console.log(`Match data:`, generateResponse.data);
    } catch (error) {
      console.error(
        "❌ Enhanced match generation failed:",
        error.response?.data || error.message
      );
    }

    // 4. Test Getting Enhanced Matches for Job
    console.log("\n4. Testing get enhanced matches for job...");
    try {
      const getMatchesResponse = await axios.get(
        `${BASE_URL}/matches/job/${testJobId}/top`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log(`✅ Get enhanced matches successful`);
      console.log(`Get matches response status: ${getMatchesResponse.status}`);
      console.log(`Found ${getMatchesResponse.data.data?.length || 0} matches`);
    } catch (error) {
      console.error(
        "❌ Get enhanced matches failed:",
        error.response?.data || error.message
      );
    }

    // 5. Test Get All Enhanced Matches
    console.log("\n5. Testing get all enhanced matches...");
    try {
      const getAllResponse = await axios.get(`${BASE_URL}/matches/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(`✅ Get all enhanced matches successful`);
      console.log(`Get all matches response status: ${getAllResponse.status}`);
      console.log(`Total matches: ${getAllResponse.data.data?.length || 0}`);
    } catch (error) {
      console.error(
        "❌ Get all enhanced matches failed:",
        error.response?.data || error.message
      );
    }

    console.log("\n🎉 Enhanced matching tests completed!\n");
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
