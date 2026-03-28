# Phoenix Safety Guardian

Phoenix Safety Guardian is a React + TypeScript web application focused on personal safety workflows for women in India.

It includes an SOS flow, emergency contacts management, safety tool toggles, and safe-route planning UI in a clean, mobile-friendly interface.

## Table of contents

- [Project status](#project-status)
- [Core features](#core-features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [How to run the project](#how-to-run-the-project)
- [Build for production](#build-for-production)
- [Project structure](#project-structure)
- [Architecture notes](#architecture-notes)
- [UI and design system](#ui-and-design-system)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [Roadmap suggestions](#roadmap-suggestions)
- [Contributing](#contributing)
- [License](#license)

## Project status

- Current state: React frontend with a FastAPI backend scaffold.
- Backend: FastAPI backend available in the `backend/` folder.
- Data persistence: PostgreSQL-backed persistence is available through the backend APIs once the database is configured.
- Production readiness: Still requires frontend API integration, authentication, and real map/safety services.

## Core features

1. SOS emergency button with countdown dialog.
2. Emergency contacts add/edit/remove flow.
3. Safety tools panel with toggles such as stealth mode and voice distress detection.
4. Safe routes planner UI with safest/fastest/balanced tabs.
5. Responsive navigation and clean card-based interface.
6. Toast notifications for key user actions.

## Tech stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- shadcn/ui (Radix UI based components)
- React Router DOM
- TanStack Query (provider is configured for future API usage)
- Sonner toast notifications
- Lucide React icons

## Getting started

### Prerequisites

- Node.js 18.18+ (Node.js 20 LTS recommended)
- npm 9+

### Clone and install

```bash
git clone <your-repository-url>
cd phonix-safety-guardian
npm install
```

## Available scripts

- `npm run dev`: Starts Vite development server.
- `npm run build`: Creates an optimized production build.
- `npm run build:dev`: Builds using development mode.
- `npm run lint`: Runs ESLint.
- `npm run preview`: Serves the production build locally.

## How to run the project

```bash
npm run dev
```

Default local URL:

- `http://localhost:8080`

The Vite config is set to host on `::` and port `8080`, so it is reachable on local network interfaces where applicable.

## Build for production

```bash
npm run build
npm run preview
```

Build output is generated in the `dist/` directory.

## Project structure

```text
.
|-- backend/
|   |-- main.py
|   |-- database.py
|   |-- models.py
|   |-- schemas.py
|   |-- requirements.txt
|   `-- routers/
|       |-- contacts.py
|       |-- sos.py
|       `-- location.py
|-- src/
|   |-- components/
|   |   |-- HomePage.tsx
|   |   |-- Layout.tsx
|   |   |-- Navbar.tsx
|   |   |-- SosButton.tsx
|   |   `-- ui/                # shadcn/ui component library
|   |-- hooks/
|   |-- lib/
|   |-- pages/
|   |   |-- ContactsPage.tsx
|   |   |-- RoutesPage.tsx
|   |   |-- SafetyPage.tsx
|   |   `-- NotFound.tsx
|   |-- App.tsx
|   |-- main.tsx
|   `-- index.css
|-- public/
|-- tailwind.config.ts
|-- vite.config.ts
|-- package.json
`-- README.md
```

## Architecture notes

- Routing is managed through `react-router-dom` in `src/App.tsx`.
- `Layout` wraps all main pages with shared navigation, footer, and toaster.
- UI is built using composable shadcn/ui primitives in `src/components/ui`.
- Most feature pages still use local component state and should now be connected to the FastAPI backend.
- Global API state layer can be expanded via existing `QueryClientProvider`.
- Backend APIs are implemented with FastAPI, SQLAlchemy ORM, PostgreSQL, and Pydantic in the `backend/` folder.
- Automatic WhatsApp SOS delivery requires backend WhatsApp Cloud API configuration.

## UI and design system

- Tailwind theme defines a custom `phoenix` palette in `tailwind.config.ts`.
- Global design tokens and base styles live in `src/index.css`.
- Utility alias `@` points to `src` via Vite resolve config.

## Troubleshooting

### Port already in use

If port 8080 is occupied:

```bash
npm run dev -- --port 5173
```

### Clean reinstall dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

Windows PowerShell equivalent:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

### Lint issues

```bash
npm run lint
```

Fix reported issues before committing.

### Backend startup on Windows

If `uvicorn` is not recognized in PowerShell, run it through Python instead:

```powershell
cd backend
python -m uvicorn main:app --reload
```

If PostgreSQL rejects the login, set the correct connection string before starting the backend:

```powershell
$env:DATABASE_URL = "postgresql://postgres:your_real_password@localhost/phoenix_db"
python -m uvicorn main:app --reload
```

If automatic WhatsApp SOS sending is required, also set the backend WhatsApp environment variables before starting FastAPI:

```powershell
$env:WHATSAPP_ACCESS_TOKEN = "your_meta_access_token"
$env:WHATSAPP_PHONE_NUMBER_ID = "your_phone_number_id"
$env:WHATSAPP_API_VERSION = "v20.0"
python -m uvicorn main:app --reload
```

Without these values, SOS alerts are stored, but WhatsApp messages are not delivered.

### Backend folder setup

Backend dependencies are separate from the frontend. Install them from the `backend` directory:

```powershell
cd backend
pip install -r requirements.txt
```

## Deployment

Any static hosting that supports SPA fallback can host this project.

Typical options:

- Vercel
- Netlify
- GitHub Pages (with SPA routing setup)
- Firebase Hosting

Basic deploy flow:

1. Run `npm run build`.
2. Upload the generated `dist/` folder.
3. Configure rewrite/fallback so unknown routes return `index.html`.

## Roadmap suggestions

1. Connect the Contacts page to `GET /contacts`, `POST /contacts`, and `DELETE /contacts/{id}`.
2. Connect the SOS button to `POST /sos` and include browser geolocation when available.
3. Send live coordinates to `POST /location` while route or emergency flows are active.
4. Add real authentication (email/OTP, OAuth, or phone auth).
5. Integrate maps and geolocation APIs for real route intelligence.
6. Add automated tests for both frontend and backend.

## What To Do Next

After setting up the backend, this is the right order to continue the project:

1. Configure PostgreSQL and confirm the backend starts with `python -m uvicorn main:app --reload`.
2. Replace in-memory contact state in the React app with API calls to the backend.
3. Wire the SOS button to send the user's name and current coordinates to the backend.
4. Add browser geolocation permissions and periodic location updates.
5. Add error handling, loading states, and success states in the frontend.
6. Add authentication so alerts and locations are tied to real users.
7. Add production-grade features such as rate limiting, validation, logs, and deployment setup.

## Contributing

1. Fork and clone the repository.
2. Create a feature branch.
3. Make focused, tested changes.
4. Run lint/build checks.
5. Open a pull request with clear details.

## License

No license file is currently defined.

If you plan to open-source this project, add a `LICENSE` file (for example MIT, Apache-2.0, or GPL-3.0) and update this section.
