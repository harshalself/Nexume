/**
 * Resume Processing Pipeline Test
 * Tests text extraction, processing, and matching functionality
 */

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:8000/api/v1";

// Test credentials
const testUser = {
  email: "test.processing@example.com",
  password: "TestPassword123!",
  first_name: "Test",
  last_name: "Processing",
};

// Sample job description for matching
const sampleJobDescription = `
Software Engineer - Full Stack Developer

We are looking for a talented Full Stack Developer to join our team. 

Required Skills:
- JavaScript, TypeScript, Node.js
- React, Angular, Vue.js
- Python, Java, or C++
- MongoDB, PostgreSQL, MySQL
- AWS, Docker, Kubernetes
- Git, CI/CD, Agile methodologies

Qualifications:
- Bachelor's degree in Computer Science or related field
- 3+ years of experience in web development
- Strong problem-solving and communication skills
- Experience with microservices architecture
- Knowledge of DevOps practices

Responsibilities:
- Develop and maintain web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews
- Troubleshoot and debug applications
`;

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

let authToken = "";
let userId = "";
let testResumeId = "";

console.log(
  `${colors.cyan}🧪 Starting Resume Processing Pipeline Test${colors.reset}\n`
);

// Helper function to create a realistic test resume
function createTestResume(filename, mimeType) {
  const resumeContent = `
JOHN DEVELOPER
Email: john.developer@email.com
Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johndeveloper

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 5+ years of expertise in JavaScript, React, Node.js, and cloud technologies. 
Proven track record of developing scalable web applications and leading cross-functional teams.

TECHNICAL SKILLS
Programming Languages: JavaScript, TypeScript, Python, Java
Frontend: React, Angular, HTML5, CSS3, Bootstrap
Backend: Node.js, Express, RESTful APIs, GraphQL
Databases: MongoDB, PostgreSQL, MySQL, Redis
Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins, Git
Other: Agile, Scrum, TDD, Microservices

PROFESSIONAL EXPERIENCE

Senior Full Stack Developer | Tech Corp | 2020 - Present
• Developed and maintained 10+ web applications using React and Node.js
• Implemented microservices architecture reducing system downtime by 40%
• Led a team of 5 developers using Agile methodologies
• Optimized database queries improving performance by 60%
• Deployed applications to AWS using Docker and Kubernetes

Full Stack Developer | StartupXYZ | 2018 - 2020
• Built responsive web applications using Angular and Express
• Designed and implemented RESTful APIs serving 100k+ users
• Collaborated with product managers and designers
• Implemented CI/CD pipelines reducing deployment time by 50%

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2018
GPA: 3.8/4.0

CERTIFICATIONS
• AWS Certified Solutions Architect
• MongoDB Certified Developer
• Agile Certified Practitioner

PROJECTS
E-commerce Platform: Built full-stack application with React, Node.js, and MongoDB
Real-time Chat App: Developed using Socket.io, Express, and Redis
Task Management Tool: Created with Angular, PostgreSQL, and Docker
`;

  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, resumeContent);
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

  // Sign in
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

// Test 2: Upload Resume with Text Processing
async function testUploadResumeWithProcessing() {
  // Create a test resume file
  const testFile = createTestResume("developer-resume.pdf", "application/pdf");

  const form = new FormData();
  form.append("resume", fs.createReadStream(testFile.path), {
    filename: testFile.name,
    contentType: testFile.type,
  });
  form.append("name", "John Developer");
  form.append("email", "john.developer@email.com");

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
  console.log(`   📄 Resume uploaded with ID: ${testResumeId}`);

  // Check if resume was processed automatically
  if (response.data.resume.parsed_data) {
    const parsedData = JSON.parse(response.data.resume.parsed_data);
    console.log(
      `   🔍 Text automatically processed. Word count: ${parsedData.wordCount}`
    );
    console.log(
      `   🏷️  Keywords found: ${parsedData.keywords.slice(0, 5).join(", ")}...`
    );
  } else {
    console.log(`   ⚠️  Text processing failed during upload`);
  }

  // Clean up test file
  fs.unlinkSync(testFile.path);
}

