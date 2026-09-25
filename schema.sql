-- ============================================================================
-- CUSTOM LOBBIES (CustomLobbies.com) - Relational Database Schema & Queries
-- Compatible with PostgreSQL 13+ and MySQL 8+
-- ============================================================================

-- 1. USERS TABLE
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
    role VARCHAR(30) NOT NULL DEFAULT 'Player', -- 'Player', 'Captain', 'Admin', 'Streamer'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_cl_points ON users(cl_points DESC);
CREATE INDEX IF NOT EXISTS idx_users_elo ON users(elo_rating DESC);


-- 2. TEAMS / CLANS TABLE
CREATE TABLE IF NOT EXISTS teams (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    tag VARCHAR(15) NOT NULL, -- e.g. [VANGUARD], [WD-ALPHA]
    emblem VARCHAR(50) DEFAULT '🛡️',
    game VARCHAR(100) NOT NULL, -- 'WARDOGS', 'Counter-Strike 2', 'Valorant', etc.
    team_size INT NOT NULL DEFAULT 50, -- 50 (Battalion), 7 (Fireteam), 999 (Unlimited)
    captain_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    captain_handle VARCHAR(50) NOT NULL,
    playstyle_focus VARCHAR(100) DEFAULT 'Ranked Ladder', -- 'Competitive Scrims', '50-Man Battalion', '7-Man Fireteam'
    synergy VARCHAR(50) DEFAULT '100% (Role-Balanced)',
    team_elo INT NOT NULL DEFAULT 2150,
    wins INT NOT NULL DEFAULT 0,
    losses INT NOT NULL DEFAULT 0,
    bounty_earned INT NOT NULL DEFAULT 0, -- in CL-Points
    faction VARCHAR(100) DEFAULT '🔵 Vanguard Command',
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_teams_game ON teams(game);
CREATE INDEX IF NOT EXISTS idx_teams_captain ON teams(captain_id);
CREATE INDEX IF NOT EXISTS idx_teams_elo ON teams(team_elo DESC);


-- 3. TEAM MEMBERS (Active Roster)
CREATE TABLE IF NOT EXISTS team_members (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    team_id BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    member_name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL DEFAULT 'Operative', -- 'Captain', 'Entry Fragger', 'AWPer / Sniper', 'Support', 'Flex'
    elo INT NOT NULL DEFAULT 2150,
    is_captain BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_team_member UNIQUE (team_id, member_name)
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);


-- 4. TEAM RECRUITMENT APPLICATIONS & DRAFT REQUESTS
CREATE TABLE IF NOT EXISTS team_applications (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    team_id BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    applicant_name VARCHAR(100) NOT NULL,
    applicant_role VARCHAR(100) NOT NULL DEFAULT 'Flex',
    applicant_elo INT NOT NULL DEFAULT 2150,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'DECLINED'
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_team_apps_team ON team_applications(team_id);


-- 5. FREE AGENT PLAYER POOL
CREATE TABLE IF NOT EXISTS free_agents (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    gamer_handle VARCHAR(100) NOT NULL,
    callsign VARCHAR(50) NOT NULL,
    target_game VARCHAR(100) NOT NULL DEFAULT 'WARDOGS',
    primary_role VARCHAR(100) NOT NULL DEFAULT 'Entry Fragger',
    elo_rating INT NOT NULL DEFAULT 2150,
    karma VARCHAR(50) DEFAULT '100% Positive',
    status VARCHAR(50) NOT NULL DEFAULT 'Available for Draft', -- 'Available for Draft', 'Drafted to Team', 'In Match'
    anticheat_verified BOOLEAN NOT NULL DEFAULT TRUE,
    availability_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_free_agents_game ON free_agents(target_game);
CREATE INDEX IF NOT EXISTS idx_free_agents_status ON free_agents(status);


-- 6. MATCH LOBBIES (Custom 128-tick & WARDOGS Lobbies)
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
    match_status VARCHAR(50) NOT NULL DEFAULT 'RECRUITING', -- 'RECRUITING', 'LIVE', 'COMPLETED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lobbies_game ON lobbies(game);
CREATE INDEX IF NOT EXISTS idx_lobbies_status ON lobbies(match_status);


-- 7. LOBBY PARTICIPANTS
CREATE TABLE IF NOT EXISTS lobby_participants (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    lobby_id BIGINT NOT NULL REFERENCES lobbies(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    player_name VARCHAR(100) NOT NULL,
    team_slot INT NOT NULL, -- 1 = Team Alpha, 2 = Team Bravo, 3 = Team Charlie (for 33v33v33)
    is_ready BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 8. TOURNAMENTS & CHAMPIONSHIPS
CREATE TABLE IF NOT EXISTS tournaments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(200) NOT NULL,
    game VARCHAR(100) NOT NULL,
    format VARCHAR(100) NOT NULL DEFAULT 'Single Elimination (Bracket)',
    prize_pool_cl INT NOT NULL DEFAULT 10000,
    max_teams INT NOT NULL DEFAULT 16,
    status VARCHAR(50) NOT NULL DEFAULT 'REGISTRATION_OPEN', -- 'REGISTRATION_OPEN', 'IN_PROGRESS', 'CONCLUDED'
    winner_team_id BIGINT REFERENCES teams(id) ON DELETE SET NULL,
    starts_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 9. VIRTUAL CL-POINTS LEDGER
CREATE TABLE IF NOT EXISTS cl_transactions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INT NOT NULL, -- positive for rewards/bounties, negative for fees
    balance_after INT NOT NULL,
    reason VARCHAR(255) NOT NULL, -- 'Free Agent Signup Bonus', 'Host Reward', 'Tournament Entry', 'Bounty Win'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cl_user_id ON cl_transactions(user_id);


-- ============================================================================
-- COMMON PRODUCTION QUERIES (CRUD & Matchmaking)
-- ============================================================================

-- Query 1: Get All Registered Teams with Member Count and Captain
SELECT 
    t.id,
    t.name,
    t.tag,
    t.emblem,
    t.game,
    t.team_size,
    t.captain_handle,
    t.faction,
    t.team_elo,
    t.bounty_earned,
    COUNT(m.id) AS active_members_count
FROM teams t
LEFT JOIN team_members m ON t.id = m.team_id
GROUP BY t.id, t.name, t.tag, t.emblem, t.game, t.team_size, t.captain_handle, t.faction, t.team_elo, t.bounty_earned
ORDER BY t.team_elo DESC;

-- Query 2: Get Free-Agent Pool for a Given Game (e.g. WARDOGS)
SELECT 
    id,
    gamer_handle,
    callsign,
    target_game,
    primary_role,
    elo_rating,
    karma,
    status,
    availability_note,
    created_at
FROM free_agents
WHERE target_game = 'WARDOGS' AND status = 'Available for Draft'
ORDER BY elo_rating DESC, created_at DESC;

-- Query 3: Safely Insert User, Team, and Captain in a Single Atomic Transaction
WITH new_user AS (
    INSERT INTO users (username, email, password_hash, gamer_tag, role)
    VALUES ('Sean', 'sean@customlobbies.com', 'scrypt_hash_example', 'Sean', 'Captain')
    ON CONFLICT (username) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
    RETURNING id, username
),
new_team AS (
    INSERT INTO teams (name, tag, emblem, game, team_size, captain_id, captain_handle, playstyle_focus, team_elo, bio)
    SELECT 'WARDOG Alpha', '[WD-ALPHA]', '🛡️', 'WARDOGS', 50, id, username, '50-Man Battalion', 2400, 'Ranked competitive battalion'
    FROM new_user
    RETURNING id, captain_handle
)
INSERT INTO team_members (team_id, member_name, role, elo, is_captain)
SELECT id, captain_handle, '👑 Commander / Captain', 2400, TRUE
FROM new_team;

-- Query 4: Safely Recruit a Free-Agent into Team Applications Queue (Dynamic Team ID)
INSERT INTO team_applications (team_id, applicant_name, applicant_role, applicant_elo, note)
SELECT id, 'Valkyrie_Merc', '🎯 Sniper', 2150, 'Drafted from Free Agent Pool'
FROM teams
WHERE name = 'WARDOG Alpha'
LIMIT 1;

-- Query 5: Safely Accept Application & Move into Active Team Roster
WITH accepted_app AS (
    UPDATE team_applications 
    SET status = 'ACCEPTED' 
    WHERE applicant_name = 'Valkyrie_Merc' AND status = 'PENDING'
    RETURNING team_id, applicant_name, applicant_role, applicant_elo
)
INSERT INTO team_members (team_id, member_name, role, elo, is_captain)
SELECT team_id, applicant_name, applicant_role, applicant_elo, FALSE
FROM accepted_app;

-- Update status in free-agent pool
UPDATE free_agents
SET status = 'Drafted to Team'
WHERE gamer_handle = 'Valkyrie_Merc';

-- Query 6: Top 10 Teams Leaderboard by MMR & Bounty
SELECT 
    t.name,
    t.tag,
    t.game,
    t.team_elo,
    t.wins || 'W - ' || t.losses || 'L' AS record,
    t.bounty_earned || ' 🪙' AS bounty
FROM teams t
ORDER BY t.team_elo DESC, t.bounty_earned DESC
LIMIT 10;
