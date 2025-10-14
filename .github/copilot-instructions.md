# Copilot Instructions

This document provides instructions for AI coding agents to effectively contribute to this project.

## Project Overview

This is a monorepo containing a client-side application and a server-side application.

- **Client:** The client is a [Next.js](httpss://nextjs.org/) application located in the `client` directory. It uses [React](httpss://react.dev/) and [Tailwind CSS](httpss://tailwindcss.com/).
- **Server:** The server is a [NestJS](httpss://nestjs.com/) application located in the `server` directory. It uses [TypeScript](httpss://www.typescriptlang.org/) and provides a RESTful API for the client.

## Key Technologies

- **Frontend:** Next.js, React, Tailwind CSS, TypeScript
- **Backend:** NestJS, TypeScript
- **Database:** (Not specified, but likely a relational database like PostgreSQL or MySQL)
- **Authentication:** (Not specified, but likely JWT-based authentication)

## Development Workflow

### Client

To run the client application in development mode, navigate to the `client` directory and run the following command:

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`.

### Server

To run the server application in development mode, navigate to the `server` directory and run the following command:

```bash
npm run start:dev
```

This will start the development server at `http://localhost:3001`.

## Code Style and Conventions

- **Linting:** The project uses ESLint to enforce a consistent code style. Before committing any changes, make sure to run `npm run lint` in both the `client` and `server` directories to check for any linting errors.
- **Formatting:** The project uses Prettier to automatically format the code. You can run `npm run format` in both the `client` and `server` directories to format the code.

## API Communication

The client communicates with the server through a RESTful API. The API endpoints are defined in the `server/src/main.ts` file. When adding new API endpoints, make sure to follow the existing conventions and document them properly.

## Authentication

The application uses JWT-based authentication to protect the API endpoints. The authentication logic is implemented in the `server/src/auth` directory. When adding new protected routes, make sure to use the `AuthGuard` to protect them.

## Database

The server uses a relational database to store the data. The database schema is defined in the `server/src/database` directory. When making changes to the database schema, make sure to create a new migration file and update the database accordingly.
