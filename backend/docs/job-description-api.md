# Job Description API Documentation

## 1. Create Job Description

**Endpoint:** `POST /api/v1/job-descriptions`

**Description:** Create a new job description (protected route).

**Headers:**

```
Accept: application/json
Authorization: Bearer <accessToken>
```

**Request Body:**

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "status": "string (optional, default 'active')"
}
```

**Response:**

```json
{
  "message": "Job description created successfully",
  "jobDescription": {
    /* job description object */
  }
}
```

## 2. Get Job Descriptions

**Endpoint:** `GET /api/v1/job-descriptions`

**Description:** Get all job descriptions belonging to the authenticated user (protected route).

**Headers:**

```
Accept: application/json
Authorization: Bearer <accessToken>
```

**Response:**

```json
{
  "jobDescriptions": [
    {
      /* job description object */
    }
    // ...more
  ]
}
```

## 3. Get Job Description by ID

**Endpoint:** `GET /api/v1/job-descriptions/:id`

**Description:** Get a single job description by ID (only if owned by the authenticated user).

**Headers:**

```
Accept: application/json
Authorization: Bearer <accessToken>
```

**Response:**

```json
{
  "jobDescription": {
    /* job description object */
  }
}
```

## 4. Update Job Description

**Endpoint:** `PUT /api/v1/job-descriptions/:id`

**Description:** Update a job description by ID (only if owned by the authenticated user).

**Headers:**

```
Accept: application/json
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "status": "string (optional)"
}
```

**Response:**

```json
{
  "message": "Job description updated successfully",
  "jobDescription": {
    /* updated job description object */
  }
}
```

## 5. Delete (Soft Delete) Job Description

**Endpoint:** `DELETE /api/v1/job-descriptions/:id`

**Description:** Soft delete a job description by ID (only if owned by the authenticated user). Sets `is_deleted` to true.

**Headers:**

```
Accept: application/json
Authorization: Bearer <accessToken>
```

**Response:**

```json
{
  "message": "Job description deleted (soft delete) successfully"
}
```