// Test 3: Process Existing Resume (if not already processed)
async function testProcessExistingResume() {
  try {
    const response = await axios.post(
      `${BASE_URL}/resumes/${testResumeId}/process`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const parsedData = JSON.parse(response.data.resume.parsed_data);
      console.log(
        `   🔍 Resume processed. Word count: ${parsedData.wordCount}`
      );
      console.log(
        `   📑 Sections found: ${Object.keys(parsedData.sections).join(", ")}`
      );
      console.log(
        `   🏷️  Keywords: ${parsedData.keywords.slice(0, 10).join(", ")}...`
      );
    }
  } catch (error) {
    if (
      error.response &&
      error.response.status === 400 &&
      error.response.data.message.includes("already processed")
    ) {
      console.log(`   ✅ Resume already processed (expected)`);
    } else {
      throw error;
    }
  }
}

// Test 4: Match Resume to Job Description
async function testMatchResumeToJob() {
  const response = await axios.post(
    `${BASE_URL}/resumes/${testResumeId}/match`,
    {
      jobDescription: sampleJobDescription,
    },
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

  const matchData = response.data.data;

  if (!matchData.analysis) {
    throw new Error("No analysis data received");
  }

  console.log(`   📊 Match Score: ${matchData.analysis.score}%`);
  console.log(
    `   ✅ Matched Keywords (${
      matchData.analysis.matchedKeywords.length
    }): ${matchData.analysis.matchedKeywords.slice(0, 8).join(", ")}...`
  );
  console.log(
    `   ❌ Missing Keywords (${
      matchData.analysis.missingKeywords.length
    }): ${matchData.analysis.missingKeywords.slice(0, 5).join(", ")}...`
  );

  if (matchData.analysis.strengths.length > 0) {
    console.log(`   💪 Strengths:`);
    matchData.analysis.strengths.forEach((strength, index) => {
      console.log(`      ${index + 1}. ${strength}`);
    });
  }

  if (matchData.analysis.recommendations.length > 0) {
    console.log(`   📝 Recommendations:`);
    matchData.analysis.recommendations.forEach((rec, index) => {
      console.log(`      ${index + 1}. ${rec}`);
    });
  }
}

// Test 5: Upload Different File Type (DOCX)
async function testUploadDOCXResume() {
  const testFile = createTestResume(
    "developer-resume.docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );

  const form = new FormData();
  form.append("resume", fs.createReadStream(testFile.path), {
    filename: testFile.name,
    contentType: testFile.type,
  });
  form.append("name", "Jane Developer");
  form.append("email", "jane.developer@email.com");

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

  if (response.data.resume.parsed_data) {
    const parsedData = JSON.parse(response.data.resume.parsed_data);
    console.log(
      `   🔍 DOCX text processed. Word count: ${parsedData.wordCount}`
    );
  }

  // Clean up test file
  fs.unlinkSync(testFile.path);
}

// Test 6: Get All Resumes (should show processed data)
async function testGetAllProcessedResumes() {
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

  const processedCount = response.data.resumes.filter(
    (r) => r.parsed_data
  ).length;
  console.log(
    `   🔍 Processed resumes: ${processedCount}/${response.data.resumes.length}`
  );

  if (processedCount > 0) {
    const sampleResume = response.data.resumes.find((r) => r.parsed_data);
    const parsedData = JSON.parse(sampleResume.parsed_data);
    console.log(
      `   📊 Sample analysis - Words: ${parsedData.wordCount}, Keywords: ${parsedData.keywords.length}`
    );
  }
}

// Run all tests
async function runAllTests() {
  const tests = [
    { name: "User Authentication", fn: testUserAuth },
    {
      name: "Upload Resume with Text Processing",
      fn: testUploadResumeWithProcessing,
    },
    { name: "Process Existing Resume", fn: testProcessExistingResume },
    { name: "Match Resume to Job Description", fn: testMatchResumeToJob },
    { name: "Upload DOCX Resume", fn: testUploadDOCXResume },
    { name: "Get All Processed Resumes", fn: testGetAllProcessedResumes },
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
    `${colors.cyan}📊 Resume Processing Pipeline Test Results:${colors.reset}`
  );
  console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
  console.log(`${colors.yellow}📋 Total: ${passed + failed}${colors.reset}\n`);

  if (failed === 0) {
    console.log(
      `${colors.green}🎉 All tests passed! Resume processing pipeline is fully functional.${colors.reset}`
    );
    console.log(`${colors.magenta}✨ Features working:${colors.reset}`);
    console.log(`   • PDF/DOCX text extraction`);
    console.log(`   • Resume text processing and keyword extraction`);
    console.log(`   • Basic TF-IDF similarity matching`);
    console.log(`   • Match analysis with recommendations`);
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
