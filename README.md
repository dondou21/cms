# Church Management System (Desktop)

This project has been converted from a Next.js + MySQL web application to a standalone Desktop application via Electron + SQLite.

## Getting Started for Development

To run the application locally in development mode:

1. Copy `.env.example` to `.env` (if not done already)
   ```sh
   cp .env.example .env
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Initialize the database:
   ```sh
   node server/init_db.js
   ```

4. Run the application (this runs Next.js, Express server, and Electron app concurrently):
   ```sh
   npm run dev
   ```

## Packaging the Application

To build the project into an executable file (e.g. `.exe` on Windows):

1. Build the Next.js frontend and package it:
   ```sh
   npm run build
   ```

2. Check the `dist/` folder for the `.exe` setup file. It bundles the Next.js static files, the Node.js Express API server, and SQLite database in one installable package.
