# User Service

A production-ready, extensible Node.js microservice for user management and authentication using TypeScript, Express, MongoDB, and JWT-based authentication with best practices for modularity, configuration, and logging.

## Features

- **🔐 JWT-based Authentication** - Secure access and refresh token system
- **👥 User Management** - Complete CRUD operations for user profiles
- **🛡️ Role-Based Access Control** - Admin and user role separation
- **📊 Session Management** - Multi-device session tracking and management
- **🔒 Security-First** - Helmet, CORS, rate limiting, and input validation
- **📝 Centralized Messaging** - Standardized API responses and error handling
- **🔄 Event-Driven Architecture** - RabbitMQ integration ready
- **📈 Structured Logging** - Winston with daily rotation
- **🐳 Docker Ready** - Containerized deployment support
- **📚 TypeScript-First** - Full type safety and IntelliSense support

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 5+
- npm or yarn

### Installation

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd user-service
   npm install
   ```

2. **Environment Setup:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the service:**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

4. **Verify it's running:**
   ```bash
   curl http://localhost:3001/health
   ```

---

## 📚 API Documentation

### Base Configuration

- **Base URL**: `http://localhost:3001`
- **API Version**: `v1`
- **API Prefix**: `/api/v1`
- **Authentication**: Bearer Token (JWT)

### Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## 🌐 API Endpoints

### 🔓 Public Endpoints (No Authentication)

#### Health Check

```http
GET /health
GET /api/health
```

**Response:**

```json
{
  "success": true,
  "message": "Service is running",
  "data": {
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0"
  }
}
```

#### Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
```

**Register User:**

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

**Login:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "deviceInfo": "iPhone 15",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

**Refresh Token:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 🔒 Protected Endpoints (Authentication Required)

#### Authentication Management

```http
POST /api/v1/auth/logout
POST /api/v1/auth/logout-all
GET /api/v1/auth/profile
```

#### User Profile Management

```http
GET /api/v1/users/profile
PUT /api/v1/users/profile
DELETE /api/v1/users/profile
```

**Update Profile:**

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

### 👑 Admin Endpoints (Admin Role Required)

#### User Management

```http
GET /api/v1/auth/admin/users
GET /api/v1/users/admin/all
GET /api/v1/users/admin/:userId
PUT /api/v1/users/admin/:userId
DELETE /api/v1/users/admin/:userId
```

---

## 📊 Response Format

All APIs follow a standardized response format:

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0",
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information",
    "field": "field_name"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0"
  }
}
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3001
NODE_ENV=development
API_VERSION=1.0.0

# Database
MONGODB_URI=mongodb://localhost:27017/user-service

# JWT Configuration
JWT_ACCESS_SECRET=your-access-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Session Configuration
MAX_ACTIVE_SESSIONS=5
SESSION_EXPIRY_HOURS=24

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs
```

### Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request rate limiting
- **Input Validation** - Request data validation
- **Session Management** - Multi-device session tracking
- **Role-Based Access Control** - Admin/user role separation

---

## 🏗️ Architecture

### Folder Structure

```
user-service/
├── src/
│   ├── config/         # Configuration, logger, and DB connection
│   │   ├── server-config.ts
│   │   ├── logger-config.ts
│   │   ├── mongo-config.ts
│   │   ├── auth-config.ts
│   │   ├── public-routes-config.ts
│   │   └── index.ts
│   ├── controllers/    # Route handlers
│   │   ├── auth-controller.ts
│   │   ├── user-controller.ts
│   │   ├── info-controller.ts
│   │   └── index.ts
│   ├── services/       # Business logic
│   │   ├── auth-service.ts
│   │   ├── user-service.ts
│   │   └── index.ts
│   ├── middlewares/    # Express middlewares
│   │   ├── auth-middleware.ts
│   │   └── index.ts
│   ├── models/         # Database models
│   │   ├── user-model.ts
│   │   └── user-session-model.ts
│   ├── repositories/   # Data access layer
│   │   ├── user-repository.ts
│   │   ├── user-session-repository.ts
│   │   └── index.ts
│   ├── routes/         # API routes
│   │   ├── v1/
│   │   │   ├── auth-router.ts
│   │   │   ├── user-router.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── types/          # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   ├── utils/          # Utilities
│   │   ├── auth/       # Authentication utilities
│   │   ├── constants/  # Application constants
│   │   ├── helpers/    # Helper functions
│   │   ├── messages/   # Message utilities
│   │   ├── response/   # Response utilities
│   │   └── index.ts
│   ├── validators/     # Input validation
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   └── index.ts
│   └── events/         # Event-driven architecture
│       ├── publishers/
│       └── subscribers/
├── tests/              # Test files
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── e2e/           # End-to-end tests
├── docs/               # Documentation
│   ├── api/           # API documentation
│   ├── architecture/  # Architecture docs
│   └── deployment/    # Deployment guides
├── logs/               # Log files
├── index.ts            # Application entry point
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

### Key Components

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and data processing
- **Repositories**: Data access and database operations
- **Middlewares**: Authentication, validation, and error handling
- **Utils**: Shared utilities for messages, responses, and authentication
- **Config**: Centralized configuration management

---

## 🚀 Development

### Available Scripts

```bash
# Development
npm run dev          # Start with nodemon
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Docker
npm run docker:build # Build Docker image
npm run docker:run   # Run Docker container

# Utilities
npm run clean        # Clean build directory
```

### API Testing

```bash
# Health check
curl http://localhost:3001/health

# Register user
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

---

## 🔐 Security

### Authentication Flow

1. **Registration**: User creates account with email/password
2. **Login**: User authenticates and receives access/refresh tokens
3. **Token Refresh**: Automatic token renewal using refresh token
4. **Session Management**: Multi-device session tracking
5. **Logout**: Session invalidation and cleanup

### Security Measures

- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Session Limits**: Configurable active session limits
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Controlled cross-origin access
- **Helmet**: Security headers protection

---

## 📈 Monitoring & Logging

### Log Levels

- **ERROR**: Application errors and exceptions
- **WARN**: Warning conditions
- **INFO**: General information
- **DEBUG**: Detailed debugging information

### Log Rotation

- Daily log file rotation
- Compressed log archives
- Configurable retention periods

---

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t user-service .
```

### Run Container

```bash
docker run -p 3001:3001 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/user-service \
  -e JWT_ACCESS_SECRET=your-secret \
  user-service
```

### Docker Compose

```yaml
version: "3.8"
services:
  user-service:
    build: .
    ports:
      - "3001:3001"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/user-service
      - JWT_ACCESS_SECRET=your-secret
    depends_on:
      - mongo

  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

**This user service provides a robust foundation for user management and authentication in microservices architecture.**
