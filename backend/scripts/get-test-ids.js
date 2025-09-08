const axios = require("axios");

const BASE_URL = "http://localhost:8000/api/v1";
const TEST_EMAIL = "test.user@example.com";
const TEST_PASSWORD = "test123456";

(async () => {
  try {
    // Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/signin`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    const authToken = loginResponse.data.accessToken;

    // Get jobs
    try {
      const jobsResponse = await axios.get(`${BASE_URL}/job-descriptions`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log("Jobs Response:", JSON.stringify(jobsResponse.data, null, 2));
      const jobsArray =
        jobsResponse.data?.data || jobsResponse.data?.jobs || jobsResponse.data;
      console.log(
        "Available jobs:",
        Array.isArray(jobsArray) ? jobsArray.length : 0
      );
      if (Array.isArray(jobsArray) && jobsArray.length > 0) {
        console.log("First job ID:", jobsArray[0].id);
      }
    } catch (error) {
      console.log(
        "Jobs endpoint error:",
        error.response?.status,
        error.message
      );
    }

    // Get resumes
    try {
      const resumesResponse = await axios.get(`${BASE_URL}/resumes`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log(
        "Resumes Response:",
        JSON.stringify(resumesResponse.data, null, 2)
      );
      const resumesArray =
        resumesResponse.data?.data ||
        resumesResponse.data?.resumes ||
        resumesResponse.data;
      console.log(
        "Available resumes:",
        Array.isArray(resumesArray) ? resumesArray.length : 0
      );
      if (Array.isArray(resumesArray) && resumesArray.length > 0) {
        console.log("First resume ID:", resumesArray[0].id);
      }
    } catch (error) {
      console.log(
        "Resumes endpoint error:",
        error.response?.status,
        error.message
      );
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
})();
