# 🍬 Math Crush - Gamified Middle School Math Learning Platform

Math Crush is a Candy Crush inspired gamified math learning platform designed for middle-school students (Grades 6–8). Students navigate a winding level map, answer interactive math questions, earn 3-star ratings, gain points, and climb the live Hall of Fame leaderboard!

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Frontend Core** | React 19 + Vite 8 + TypeScript |
| **Styling** | Tailwind CSS v4 + Custom 3D Game Design Tokens |
| **Animations** | Framer Motion + Canvas Confetti |
| **Routing & Icons** | React Router v7 + Lucide Icons |
| **Backend API** | Node.js + Express.js |
| **Auth & Security** | JWT (`jsonwebtoken`) + Password Hashing (`bcryptjs`) |
| **Database** | Supabase PostgreSQL + HTTPS REST SDK (`@supabase/supabase-js`) |

---

## 📂 Project Structure (Monorepo)

```
gamingmaths/
├── package.json               # Root monorepo script configuration
├── README.md                  # Comprehensive documentation
│
├── backend/                   # Express.js REST API Server
│   ├── package.json
│   ├── server.js              # Entry point & API mounts
│   ├── db.js                  # Supabase PostgreSQL & REST SDK database manager
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
└── frontend/                  # React + Vite Single Page Application
    ├── package.json
    ├── vercel.json            # Vercel Vite Frontend configuration
    ├── index.html
    ├── public/
    │   ├── favicon.png        # 3D Candy gem favicon
    │   └── hero-banner.jpg    # 3D Candy world hero artwork
    └── src/
        ├── App.tsx            # Routes setup & ProtectedRoute guards
        ├── index.css          # Tailwind CSS + Candy Crush 3D design system
        ├── context/
        │   └── AuthContext.tsx # Student session state & live points tracking
        ├── services/
        │   └── api.ts         # Axios client instance with Bearer token interceptor
        ├── types/
        │   └── index.ts       # TypeScript interfaces (User, Level, Question, Progress)
        ├── components/
        │   ├── Navbar.tsx     # Navigation bar with live points, stars & mobile ribbon
        │   └── Footer.tsx     # Footer featuring interactive Privacy Policy Modal
        └── pages/
            ├── LandingPage.tsx   # Hero section & Login/Register Modals
            ├── DashboardPage.tsx # Student stats overview & topic cards
            ├── LevelMapPage.tsx  # Candy Crush level map path
            ├── GameplayPage.tsx  # Math question arena with confetti & feedback
            └── LeaderboardPage.tsx# Top 3 podium cards & student rank table
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation

1. **Clone & Install Dependencies**:
   ```bash
   git clone https://github.com/NArayan1703/mathcrush.git
   cd mathcrush
   npm run install:all
   ```

2. **Start Development Servers**:
   ```bash
   npm run dev
   ```
   - **Frontend**: Runs locally at `http://localhost:3000`
   - **Backend**: Runs locally at `http://localhost:5000`

---

## 🗄️ Database Schema (PostgreSQL)

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    total_points INT DEFAULT 0,
    current_level INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS levels (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    order_number INT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
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

CREATE TABLE IF NOT EXISTS progress (
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

---

## 🏆 Star Rating Rules

| Accuracy Score | Stars Awarded | Status |
| :--- | :---: | :--- |
| **100%** | ⭐⭐⭐ **3 Stars** | Perfect Score! |
| **80% or over** | ⭐⭐ **2 Stars** | Great Job! |
| **60% or over** | ⭐ **1 Star** | Level Passed (Unlocks Next Level) |
| **Under 60%** | ❌ **0 Stars** | Level Locked |
