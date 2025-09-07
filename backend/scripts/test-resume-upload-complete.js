/**
 * Complete Resume Upload System Test
 * Tests full end-to-end resume upload with Supabase storage
 */

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:8000/api/v1";

// Test credentials
const testUser = {
  email: "test.resume@example.com",
  password: "TestPassword123!",
  first_name: "Test",
  last_name: "Resume",
};

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
};

let authToken = "";
let userId = "";
let testResumeId = "";

console.log(
  `${colors.cyan}🧪 Starting Complete Resume Upload System Test${colors.reset}\n`
);

// Helper function to create a test file
function createTestFile(filename, content, mimeType) {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, content);
  return {
    path: filePath,
    name: filename,
    type: mimeType,
  };
}

async function runTest(testName, testFn) {
  try {
    console.log(`${colors.blue}📋 ${testName}${colors.reset}`);
    await testFn();
    console.log(`${colors.green}✅ ${testName} - PASSED${colors.reset}\n`);
    return true;
  } catch (error) {
    console.log(`${colors.red}❌ ${testName} - FAILED${colors.reset}`);
    console.log(`${colors.red}   Error: ${error.message}${colors.reset}\n`);
    return false;
  }
}

// Test 1: User Authentication
async function testUserAuth() {
  // Try to sign up first (might fail if user exists)
  try {
    await axios.post(`${BASE_URL}/auth/signup`, testUser);
    console.log(`   👤 User created successfully`);
  } catch (error) {
    console.log(`   👤 User already exists, proceeding with sign in`);
  }

  // Sign in with just email and password
  const signinData = {
    email: testUser.email,
    password: testUser.password,
  };

  const response = await axios.post(`${BASE_URL}/auth/signin`, signinData);

  if (response.status !== 200) {
    throw new Error(`Expected status 200, got ${response.status}`);
  }

  if (!response.data.accessToken) {
    throw new Error("No auth token received");
  }

  authToken = response.data.accessToken;

  // Get user ID from profile
  const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  userId = profileResponse.data.user.id;
  console.log(`   🔑 Auth token received for user: ${userId}`);
}

// Test 2: Upload PDF Resume
async function testUploadPDFResume() {
  // Create a test PDF file (simple text file with PDF extension for testing)
  const testFile = createTestFile(
    "test-resume.pdf",
    "This is a test PDF resume content",
    "application/pdf"
  );

  const form = new FormData();
  form.append("resume", fs.createReadStream(testFile.path), {
    filename: testFile.name,
    contentType: testFile.type,
  });
  form.append("name", "John Doe");
  form.append("email", "john.doe@example.com");

  const response = await axios.post(`${BASE_URL}/resumes`, form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (response.status !== 201) {
    throw new Error(`Expected status 201, got ${response.status}`);
  }

  if (!response.data.resume || !response.data.resume.id) {
    throw new Error("No resume ID received");
  }

  testResumeId = response.data.resume.id;
  console.log(`   📄 PDF resume uploaded with ID: ${testResumeId}`);
  console.log(`   🔗 File URL: ${response.data.resume.file_url}`);

  // Clean up test file
  fs.unlinkSync(testFile.path);
}

// Test 3: Upload DOCX Resume
async function testUploadDOCXResume() {
  const testFile = createTestFile(
    "test-resume.docx",
    "This is a test DOCX resume content",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );

  const form = new FormData();
  form.append("resume", fs.createReadStream(testFile.path), {
    filename: testFile.name,
    contentType: testFile.type,
  });
  form.append("name", "Jane Smith");
  form.append("email", "jane.smith@example.com");

  const response = await axios.post(`${BASE_URL}/resumes`, form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (response.status !== 201) {
    throw new Error(`Expected status 201, got ${response.status}`);
  }

  console.log(`   📄 DOCX resume uploaded with ID: ${response.data.resume.id}`);
  console.log(`   🔗 File URL: ${response.data.resume.file_url}`);

  // Clean up test file
  fs.unlinkSync(testFile.path);
}

// Test 4: Test File Size Limit (should fail)
async function testFileSizeLimit() {
  // Create a file larger than 5MB
  const largeContent = "A".repeat(6 * 1024 * 1024); // 6MB
  const testFile = createTestFile(
    "large-resume.pdf",
    largeContent,
    "application/pdf"
  );

  const form = new FormData();
  form.append("resume", fs.createReadStream(testFile.path), {
    filename: testFile.name,
    contentType: testFile.type,
  });
  form.append("name", "Large File Test");
  form.append("email", "large@example.com");

  try {
    const response = await axios.post(`${BASE_URL}/resumes`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${authToken}`,
      },
    });

    // If we reach here, the test should fail
    fs.unlinkSync(testFile.path);
    throw new Error("Expected file size limit error, but upload succeeded");
  } catch (error) {
    fs.unlinkSync(testFile.path);
    if (
      error.response &&
      error.response.status === 400 &&
      error.response.data.message.includes("File size")
    ) {
      console.log(
        `   ✅ File size limit correctly enforced: ${error.response.data.message}`
      );
      return;
    }
    throw error;
  }
}

// Test 5: Test Invalid File Type (should fail)
async function testInvalidFileType() {
  const testFile = createTestFile(
    "test-file.txt",
    "This is a text file",
    "text/plain"
  );

  const form = new FormData();
  form.append("resume", fs.createReadStream(testFile.path), {
    filename: testFile.name,
    contentType: testFile.type,
  });
  form.append("name", "Invalid File Test");
  form.append("email", "invalid@example.com");

  try {
    const response = await axios.post(`${BASE_URL}/resumes`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${authToken}`,
      },
    });

    // If we reach here, the test should fail
    fs.unlinkSync(testFile.path);
    throw new Error(
      "Expected file type validation error, but upload succeeded"
    );
  } catch (error) {
    fs.unlinkSync(testFile.path);
    if (
      error.response &&
      error.response.status === 400 &&
      error.response.data.message.includes("Invalid file type")
    ) {
      console.log(
        `   ✅ File type validation correctly enforced: ${error.response.data.message}`
      );
      return;
    }
    throw error;
  }
}

