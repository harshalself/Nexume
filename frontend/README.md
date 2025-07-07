# 📄 Project Documentation: Nexume – Next-Gen Resume Shortlisting Platform

## 🧠 Project Overview

Nexume is a web application designed to help companies that receive a high volume of resumes automatically shortlist the most relevant candidates. The system allows an admin to upload job descriptions and resumes, and then matches candidates based on relevance, providing a match percentage and detailed insights. It also sends automated email notifications for shortlisted candidates.

---

## 🚧 Frontend Technical Task List (Atomic & Ordered)

1. **Landing Page (Public)**

   - Create `src/pages/home/Home.tsx` for homepage UI
   - Create/Update `src/components/Navbar.tsx` and `src/components/Footer.tsx`
   - Add feature highlights and CTA buttons

2. **Authentication (UI & Context Only)**

   - Create `src/pages/auth/SignUp.tsx` (form, validation, UI only)
   - Create `src/pages/auth/SignIn.tsx` (form, validation, UI only)
   - Create `src/contexts/AuthContext.tsx` for auth state management (mock logic)
   - Create `src/hooks/useAuth.ts` for auth logic (mock logic)
   - Add route protection with `src/components/ProtectedRoute.tsx`
   - Prepare for backend integration: leave TODOs for API calls

3. **Dashboard Shell (Layout & Navigation)**

   - Create `src/layouts/DashboardLayout.tsx` (wraps dashboard pages)
   - Create `src/components/DashboardNav.tsx` (top navbar)
   - Create `src/components/Sidebar.tsx` (sidebar navigation)
   - Create `src/pages/Dashboard.tsx` (dashboard home page)
   - Add placeholder navigation items in `src/config/dashboardConfig.ts`

4. **Job Description Management (UI & Preparation)**

   - Create `src/pages/dashboard/JobDescriptions.tsx` (list, create, edit, delete UI)
   - Create `src/components/JobDescriptionForm.tsx` (form component)
   - Prepare `src/services/jobDescription.service.ts` (API placeholders)
   - Prepare `src/hooks/useJobDescriptions.ts` (data fetching logic, mock data)
   - Leave TODOs for backend integration

5. **Resume Upload (UI & Preparation)**

   - Create `src/pages/dashboard/ResumeUpload.tsx` (upload UI)
   - Create `src/components/ResumeUploadForm.tsx` (form component)
   - Prepare `src/services/resume.service.ts` (API placeholders)
   - Prepare `src/hooks/useResumes.ts` (data fetching logic, mock data)
   - Leave TODOs for backend integration

6. **Matching Algorithm Results (UI & Preparation)**

   - Create `src/pages/dashboard/Candidates.tsx` (table view for matched candidates)
   - Create `src/components/CandidateTable.tsx` (table component)
   - Prepare `src/services/candidate.service.ts` (API placeholders)
   - Prepare `src/hooks/useCandidates.ts` (data fetching logic, mock data)
   - Leave TODOs for backend integration

7. **Notifications (UI Only)**
   - Create/Update `src/components/Notifications.tsx` (notification bell and dropdown)
   - Prepare for backend integration (mock notifications)

---

- Each task specifies files/components/services/hooks to create.
- All API/service logic should be mocked or left as TODO for backend integration.
- Complete tasks in order for smooth incremental progress.
