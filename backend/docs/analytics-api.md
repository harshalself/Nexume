# Analytics API Documentation

## Overview

The Analytics API provides comprehensive analytics and reporting functionality for the Nexume platform, offering insights into job performance, resume processing, candidate matching, and overall system metrics.

## Base URL

```
/api/v1/analytics
```

## Authentication

All endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Dashboard Analytics

Get comprehensive overview statistics for the dashboard.

**Endpoint:** `GET /api/v1/analytics/dashboard`

**Example Request:**

```bash
GET /api/v1/analytics/dashboard
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalJobs": 45,
    "totalResumes": 1250,
    "totalMatches": 3420,
    "averageMatchScore": 67.5,
    "topMatchScore": 94.2,
    "jobsWithMatches": 38,
    "resumesWithMatches": 890,
    "recentActivity": {
      "newJobsThisWeek": 5,
      "newResumesThisWeek": 23,
      "newMatchesThisWeek": 156
    }
  }
}
```

### 2. Job Analytics

Get performance analytics for all jobs belonging to the authenticated user.

**Endpoint:** `GET /api/v1/analytics/jobs`

**Example Request:**

```bash
GET /api/v1/analytics/jobs
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "job-uuid",
      "title": "Senior Full Stack Developer",
      "company": "Tech Corp",
      "created_at": "2025-01-01T10:00:00.000Z",
      "totalMatches": 45,
      "averageMatchScore": 72.3,
      "topMatchScore": 89.5,
      "topCandidates": [
        {
          "id": "resume-uuid",
          "name": "John Doe",
          "email": "john@example.com",
          "matchScore": 89.5
        },
        {
          "id": "resume-uuid-2",
          "name": "Jane Smith",
          "email": "jane@example.com",
          "matchScore": 85.2
        }
      ]
    }
  ]
}
```

### 3. Resume Analytics

Get resume processing and upload analytics.

**Endpoint:** `GET /api/v1/analytics/resumes`

**Example Request:**

```bash
GET /api/v1/analytics/resumes
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalResumes": 1250,
    "resumesWithMatches": 890,
    "averageProcessingTime": 2.5,
    "processingSuccessRate": 95.0,
    "recentUploads": [
      {
        "id": "resume-uuid",
        "name": "latest_resume.pdf",
        "uploaded_at": "2025-01-08T14:30:00.000Z",
        "totalMatches": 3,
        "bestMatchScore": 78.5
      },
      {
        "id": "resume-uuid-2",
        "name": "candidate_cv.pdf",
        "uploaded_at": "2025-01-08T13:45:00.000Z",
        "totalMatches": 5,
        "bestMatchScore": 82.1
      }
    ]
  }
}
```

### 4. Match Analytics

Get detailed matching analytics including score distributions and trends.

**Endpoint:** `GET /api/v1/analytics/matches`

**Example Request:**

```bash
GET /api/v1/analytics/matches
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalMatches": 3420,
    "averageScore": 67.5,
    "scoreDistribution": {
      "high": 580, // 80-100%
      "medium": 1850, // 50-79%
      "low": 990 // 0-49%
    },
    "matchTrends": [
      {
        "date": "2025-01-08",
        "count": 23,
        "averageScore": 71.2
      },
      {
        "date": "2025-01-07",
        "count": 18,
        "averageScore": 68.9
      }
    ]
  }
}
```

## Data Models

### DashboardAnalytics

```typescript
interface DashboardAnalytics {
  totalJobs: number;
  totalResumes: number;
  totalMatches: number;
  averageMatchScore: number;
  topMatchScore: number;
  jobsWithMatches: number;
  resumesWithMatches: number;
  recentActivity: {
    newJobsThisWeek: number;
    newResumesThisWeek: number;
    newMatchesThisWeek: number;
  };
}
```

### JobAnalytics

```typescript
interface JobAnalytics {
  id: string;
  title: string;
  company?: string;
  created_at: string;
  totalMatches: number;
  averageMatchScore: number;
  topMatchScore: number;
  topCandidates: Array<{
    id: string;
    name: string;
    email: string;
    matchScore: number;
  }>;
}
```

### ResumeAnalytics

```typescript
interface ResumeAnalytics {
  totalResumes: number;
  resumesWithMatches: number;
  averageProcessingTime: number;
  processingSuccessRate: number;
  recentUploads: Array<{
    id: string;
    name: string;
    uploaded_at: string;
    totalMatches: number;
    bestMatchScore: number;
  }>;
}
```

### MatchAnalytics

```typescript
interface MatchAnalytics {
  totalMatches: number;
  averageScore: number;
  scoreDistribution: {
    high: number; // 80-100
    medium: number; // 50-79
    low: number; // 0-49
  };
  matchTrends: Array<{
    date: string;
    count: number;
    averageScore: number;
  }>;
}
```

## Usage Examples

### Dashboard Overview

```bash
# Get comprehensive dashboard statistics
curl -X GET "http://localhost:3000/api/v1/analytics/dashboard" \
  -H "Authorization: Bearer <token>"
```

### Job Performance Report

```bash
# Analyze performance of all jobs
curl -X GET "http://localhost:3000/api/v1/analytics/jobs" \
  -H "Authorization: Bearer <token>"
```

### Resume Processing Insights

```bash
# Get resume upload and processing statistics
curl -X GET "http://localhost:3000/api/v1/analytics/resumes" \
  -H "Authorization: Bearer <token>"
```

### Matching Trends Analysis

```bash
# Analyze matching patterns and score distributions
curl -X GET "http://localhost:3000/api/v1/analytics/matches" \
  -H "Authorization: Bearer <token>"
```

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to fetch analytics data",
  "error": "Database query failed"
}
```

## Metrics Explanation

### Match Score Distribution

- **High (80-100%)**: Excellent matches with strong alignment
- **Medium (50-79%)**: Good matches with moderate alignment
- **Low (0-49%)**: Poor matches requiring review

### Recent Activity

- Tracks activity in the last 7 days
- Includes new jobs, resumes, and matches created
- Useful for monitoring platform usage trends

### Top Candidates

- Ranked by highest match scores
- Limited to top 5 per job for performance
- Includes basic contact information for quick access

### Processing Success Rate

- Percentage of resumes successfully parsed
- Excludes corrupted or unreadable files
- Industry standard is 90-95%

## Performance Considerations

- Analytics data is computed in real-time for accuracy
- Large datasets may take longer to process
- Consider implementing caching for frequently accessed metrics
- Pagination may be added for very large result sets

## Security Notes

- All analytics respect user data boundaries
- Only data from user's own jobs and matches is included
- No personal information is exposed in aggregate metrics
- Row-Level Security (RLS) enforced at database level

## Integration Examples

### React Dashboard Component

```typescript
const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);

useEffect(() => {
  fetch("/api/v1/analytics/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setAnalytics(data.data));
}, []);
```

### Job Performance Widget

```typescript
const [jobAnalytics, setJobAnalytics] = useState<JobAnalytics[]>([]);

useEffect(() => {
  fetch("/api/v1/analytics/jobs", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setJobAnalytics(data.data));
}, []);
```