// Test 6: Get All Resumes
async function testGetAllResumes() {
  const response = await axios.get(`${BASE_URL}/resumes`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (response.status !== 200) {
    throw new Error(`Expected status 200, got ${response.status}`);
  }

  if (!Array.isArray(response.data.resumes)) {
    throw new Error("Expected resumes array");
  }

  console.log(`   📋 Found ${response.data.resumes.length} resumes`);

  // Verify our test resume is in the list
  const testResume = response.data.resumes.find((r) => r.id === testResumeId);
  if (!testResume) {
    throw new Error("Test resume not found in list");
  }

  console.log(`   ✅ Test resume found in list: ${testResume.name}`);
}

// Test 7: Get Specific Resume
async function testGetSpecificResume() {
  const response = await axios.get(`${BASE_URL}/resumes/${testResumeId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (response.status !== 200) {
    throw new Error(`Expected status 200, got ${response.status}`);
  }

  if (response.data.resume.id !== testResumeId) {
    throw new Error("Wrong resume returned");
  }

  console.log(`   📄 Resume details retrieved: ${response.data.resume.name}`);
  console.log(`   📁 File URL: ${response.data.resume.file_url}`);
}

// Test 8: Update Resume Metadata
async function testUpdateResume() {
  const updateData = {
    name: "John Doe - Updated",
    email: "john.doe.updated@example.com",
  };

  const response = await axios.patch(
    `${BASE_URL}/resumes/${testResumeId}`,
    updateData,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(`Expected status 200, got ${response.status}`);
  }

  if (response.data.resume.name !== updateData.name) {
    throw new Error("Resume not updated correctly");
  }

  console.log(`   ✏️  Resume updated: ${response.data.resume.name}`);
}

// Test 9: Delete Resume
async function testDeleteResume() {
  const response = await axios.delete(`${BASE_URL}/resumes/${testResumeId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (response.status !== 200) {
    throw new Error(`Expected status 200, got ${response.status}`);
  }

  console.log(`   🗑️  Resume deleted successfully`);

  // Verify resume is no longer accessible
  try {
    await axios.get(`${BASE_URL}/resumes/${testResumeId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    throw new Error("Deleted resume is still accessible");
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log(`   ✅ Deleted resume correctly returns 404`);
    } else {
      throw error;
    }
  }
}

// Run all tests
async function runAllTests() {
  const tests = [
    { name: "User Authentication", fn: testUserAuth },
    { name: "Upload PDF Resume", fn: testUploadPDFResume },
    { name: "Upload DOCX Resume", fn: testUploadDOCXResume },
    { name: "Test File Size Limit", fn: testFileSizeLimit },
    { name: "Test Invalid File Type", fn: testInvalidFileType },
    { name: "Get All Resumes", fn: testGetAllResumes },
    { name: "Get Specific Resume", fn: testGetSpecificResume },
    { name: "Update Resume Metadata", fn: testUpdateResume },
    { name: "Delete Resume", fn: testDeleteResume },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const success = await runTest(test.name, test.fn);
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log(
    `${colors.cyan}📊 Complete Resume Upload System Test Results:${colors.reset}`
  );
  console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
  console.log(`${colors.yellow}📋 Total: ${passed + failed}${colors.reset}\n`);

  if (failed === 0) {
    console.log(
      `${colors.green}🎉 All tests passed! Resume upload system is fully functional.${colors.reset}`
    );
  } else {
    console.log(
      `${colors.red}⚠️  Some tests failed. Please check the issues above.${colors.reset}`
    );
  }
}

// Run the tests
runAllTests().catch((error) => {
  console.error(
    `${colors.red}💥 Test suite failed: ${error.message}${colors.reset}`
  );
  process.exit(1);
});
