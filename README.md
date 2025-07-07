# 📄 Project Documentation: Nexume – Next-Gen Resume Shortlisting Platform

## 🧠 Project Overview

Nexume is a web application designed to help companies that receive a high volume of resumes automatically shortlist the most relevant candidates. The system allows an admin to upload job descriptions and resumes, and then matches candidates based on relevance, providing a match percentage and detailed insights. It also sends automated email notifications for shortlisted candidates.

---

## ⚙️ Tech Stack

- **Frontend:** React
- **Backend:** Express.js
- **Authentication & Backend Services:** Supabase

---

## 🗂️ Project Structure

```
project-root/
│
├── frontend/              # React frontend
├── backend/               # Express backend
│   └── supabase/          # Supabase config & SQL (inside backend)
```

---

## 🚀 Features

- Public Homepage showcasing app features
- Admin Sign Up / Sign In using Supabase Auth
- Admin-only dashboard access
- Job description management (Create/Edit/Delete)
- Resume upload (multiple files supported)
- Resume-to-JD matching algorithm
- Candidate list with match percentage and details
- Email notifications for shortlisted candidates
- Responsive UI with sidebar, navbar, and modular components

---

## 🧭 User Flow

### 1. **Landing Page (Public)**

- Brief about the product
- Feature highlights
- CTA buttons for Sign Up / Login

### 2. **Authentication (Supabase Auth)**

- Admin-only login system
- Email/Password based signup/login

### 3. **Dashboard (Authenticated Admin Access)**

- Top Navbar:

  - Website logo/name
  - Search bar
  - Profile dropdown

- Sidebar Navigation:

  - Dashboard (Home)
  - Job Descriptions
  - Resume Upload
  - Matched Candidates
  - Profile / Settings

### 4. **Job Description Management**

- Admin can create multiple JDs
- JDs include title, skills, experience, etc.
- Stored in Supabase database

### 5. **Resume Upload**

- Admin can upload multiple resumes in PDF format
- Backend parses the resumes and stores data

### 6. **Matching Algorithm**

- Extracted resume data is matched with each JD
- Matching logic based on skill, experience, keywords
- Generates match percentage

### 7. **Candidate Table**

- Table view of candidates per JD
- Displays:

  - Candidate name
  - Matched JD
  - Match %
  - Key skills
  - Resume download option

### 8. **Email Notifications**

- Automatically sends emails to shortlisted candidates
- Includes job description match summary and next steps

---

## 📦 Data Storage (Supabase)

- `users` table: stores admin details
- `job_descriptions` table: stores all JD entries
- `resumes` table: stores resume metadata and match scores

---

## 🏁 Final Words

Nexume aims to simplify and automate the early stages of recruitment for companies, giving HR teams more time to focus on high-value tasks. Easy to manage, secure, and extendable — a solid foundation for resume screening solutions.
