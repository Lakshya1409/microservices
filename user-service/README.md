# Node Base Template

A production-ready, extensible Node.js microservice boilerplate using TypeScript, Express, and best practices for modularity, configuration, and logging.

## Features

- Modular folder structure for scalability
- Centralized configuration and logging (Winston with daily rotation)
- Versioned API routing
- Ready for event-driven architecture (RabbitMQ, etc.)
- **MongoDB integration with Mongoose**
- TypeScript-first

## MongoDB Setup

- MongoDB connection is managed via [Mongoose](https://mongoosejs.com/).
- Connection URI is configured via the `MONGODB_URI` environment variable (see `.env.example`).
- The connection logic is in `src/config/mongo-config.ts` and is established before the server starts. If the connection fails, the process exits with an error.
- Extend the `src/repositories/` folder for models and data access logic (repositories do not manage connections).

## Folder Structure

```
node-base-template/
├── src/
│   ├── config/         # Centralized configuration, logger, and DB connection
│   │   ├── server-config.ts
│   │   ├── logger-config.ts
│   │   ├── mongo-config.ts
│   │   └── index.ts
│   ├── controllers/    # Route handler logic (controllers)
│   │   ├── info-controller.ts
│   │   └── index.ts
│   ├── events/         # Event-driven code (pub/sub, utils)
│   │   ├── publishers/
│   │   │   └── index.ts
│   │   ├── subscribers/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── middlewares/    # Express middlewares (auth, error, etc.)
│   │   └── index.ts
│   ├── repositories/   # Data access layer (DB models, repository classes)
│   │   └── index.ts
│   ├── routes/         # Express routers, versioned API structure
│   │   ├── v1/
│   │   │   ├── userRoutes.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── services/       # Business logic layer
│   │   └── index.ts
│   └── utils/          # Utility/helper functions
│       └── index.ts
├── index.ts            # Entrypoint, sets up Express app
├── package.json
├── tsconfig.json
├── Dockerfile
├── .dockerignore
└── logs/               # Log files (rotated by Winston)
```

## Folder/Component Explanations

- **config/**: All environment variable access, logger setup, and MongoDB connection logic. Extend `server-config.ts` for new config values.
- **controllers/**: Functions that handle HTTP requests. Add new controllers for new endpoints.
- **events/**: For event-driven code (e.g., RabbitMQ publishers/subscribers). Organize by `publishers/`, `subscribers/`, and shared `utils/`.
- **middlewares/**: Custom Express middleware (auth, error handling, etc.).
- **repositories/**: Data access logic (DB, cache, etc.). Includes only models and repository classes, not connection logic.
- **routes/**: API route definitions. Supports versioning (e.g., `v1/`, `v2/`).
- **services/**: Business/domain logic. Keep controllers thin by moving logic here.
- **utils/**: General-purpose utility functions.
- **logs/**: Log output, managed by Winston with daily rotation.

## Extending the Template

- Add new API versions: Create a new folder under `src/routes/` (e.g., `v2/`).
- Add new endpoints: Add a controller, then a route in the appropriate version folder.
- Add business logic: Implement in `services/` and call from controllers.
- Add event-driven features: Implement publishers/subscribers in `events/`.
- Add data access: Implement repositories and use in services. Add Mongoose models and repository classes in `src/repositories/`.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set your environment variables (including `MONGODB_URI`).
3. Make sure MongoDB is running and accessible.
4. Build and run:
   ```bash
   npm run build && npm start
   ```
5. API available at `http://localhost:<PORT>/api/v1/`

---

**This template is designed for rapid, clean microservice development. Extend each folder as your service grows!**
