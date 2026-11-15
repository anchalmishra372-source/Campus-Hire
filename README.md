# Campus Hire — Full MERN Job Portal

A complete, polished educational MERN project with a responsive interface and eight requested features.

## Included features
1. Admin dashboard with platform statistics and recent jobs
2. Recruiter applicants dashboard with application status management
3. Student profile with PDF/DOC/DOCX resume upload
4. Recruiter job create, edit and delete
5. Student saved jobs / wishlist
6. In-app notifications
7. Analytics dashboard with charts
8. Deployment configuration for Render + Vercel

## Requirements
- Node.js 20 or newer
- MongoDB Atlas account or local MongoDB
- VS Code

## Run it after extracting

### Backend
Open a terminal in the `Server` folder:
```bash
npm install
```
Copy `.env.example` to `.env` and enter your MongoDB connection string and a long JWT secret.
Then run:
```bash
npm run dev
```
Backend runs at `http://localhost:8000`.

### Frontend
Open another terminal in the `Client` folder:
```bash
npm install
```
Copy `.env.example` to `.env`.
Then run:
```bash
npm run dev
```
Open the URL printed by Vite (normally `http://localhost:5173`).

## Create an admin account
Public signup supports Student and Recruiter only. Register a normal account, then open MongoDB Compass / Atlas and change that user's `role` field to `admin`. Log out and log in again.

## Notes
- The application uses MongoDB for persistent data.
- Uploaded resumes are stored in `Server/uploads` for local development. For production, configure cloud object storage.
- This is a final-year-project MVP. Before exposing it publicly, add production-grade rate limiting, email verification, monitoring, secure file scanning/storage, and review deployment environment variables.
