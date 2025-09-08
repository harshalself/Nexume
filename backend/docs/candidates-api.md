# Candidates API Documentation

## Overview

The Candidates API provides comprehensive candidate management functionality, allowing users to view, filter, and analyze candidates (resumes) that have been matched against their job descriptions.

## Base URL

```
/api/v1/candidates
```

## Authentication

All endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Get All Candidates

Retrieve all candidates for the authenticated user with optional filtering and pagination.

**Endpoint:** `GET /api/v1/candidates`

**Query Parameters:**

- `status` (optional): Filter by candidate status
- `minScore` (optional): Minimum match score (0-100)
- `limit` (optional): Maximum number of results (default: 50)
- `offset` (optional): Number of results to skip for pagination

**Example Request:**

```bash
GET /api/v1/candidates?minScore=70&limit=20&offset=0
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "resume-uuid",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "file_url": "https://storage.url/resume.pdf",
      "uploaded_at": "2025-01-08T10:00:00.000Z",
      "best_match_score": 85.5,
      "best_match_job_title": "Senior Developer",
      "total_matches": 3
    }
  ],
  "count": 15
}
```

### 2. Get Candidates for Specific Job

Retrieve candidates matched to a specific job description.

**Endpoint:** `GET /api/v1/candidates/job/:jobId`

**Path Parameters:**

- `jobId`: Job description UUID

**Query Parameters:**

- `minScore` (optional): Minimum match score (0-100)
- `limit` (optional): Maximum number of results (default: 50)

**Example Request:**

```bash
GET /api/v1/candidates/job/job-uuid?minScore=60&limit=10
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "resume-uuid",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "file_url": "https://storage.url/resume.pdf",
      "uploaded_at": "2025-01-08T09:30:00.000Z",
      "match_score": 78.2,
      "match_details": {
        "skills_match": 0.85,
        "experience_match": 0.72,
        "education_match": 0.9
      },
      "matched_on": "2025-01-08T10:15:00.000Z",
      "job": {
        "id": "job-uuid",
        "title": "Frontend Developer",
        "company": "Tech Corp"
      }
    }
  ],
  "count": 8
}
```

### 3. Get Candidate Details

Retrieve detailed information about a specific candidate including full match history.

**Endpoint:** `GET /api/v1/candidates/:id`

**Path Parameters:**

- `id`: Candidate (resume) UUID

**Example Request:**

```bash
GET /api/v1/candidates/resume-uuid
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "resume-uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "file_url": "https://storage.url/resume.pdf",
    "uploaded_at": "2025-01-08T10:00:00.000Z",
    "parsed_data": {
      "skills": ["JavaScript", "React", "Node.js"],
      "experience": "5 years",
      "education": "Computer Science"
    },
    "best_match_score": 85.5,
    "best_match_job_title": "Senior Developer",
    "total_matches": 3,
    "matches": [
      {
        "id": "match-uuid",
        "job_id": "job-uuid",
        "job_title": "Senior Developer",
        "company": "Tech Corp",
        "match_score": 85.5,
        "match_details": {
          "skills_match": 0.9,
          "experience_match": 0.85,
          "education_match": 0.82
        },
        "matched_on": "2025-01-08T10:15:00.000Z"
      }
    ]
  }
}
```

### 4. Get Top Candidates

Retrieve the highest-scoring candidates across all jobs for the authenticated user.

**Endpoint:** `GET /api/v1/candidates/top`

**Query Parameters:**

- `limit` (optional): Maximum number of results (default: 10)

**Example Request:**

```bash
GET /api/v1/candidates/top?limit=5
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "resume-uuid",
      "name": "Top Candidate",
      "email": "top@example.com",
      "file_url": "https://storage.url/resume.pdf",
      "uploaded_at": "2025-01-08T10:00:00.000Z",
      "best_match_score": 92.5,
      "best_match_job_title": "Lead Developer",
      "total_matches": 5
    }
  ],
  "count": 5
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "success": false,
  "message": "Invalid parameters",
  "details": "minScore must be between 0 and 100"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Access denied to this candidate"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Candidate not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Database connection failed"
}
```

## Usage Examples

### Filter High-Quality Candidates

```bash
# Get candidates with match score >= 80%
curl -X GET "http://localhost:3000/api/v1/candidates?minScore=80" \
  -H "Authorization: Bearer <token>"
```

### Get Candidates for Urgent Job

```bash
# Get top 5 candidates for a specific job
curl -X GET "http://localhost:3000/api/v1/candidates/job/job-uuid?limit=5" \
  -H "Authorization: Bearer <token>"
```

### Analyze Candidate Profile

```bash
# Get full candidate details including match history
curl -X GET "http://localhost:3000/api/v1/candidates/resume-uuid" \
  -H "Authorization: Bearer <token>"
```

### Dashboard Overview

```bash
# Get top 10 candidates for dashboard display
curl -X GET "http://localhost:3000/api/v1/candidates/top?limit=10" \
  -H "Authorization: Bearer <token>"
```

## Data Models

### CandidateData

```typescript
interface CandidateData {
  id: string;
  name: string;
  email: string;
  file_url: string;
  uploaded_at: string;
  best_match_score?: number;
  best_match_job_title?: string;
  total_matches: number;
}
```

### CandidateDetails

```typescript
interface CandidateDetails extends CandidateData {
  parsed_data: any;
  matches: Array<{
    id: string;
    job_id: string;
    job_title: string;
    company?: string;
    match_score: number;
    match_details: any;
    matched_on: string;
  }>;
}
```

## Performance Notes

- All endpoints implement pagination to handle large datasets efficiently
- Candidates are filtered by user access control automatically
- Match scores are calculated and cached for better performance
- Database queries are optimized with proper indexing

## Security

- All endpoints require valid JWT authentication
- Row-Level Security (RLS) ensures users only access their own data
- File URLs are pre-signed for secure access
- Input validation prevents SQL injection and other attacks
