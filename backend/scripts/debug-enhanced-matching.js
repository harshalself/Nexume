/**
 * Debug Enhanced Matching - Check what's happening during AI analysis
 */

const axios = require("axios");

const BASE_URL = "http://localhost:8000/api/v1";

// Test user credentials
const testUser = {
  email: "sarah.johnson@techcorp.com",
  password: "SecurePass123!",
};

let authToken = "";

async function debugEnhancedMatching() {
  console.log("🔍 Debugging Enhanced Matching AI Integration...\n");

  try {
    // 1. Authenticate
    console.log("📋 Step 1: Authentication");
    const signinResponse = await axios.post(
      `${BASE_URL}/auth/signin`,
      testUser
    );
    authToken = signinResponse.data.accessToken;
    console.log("   ✅ Authenticated successfully");

    // 2. Get existing resumes
    console.log("\n📋 Step 2: Get Existing Resumes");
    const resumeResponse = await axios.get(`${BASE_URL}/resumes`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const resumes = resumeResponse.data.resumes.filter((r) => !r.is_deleted);
    console.log(`   📄 Found ${resumes.length} active resumes`);

    if (resumes.length === 0) {
      console.log("   ❌ No resumes available for testing");
      return;
    }

    // 3. Get existing jobs
    console.log("\n📋 Step 3: Get Existing Jobs");
    const jobResponse = await axios.get(`${BASE_URL}/job-descriptions`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const jobs = jobResponse.data.jobDescriptions;
    console.log(`   💼 Found ${jobs.length} job descriptions`);

    if (jobs.length === 0) {
      console.log("   ❌ No jobs available for testing");
      return;
    }

    // 4. Test enhanced matching
    console.log("\n📋 Step 4: Test Enhanced Matching");
    const resumeId = resumes[0].id;
    const jobId = jobs[0].id;

    console.log(`   📄 Using resume: ${resumes[0].name || "Unnamed"}`);
    console.log(`   💼 Using job: ${jobs[0].title}`);

    // Check resume data structure
    console.log("\n📋 Step 5: Check Resume Data Structure");
    const resumeData = JSON.parse(resumes[0].parsed_data || "{}");
    console.log("   📊 Resume parsed_data keys:", Object.keys(resumeData));
    console.log("   📝 Has text field:", !!resumeData.text);
    if (resumeData.text) {
      console.log("   📏 Text length:", resumeData.text.length, "characters");
      console.log(
        "   📄 Text preview:",
        resumeData.text.substring(0, 100) + "..."
      );
    }

    // Perform enhanced matching
    console.log("\n📋 Step 6: Perform Enhanced Matching");
    const matchResponse = await axios.post(
      `${BASE_URL}/matches/enhanced`,
      {
        resumeId,
        jobId,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    const match = matchResponse.data.match;
    console.log("   ✅ Match completed successfully");
    console.log(`   🎯 Match Score: ${match.match_score}%`);
    console.log(
      `   🤖 AI Enabled: ${match.match_details.ai_enabled ? "Yes" : "No"}`
    );
    console.log(
      `   ⏱️ Processing Time: ${match.match_details.processing_time}ms`
    );

    if (match.match_details.ai_enabled) {
      console.log("   🎉 AI Analysis is working!");
      console.log(
        "   💪 AI Strengths:",
        match.match_details.combined_insights.top_strengths
      );
    } else {
      console.log("   ⚠️ AI Analysis failed, using basic analysis only");
      console.log(
        "   🔧 This indicates an issue with the Gemini API integration"
      );
    }
  } catch (error) {
    console.log("❌ Debug failed!");
    console.log("🔧 Error:", error.response?.data?.message || error.message);

    if (error.response?.status === 401) {
      console.log("   💡 Authentication issue - check credentials");
    } else if (error.response?.status === 404) {
      console.log("   💡 Resource not found - check if server is running");
    } else if (
      error.response?.data?.message?.includes("Resume must be processed")
    ) {
      console.log(
        "   💡 Resume not processed - need to upload and process a resume first"
      );
    }
  }
}

// Run debug
debugEnhancedMatching();
