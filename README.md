# 🍬 Math Crush — Gamified Middle School Math Learning Platform

> **Hackathon Edition** — Turn boring math homework into a Candy Crush style game! Earn stars, unlock levels, and top the leaderboard while mastering Grade 6–8 math curriculum.

---

## 🌟 Overview

**Math Crush** is an interactive, gamified learning platform built for middle school students. Inspired by Candy Crush's level progression system, students progress through a winding map of math challenges. Each level contains multiple choice math questions designed around middle school curriculum topics (Fractions, Decimals, Percentages, Ratios, Algebra, and Geometry).

### Key Highlights:
- 🍬 **Candy Crush Level Map**: Visual winding path with floating islands, 3D candy buttons, and player location markers.
- ⭐ **3-Star Rating System**: Earn 1, 2, or 3 stars based on score accuracy (50%, 70%, 90% thresholds).
- 🏆 **Live Podium Leaderboard**: Compete with classmates for top points and stars.
- 🎮 **Tactile Gameplay Arena**: Instant answer feedback with green glows, red shake animations, step-by-step math explanations, and confetti explosions.
- 🔐 **JWT Authentication**: Student registration and login with local session state.
- 🛡️ **Privacy & COPPA Compliant**: Dedicated privacy policy modal for student data safety.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Core** | React 19 + Vite 8 + TypeScript |
| **Styling** | Tailwind CSS v4 + Custom 3D Game Design Tokens |
| **Animations** | Framer Motion + Canvas Confetti |
| **Routing & Icons** | React Router v7 + Lucide Icons |
| **Backend API** | Node.js + Express.js |
| **Auth & Security** | JWT (`jsonwebtoken`) + Password Hashing (`bcryptjs`) |
| **Database** | PostgreSQL (DDL Schema) + Embedded SQLite Fallback (`better-sqlite3`) |

---

## 📂 Project Structure (Monorepo)

```
gamingmaths/
├── package.json               # Root monorepo script configuration (concurrent runner)
├── README.md                  # Comprehensive documentation
│
├── backend/                   # Express.js REST API Server
│   ├── package.json
│   ├── server.js              # Entry point & API mounts (Port 5000)
│   ├── db.js                  # Dual DB adapter (PostgreSQL + SQLite fallback)
│   ├── schema.sql             # PostgreSQL DDL table definitions
│   ├── seedData.js            # Seed data (5 Levels, 50 Math Questions)
│   ├── middleware/
│   │   └── auth.js            # JWT bearer token verification
│   └── routes/
│       ├── auth.js            # POST /register, POST /login, GET /me
│       ├── levels.js          # GET /levels, GET /levels/:id/questions
│       ├── progress.js        # POST /progress/complete, GET /progress
│       └── leaderboard.js     # GET /leaderboard
│
└── frontend/                  # React + Vite TypeScript App
    ├── package.json
    ├── vite.config.ts         # Vite server, Tailwind plugin & API proxy config
    ├── index.html
    └── src/
        ├── index.css          # Candy design system, 3D buttons & glow effects
        ├── App.tsx            # Protected routes & App layout
        ├── context/
        │   └── AuthContext.tsx# User session & points state management
        ├── services/
        │   └── api.ts         # Axios client with bearer token interceptor
        ├── components/
        │   ├── Navbar.tsx     # Header bar with live points 💎, stars ⭐, level 🍬
        │   └── Footer.tsx     # App footer with interactive Privacy Policy Modal
        └── pages/
            ├── LandingPage.tsx   # Hero section, feature grid & login/register modal
            ├── DashboardPage.tsx # Student stats, progress bar & math topics
            ├── LevelMapPage.tsx # Winding level map with bouncy candy nodes
            ├── GameplayPage.tsx # 10 multiple-choice questions & feedback
            └── LeaderboardPage.tsx# Top 3 podium cards & full student rank table
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24 recommended)
- **npm**: v10.0.0 or higher

### Installation & Setup

1. **Clone the repository & install root dependencies**:
   ```bash
   git clone https://github.com/NArayan1703/mathcrush.git
   cd gamingmaths
   npm install
   ```

2. **Install subproject dependencies** (Backend & Frontend):
   ```bash
   npm --prefix backend install
   npm --prefix frontend install
   ```

3. **Launch Both Servers Concurrently** (Single Command):
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   - **Frontend Application**: `http://localhost:3000`
   - **Backend API Health Check**: `http://localhost:5000/api/health`

---

## 🎮 Math Content & Curriculum Coverage

The demo includes **5 Levels** containing **50 curated middle school math questions**:

| Level | Topic | Grade Level | Questions |
| :---: | :--- | :---: | :---: |
| **Level 1** | Fraction Fundamentals 🍕 | Grade 6 | 10 |
| **Level 2** | Decimal Discoveries 🪙 | Grade 6 | 10 |
| **Level 3** | Percentage Power 📊 | Grade 7 | 10 |
| **Level 4** | Ratio Realms ⚖️ | Grade 7 | 10 |
| **Level 5** | Algebra & Geometry Quest 📐 | Grade 8 | 10 |

---

## 🗄️ Database Schema & API Reference

### Database DDL (`backend/schema.sql`)

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    total_points INT DEFAULT 0,
    current_level INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Levels Table
CREATE TABLE levels (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    order_number INT UNIQUE NOT NULL
);

-- Questions Table
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    level_id INT REFERENCES levels(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_answer VARCHAR(10) NOT NULL,
    explanation TEXT
);

-- Progress Table
CREATE TABLE progress (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    level_id INT REFERENCES levels(id) ON DELETE CASCADE,
    stars INT DEFAULT 0,
    score INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, level_id)
);
```

### REST API Endpoints

#### Authentication
- `POST /api/auth/register` — Register a new student account (`name`, `email`, `password`)
- `POST /api/auth/login` — Sign in to an existing account (`email`, `password`)
- `GET /api/auth/me` — Fetch logged-in user profile & total stars

#### Levels & Gameplay
- `GET /api/levels` — Fetch all levels with user progress & unlock statuses
- `GET /api/levels/:id` — Fetch single level details
- `GET /api/levels/:id/questions` — Fetch 10 questions for a specific level

#### Progress & Leaderboard
- `POST /api/progress/complete` — Record level completion score, calculate stars & unlock next level
- `GET /api/progress` — Fetch completed levels for current user
- `GET /api/leaderboard` — Fetch student rankings sorted by total points & stars

---

## 📜 License

This project is licensed under the **ISC License**. 
