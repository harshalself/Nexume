# 📋 **Nexume Backend API Documentation**

## 🎯 **Complete Process Flow & API Reference**

_Generated on: September 10, 2025_  
_Base URL: `/api/v1/`_

---

## 🔄 **PHASE 1: AUTHENTICATION & USER MANAGEMENT**

### **User Authentication APIs**

All authentication routes are prefixed with `/auth`

| Method   | Endpoint        | Description                           | Status      |
| -------- | --------------- | ------------------------------------- | ----------- |
| `POST`   | `/auth/signup`  | User registration with email/password | ✅ Complete |
| `POST`   | `/auth/signin`  | User login and JWT token generation   | ✅ Complete |
| `GET`    | `/auth/profile` | Get authenticated user profile        | ✅ Complete |
| `PATCH`  | `/auth/profile` | Update user profile information       | ✅ Complete |
| `DELETE` | `/auth/profile` | Soft delete user account              | ✅ Complete |

---

## 📋 **PHASE 2: JOB DESCRIPTION MANAGEMENT**

### **Job Description CRUD APIs**

All job description routes are prefixed with `/job-descriptions`

| Method   | Endpoint                | Description                        | Status      |
| -------- | ----------------------- | ---------------------------------- | ----------- |
| `POST`   | `/job-descriptions`     | Create new job description         | ✅ Complete |
| `GET`    | `/job-descriptions`     | Get all job descriptions for user  | ✅ Complete |
| `GET`    | `/job-descriptions/:id` | Get specific job description by ID | ✅ Complete |
| `PUT`    | `/job-descriptions/:id` | Update job description             | ✅ Complete |
| `DELETE` | `/job-descriptions/:id` | Soft delete job description        | ✅ Complete |

---

## 📄 **PHASE 3: RESUME MANAGEMENT**

### **Resume Upload & Processing APIs**

All resume routes are prefixed with `/resumes`

| Method   | Endpoint               | Description                          | Status         |
| -------- | ---------------------- | ------------------------------------ | -------------- |
| `POST`   | `/resumes`             | Upload resume file (PDF/DOC/DOCX)    | 🚧 In Progress |
| `GET`    | `/resumes`             | Get all resumes for user             | 🚧 In Progress |
| `GET`    | `/resumes/:id`         | Get specific resume by ID            | 🚧 In Progress |
| `PATCH`  | `/resumes/:id`         | Update resume metadata               | 🚧 In Progress |
| `DELETE` | `/resumes/:id`         | Soft delete resume                   | 🚧 In Progress |
| `POST`   | `/resumes/:id/process` | Process resume to extract text       | 🚧 In Progress |
| `POST`   | `/resumes/:id/match`   | Match resume against job description | 🚧 In Progress |

---

## 🤖 **PHASE 4: ENHANCED MATCHING SYSTEM**

### **AI-Powered Matching APIs**

All matching routes are prefixed with `/matches`

| Method   | Endpoint                             | Description                                 | Status         |
| -------- | ------------------------------------ | ------------------------------------------- | -------------- |
| `POST`   | `/matches/enhanced`                  | Perform AI-enhanced matching (TF-IDF + LLM) | 🚧 In Progress |
| `POST`   | `/matches/batch`                     | Batch process multiple resume-job matches   | 🚧 In Progress |
| `GET`    | `/matches/resume/:resumeId`          | Get all matches for a specific resume       | 🚧 In Progress |
| `GET`    | `/matches/resume/:resumeId/insights` | Generate comprehensive resume insights      | 🚧 In Progress |
| `GET`    | `/matches/job/:jobId/top`            | Get top matching resumes for a job          | 🚧 In Progress |
| `GET`    | `/matches`                           | Get all matches with optional filters       | 🚧 In Progress |
| `DELETE` | `/matches/:matchId`                  | Delete a match result                       | 🚧 In Progress |

---

## 👥 **PHASE 5: CANDIDATES MANAGEMENT**

### **Candidate Management APIs**

All candidate routes are prefixed with `/candidates`

| Method | Endpoint                   | Description                                | Status   |
| ------ | -------------------------- | ------------------------------------------ | -------- |
| `GET`  | `/candidates`              | Get all candidates with optional filtering | ⏳ Ready |
| `GET`  | `/candidates/top`          | Get top candidates (best matches overall)  | ⏳ Ready |
| `GET`  | `/candidates/job/:jobId`   | Get candidates for a specific job          | ⏳ Ready |
| `GET`  | `/candidates/:candidateId` | Get detailed candidate information         | ⏳ Ready |

---

## 📊 **PHASE 6: ANALYTICS & INSIGHTS**

### **Analytics Dashboard APIs**

All analytics routes are prefixed with `/analytics`

