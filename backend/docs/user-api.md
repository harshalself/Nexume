# User API Documentation

## 1. Register User

**Endpoint:** `POST /api/v1/auth/signup`

**Description:** Register a new user.

**Headers:**

```
Accept: application/json
```

**Request Body:**

```json
{
  "email": "string (required)",
  "password": "string (required)",
  "first_name": "string (required)",
  "last_name": "string (required)"
}
```

**Response:**

```json
{
  "message": "Sign up successful",
  "user": {
    /* user object */
  },
  "accessToken": "string"
}
```

---

## 2. User Sign In

**Endpoint:** `POST /api/v1/auth/signin`

**Description:** Log in an existing user.

**Headers:**

```
Accept: application/json
```

**Request Body:**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**

```json
{
  "message": "Sign in successful",
  "user": {
    /* user object */
  },
  "accessToken": "string"
}
```

---

## 3. Get Profile

**Endpoint:** `GET /api/v1/auth/profile`

**Description:** Fetch the authenticated user's profile.

**Headers:**

```
Accept: application/json
Authorization: Bearer <accessToken>
```

**Response:**

```json
{
  "message": "Profile fetched successfully",
  "user": {
    /* user object */
  }
}
```

---

## 4. Update Profile

**Endpoint:** `PATCH /api/v1/auth/profile`

**Description:** Update the authenticated user's profile.

**Headers:**

```
Accept: application/json
Authorization: Bearer <accessToken>
```

**Request Body:**

```json
{
  "first_name": "string (optional)",
  "last_name": "string (optional)",
  "profile_pic": "string (optional)"
}
```

**Response:**

```json
{
  "message": "Profile updated successfully",
  "user": {
    /* updated user object */
  }
}
```

---

## 5. Delete Profile

**Endpoint:** `DELETE /api/v1/auth/profile`

**Description:** Soft delete the authenticated user's account.

**Headers:**

```
Accept: application/json
Authorization: Bearer <accessToken>
```
