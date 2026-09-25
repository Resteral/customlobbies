-- ============================================================================
-- CUSTOM LOBBIES - Sample Data Seed Script (Safe Execution Order)
-- ============================================================================

BEGIN;

-- 1. Seed Users First
INSERT INTO users (username, email, password_hash, gamer_tag, cl_points, elo_rating, role)
VALUES 
  ('Sean', 'sean@customlobbies.com', '$2b$12$e8Y..exampleHash', 'Sean (Host)', 10000, 2450, 'Admin'),
  ('Ghost_Dog_99', 'ghost@customlobbies.com', '$2b$12$e8Y..exampleHash', 'GhostDog', 2500, 2400, 'Captain'),
  ('Valkyrie_Merc', 'valk@customlobbies.com', '$2b$12$e8Y..exampleHash', 'Valkyrie', 1200, 2150, 'Player'),
  ('Sargeant_Iron', 'iron@customlobbies.com', '$2b$12$e8Y..exampleHash', 'SargeIron', 1800, 2100, 'Player'),
  ('Shadow_K9', 'shadow@customlobbies.com', '$2b$12$e8Y..exampleHash', 'ShadowK9', 950, 1980, 'Player')
ON CONFLICT (username) DO NOTHING;

-- 2. Seed Teams (Referencing existing User IDs)
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

-- 3. Seed Active Team Members (Referencing created Teams)
INSERT INTO team_members (team_id, member_name, role, elo, is_captain)
SELECT t.id, 'Sean', '👑 Commander / Captain', 2450, TRUE
FROM teams t WHERE t.name = 'WARDOG Alpha';

INSERT INTO team_members (team_id, member_name, role, elo, is_captain)
SELECT t.id, 'Sargeant_Iron', '🛡️ Vanguard Heavy / Tank', 2100, FALSE
FROM teams t WHERE t.name = 'WARDOG Alpha';

INSERT INTO team_members (team_id, member_name, role, elo, is_captain)
SELECT t.id, 'Shadow_K9', '⚡ Entry Fragger', 1980, FALSE
FROM teams t WHERE t.name = 'WARDOG Alpha';

INSERT INTO team_members (team_id, member_name, role, elo, is_captain)
SELECT t.id, 'Ghost_Dog_99', '👑 Commander / Captain', 2400, TRUE
FROM teams t WHERE t.name = 'Cyber Wolves';

-- 4. Seed Free Agents Pool
INSERT INTO free_agents (gamer_handle, callsign, target_game, primary_role, elo_rating, karma, status, availability_note)
VALUES
  ('Valkyrie_Merc', 'VALKYRIE-1', 'WARDOGS', 'AWPer / Sniper', 2150, '100% Positive', 'Available for Draft', 'Ready for 50-player battalion scrims! Discord active.'),
  ('TenZ_Aim', 'TENZ-APEX', 'Counter-Strike 2', 'Entry Fragger', 2380, '99% Positive', 'Available for Draft', 'Looking for high-tier Premier team.'),
  ('Echo_Tactical', 'ECHO-9', 'WARDOGS', '⚡ Breacher / Assault', 2050, '100% Positive', 'Available for Draft', 'Experienced breach shotcaller.'),
  ('Frost_Bite', 'FROST-4', 'WARDOGS', '🛡️ Vanguard Heavy / Tank', 2200, '98% Positive', 'Available for Draft', 'Shield anchor for frontline defense.');

-- 5. Seed Match Lobbies
INSERT INTO lobbies (title, game, host_name, max_players, current_players, region, map, draft_type, server_ip, tickrate, match_status)
VALUES
  ('WARDOGS 50v50 Battle of Amber Sector', 'WARDOGS', 'Sean', 100, 48, 'NA-East Dedicated Node', 'Amber Strike Frontline', 'Captains Selection Draft', '192.168.1.85:7777', 128, 'RECRUITING'),
  ('CS2 128-Tick Premier Scrim #104', 'Counter-Strike 2', 'Ghost_Dog_99', 10, 8, 'NA-East (Virginia)', 'de_inferno & de_mirage', 'FACEIT Competitive', '192.168.1.85:27015', 128, 'RECRUITING');

COMMIT;