| Method | Endpoint               | Description                      | Status   |
| ------ | ---------------------- | -------------------------------- | -------- |
| `GET`  | `/analytics/dashboard` | Get dashboard overview analytics | ⏳ Ready |
| `GET`  | `/analytics/jobs`      | Get job-specific analytics       | ⏳ Ready |
| `GET`  | `/analytics/resumes`   | Get resume analytics             | ⏳ Ready |
| `GET`  | `/analytics/matches`   | Get matching analytics           | ⏳ Ready |

---

## 🧪 **PHASE 7: TESTING & DEVELOPMENT**

### **Test & Development APIs**

All test routes are prefixed with `/test`

| Method | Endpoint                | Description                          | Status      |
| ------ | ----------------------- | ------------------------------------ | ----------- |
| `GET`  | `/test/gemini`          | Test Gemini API connection           | ✅ Complete |
| `GET`  | `/test/resume-analysis` | Test resume analysis with dummy data | ✅ Complete |

**Test Routes Available:**

- `GET /test/gemini` - Test Gemini API connection ✅ **Fully Implemented**
- `GET /test/resume-analysis` - Test resume analysis functionality ✅ **Fully Implemented**

---

## 🔄 **COMPLETE USER JOURNEY FLOW**

### **Sequential Process Flow:**

1. **🔐 User Onboarding**

   - `POST /auth/signup` → User registration
   - `POST /auth/signin` → User authentication

2. **💼 Job Management**

   - `POST /job-descriptions` → Create job descriptions
   - `GET /job-descriptions` → View/manage jobs

3. **📄 Resume Processing**

   - `POST /resumes` → Upload resume files
   - `POST /resumes/:id/process` → Extract text content

4. **🎯 AI Matching**

   - `POST /matches/enhanced` → Perform AI-powered matching
   - `POST /matches/batch` → Batch process multiple matches

5. **👥 Candidate Review**

   - `GET /candidates` → View all candidates
   - `GET /candidates/job/:jobId` → View job-specific candidates
   - `GET /candidates/top` → View top candidates

6. **📊 Analytics & Insights**
   - `GET /analytics/dashboard` → Dashboard overview
   - `GET /analytics/jobs` → Job performance analytics
   - `GET /analytics/resumes` → Resume analytics
   - `GET /analytics/matches` → Matching analytics

---

## 🔧 **TECHNICAL SPECIFICATIONS**

### **Authentication**

- **Type:** JWT Bearer Token
- **Middleware:** Applied to all routes except `/auth/*`
- **Storage:** Supabase Auth integration

### **File Upload**

- **Supported Formats:** PDF, DOC, DOCX
- **Max Size:** 5MB per file
- **Storage:** Supabase Storage bucket

### **Data Processing**

- **Text Extraction:** PDF/DOC parsing
- **Matching Algorithm:** TF-IDF + Cosine Similarity + LLM Enhancement
- **AI Integration:** Groq API with user-stored API keys

### **Database Tables**

- `users` - User accounts and API keys
- `job_descriptions` - Job postings and requirements
- `resumes` - Resume metadata and file references
- `matches` - Matching results and scores

---

## 📈 **IMPLEMENTATION STATUS SUMMARY**

| Phase                      | Status         | APIs Count  | Completion |
| -------------------------- | -------------- | ----------- | ---------- |
| Phase 1: Authentication    | ✅ Complete    | 5/5         | 100%       |
| Phase 2: Job Management    | ✅ Complete    | 5/5         | 100%       |
| Phase 3: Resume Management | 🚧 In Progress | 7/7         | 0%         |
| Phase 4: Enhanced Matching | 🚧 In Progress | 7/7         | 0%         |
| Phase 5: Candidates        | ⏳ Ready       | 4/4         | 0%         |
| Phase 6: Analytics         | ⏳ Ready       | 4/4         | 0%         |
| Phase 7: Testing           | ✅ Complete    | 2/2         | 100%       |
| **TOTAL**                  | **Mixed**      | **33 APIs** | **39.4%**  |

---

## 🧪 **TESTING SCRIPTS**

Available test scripts in `/backend/scripts/`:

- `test-user-apis.js` - User authentication tests
- `test-job-apis.js` - Job description CRUD tests
- `test-resume-apis.js` - Resume management tests
- `test-enhanced-matching.js` - AI matching tests
- `test-candidates-apis.js` - Candidate management tests
- `test-analytics-apis.js` - Analytics tests
- `get-test-ids.js` - Utility for retrieving test data
- `run-all-tests.js` - Execute all tests sequentially

---

## 🚀 **NEXT DEVELOPMENT PRIORITIES**

1. **High Priority:** Resume upload and processing system
2. **Medium Priority:** AI matching algorithm implementation
3. **Low Priority:** Analytics dashboard and candidate management

---

_This documentation is auto-generated from the backend route configuration and represents the complete API surface of the Nexume platform with **33 APIs** across 7 phases._</content>
<parameter name="filePath">L:\Projects\Nexume\API_DOCUMENTATION.md
