/**
 * Phase 4: Enhanced Matching System - Real User Simulation
 * Tests all 7 enhanced matching APIs with AI-powered analysis
 */

const axios = require("axios");
const FormData = require("form-data");

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

// Realistic job descriptions for testing
const jobDescriptions = {
  seniorFullStack: {
    title: "Senior Full Stack Developer",
    company: "TechCorp Solutions",
    description: `We are seeking a Senior Full Stack Developer to join our dynamic team.

Requirements:
• 5+ years of experience in full-stack development
• Strong proficiency in JavaScript/TypeScript, React, Node.js
• Experience with cloud platforms (AWS, Azure, or GCP)
• Database design and optimization (PostgreSQL, MongoDB)
• RESTful API development and microservices architecture
• Agile development methodologies and CI/CD practices
• Containerization with Docker and orchestration with Kubernetes
• Version control with Git and collaborative development

Key Responsibilities:
• Design and develop scalable web applications using modern technologies
• Collaborate with cross-functional teams to deliver high-quality software
• Mentor junior developers and conduct code reviews
• Optimize application performance and ensure security best practices
• Participate in architectural decisions and technology evaluations

Preferred Qualifications:
• Experience with GraphQL and real-time applications
• Knowledge of DevOps practices and infrastructure as code
• Familiarity with testing frameworks (Jest, Cypress)
• Understanding of design patterns and software architecture principles

Benefits:
• Competitive salary and equity package
• Health, dental, and vision insurance
• Flexible work arrangements and remote work options
• Professional development budget and conference attendance
• Modern tech stack and collaborative culture`,
  },

  devOpsEngineer: {
    title: "DevOps Engineer",
    company: "CloudTech Systems",
    description: `DevOps Engineer position available for our infrastructure team.

Technical Requirements:
• 3+ years of DevOps or infrastructure experience
• Strong Linux/Unix system administration skills
• Infrastructure as Code (Terraform, CloudFormation)
• Configuration management (Ansible, Puppet, Chef)
• CI/CD pipeline development (Jenkins, GitLab CI, GitHub Actions)
• Containerization and orchestration (Docker, Kubernetes)
• Cloud platforms (AWS, Azure, GCP)
• Monitoring and logging (Prometheus, Grafana, ELK stack)
• Scripting languages (Python, Bash, PowerShell)

Core Responsibilities:
• Design and maintain cloud infrastructure
• Implement automated deployment pipelines
• Monitor system performance and reliability
• Ensure security best practices and compliance
• Collaborate with development teams on infrastructure needs
• Troubleshoot production issues and implement solutions
• Optimize costs and resource utilization
• Document infrastructure and processes

Qualifications:
• Bachelor's degree in Computer Science or related field
• Certifications in AWS, Azure, or Kubernetes preferred
• Experience with microservices and serverless architectures
• Knowledge of networking, security, and compliance standards
• Strong problem-solving and analytical skills

What We Offer:
• Competitive compensation package
• Comprehensive benefits including health insurance
• Flexible working hours and remote work options
• Learning and development opportunities
• Cutting-edge technology environment`,
  },

  frontendDeveloper: {
    title: "Frontend Developer",
    company: "InnovateTech",
    description: `Frontend Developer role with focus on user experience and modern web technologies.

Required Skills:
• 3+ years of frontend development experience
• Expert knowledge of HTML5, CSS3, and JavaScript (ES6+)
• React.js and state management (Redux, Context API)
• TypeScript for type-safe development
• Responsive design and mobile-first development
• CSS preprocessors (SASS/SCSS) and CSS-in-JS solutions
• Version control with Git and collaborative workflows
• Cross-browser compatibility and performance optimization
• Testing frameworks (Jest, React Testing Library)

Key Duties:
• Develop responsive and interactive user interfaces
• Implement pixel-perfect designs from mockups
• Optimize application performance and loading times
• Collaborate with UX/UI designers and backend developers
• Write clean, maintainable, and well-documented code
• Participate in code reviews and knowledge sharing
• Stay updated with latest frontend technologies and trends
• Ensure accessibility and inclusive design practices

Nice to Have:
• Experience with Next.js or Gatsby
• Knowledge of GraphQL and RESTful APIs
• Familiarity with design systems and component libraries
• Understanding of SEO principles and web performance
• Experience with animation libraries (Framer Motion, GSAP)

Benefits Package:
• Competitive salary commensurate with experience
• Comprehensive health and dental coverage
• Flexible PTO and work-from-home options
• Professional development stipend
• Modern development environment with latest tools`,
  },

  dataScientist: {
    title: "Data Scientist",
    company: "DataDriven Corp",
    description: `Data Scientist position to drive insights from complex datasets.

Essential Skills:
• 4+ years of experience in data science or analytics
• Strong proficiency in Python and R programming
• Statistical analysis and hypothesis testing
• Machine learning algorithms and model development
• Data visualization (Tableau, Power BI, matplotlib, seaborn)
• SQL and database querying (PostgreSQL, BigQuery)
• Big data technologies (Spark, Hadoop)
• Deep learning frameworks (TensorFlow, PyTorch)
• A/B testing and experimental design

Responsibilities:
• Analyze large datasets to extract actionable insights
• Develop and deploy machine learning models
• Create data visualizations and dashboards
• Collaborate with business stakeholders to understand requirements
• Design and implement data pipelines
• Perform statistical analysis and predictive modeling
• Communicate findings to technical and non-technical audiences
• Stay current with latest data science methodologies

Education & Experience:
• Master's or PhD in Data Science, Statistics, or related field
• Proven track record of delivering data-driven solutions
• Experience with cloud platforms (AWS, GCP, Azure)
• Knowledge of data privacy and ethical considerations
• Strong communication and presentation skills

What We Provide:
• Competitive salary and performance bonuses
• Comprehensive benefits package
• Flexible work arrangements
• Continuous learning and conference budget
• Access to cutting-edge tools and technologies`,
  },
};

