# JEFF G. WILSON — Personal Portfolio & AI Research Web Application

A full-stack personal portfolio and research portal built with **Liquid Glass & Obsidian Refraction** design systems, powered by a **FastAPI** backend, **PostgreSQL / SQLite** database via SQLAlchemy ORM, and a **React 18 TypeScript** single-page application.

---

## 🌟 Key Highlights & Architecture

- **Visual Design System**: Faithfully crafted from Stitch design specifications (`ui/liquid_glass/` and `ui/obsidian_refraction/`). Includes authentic multi-layered backdrop blurs (`backdrop-filter: blur(24px/32px/40px)`), glowing ambient light blobs, tactile SVG noise texture overlays, and dual-mode styling (**Liquid Glass Dark Mode** & **Frosted Ice Light Mode** with automatic system preference detection).
- **100% Dynamic Backend-Driven Content**: No hardcoded portfolio data in components. All profiles, projects, research papers, experience timeline nodes, education records, conference events, certifications, awards, skills, media, CVs, and client inquiries are fetched from the REST API and stored in the database.
- **Academic Research Portal**: Comprehensive showcase of research papers, including the **TrustRAG: Multimodal Retrieval-Augmented Generation** architecture, citation copier, abstract breakdowns, methodology notes, and PDF viewer/download links.
- **Interactive "Work With Me" Proposal System**: Multi-path inquiry flow with dedicated form paths for **Research Collaboration**, **Web Platforms**, **Mobile Apps (iOS/Android)**, and **General Inquiries** with real-time submission to the database and CMS notifications.
- **Complete Admin CMS**:
  - Secure JWT authentication with Bcrypt password hashing (`admin@jeffgwilson.com` / `AdminPass123!`).
  - Interactive Dashboard with KPI bento cards, unread inquiry indicators, category distribution telemetry, and recent audit activity feed.
  - Live Profile & Avatar photo manager with instant preview, replacement, and safe file uploads.
  - Complete CRUD for Projects, Research Papers, Experience, Education, Conferences, Certifications, Awards, Skills, and Media Library.
  - Curriculum Vitae versioning manager with one-click active download switching.
  - Inquiries pipeline manager (New, Reviewing, Contacted, In Discussion, Completed, Archived) with mailto client triggers.

---

## 📁 Project Structure

