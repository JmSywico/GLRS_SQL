-- ====================================================
-- createDB.sql for QUEST
-- Quest Unit Engagement Status Tracking System
-- ====================================================

-- =======================
-- ROLES
-- =======================
CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(30) NOT NULL UNIQUE
);

-- =======================
-- USERS
-- =======================
CREATE TABLE users (
  user_id VARCHAR(20) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT NOT NULL REFERENCES roles(role_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- =======================
-- DEVELOPERS
-- =======================
CREATE TABLE developers (
  developer_id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  website VARCHAR(255),
  country VARCHAR(100)
);

-- =======================
-- GAMES
-- =======================
CREATE TABLE games (
  game_id VARCHAR(20) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  developer_id INT REFERENCES developers(developer_id),
  description TEXT,
  release_year INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (title, developer_id, release_year)
);

-- =======================
-- GENRES
-- =======================
CREATE TABLE genres (
  genre_id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE game_genres (
  game_id VARCHAR(20) REFERENCES games(game_id) ON DELETE CASCADE,
  genre_id INT REFERENCES genres(genre_id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, genre_id)
);

-- =======================
-- PLATFORMS
-- =======================
CREATE TABLE platforms (
  platform_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE game_platforms (
  game_id VARCHAR(20) REFERENCES games(game_id) ON DELETE CASCADE,
  platform_id INT REFERENCES platforms(platform_id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, platform_id)
);

-- =======================
-- USER LIBRARY
-- =======================
CREATE TYPE ownership_status_t AS ENUM ('owned', 'wishlist');

CREATE TABLE user_library (
  user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE CASCADE,
  game_id VARCHAR(20) REFERENCES games(game_id) ON DELETE CASCADE,
  ownership_status ownership_status_t NOT NULL,
  date_added TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (user_id, game_id)
);

-- =======================
-- PLAY SESSIONS
-- =======================
CREATE TABLE play_sessions (
  playtime_id VARCHAR(20) PRIMARY KEY,
  user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE CASCADE,
  game_id VARCHAR(20) REFERENCES games(game_id) ON DELETE CASCADE,
  play_start TIMESTAMP WITH TIME ZONE NOT NULL,
  play_end TIMESTAMP WITH TIME ZONE,
  total_minutes NUMERIC(12,2),
  is_finished BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =======================
-- RATINGS + REVIEWS
-- =======================
CREATE TABLE ratings (
  rating_id VARCHAR(20) PRIMARY KEY,
  user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE SET NULL,
  game_id VARCHAR(20) REFERENCES games(game_id) ON DELETE CASCADE,
  rating_value NUMERIC(3,2) CHECK (rating_value >= 0 AND rating_value <= 5),
  rating_text TEXT,
  rating_date DATE DEFAULT CURRENT_DATE,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, game_id)
);

-- =======================
-- REVIEW FLAGS
-- =======================
CREATE TABLE review_flags (
  flag_id SERIAL PRIMARY KEY,
  rating_id VARCHAR(20) REFERENCES ratings(rating_id) ON DELETE CASCADE,
  flagged_by VARCHAR(20) REFERENCES users(user_id),
  reason TEXT,
  flagged_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_by VARCHAR(20) REFERENCES users(user_id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  action_taken VARCHAR(50)
);

-- =======================
-- MODERATION LOGS
-- =======================
CREATE TABLE moderation_logs (
  mod_id SERIAL PRIMARY KEY,
  admin_user VARCHAR(20) REFERENCES users(user_id),
  action VARCHAR(100),
  target_type VARCHAR(50),
  target_id VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =======================
-- RECOMMENDATIONS
-- =======================
CREATE TABLE recommendations (
  rec_id SERIAL PRIMARY KEY,
  user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE CASCADE,
  game_id VARCHAR(20) REFERENCES games(game_id) ON DELETE CASCADE,
  score NUMERIC(8,5),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  source VARCHAR(50)
);

-- =======================
-- INDEXES
-- =======================
CREATE INDEX idx_games_title ON games (title);
CREATE INDEX idx_ratings_game ON ratings (game_id);
CREATE INDEX idx_play_sessions_user ON play_sessions (user_id);
CREATE INDEX idx_user_library_user ON user_library (user_id);