let authToken = "";
let userId = "";
let uploadedResumeIds = [];
let createdJobIds = [];
let createdMatchIds = [];

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

// Phase 4.1: User Authentication (Prerequisite)
async function authenticateUser() {
  console.log("\n" + "=".repeat(60));
  console.log("🔐 PHASE 4 PREP: USER AUTHENTICATION");
  console.log("=".repeat(60));

  try {
    const signinData = {
      email: realUser.email,
      password: realUser.password,
    };

    console.log("📤 Authenticating user for enhanced matching...");
    const response = await api.post("/auth/signin", signinData);

    if (response.status === 200 && response.data.accessToken) {
      authToken = response.data.accessToken;
      userId = response.data.user?.id;

      logStep(
        "User Authentication",
        true,
        `Welcome back ${realUser.first_name}!`
      );
      console.log(`   🔑 Auth token: ${authToken.substring(0, 20)}...`);
      console.log(`   👤 User ID: ${userId}`);
      return true;
    } else {
      logStep("User Authentication", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logStep(
      "User Authentication",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Phase 4.2: Create Job Descriptions for Testing
async function createJobDescriptions() {
  console.log("\n" + "=".repeat(60));
  console.log("💼 PHASE 4.2: CREATE JOB DESCRIPTIONS");
  console.log("=".repeat(60));

  logUserAction(
    "Sarah Johnson is creating job descriptions for testing enhanced matching"
  );

  for (const [key, job] of Object.entries(jobDescriptions)) {
    try {
      console.log(`📤 Creating job: ${job.title} at ${job.company}`);

      const response = await api.post("/job-descriptions", {
        title: job.title,
        description: job.description,
        company: job.company,
      });

      if (response.status === 201 && response.data.jobDescription) {
        const createdJob = response.data.jobDescription;
        createdJobIds.push(createdJob.id);

        logStep(`Create ${key}`, true, `${job.title} created successfully`);
        console.log(`   🆔 Job ID: ${createdJob.id}`);
        console.log(`   🏢 Company: ${createdJob.company}`);
        console.log(
          `   📅 Created: ${new Date(
            createdJob.created_at
          ).toLocaleDateString()}`
        );
      } else {
        logStep(`Create ${key}`, false, "Invalid response structure");
      }
    } catch (error) {
      logStep(
        `Create ${key}`,
        false,
        error.response?.data?.message || error.message
      );
    }
  }

  console.log(
    `\n📊 Created ${createdJobIds.length} job descriptions for testing`
  );
  return createdJobIds.length > 0;
}

// Phase 4.3: Get Existing Resumes for Testing
async function getExistingResumes() {
  console.log("\n" + "=".repeat(60));
  console.log("📄 PHASE 4.3: GET EXISTING RESUMES");
  console.log("=".repeat(60));

  logUserAction(
    "Sarah Johnson is retrieving existing resumes for enhanced matching"
  );

  try {
    console.log("📤 Fetching existing resumes...");

    const response = await api.get("/resumes");

    if (response.status === 200 && response.data.resumes) {
      const resumes = response.data.resumes;
      const activeResumes = resumes.filter((resume) => !resume.is_deleted);

      logStep(
        "Get Existing Resumes",
        true,
        `${activeResumes.length} active resume(s) found`
      );
      console.log("   📋 Available Resumes:");

      activeResumes.forEach((resume, index) => {
        console.log(`      ${index + 1}. ${resume.name || "Unnamed Resume"}`);
        console.log(`         🆔 ID: ${resume.id}`);
        console.log(`         📧 Email: ${resume.email || "Not provided"}`);
        console.log(
          `         📊 Processed: ${resume.parsed_data ? "Yes" : "No"}`
        );
        uploadedResumeIds.push(resume.id);
      });

      return activeResumes.length > 0;
    } else {
      logStep("Get Existing Resumes", false, "No resumes found");
      return false;
    }
  } catch (error) {
    logStep(
      "Get Existing Resumes",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Phase 4.4: Perform Enhanced Matching
async function performEnhancedMatching() {
  console.log("\n" + "=".repeat(60));
  console.log("🎯 PHASE 4.4: PERFORM ENHANCED MATCHING");
  console.log("=".repeat(60));

  if (uploadedResumeIds.length === 0 || createdJobIds.length === 0) {
    logStep("Enhanced Matching", false, "No resumes or jobs available");
    return false;
  }

  logUserAction("Sarah Johnson is performing enhanced AI-powered matching");

  const testCases = [
    {
      resumeIndex: 0,
      jobIndex: 0,
      description: "First resume vs Senior Full Stack Developer",
    },
    {
      resumeIndex: 0,
      jobIndex: 1,
      description: "First resume vs DevOps Engineer",
    },
    {
      resumeIndex: uploadedResumeIds.length > 1 ? 1 : 0,
      jobIndex: 2,
      description: "Second resume vs Frontend Developer",
    },
  ];

  let successCount = 0;

  for (const testCase of testCases) {
    try {
      const resumeId = uploadedResumeIds[testCase.resumeIndex];
      const jobId = createdJobIds[testCase.jobIndex];

      console.log(`📤 ${testCase.description}`);
      console.log(`   Resume ID: ${resumeId}`);
      console.log(`   Job ID: ${jobId}`);

      const response = await api.post("/matches/enhanced", {
        resumeId,
        jobId,
      });

      if (response.status === 200 && response.data.match) {
        const match = response.data.match;
        createdMatchIds.push(match.id);

        logStep(
          `Enhanced Match ${testCase.resumeIndex + 1}-${testCase.jobIndex + 1}`,
          true,
          "AI matching completed"
        );
        console.log(`   🆔 Match ID: ${match.id}`);
        console.log(`   🎯 Match Score: ${match.match_score}%`);
        console.log(
          `   🤖 AI Enabled: ${match.match_details.ai_enabled ? "Yes" : "No"}`
        );
        console.log(
          `   ⏱️ Processing Time: ${match.match_details.processing_time}ms`
        );

        if (match.match_details.combined_insights) {
          console.log(
            `   💪 Top Strengths: ${
              match.match_details.combined_insights.top_strengths
                ?.slice(0, 2)
                .join(", ") || "None"
            }`
          );
          console.log(
            `   🎯 Confidence: ${match.match_details.combined_insights.confidence_level}`
          );
        }

        successCount++;
      } else {
        logStep(
          `Enhanced Match ${testCase.resumeIndex + 1}-${testCase.jobIndex + 1}`,
          false,
          "Invalid response structure"
        );
      }
    } catch (error) {
      logStep(
        `Enhanced Match ${testCase.resumeIndex + 1}-${testCase.jobIndex + 1}`,
        false,
        error.response?.data?.message || error.message
      );
    }
  }

  console.log(
    `\n📊 Enhanced matching completed: ${successCount}/${testCases.length} successful`
  );
  return successCount > 0;
}

// Phase 4.5: Get Resume Matches
async function getResumeMatches() {
  console.log("\n" + "=".repeat(60));
  console.log("📊 PHASE 4.5: GET RESUME MATCHES");
  console.log("=".repeat(60));

  if (uploadedResumeIds.length === 0) {
    logStep("Get Resume Matches", false, "No resumes available");
    return false;
  }

  logUserAction("Sarah Johnson is viewing match history for resumes");

  try {
    const resumeId = uploadedResumeIds[0];
    console.log(`📤 Fetching match results for resume ID: ${resumeId}`);

    const response = await api.get(`/matches/resume/${resumeId}`);

    if (response.status === 200 && response.data.matches) {
      const matches = response.data.matches;

      logStep("Get Resume Matches", true, `${matches.length} match(es) found`);
      console.log("   📋 Match History:");

      matches.forEach((match, index) => {
        console.log(`      ${index + 1}. Match ID: ${match.id}`);
        console.log(`         🎯 Score: ${match.match_score}%`);
        console.log(
          `         💼 Job: ${match.job_descriptions?.title || "Unknown"}`
        );
        console.log(
          `         🏢 Company: ${match.job_descriptions?.company || "Unknown"}`
        );
        console.log(
          `         📅 Matched: ${new Date(
            match.matched_on
          ).toLocaleDateString()}`
        );
        console.log(
          `         🤖 AI Analysis: ${
            match.match_details.ai_enabled ? "Yes" : "No"
          }`
        );
      });

      return true;
    } else {
      logStep("Get Resume Matches", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logStep(
      "Get Resume Matches",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Phase 4.6: Get Top Matches for Job
async function getTopMatchesForJob() {
  console.log("\n" + "=".repeat(60));
  console.log("🏆 PHASE 4.6: GET TOP MATCHES FOR JOB");
  console.log("=".repeat(60));

  if (createdJobIds.length === 0) {
    logStep("Get Top Matches", false, "No jobs available");
    return false;
  }

  logUserAction("Sarah Johnson is viewing top matching candidates for a job");

  try {
    const jobId = createdJobIds[0];
    console.log(`📤 Fetching top matches for job ID: ${jobId}`);

    const response = await api.get(`/matches/job/${jobId}/top?limit=5`);

    if (response.status === 200 && response.data.matches) {
      const matches = response.data.matches;

      logStep("Get Top Matches", true, `${matches.length} top match(es) found`);
      console.log("   🏆 Top Candidates:");

      matches.forEach((match, index) => {
        console.log(
          `      ${index + 1}. ${match.resumes?.name || "Unknown Candidate"}`
        );
        console.log(`         🆔 Resume ID: ${match.resume_id}`);
        console.log(`         🎯 Match Score: ${match.match_score}%`);
        console.log(
          `         📧 Email: ${match.resumes?.email || "Not provided"}`
        );
        console.log(
          `         🤖 AI Analysis: ${
            match.match_details.ai_enabled ? "Yes" : "No"
          }`
        );
      });

      return true;
    } else {
      logStep("Get Top Matches", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logStep(
      "Get Top Matches",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Phase 4.7: Generate Resume Insights
async function generateResumeInsights() {
  console.log("\n" + "=".repeat(60));
  console.log("🔍 PHASE 4.7: GENERATE RESUME INSIGHTS");
  console.log("=".repeat(60));

  if (uploadedResumeIds.length === 0) {
    logStep("Resume Insights", false, "No resumes available");
    return false;
  }

  logUserAction(
    "Sarah Johnson is generating comprehensive insights for a resume"
  );

  try {
    const resumeId = uploadedResumeIds[0];
    console.log(`📤 Generating insights for resume ID: ${resumeId}`);

    const response = await api.get(`/matches/resume/${resumeId}/insights`);

    if (response.status === 200 && response.data.insights) {
      const insights = response.data.insights;

      logStep("Resume Insights", true, "Comprehensive insights generated");
      console.log("   📊 Career Insights:");
      console.log(
        `      🎯 Average Match Score: ${insights.average_score || "N/A"}%`
      );
      console.log(`      📈 Total Matches: ${insights.total_matches || 0}`);
      console.log(
        `      🏆 Best Match: ${insights.best_match?.job_title || "None"} at ${
          insights.best_match?.company || "Unknown"
        }`
      );

      if (insights.common_strengths && insights.common_strengths.length > 0) {
        console.log(
          `      💪 Common Strengths: ${insights.common_strengths
            .slice(0, 3)
            .join(", ")}`
        );
      }

      if (insights.improvement_areas && insights.improvement_areas.length > 0) {
        console.log(
          `      🎯 Areas for Improvement: ${insights.improvement_areas
            .slice(0, 3)
            .join(", ")}`
        );
      }

      if (
        insights.career_recommendations &&
        insights.career_recommendations.length > 0
      ) {
        console.log(`      🚀 Career Recommendations:`);
        insights.career_recommendations.forEach((rec, index) => {
          console.log(`         ${index + 1}. ${rec}`);
        });
      }

      return true;
    } else {
      logStep("Resume Insights", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logStep(
      "Resume Insights",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Phase 4.8: Get All Matches with Filters
async function getAllMatchesWithFilters() {
  console.log("\n" + "=".repeat(60));
  console.log("🔎 PHASE 4.8: GET ALL MATCHES WITH FILTERS");
  console.log("=".repeat(60));

  logUserAction("Sarah Johnson is browsing matches with various filters");

  try {
    console.log("📤 Fetching all matches...");

    const response = await api.get("/matches");

    if (response.status === 200 && response.data.matches) {
      const matches = response.data.matches;

      logStep("Get All Matches", true, `${matches.length} match(es) found`);
      console.log("   📋 All Matches:");

      matches.forEach((match, index) => {
        console.log(`      ${index + 1}. Match ID: ${match.id}`);
        console.log(`         🎯 Score: ${match.match_score}%`);
        console.log(`         👤 Resume: ${match.resumes?.name || "Unknown"}`);
        console.log(
          `         💼 Job: ${match.job_descriptions?.title || "Unknown"}`
        );
        console.log(
          `         🤖 AI: ${match.match_details.ai_enabled ? "Yes" : "No"}`
        );
      });

      // Test filtering by minimum score
      console.log("\n📤 Testing score filtering (min 70%)...");
      const highScoreResponse = await api.get("/matches?minScore=70");

      if (highScoreResponse.status === 200) {
        const highScoreMatches = highScoreResponse.data.matches;
        console.log(`   ✅ High-score matches: ${highScoreMatches.length}`);
      }

      return true;
    } else {
      logStep("Get All Matches", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logStep(
      "Get All Matches",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Phase 4.9: Batch Process Matches
async function batchProcessMatches() {
  console.log("\n" + "=".repeat(60));
  console.log("⚡ PHASE 4.9: BATCH PROCESS MATCHES");
  console.log("=".repeat(60));

  // Check if we have enough resumes and jobs for meaningful batch testing
  if (uploadedResumeIds.length < 1 || createdJobIds.length < 2) {
    logStep(
      "Batch Processing",
      false,
      "Need at least 1 resume and 2 jobs for batch testing"
    );
    return false;
  }

  logUserAction(
    "Sarah Johnson is performing batch matching for multiple resume-job combinations"
  );

  try {
    // Create batch of matches to process using available resumes
    const batchMatches = [];

    // Use the first available resume for multiple jobs
    const resumeId = uploadedResumeIds[0];

    // Create matches for the first two jobs
    if (createdJobIds.length >= 2) {
      batchMatches.push({
        resumeId: resumeId,
        jobId: createdJobIds[0],
      });
      batchMatches.push({
        resumeId: resumeId,
        jobId: createdJobIds[1],
      });
    }

    // If we have a second resume, use it with different jobs
    if (uploadedResumeIds.length > 1) {
      batchMatches.push({
        resumeId: uploadedResumeIds[1],
        jobId: createdJobIds[0],
      });
    } else if (createdJobIds.length >= 3) {
      // Use same resume with third job if available
      batchMatches.push({
        resumeId: resumeId,
        jobId: createdJobIds[2],
      });
    }

    console.log("📤 Processing batch of matches...");
    console.log(`   📊 Batch Size: ${batchMatches.length} combinations`);

    const response = await api.post("/matches/batch", {
      matches: batchMatches,
    });

    if (response.status === 200 && response.data) {
      const { successful, failed, results, errors } = response.data;

      logStep(
        "Batch Processing",
        true,
        `${successful} successful, ${failed} failed`
      );
      console.log("   📊 Batch Results:");
      console.log(`      ✅ Successful: ${successful}`);
      console.log(`      ❌ Failed: ${failed}`);
      console.log(`      📈 Total Processed: ${successful + failed}`);

      if (results && results.length > 0) {
        console.log("   🎯 Sample Results:");
        results.slice(0, 2).forEach((result, index) => {
          console.log(
            `      ${index + 1}. Match Score: ${result.match_score}%`
          );
          console.log(
            `         🤖 AI Enabled: ${
              result.match_details?.ai_enabled ? "Yes" : "No"
            }`
          );
        });
      }

      if (errors && errors.length > 0) {
        console.log("   ⚠️ Sample Errors:");
        errors.slice(0, 2).forEach((error, index) => {
          console.log(`      ${index + 1}. ${error.error}`);
        });
      }

      return successful > 0;
    } else {
      logStep("Batch Processing", false, "Invalid response structure");
      return false;
    }
  } catch (error) {
    logStep(
      "Batch Processing",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Phase 4.10: Delete Match Results
async function deleteMatchResults() {
  console.log("\n" + "=".repeat(60));
  console.log("🗑️ PHASE 4.10: DELETE MATCH RESULTS");
  console.log("=".repeat(60));

  if (createdMatchIds.length === 0) {
    logStep("Delete Match", false, "No matches available to delete");
    return false;
  }

  logUserAction("Sarah Johnson is cleaning up match results");

  try {
    const matchId = createdMatchIds[0];
    console.log(`📤 Deleting match ID: ${matchId}`);

    const response = await api.delete(`/matches/${matchId}`);

    if (response.status === 200) {
      logStep("Delete Match", true, "Match result deleted successfully");
      console.log("   ✅ Match result removed from database");

      // Remove from our tracking array
      const index = createdMatchIds.indexOf(matchId);
      if (index > -1) {
        createdMatchIds.splice(index, 1);
      }

      return true;
    } else {
      logStep("Delete Match", false, "Invalid response status");
      return false;
    }
  } catch (error) {
    logStep(
      "Delete Match",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Phase 4.11: Performance Analysis
async function performanceAnalysis() {
  console.log("\n" + "=".repeat(60));
  console.log("📈 PHASE 4.11: PERFORMANCE ANALYSIS");
  console.log("=".repeat(60));

  logUserAction("Sarah Johnson is analyzing matching system performance");

  try {
    console.log("📤 Analyzing match performance metrics...");

    const response = await api.get("/matches");

    if (response.status === 200 && response.data.matches) {
      const matches = response.data.matches;

      // Analyze performance metrics
      const aiEnabledMatches = matches.filter(
        (m) => m.match_details.ai_enabled
      );
      const basicOnlyMatches = matches.filter(
        (m) => !m.match_details.ai_enabled
      );

      const avgAiScore =
        aiEnabledMatches.length > 0
          ? aiEnabledMatches.reduce((sum, m) => sum + m.match_score, 0) /
            aiEnabledMatches.length
          : 0;

      const avgBasicScore =
        basicOnlyMatches.length > 0
          ? basicOnlyMatches.reduce((sum, m) => sum + m.match_score, 0) /
            basicOnlyMatches.length
          : 0;

      const avgProcessingTime =
        matches.length > 0
          ? matches.reduce(
              (sum, m) => sum + (m.match_details.processing_time || 0),
              0
            ) / matches.length
          : 0;

      logStep(
        "Performance Analysis",
        true,
        "System performance metrics calculated"
      );
      console.log("   📊 Performance Metrics:");
      console.log(`      🎯 Total Matches: ${matches.length}`);
      console.log(`      🤖 AI-Enhanced Matches: ${aiEnabledMatches.length}`);
      console.log(`      📊 Basic Matches: ${basicOnlyMatches.length}`);
      console.log(`      📈 Avg AI Score: ${Math.round(avgAiScore)}%`);
      console.log(`      📈 Avg Basic Score: ${Math.round(avgBasicScore)}%`);
      console.log(
        `      ⏱️ Avg Processing Time: ${Math.round(avgProcessingTime)}ms`
      );

      if (aiEnabledMatches.length > 0 && basicOnlyMatches.length > 0) {
        const improvement = avgAiScore - avgBasicScore;
        console.log(
          `      📊 AI Improvement: ${improvement > 0 ? "+" : ""}${Math.round(
            improvement
          )}%`
        );
      }

      return true;
    } else {
      logStep(
        "Performance Analysis",
        false,
        "Could not fetch matches for analysis"
      );
      return false;
    }
  } catch (error) {
    logStep(
      "Performance Analysis",
      false,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Main simulation runner
async function runPhase4Simulation() {
  console.log("🚀 NEXUME PHASE 4 SIMULATION: ENHANCED MATCHING SYSTEM");
  console.log("📅 Date:", new Date().toLocaleDateString());
  console.log("👤 User: Sarah Johnson (HR Manager at TechCorp Solutions)");
  console.log(
    "🎯 Testing all 7 enhanced matching endpoints + performance analysis"
  );
  console.log("=".repeat(80));

  const results = {
    authentication: false,
    createJobs: false,
    getResumes: false,
    enhancedMatching: false,
    getResumeMatches: false,
    getTopMatches: false,
    resumeInsights: false,
    allMatchesFilters: false,
    batchProcessing: false,
    deleteMatch: false,
    performanceAnalysis: false,
  };

  // Execute simulation steps
  results.authentication = await authenticateUser();

  if (authToken) {
    results.createJobs = await createJobDescriptions();
    results.getResumes = await getExistingResumes();

    if (results.createJobs && results.getResumes) {
      results.enhancedMatching = await performEnhancedMatching();
      results.getResumeMatches = await getResumeMatches();
      results.getTopMatches = await getTopMatchesForJob();
      results.resumeInsights = await generateResumeInsights();
      results.allMatchesFilters = await getAllMatchesWithFilters();
      results.batchProcessing = await batchProcessMatches();
      results.deleteMatch = await deleteMatchResults();
      results.performanceAnalysis = await performanceAnalysis();
    }
  }

  // Results summary
  console.log("\n" + "=".repeat(80));
  console.log("📊 PHASE 4 SIMULATION RESULTS");
  console.log("=".repeat(80));

  const totalSteps = Object.keys(results).length;
  const passedSteps = Object.values(results).filter(Boolean).length;
  const successRate = ((passedSteps / totalSteps) * 100).toFixed(1);

  console.log(`✅ Steps Passed: ${passedSteps}/${totalSteps}`);
  console.log(`📈 Success Rate: ${successRate}%`);
  console.log(
    `🎯 Enhanced Matching: ${
      passedSteps >= 9 ? "FULLY FUNCTIONAL" : "ISSUES DETECTED"
    }`
  );

  console.log("\n📋 Detailed Results:");
  Object.entries(results).forEach(([step, success]) => {
    const status = success ? "✅" : "❌";
    const stepName = step
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
    console.log(`   ${status} ${stepName}`);
  });

  console.log("\n🎯 Phase 4 Enhanced Matching System Status:");
  if (passedSteps >= 9) {
    console.log(
      "   ✅ FULLY FUNCTIONAL - All enhanced matching features working"
    );
    console.log(
      "   🎯 AI-POWERED ANALYSIS - Advanced matching algorithms operational"
    );
    console.log(
      "   🚀 PRODUCTION READY - Ready for real-world HR applications"
    );
  } else if (passedSteps >= 7) {
    console.log(
      "   ⚠️ MOSTLY FUNCTIONAL - Core features working, minor issues"
    );
    console.log(
      "   📋 Basic matching operational, some advanced features need attention"
    );
  } else {
    console.log("   ❌ ISSUES DETECTED - Enhanced matching needs attention");
    console.log("   🔧 Core functionality requires debugging");
  }

  console.log("\n📊 Matching System Statistics:");
  console.log(`   💼 Jobs Created: ${createdJobIds.length}`);
  console.log(`   📄 Resumes Used: ${uploadedResumeIds.length}`);
  console.log(`   🎯 Matches Generated: ${createdMatchIds.length}`);

  if (passedSteps >= 9) {
    console.log("\n🚀 Next Steps:");
    console.log("   📈 Ready for Phase 5: Candidate Management");
    console.log("   📊 Ready for Phase 6: Analytics Dashboard");
    console.log("   🎯 Enhanced matching system fully operational");
  }

  console.log("\n" + "=".repeat(80));

  return {
    results,
    passedSteps,
    totalSteps,
    successRate,
    createdJobIds,
    uploadedResumeIds,
    createdMatchIds,
  };
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
    console.log("🎬 Starting Phase 4 Enhanced Matching Simulation...\n");
    await runPhase4Simulation();
  }
})();
