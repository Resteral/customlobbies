-- ============================================================================
-- CUSTOM LOBBIES - ALL-IN-ONE DATABASE INITIALIZATION SCRIPT
-- Runs CREATE TABLE first, then safely seeds initial data.
-- Paste and run this ENTIRE block in your SQL Editor (Supabase, Neon, pgAdmin, etc.)
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. CREATE TABLES (DDL)
-- ============================================================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    gamer_tag VARCHAR(50),
    avatar_url VARCHAR(500) DEFAULT 'https://customlobbies.com/assets/default-avatar.png',
    cl_points INT NOT NULL DEFAULT 500,
    elo_rating INT NOT NULL DEFAULT 1500,
    karma_score INT NOT NULL DEFAULT 100,
    is_anticheat_verified BOOLEAN NOT NULL DEFAULT TRUE,
    role VARCHAR(30) NOT NULL DEFAULT 'Player',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Teams Table (50-player battalions & 7-player fireteams)
CREATE TABLE IF NOT EXISTS teams (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    tag VARCHAR(15) NOT NULL,
    emblem VARCHAR(50) DEFAULT '🛡️',
    game VARCHAR(100) NOT NULL,
    team_size INT NOT NULL DEFAULT 50,
    captain_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    captain_handle VARCHAR(50) NOT NULL,
    playstyle_focus VARCHAR(100) DEFAULT 'Ranked Ladder',
    synergy VARCHAR(50) DEFAULT '100% (Role-Balanced)',
    team_elo INT NOT NULL DEFAULT 2150,
    wins INT NOT NULL DEFAULT 0,
    losses INT NOT NULL DEFAULT 0,
    bounty_earned INT NOT NULL DEFAULT 0,
    faction VARCHAR(100) DEFAULT '🔵 Vanguard Command',
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    team_id BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    member_name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL DEFAULT 'Operative',
    elo INT NOT NULL DEFAULT 2150,
    is_captain BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_team_member UNIQUE (team_id, member_name)
);

