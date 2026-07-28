-- Math Crush Database Schema (PostgreSQL)

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
    correct_answer VARCHAR(10) NOT NULL, -- 'A', 'B', 'C', or 'D'
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