```
My-Protfolio/
├── backend/                        # FastAPI Backend Application
│   ├── app/
│   │   ├── api/                    # REST API Routers
│   │   │   ├── auth.py             # Login, password change, user profile
│   │   │   ├── profile.py          # Public & admin profile endpoints + avatar upload
│   │   │   ├── projects.py         # Projects CRUD & slug router
│   │   │   ├── research.py         # Research papers CRUD
│   │   │   ├── experience.py       # Experience timeline CRUD
│   │   │   ├── education.py        # Education history CRUD
│   │   │   ├── conferences.py      # Conference events CRUD
│   │   │   ├── certifications.py   # Certifications CRUD
│   │   │   ├── awards.py           # Awards & honors CRUD
│   │   │   ├── skills.py           # Skills matrix CRUD
│   │   │   ├── inquiries.py        # "Work With Me" inquiries & pipeline
│   │   │   ├── media.py            # Media library & file uploads
│   │   │   ├── cv.py               # Curriculum Vitae manager
│   │   │   ├── settings.py         # Global site settings & SEO
│   │   │   └── stats.py            # Dashboard KPI metrics
│   │   ├── auth/                   # JWT & Bcrypt password handling
│   │   ├── models/                 # 14 SQLAlchemy ORM models
│   │   ├── schemas/                # Pydantic validation schemas
│   │   ├── services/               # Asynchronous safe file storage service
│   │   ├── utils/                  # Slug generator & helpers
│   │   ├── config.py               # Pydantic Settings
│   │   ├── database.py             # SQLAlchemy Session & Engine
│   │   └── main.py                 # FastAPI App with CORS & static serving
│   ├── requirements.txt            # Python dependencies
│   ├── seed.py                     # Initial database seeding script
│   ├── Dockerfile                  # Backend production Dockerfile
│   └── .env                        # Backend environment configuration
│
├── frontend/                       # Vite React TypeScript Application
│   ├── src/
│   │   ├── admin/                  # Admin CMS Pages & Layout
│   │   │   ├── AdminDashboard.tsx  # KPI telemetry & activity feed
│   │   │   ├── AdminProfile.tsx    # Live profile & avatar photo editor
│   │   │   ├── AdminProjects.tsx   # Projects list with quick toggles
│   │   │   ├── AdminProjectEdit.tsx# Add/edit project form
│   │   │   ├── AdminResearch.tsx   # Research papers management
│   │   │   ├── AdminResearchEdit.tsx
│   │   │   ├── AdminExperience.tsx # Experience CRUD
│   │   │   ├── AdminEducation.tsx  # Education CRUD
│   │   │   ├── AdminConferences.tsx# Conferences CRUD
│   │   │   ├── AdminCertifications.tsx
│   │   │   ├── AdminSkills.tsx     # Skills matrix CRUD
│   │   │   ├── AdminMedia.tsx      # Media gallery & file upload
│   │   │   ├── AdminCV.tsx         # CV versioning manager
│   │   │   ├── AdminInquiries.tsx  # Inquiries inbox & pipeline status
│   │   │   ├── AdminSettings.tsx   # Site metadata & password change
│   │   │   ├── AdminLogin.tsx      # Glassmorphic login page
│   │   │   └── ProtectedRoute.tsx  # Route guard
│   │   ├── api/                    # API client methods & auth interceptor
│   │   ├── components/
│   │   │   ├── common/             # Glass UI Library (Cards, Buttons, Inputs, Modals, Badges)
│   │   │   └── layout/             # Floating Navbar, Footer, Background Glows, Layouts
│   │   ├── contexts/               # ThemeContext, AuthContext, ToastContext
│   │   ├── pages/                  # Public Pages
│   │   │   ├── Home.tsx            # Hero, Bento Grid, Featured Spotlight, About Snapshot
│   │   │   ├── About.tsx           # Full Biography, Education, Philosophy, Skills
│   │   │   ├── Projects.tsx        # Searchable & filterable project catalog
│   │   │   ├── ProjectDetail.tsx   # Detailed project architecture case study
│   │   │   ├── Research.tsx        # TrustRAG paper breakdown & citations
│   │   │   ├── Experience.tsx      # Vertical Liquid Glass timeline
│   │   │   ├── Education.tsx       # Degree records
│   │   │   ├── Conferences.tsx     # Vibrant Gujarat 2026 & summit engagements
│   │   │   ├── Certifications.tsx  # Credentials showcase
│   │   │   ├── Awards.tsx          # Honors & awards
│   │   │   ├── WorkWithMe.tsx      # Multi-flow collaboration inquiry form
│   │   │   ├── Contact.tsx         # Direct contact channels
│   │   │   └── CVViewer.tsx        # PDF CV download & viewer
│   │   ├── types/                  # TypeScript definitions
│   │   ├── App.tsx                 # Root router
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Liquid Glass design system CSS variables
│   ├── package.json
│   ├── tailwind.config.js          # Extended Liquid Glass theme tokens
│   ├── vite.config.ts              # Proxy & alias configuration
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml              # Complete container orchestration
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with Jeff G. Wilson's profile, papers, and projects
python seed.py

# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```
- The backend API will be available at: `http://127.0.0.1:8000`
- Interactive Swagger documentation: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
- The frontend will be available at: `http://localhost:5173`

---

## 🔐 Default Admin Credentials

- **Email**: `admin@jeffgwilson.com`
- **Password**: `AdminPass123!`
- **Admin Console Route**: `http://localhost:5173/admin` or `http://localhost:5173/admin/login`

*(You can change the password at any time via the Admin Settings page).*

---

## 🐳 Docker Deployment

To launch the complete application with Docker Compose:

```bash
docker-compose up --build
```
- Public Portfolio: `http://localhost:5173`
- Backend API: `http://localhost:8000`

---

© 2026 Jeff G. Wilson. Built with Liquid Glass & Obsidian Refraction design systems.