-- Team Applications Table
CREATE TABLE IF NOT EXISTS team_applications (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    team_id BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    applicant_name VARCHAR(100) NOT NULL,
    applicant_role VARCHAR(100) NOT NULL DEFAULT 'Flex',
    applicant_elo INT NOT NULL DEFAULT 2150,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Free Agent Player Pool Table
CREATE TABLE IF NOT EXISTS free_agents (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    gamer_handle VARCHAR(100) NOT NULL,
    callsign VARCHAR(50) NOT NULL,
    target_game VARCHAR(100) NOT NULL DEFAULT 'WARDOGS',
    primary_role VARCHAR(100) NOT NULL DEFAULT 'Entry Fragger',
    elo_rating INT NOT NULL DEFAULT 2150,
    karma VARCHAR(50) DEFAULT '100% Positive',
    status VARCHAR(50) NOT NULL DEFAULT 'Available for Draft',
    anticheat_verified BOOLEAN NOT NULL DEFAULT TRUE,
    availability_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lobbies Table
CREATE TABLE IF NOT EXISTS lobbies (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(150) NOT NULL,
    game VARCHAR(100) NOT NULL,
    host_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    host_name VARCHAR(100) NOT NULL DEFAULT 'You (Host)',
    max_players INT NOT NULL DEFAULT 10,
    current_players INT NOT NULL DEFAULT 1,
    region VARCHAR(100) NOT NULL DEFAULT 'NA East',
    map VARCHAR(100) NOT NULL DEFAULT 'Mirage & Inferno',
    draft_type VARCHAR(100) NOT NULL DEFAULT 'FACEIT Competitive',
    server_ip VARCHAR(100) DEFAULT '192.168.1.85:27015',
    tickrate INT NOT NULL DEFAULT 128,
    match_status VARCHAR(50) NOT NULL DEFAULT 'RECRUITING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Virtual CL-Points Ledger Table
CREATE TABLE IF NOT EXISTS cl_transactions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    balance_after INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Speed
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_teams_game ON teams(game);
CREATE INDEX IF NOT EXISTS idx_free_agents_game ON free_agents(target_game);
CREATE INDEX IF NOT EXISTS idx_free_agents_status ON free_agents(status);
CREATE INDEX IF NOT EXISTS idx_lobbies_game ON lobbies(game);


-- ============================================================================
-- 2. SEED INITIAL DATA (DML)
-- ============================================================================

-- Step A: Insert Users
INSERT INTO users (username, email, password_hash, gamer_tag, cl_points, elo_rating, role)
VALUES 
  ('Sean', 'sean@customlobbies.com', '$2b$12$e8Y..exampleHash', 'Sean (Host)', 10000, 2450, 'Admin'),
  ('Ghost_Dog_99', 'ghost@customlobbies.com', '$2b$12$e8Y..exampleHash', 'GhostDog', 2500, 2400, 'Captain'),
  ('Valkyrie_Merc', 'valk@customlobbies.com', '$2b$12$e8Y..exampleHash', 'Valkyrie', 1200, 2150, 'Player'),
  ('Sargeant_Iron', 'iron@customlobbies.com', '$2b$12$e8Y..exampleHash', 'SargeIron', 1800, 2100, 'Player'),
  ('Shadow_K9', 'shadow@customlobbies.com', '$2b$12$e8Y..exampleHash', 'ShadowK9', 950, 1980, 'Player')
ON CONFLICT (username) DO NOTHING;

-- Step B: Insert Teams
INSERT INTO teams (name, tag, emblem, game, team_size, captain_id, captain_handle, playstyle_focus, team_elo, wins, losses, bounty_earned, faction, bio)
SELECT 
  'WARDOG Alpha', '[WD-ALPHA]', '🛡️', 'WARDOGS', 50, u.id, u.username, '50-Man Battalion', 2400, 14, 3, 25000, '🔵 Vanguard Command', 'Official Season 4 Premier Division Battalion'
FROM users u WHERE u.username = 'Sean'
LIMIT 1;

INSERT INTO teams (name, tag, emblem, game, team_size, captain_id, captain_handle, playstyle_focus, team_elo, wins, losses, bounty_earned, faction, bio)
SELECT 
  'Cyber Wolves', '[CW-ELITE]', '🐺', 'WARDOGS', 50, u.id, u.username, '50-Man Battalion', 2350, 11, 5, 18500, '🔴 Iron Syndicate', 'High-aggression border offensive unit'
FROM users u WHERE u.username = 'Ghost_Dog_99'
LIMIT 1;

-- Step C: Insert Team Members
INSERT INTO team_members (team_id, member_name, role, elo, is_captain)
SELECT t.id, 'Sean', '👑 Commander / Captain', 2450, TRUE
FROM teams t WHERE t.name = 'WARDOG Alpha'
ON CONFLICT (team_id, member_name) DO NOTHING;

INSERT INTO team_members (team_id, member_name, role, elo, is_captain)
SELECT t.id, 'Sargeant_Iron', '🛡️ Vanguard Heavy / Tank', 2100, FALSE
FROM teams t WHERE t.name = 'WARDOG Alpha'
ON CONFLICT (team_id, member_name) DO NOTHING;

INSERT INTO team_members (team_id, member_name, role, elo, is_captain)
SELECT t.id, 'Ghost_Dog_99', '👑 Commander / Captain', 2400, TRUE
FROM teams t WHERE t.name = 'Cyber Wolves'
ON CONFLICT (team_id, member_name) DO NOTHING;

-- Step D: Insert Free Agents
INSERT INTO free_agents (gamer_handle, callsign, target_game, primary_role, elo_rating, karma, status, availability_note)
VALUES
  ('Valkyrie_Merc', 'VALKYRIE-1', 'WARDOGS', 'AWPer / Sniper', 2150, '100% Positive', 'Available for Draft', 'Ready for 50-player battalion scrims! Discord active.'),
  ('TenZ_Aim', 'TENZ-APEX', 'Counter-Strike 2', 'Entry Fragger', 2380, '99% Positive', 'Available for Draft', 'Looking for high-tier Premier team.'),
  ('Echo_Tactical', 'ECHO-9', 'WARDOGS', '⚡ Breacher / Assault', 2050, '100% Positive', 'Available for Draft', 'Experienced breach shotcaller.');

-- Step E: Insert Lobbies
INSERT INTO lobbies (title, game, host_name, max_players, current_players, region, map, draft_type, server_ip, tickrate, match_status)
VALUES
  ('WARDOGS 50v50 Battle of Amber Sector', 'WARDOGS', 'Sean', 100, 48, 'NA-East Dedicated Node', 'Amber Strike Frontline', 'Captains Selection Draft', '192.168.1.85:7777', 128, 'RECRUITING'),
  ('CS2 128-Tick Premier Scrim #104', 'Counter-Strike 2', 'Ghost_Dog_99', 10, 8, 'NA-East (Virginia)', 'de_inferno & de_mirage', 'FACEIT Competitive', '192.168.1.85:27015', 128, 'RECRUITING');

COMMIT;
