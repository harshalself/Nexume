/**
 * Debug Resume Upload Test
 */

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:8000/api/v1";

const testUser = {
  email: "test.resume@example.com",
  password: "TestPassword123!",
  first_name: "Test",
  last_name: "Resume",
};

async function debugResumeUpload() {
  try {
    console.log("1. Authenticating...");

    // Sign in
    const signinData = {
      email: testUser.email,
      password: testUser.password,
    };

    const response = await axios.post(`${BASE_URL}/auth/signin`, signinData);

    if (!response.data.accessToken) {
      throw new Error("No auth token received");
    }

    const authToken = response.data.accessToken;
    console.log("✅ Auth token received");

    console.log("2. Creating test file...");

    // Create a test PDF file
    const testContent = "This is a test PDF resume content";
    const testFilePath = path.join(__dirname, "test-resume.pdf");
    fs.writeFileSync(testFilePath, testContent);

    console.log("✅ Test file created");

    console.log("3. Uploading resume...");

    // Create form data
    const form = new FormData();
    form.append("resume", fs.createReadStream(testFilePath), {
      filename: "test-resume.pdf",
      contentType: "application/pdf",
    });
    form.append("name", "John Doe");
    form.append("email", "john.doe@example.com");

    try {
      const uploadResponse = await axios.post(`${BASE_URL}/resumes`, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("✅ Upload successful:", uploadResponse.data);
    } catch (uploadError) {
      console.log("❌ Upload failed");
      console.log("Status:", uploadError.response?.status);
      console.log(
        "Error message:",
        uploadError.response?.data?.message || uploadError.message
      );
      console.log("Full error data:", uploadError.response?.data);
    }

    // Clean up
    fs.unlinkSync(testFilePath);
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

debugResumeUpload();
