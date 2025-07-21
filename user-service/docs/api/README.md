# User Service API Documentation

## Overview

The User Service provides comprehensive user management and authentication functionality for the microservices architecture.

## Base URL

```
http://localhost:3001/api/v1
```

## Authentication

Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Response Format

All API responses follow a standardized format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0"
  }
}
```

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0"
  }
}
```

## Endpoints

### Authentication Endpoints

#### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "isVerified": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

#### POST /auth/login

Authenticate user and receive tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "isVerified": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

#### POST /auth/refresh

Refresh access token using refresh token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

#### POST /auth/logout

Logout current user session.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### POST /auth/logout-all

Logout from all user sessions.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out from all sessions"
}
```

### User Profile Endpoints

#### GET /user/profile

Get current user profile.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "profileImage": "https://example.com/image.jpg",
    "isActive": true,
    "isVerified": true,
    "role": "customer",
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /user/profile

Update current user profile.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "isActive": true,
    "isVerified": true,
    "role": "customer",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### DELETE /user/profile

Delete current user account.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### Admin Endpoints

#### GET /user/admin/all

Get all users (Admin only).

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search term for email or name
- `role` (optional): Filter by role
- `isActive` (optional): Filter by active status
- `isVerified` (optional): Filter by verification status

**Response:**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439011",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "customer",
        "isActive": true,
        "isVerified": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

#### GET /user/admin/:userId

Get user by ID (Admin only).

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "profileImage": "https://example.com/image.jpg",
    "isActive": true,
    "isVerified": true,
    "role": "customer",
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /user/admin/:userId

Update user by ID (Admin only).

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "role": "moderator",
  "isActive": true,
  "isVerified": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "role": "moderator",
    "isActive": true,
    "isVerified": true,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### DELETE /user/admin/:userId

Delete user by ID (Admin only).

**Headers:**

```
Authorization: Bearer <admin_access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Error Codes

| Code                 | Description                   |
| -------------------- | ----------------------------- |
| UNAUTHORIZED         | Authentication required       |
| FORBIDDEN            | Insufficient permissions      |
| INVALID_CREDENTIALS  | Wrong email or password       |
| TOKEN_EXPIRED        | Access token has expired      |
| INVALID_TOKEN        | Invalid or malformed token    |
| SESSION_EXPIRED      | User session has expired      |
| ACCOUNT_LOCKED       | Account is temporarily locked |
| USER_INACTIVE        | User account is inactive      |
| USER_UNVERIFIED      | User email is not verified    |
| VALIDATION_ERROR     | Request validation failed     |
| USER_NOT_FOUND       | User does not exist           |
| EMAIL_ALREADY_EXISTS | Email is already registered   |

## Rate Limiting

- Authentication endpoints: 5 requests per 15 minutes
- Other endpoints: 100 requests per 15 minutes

## Security

- All passwords are hashed using bcrypt
- JWT tokens are signed with secure keys
- Session management with automatic cleanup
- Input validation and sanitization
- CORS protection
- Helmet security headers
