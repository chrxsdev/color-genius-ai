## PROJECT DOCUMENTATION

This document provides a concise and structured README instructions for generating the documentation for this repository.

Goal
- Produce a clear README that explains what the project is, how it’s structured, which technologies it uses, and how to run it.
- Be creative but not flashy. Avoid buzzwords.

Audience and tone
- Audience: developers and non-technical stakeholders new to the repo.
- Tone: clear, friendly, practical. Keep explanations moderate in technical depth.

Scope
- Include fundamental information about the project idea and structure.
- Explain what it does, its organization, tech stack, and how to run it.
- Avoid deep internal implementation details.

Required sections (in order)
1) Title
   - Project name and a one-line tagline.
2) Badges and logo
   - Place a logo at the top if available.
   - Add versioning and status badges using shields.io.
     Example:
     ![Version](https://img.shields.io/badge/version-INSERT_VERSION-blue)
     ![Build](https://img.shields.io/badge/build-passing-brightgreen)
3) Description
   - 2–4 short paragraphs: problem, target users, key benefits.
4) Features
   - 5–8 bullet points of high-level capabilities.
5) Project structure
   - A tree or bullets describing top-level folders and their purpose.
     Example:
     /src        application source code
     /docs       documentation
     /tests      test suites
     /scripts    setup and maintenance scripts
6) Tech stack
   - Primary languages, frameworks, libraries, and major services.
7) Getting started
   - Prerequisites with versions.
   - Installation steps.
   - Configuration steps (env vars, secrets) without exposing sensitive values.
   - Run commands for dev and prod.
     Example:
     npm install
     npm run dev
     npm run build && npm start
8) Usage
   - Minimal examples or common commands. Include sample requests for APIs.
9) Configuration
   - Key environment variables and config files with short explanations.
10) Testing
    - How to run tests and view coverage.
11) Deployment
    - Brief notes for typical deployment targets (This project is deployed in Vercel).
12) Roadmap or limitations
    - Optional planned items or known constraints.
13) License
    - State the license and link to LICENSE.
14) Contributing
    - Basic steps or link to CONTRIBUTING.md.

Formatting rules
- Use simple Markdown headings and bullet lists.
- Keep sections succinct.
- Use code blocks for commands and API examples.
- Do not include credentials or secrets.

Inputs and placeholders (fill or infer)
- PROJECT_NAME: INSERT_PROJECT_NAME
- TAGLINE: INSERT_TAGLINE
- LOGO_URL: INSERT_LOGO_URL (omit section if unknown)
- VERSION: INSERT_VERSION or infer from project metadata
- TECH_STACK: infer from files or list placeholders
- COMMANDS: infer from package.json, Makefile, or Dockerfile

Acceptance criteria
- Renders cleanly on GitHub.
- All required sections exist, TODO placeholders allowed if unknown.
- Explains what it is, structure, technologies, and how to run it.
- Includes a logo and shields.io badges if URLs or metadata exist.
- Concise and avoids unnecessary deep dives.

Now generate the README using the repo context if available. If information is missing, use clear TODO placeholders.
```

### Example README skeleton Copilot should produce

```
# ColorGeniusAI · TAGLINE

![Logo]: Use the logo in /public/logo.png
![Version](https://img.shields.io/badge/version-VERSION-blue)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

## Description
Briefly describe the problem, who it helps, and the core value. Keep it 2–4 short paragraphs.
Example: PROJECT_NAME streamlines X by Y so teams can Z.

## Features
- MVP: short benefit-focused line (Generating color palettes based on AI analysis)

## Project structure
```
Analyze the repo structure and summarize folders
```

## Tech stack
- Language: Node.js 20, TypeScript
- Frameworks: Nextjs, React 19
- Data: Supabase, PostgreSQL 15
- Infra: Vercel
- Other: aisdk, Gemini API

## Getting started
Prerequisites
- Node.js >= 20
- Docker and Docker Compose
- PostgreSQL 15

Install
```
npm install
```

Configure
- Copy `.env.example` to `.env` and set required values:
  - `DATABASE_URL`: PostgreSQL connection string
  - `PORT`: server port, default 3000

Run
```
npm run dev
# or
docker compose up --build
```

Build and start
```
npm run build && npm start
```

## Usage
- REST API base URL: `http://localhost:3000/api`
- Example:
```
curl -s http://localhost:3000/api/health
```

## Configuration
- `.env`: runtime configuration
- `config/default.yaml`: non-secret defaults
- Important env vars:
  - `LOG_LEVEL`: debug, info, warn, error
  - `JWT_SECRET`: set securely in production


## Roadmap / limitations
- TODO: list planned features or known constraints:
  - Analyze image and suggest color palettes
  - Edit Palettes
  - Make copy of other palettes
  - Share palettes via link
  - Social Login (Github, magic link)
  - Collaboration features (comments, version history, add friends)

## License
MIT. See [LICENSE](./LICENSE).

## Contributing
Issues and PRs are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.