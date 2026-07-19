# ✨ PrepAI — Your AI-Powered Interview Coach

PrepAI turns a job description and a candidate profile into a focused interview-preparation plan. Instead of preparing from generic question lists, users receive advice tailored to the specific role they want.

> Upload a résumé, paste the target job description, and let PrepAI identify what to study, what questions to expect, and how to present your experience with confidence.

## Why build PrepAI?

Interview preparation is often fragmented: candidates read the job description, compare it against their résumé, search for questions, then try to form a study plan. This takes time and makes it easy to miss the skills that matter most for a particular role.

PrepAI brings those steps together. It analyzes the candidate's background alongside the role requirements and produces a structured, practical preparation guide. The goal is to help candidates prepare deliberately—not just broadly.

## What it does

After a user signs in and provides a target job description, résumé PDF, and optional self-description, PrepAI generates an interview report with:

- **Match score** — an at-a-glance indication of how the profile aligns with the role.
- **Technical interview questions** — likely questions, the interviewer’s intent, and guidance for strong answers.
- **Behavioral interview questions** — role-relevant questions with answer guidance.
- **Skill-gap analysis** — missing or weaker skills, prioritized by severity.
- **Day-by-day preparation plan** — actionable study tasks and focus areas.
- **Tailored résumé PDF** — a downloadable résumé prepared from the stored report information.

Users can also revisit their earlier interview reports from their dashboard.

## Product flow

```text
Create account / sign in
          ↓
Add job description + résumé PDF + optional self-description
          ↓
PrepAI analyzes the profile and role requirements
          ↓
Review match score, questions, skill gaps, and preparation plan
          ↓
Download a tailored résumé and return to saved reports anytime
```

## Technology

| Area             | Tools                                                        |
| ---------------- | ------------------------------------------------------------ |
| Frontend         | React 19, Vite, React Router, Axios, Tailwind CSS            |
| Backend          | Node.js, Express 5, MongoDB, Mongoose                        |
| Authentication   | JWT stored in HTTP cookies, bcrypt password hashing          |
| AI and documents | Google GenAI, Zod structured outputs, PDF parsing, Puppeteer |
| Testing          | Vitest, React Testing Library, Supertest                     |
| Code quality     | ESLint, Prettier, V8 coverage                                |

## Repository structure

```text
PrepAi/
├── prepai-frontend/      # React user interface
│   └── src/
│       ├── features/auth/       # Authentication pages and state
│       ├── features/interview/  # Report creation and viewing
│       └── lib/                 # Shared API client
├── prepai-backend/       # Express API
│   └── src/
│       ├── controllers/         # Request handlers
│       ├── middlewares/         # Auth and upload handling
│       ├── models/              # MongoDB schemas
│       ├── routes/              # API endpoints
│       └── services/            # AI and PDF generation
└── README.md
```

## Getting started

### Prerequisites

- Node.js 20 or later
- npm
- A MongoDB database
- A Google GenAI API key

### 1. Install dependencies

Install the frontend and backend dependencies independently:

```powershell
cd D:\Projects\PrepAi\prepai-frontend
npm.cmd install

cd D:\Projects\PrepAi\prepai-backend
npm.cmd install
```

`npm.cmd` is used in the commands above because this PowerShell environment blocks `npm.ps1` through its execution policy. In Command Prompt, Git Bash, or a PowerShell session without that restriction, you can use `npm` normally.

### 2. Configure the backend

Create a `.env` file inside `prepai-backend`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_random_secret
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

Never commit `.env` files or real credentials.

### 3. Start the application

Start the API server:

```powershell
cd D:\Projects\PrepAi\prepai-backend
npm.cmd run dev
```

In a second terminal, start the frontend:

```powershell
cd D:\Projects\PrepAi\prepai-frontend
npm.cmd run dev
```

The frontend normally runs at `http://localhost:5173`; the API defaults to `http://localhost:3000`.

## API overview

| Method | Endpoint                                       | Purpose                      | Authentication |
| ------ | ---------------------------------------------- | ---------------------------- | -------------- |
| POST   | `/api/auth/register`                           | Create an account            | Public         |
| POST   | `/api/auth/login`                              | Sign in                      | Public         |
| GET    | `/api/auth/logout`                             | Sign out                     | Public         |
| GET    | `/api/auth/get-me`                             | Read the signed-in user      | Required       |
| POST   | `/api/interview/`                              | Generate an interview report | Required       |
| GET    | `/api/interview/`                              | List a user’s reports        | Required       |
| GET    | `/api/interview/report/:interviewId`           | Read one report              | Required       |
| POST   | `/api/interview/resume/pdf/:interviewReportId` | Download tailored résumé PDF | Required       |

## Testing, code quality, and CI/CD

Both applications include automated tests, code-style validation, and a quality gate. These checks help catch regressions early and keep behavior stable as the app grows.

### CI/CD

This repository includes a GitHub Actions workflow at `.github/workflows/quality.yml`. It runs on `push` and `pull_request` events targeting `main`, installs dependencies for both `prepai-frontend` and `prepai-backend`, and executes `npm run check` in each package to validate the full quality gate.

### Quality gate expectations

- `npm.cmd run lint` checks for code-style issues and common JavaScript/React bugs.
- `npm.cmd run format` verifies Prettier formatting.
- `npm.cmd run test` verifies functionality with the current test suite.
- `npm.cmd run test:coverage` produces a coverage report so you can verify the scope of code exercised by tests.
- `npm.cmd run check` executes the full quality gate for each app and should pass before creating a pull request.

### Full checks

The frontend check runs linting, formatting validation, tests, and a production build:

```powershell
cd D:\Projects\PrepAi\prepai-frontend
npm.cmd run check
```

The backend check runs linting, formatting validation, and tests:

```powershell
cd D:\Projects\PrepAi\prepai-backend
npm.cmd run check
```

### Recommended workflow

1. Install dependencies and start development.
2. Run `npm.cmd run lint` and `npm.cmd run format` regularly.
3. Write or update tests for any changed behavior.
4. Run `npm.cmd run test` and `npm.cmd run test:coverage` locally.
5. Run `npm.cmd run check` in the package you changed before submitting code.

### Individual commands

Run these from either `prepai-frontend` or `prepai-backend`:

| Command                     | What it does                                    |
| --------------------------- | ----------------------------------------------- |
| `npm.cmd run lint`          | Finds JavaScript and React code-quality issues. |
| `npm.cmd run format`        | Checks that Prettier formatting is applied.     |
| `npm.cmd run format:write`  | Applies Prettier formatting automatically.      |
| `npm.cmd run test`          | Runs all automated tests once.                  |
| `npm.cmd run test:watch`    | Keeps tests running while you develop.          |
| `npm.cmd run test:coverage` | Generates terminal and HTML coverage reports.   |

Coverage reports are saved to the `coverage/` directory within the relevant application.

## Contributing workflow

1. Create a branch for the change.
2. Add or update tests with the behavior you change.
3. Run `npm.cmd run check` in both application folders.
4. Keep secrets out of source control and use `.env` for local configuration.
