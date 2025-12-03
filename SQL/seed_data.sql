-- ====================================================
-- seed_data.sql (Big but Balanced) for QUEST
-- 60 games (G001..G060), 30 developers, 15 genres, 10 platforms
-- ~12 users, ~45 ratings, ~90 play sessions, flags, moderation logs, recs
-- ====================================================

-- ----------------------------
-- ROLES
-- ----------------------------
INSERT INTO roles (role_name) VALUES
('Member'),
('Admin'),
('Moderator'),
('Analytics'),
('Developer/Publisher')
ON CONFLICT DO NOTHING;

-- ----------------------------
-- USERS (12 users)
-- ----------------------------
INSERT INTO users (user_id, username, email, password_hash, role_id)
VALUES
('U001','AdminMaster','admin@glrs.com','$2b$12$EXAMPLEHASHADMIN',2),
('U002','ModRanger','moderator@glrs.com','$2b$12$EXAMPLEHASHMOD',3),
('U003','AnalyticsGuy','analytics@glrs.com','$2b$12$EXAMPLEHASHAN',4),
('U004','PlayerNova','nova@example.com','$2b$12$EXAMPLEHASH1',1),
('U005','NightWolf','wolf@example.com','$2b$12$EXAMPLEHASH2',1),
('U006','PixelQueen','queen@example.com','$2b$12$EXAMPLEHASH3',1),
('U007','RetroKid','retro@example.com','$2b$12$EXAMPLEHASH4',1),
('U008','GamerJay','jay@example.com','$2b$12$EXAMPLEHASH5',1),
('U009','LunaByte','luna@example.com','$2b$12$EXAMPLEHASH6',1),
('U010','ShadowCore','shadow@example.com','$2b$12$EXAMPLEHASH7',1),
('U011','ArcadeAce','arcade@example.com','$2b$12$EXAMPLEHASH8',1),
('U012','IndieFan','indie@example.com','$2b$12$EXAMPLEHASH9',1)
ON CONFLICT DO NOTHING;

-- ----------------------------
-- DEVELOPERS (30)
-- Order here determines developer_id used below
-- ----------------------------
INSERT INTO developers (name, website, country) VALUES
('FromSoftware','https://www.fromsoftware.jp','Japan'),
('Santa Monica Studio','https://sms.playstation.com','USA'),
('Nintendo','https://www.nintendo.com','Japan'),
('Square Enix','https://www.square-enix.com','Japan'),
('Capcom','https://www.capcom.com','Japan'),
('CD Projekt Red','https://www.cdprojekt.com','Poland'),
('Bethesda Game Studios','https://bethesda.net','USA'),
('Rockstar Games','https://www.rockstargames.com','USA'),
('Ubisoft','https://www.ubisoft.com','France'),
('Insomniac Games','https://insomniac.games','USA'),
('343 Industries','https://www.halowaypoint.com','USA'),
('Bungie','https://www.bungie.net','USA'),
('Mojang Studios','https://www.minecraft.net','Sweden'),
('BioWare','https://www.bioware.com','Canada'),
('Respawn Entertainment','https://www.respawn.com','USA'),
('Riot Games','https://www.riotgames.com','USA'),
('Valve Corporation','https://www.valvesoftware.com','USA'),
('Blizzard Entertainment','https://www.blizzard.com','USA'),
('Bandai Namco','https://www.bandainamco.com','Japan'),
('Toby Fox','https://tobyfox.itch.io','USA'),
('Supergiant Games','https://www.supergiantgames.com','USA'),
('Atlus','https://www.atlus.com','Japan'),
('Kojima Productions','https://www.kojimaproductions.jp','Japan'),
('Larian Studios','https://larian.com','Belgium'),
('Obsidian Entertainment','https://www.obsidian.net','USA'),
('Creative Assembly','https://www.creative-assembly.com','UK'),
('Infinity Ward','https://www.infinityward.com','USA'),
('Treyarch','https://www.treyarch.com','USA'),
('Naughty Dog','https://www.naughtydog.com','USA'),
('IO Interactive','https://www.ioi.dk','Denmark')
ON CONFLICT DO NOTHING;

-- ----------------------------
-- GENRES (15)
-- Order determines genre_id used below
-- ----------------------------
INSERT INTO genres (name) VALUES
('Action'),
('Adventure'),
('RPG'),
('Shooter'),
('Open World'),
('Strategy'),
('Puzzle'),
('Horror'),
('Platformer'),
('Simulation'),
('Sports'),
('Roguelike'),
('MMO'),
('Stealth'),
('Survival')
ON CONFLICT DO NOTHING;

-- ----------------------------
-- PLATFORMS (10)
-- Order determines platform_id used below
-- ----------------------------
INSERT INTO platforms (name) VALUES
('PC'),
('PlayStation 5'),
('PlayStation 4'),
('Xbox Series X'),
('Xbox One'),
('Nintendo Switch'),
('Mobile'),
('Steam Deck'),
('VR'),
('PlayStation 3')
ON CONFLICT DO NOTHING;

-- ----------------------------
-- GAMES (60)  G001..G060
-- developer_id refers to the list above
-- ----------------------------
INSERT INTO games (game_id, title, developer_id, description, release_year) VALUES
('G001','Elden Ring', 1, 'Open-world action RPG with deep lore and challenging combat.', 2022),
('G002','God of War Ragnarök', 2, 'Mythic action-adventure continuing Kratos'' story.', 2022),
('G003','The Legend of Zelda: Breath of the Wild', 3, 'Open-world adventure on Hyrule; exploration first.', 2017),
('G004','Final Fantasy VII Remake', 4, 'Reimagined classic RPG with cinematic action combat.', 2020),
('G005','Resident Evil Village', 5, 'Survival horror blending action and puzzles.', 2021),
('G006','Cyberpunk 2077', 6, 'Open-world sci-fi RPG with branching narratives.', 2020),
('G007','The Elder Scrolls V: Skyrim', 7, 'Massive open-world fantasy RPG with modding support.', 2011),
('G008','Red Dead Redemption 2', 8, 'Cinematic western open-world narrative.', 2018),
('G009','Assassin''s Creed Valhalla', 9, 'Open-world Viking epic with settlement building.', 2020),
('G010','Marvel''s Spider-Man: Miles Morales', 10, 'Action-adventure swinging through NYC as Miles.', 2020),
('G011','Halo Infinite', 11, 'Sci-fi shooter featuring Master Chief and multiplayer.', 2021),
('G012','Destiny 2', 12, 'Online shared-world shooter with raids and looter mechanics.', 2017),
('G013','Minecraft', 13, 'Sandbox building and survival game.', 2011),
('G014','Mass Effect Legendary Edition', 14, 'Remastered sci-fi RPG trilogy.', 2021),
('G015','Apex Legends', 15, 'Hero-shooter battle royale with squads and ping system.', 2019),
('G016','League of Legends', 16, 'Competitive MOBA with champions and ranked play.', 2009),
('G017','Half-Life: Alyx', 17, 'VR-first shooter set in the Half-Life universe.', 2020),
('G018','Overwatch 2', 18, 'Team-based hero shooter with objective play.', 2022),
('G019','Tekken 8', 19, 'High-fidelity fighting game with deep mechanics.', 2024),
('G020','Undertale', 20, 'Indie RPG known for story, characters and combat choices.', 2015),
('G021','Hades', 21, 'Action roguelike with fast combat and narrative depth.', 2020),
('G022','Persona 5 Royal', 22, 'Stylish JRPG with social simulation elements.', 2019),
('G023','Death Stranding', 23, 'Kojima''s unique delivery-based open-world experience.', 2019),
('G024','Baldur''s Gate 3', 24, 'CRPG with deep choices, D&D-based systems.', 2023),
('G025','Pillars of Eternity II: Deadfire', 25, 'Classic-style CRPG with party-based mechanics.', 2018),
('G026','Shadow of the Colossus (Remake)', 26, 'Artful action-adventure reimagining classic title.', 2018),
('G027','Call of Duty: Modern Warfare II', 27, 'Fast-paced military shooter with multiplayer.', 2022),
('G028','Call of Duty: Black Ops Cold War', 28, 'Cold War era shooter with cinematic campaign.', 2020),
('G029','The Last of Us Part II', 29, 'Post-apocalyptic narrative-driven action-adventure.', 2020),
('G030','Hitman 3', 30, 'Stealth puzzle assassination sandbox.', 2021),
('G031','The Witcher 3: Wild Hunt', 6, 'Open-world RPG with deep story and characters.', 2015),
('G032','Ghost of Tsushima', 2, 'Open-world samurai action with cinematic combat.', 2020),
('G033','Super Mario Odyssey', 3, '3D platforming adventure across kingdoms.', 2017),
('G034','Animal Crossing: New Horizons', 3, 'Social simulation island life.', 2020),
('G035','Dark Souls III', 1, 'Challenging action RPG with interconnected world.', 2016),
('G036','Monster Hunter Rise', 5, 'Action RPG with monster hunting and co-op.', 2021),
('G037','GTA V', 8, 'Open-world crime epic with single-player and online modes.', 2013),
('G038','Forza Horizon 5', 9, 'Open-world racing festival with diverse cars.', 2021),
('G039','Dead Cells', 21, 'Action-platformer roguelike with permadeath runs.', 2018),
('G040','Stardew Valley', 13, 'Indie farming simulation with RPG elements.', 2016),
('G041','Sekiro: Shadows Die Twice', 1, 'Precision-based action game with parry timing.', 2019),
('G042','Rainbow Six Siege', 9, 'Tactical shooter emphasizing team coordination.', 2015),
('G043','Dishonored 2', 26, 'Stealth-action with supernatural powers.', 2016),
('G044','Dragon Quest XI', 4, 'Traditional JRPG with modern production values.', 2018),
('G045','DOOM Eternal', 17, 'Fast-paced arena shooter with aggressive movement.', 2020),
('G046','Papers, Please', 20, 'Indie simulation of border control ethics and choices.', 2013),
('G047','Civilization VI', 6, 'Turn-based strategy spanning eras of history.', 2016),
('G048','Control', 18, 'Paranormal action-adventure with reality-bending story.', 2019),
('G049','The Outer Worlds', 25, 'Narrative-driven sci-fi RPG with choice.', 2019),
('G050','No Man''s Sky', 17, 'Procedural open universe exploration and survival.', 2016),
('G051','Celeste', 21, 'Precision platformer with emotive narrative and difficulty.', 2018),
('G052','The Legend of Zelda: Tears of the Kingdom', 3, 'Sequel to Breath of the Wild with expanded systems.', 2023),
('G053','Returnal', 10, 'Roguelike third-person shooter with time loop mechanics.', 2021),
('G054','Among Us', 15, 'Social deduction multiplayer game.', 2018),
('G055','Horizon Forbidden West', 2, 'Open-world action RPG with machine creatures.', 2022),
('G056','Metal Gear Solid V: The Phantom Pain', 23, 'Open-ended stealth and base-building.', 2015),
('G057','Spelunky 2', 21, 'Challenging roguelike platformer sequel.', 2020),
('G058','Divinity: Original Sin 2', 24, 'Highly praised tactical CRPG with co-op.', 2017),
('G059','Ori and the Will of the Wisps', 26, 'Beautiful platformer with sweeping set pieces.', 2020),
('G060','Super Smash Bros. Ultimate', 3, 'Crossover fighting game featuring many characters.', 2018)
ON CONFLICT DO NOTHING;

-- ----------------------------
-- GAME_GENRES (map games -> genres)
-- Use genre ids from insertion order:
-- 1:Action, 2:Adventure, 3:RPG, 4:Shooter, 5:Open World, 6:Strategy,
-- 7:Puzzle, 8:Horror, 9:Platformer, 10:Simulation, 11:Sports,
-- 12:Roguelike, 13:MMO, 14:Stealth, 15:Survival
-- ----------------------------
INSERT INTO game_genres (game_id, genre_id) VALUES
('G001', 3), ('G001', 5),
('G002', 1), ('G002', 2),
('G003', 2), ('G003', 5),
('G004', 3), ('G004', 1),
('G005', 8), ('G005', 1),
('G006', 3), ('G006', 5),
('G007', 3), ('G007', 5),
('G008', 5), ('G008', 2),
('G009', 5), ('G009', 2),
('G010', 1), ('G010', 2),
('G011', 4), ('G011', 1),
('G012', 4), ('G012', 13),
('G013', 10),
('G014', 3),
('G015', 4),
('G016', 6),
('G017', 4), ('G017', 9),
('G018', 4),
('G019', 1),
('G020', 3),
('G021', 12), ('G021', 1),
('G022', 3), ('G022', 2),
('G023', 2), ('G023', 5),
('G024', 3),
('G025', 3),
('G026', 1), ('G026', 2),
('G027', 4),
('G028', 4),
('G029', 1), ('G029', 2),
('G030', 14), ('G030', 2),
('G031', 3), ('G031', 5),
('G032', 1), ('G032', 5),
('G033', 9), ('G033', 2),
('G034', 10), ('G034', 2),
('G035', 1),
('G036', 1), ('G036', 3),
('G037', 5), ('G037', 1),
('G038', 11), ('G038', 5),
('G039', 12), ('G039', 9),
('G040', 10), ('G040', 3),
('G041', 1),
('G042', 4),
('G043', 14), ('G043', 1),
('G044', 3),
('G045', 4), ('G045', 1),
('G046', 10),
('G047', 6),
('G048', 1), ('G048', 2),
('G049', 1),
('G050', 1), ('G050', 2),
('G051', 9), ('G051', 12),
('G052', 2), ('G052', 5), ('G052', 3),
('G053', 12), ('G053', 4),
('G054', 2), ('G054', 4),
('G055', 3), ('G055', 5),
('G056', 14), ('G056', 5),
('G057', 12), ('G057', 9),
('G058', 3), ('G058', 6),
('G059', 9), ('G059', 2),
('G060', 1), ('G060', 9)
ON CONFLICT DO NOTHING;

-- ----------------------------
-- GAME_PLATFORMS (map games -> platforms)
-- Platforms ids from insertion order:
-- 1:PC,2:PS5,3:PS4,4:Xbox Series X,5:Xbox One,6:Switch,7:Mobile,8:Steam Deck,9:VR,10:PS3
-- ----------------------------
INSERT INTO game_platforms (game_id, platform_id) VALUES
('G001',1),('G001',2),('G001',4),
('G002',2),('G002',3),
('G003',6),
('G004',2),('G004',1),
('G005',2),('G005',1),
('G006',1),('G006',2),('G006',4),
('G007',1),('G007',2),('G007',3),
('G008',1),('G008',4),('G008',5),
('G009',1),('G009',2),('G009',4),
('G010',2),('G010',1),
('G011',1),('G011',4),('G011',2),
('G012',1),('G012',4),
('G013',1),('G013',6),('G013',8),
('G014',1),('G014',2),
('G015',1),('G015',4),('G015',2),
('G016',1),
('G017',1),('G017',9),
('G018',1),('G018',2),
('G019',2),('G019',3),
('G020',1),
('G021',1),('G021',2),('G021',6),
('G022',2),
('G023',1),('G023',2),('G023',4),
('G024',1),('G024',2),
('G025',1),
('G026',2),
('G027',1),('G027',4),('G027',2),
('G028',1),('G028',4),
('G029',2),('G029',3),
('G030',1),('G030',2),
('G031',1),('G031',2),('G031',4),
('G032',2),
('G033',6),('G033',3),
('G034',6),
('G035',1),('G035',2),
('G036',6),('G036',1),
('G037',1),('G037',4),('G037',8),
('G038',1),('G038',4),
('G039',1),('G039',8),
('G040',1),('G040',6),
('G041',1),('G041',2),
('G042',1),('G042',4),
('G043',1),('G043',2),
('G044',2),('G044',1),
('G045',1),('G045',2),
('G046',1),
('G047',1),
('G048',1),('G048',2),
('G049',1),
('G050',1),('G050',2),
('G051',1),('G051',6),
('G052',6),('G052',1),
('G053',2),('G053',1),
('G054',1),('G054',6),('G054',7),
('G055',2),('G055',1),
('G056',1),('G056',2),
('G057',1),('G057',6),
('G058',1),('G058',2),
('G059',1),('G059',6),
('G060',6),('G060',2)
ON CONFLICT DO NOTHING;

-- ----------------------------
-- USER_LIBRARY (owned + wishlist)
-- ----------------------------
INSERT INTO user_library (user_id, game_id, ownership_status, date_added) VALUES
('U004','G001','owned','2024-03-10 10:00:00+08'),
('U004','G003','owned','2023-05-20 09:00:00+08'),
('U004','G024','wishlist','2025-01-12 14:30:00+08'),
('U005','G005','owned','2021-06-15 18:20:00+08'),
('U005','G031','owned','2017-11-04 12:00:00+08'),
('U005','G015','wishlist','2024-11-11 08:00:00+08'),
('U006','G013','owned','2019-09-01 17:00:00+08'),
('U006','G040','owned','2020-04-22 20:00:00+08'),
('U007','G033','owned','2018-12-25 11:00:00+08'),
('U007','G034','owned','2020-03-20 09:30:00+08'),
('U008','G008','owned','2022-02-15 16:45:00+08'),
('U008','G037','owned','2015-10-10 13:00:00+08'),
('U009','G021','owned','2021-01-05 21:00:00+08'),
('U009','G039','owned','2019-02-02 22:15:00+08'),
('U010','G029','owned','2020-09-12 19:00:00+08'),
('U010','G030','wishlist','2023-03-03 10:00:00+08'),
('U011','G052','owned','2023-07-07 07:07:00+08'),
('U011','G003','wishlist','2024-04-04 04:04:00+08'),
('U012','G021','wishlist','2022-08-08 08:08:00+08'),
('U012','G059','owned','2021-12-12 12:12:00+08'),
('U004','G052','owned','2023-08-01 09:00:00+08'),
('U005','G001','owned','2023-01-02 10:00:00+08'),
('U006','G041','owned','2019-03-10 20:00:00+08'),
('U008','G045','owned','2021-05-18 14:00:00+08'),
('U009','G047','owned','2018-07-07 15:30:00+08'),
('U010','G049','owned','2019-09-09 09:09:00+08'),
('U011','G060','owned','2019-11-11 11:11:00+08'),
('U012','G013','owned','2015-11-11 11:11:00+08')
ON CONFLICT DO NOTHING;

-- ----------------------------
-- RATINGS (45 ratings approx)
-- rating_id R001..R045
-- ----------------------------
INSERT INTO ratings (rating_id, user_id, game_id, rating_value, rating_text, rating_date, is_visible)
VALUES
('R001','U004','G001',4.8,'Incredible worldbuilding and combat loops.', '2024-03-11','TRUE'),
('R002','U005','G001',4.6,'Challenging but rewarding.', '2023-01-03','TRUE'),
('R003','U006','G013',4.9,'Endless creativity and play styles.', '2020-05-01','TRUE'),
('R004','U007','G033',5.0,'Pure joy to play; Mario at his best.', '2017-11-22','TRUE'),
('R005','U008','G008',4.7,'A masterpiece of storytelling.', '2022-03-01','TRUE'),
('R006','U009','G021',4.5,'Addictive, replayable roguelike.', '2021-02-10','TRUE'),
('R007','U010','G029',4.9,'Emotionally powerful and dense narrative.', '2020-09-15','TRUE'),
('R008','U011','G052',4.7,'Fantastic sequel; builds on the original.', '2023-07-08','TRUE'),
('R009','U012','G059',4.8,'Beautiful art and moving story.', '2021-12-25','TRUE'),
('R010','U004','G031',4.9,'Still one of the deepest RPGs.', '2020-06-10','TRUE'),
('R011','U005','G035',4.4,'Tough but satisfying.', '2017-12-01','TRUE'),
('R012','U006','G040',4.6,'Relaxing and surprisingly deep.', '2020-04-25','TRUE'),
('R013','U007','G034',4.2,'Chill island vibes.', '2020-03-22','TRUE'),
('R014','U008','G037',4.3,'Endless hours of content.', '2016-01-10','TRUE'),
('R015','U009','G047',4.1,'Engrossing strategy formula.', '2018-08-02','TRUE'),
('R016','U010','G049',4.0,'Solid RPG with fun writing.', '2019-10-01','TRUE'),
('R017','U004','G024',4.9,'Top-tier CRPG; roleplaying at its best.', '2023-09-01','TRUE'),
('R018','U005','G001',4.7,'Second playthrough was amazing.', '2024-04-02','TRUE'),
('R019','U006','G041',4.6,'Masterful combat systems.', '2019-04-12','TRUE'),
('R020','U007','G033',4.8,'A delightful platformer.', '2018-01-02','TRUE'),
('R021','U008','G045',4.5,'Fast and furious shooter combat.', '2021-05-20','TRUE'),
('R022','U009','G039',4.3,'Great runs, steep difficulty curve.', '2019-02-10','TRUE'),
('R023','U010','G013',4.7,'Still playing with friends, timeless.', '2020-01-15','TRUE'),
('R024','U011','G060',4.9,'Party brawler done right.', '2019-11-20','TRUE'),
('R025','U012','G021',4.4,'Great story plus roguelike flow.', '2021-01-11','TRUE'),
('R026','U004','G052',4.8,'Exploration and ideas feel fresh.', '2024-02-14','TRUE'),
('R027','U005','G036',4.2,'Hunting loop is compelling with friends.', '2021-07-03','TRUE'),
('R028','U006','G014',4.6,'Trip down memory lane, polished.', '2021-07-20','TRUE'),
('R029','U007','G039',4.5,'Love the movement and combat combos.', '2019-03-02','TRUE'),
('R030','U008','G015',4.0,'Great for quick squad matches.', '2020-12-12','TRUE'),
('R031','U009','G045',4.2,'Very satisfying combat, intense boss fights.', '2020-03-22','TRUE'),
('R032','U010','G029',4.8,'Both story and mechanics are top-notch.', '2020-10-07','TRUE'),
('R033','U011','G044',4.1,'Classic JRPG charm.', '2018-12-12','TRUE'),
('R034','U012','G046',4.0,'Small but memorable simulation.', '2013-11-02','TRUE'),
('R035','U004','G053',4.2,'Difficult but interesting roguelike loop.', '2022-02-02','TRUE'),
('R036','U005','G002',4.7,'A bold continuation for Kratos.', '2022-11-20','TRUE'),
('R037','U006','G030',4.3,'Excellent sandbox assassination missions.', '2021-02-03','TRUE'),
('R038','U007','G058',4.9,'Phenomenal tactical RPG with great systems.', '2018-09-01','TRUE'),
('R039','U008','G017',4.6,'VR redefined for narrative shooters.', '2020-11-01','TRUE'),
('R040','U009','G050',3.9,'Struggled at first but grown massively.', '2021-03-03','TRUE'),
('R041','U010','G027',4.0,'Modern boots-on-the-ground shooter loop.', '2022-12-01','TRUE'),
('R042','U011','G038',4.4,'Driving bliss and huge map variety.', '2021-12-01','TRUE'),
('R043','U012','G051',4.8,'Tough platformer with a beautiful story.', '2018-09-10','TRUE'),
('R044','U004','G031',4.7,'Modded heavily, still immersive.', '2019-11-11','TRUE'),
('R045','U005','G056',4.5,'Open stealth and varied mission design.', '2016-05-05','TRUE')
ON CONFLICT DO NOTHING;

-- ----------------------------
-- PLAY_SESSIONS (~90 sessions P001..P090)
-- We'll mix finished (with total_minutes) and in-progress (play_end NULL)
-- Use Asia/Manila timezone +08
-- ----------------------------
INSERT INTO play_sessions (playtime_id, user_id, game_id, play_start, play_end, total_minutes, is_finished, created_at) VALUES
('P001','U004','G001','2025-11-01 19:00:00+08','2025-11-01 21:30:00+08',150.00,TRUE,'2025-11-01 21:30:00+08'),
('P002','U005','G001','2025-10-15 20:10:00+08','2025-10-15 22:05:00+08',115.00,TRUE,'2025-10-15 22:05:00+08'),
('P003','U006','G013','2024-12-24 14:00:00+08','2024-12-24 16:45:00+08',165.00,TRUE,'2024-12-24 16:45:00+08'),
('P004','U007','G033','2023-11-11 09:30:00+08','2023-11-11 10:15:00+08',45.00,TRUE,'2023-11-11 10:15:00+08'),
('P005','U008','G008','2022-02-16 18:00:00+08','2022-02-16 22:00:00+08',240.00,TRUE,'2022-02-16 22:00:00+08'),
('P006','U009','G021','2021-09-01 20:00:00+08','2021-09-01 21:10:00+08',70.00,TRUE,'2021-09-01 21:10:00+08'),
('P007','U010','G029','2020-10-07 19:00:00+08','2020-10-07 22:30:00+08',210.00,TRUE,'2020-10-07 22:30:00+08'),
('P008','U011','G052','2023-07-08 10:00:00+08','2023-07-08 13:00:00+08',180.00,TRUE,'2023-07-08 13:00:00+08'),
('P009','U012','G059','2021-12-26 15:00:00+08','2021-12-26 17:00:00+08',120.00,TRUE,'2021-12-26 17:00:00+08'),
('P010','U004','G031','2020-06-10 14:00:00+08','2020-06-10 20:00:00+08',360.00,TRUE,'2020-06-10 20:00:00+08'),
('P011','U005','G035','2017-12-02 13:00:00+08','2017-12-02 16:30:00+08',210.00,TRUE,'2017-12-02 16:30:00+08'),
('P012','U006','G040','2021-04-01 09:00:00+08','2021-04-01 12:00:00+08',180.00,TRUE,'2021-04-01 12:00:00+08'),
('P013','U007','G034','2020-03-23 10:00:00+08','2020-03-23 14:00:00+08',240.00,TRUE,'2020-03-23 14:00:00+08'),
('P014','U008','G037','2016-01-15 12:00:00+08','2016-01-15 19:00:00+08',420.00,TRUE,'2016-01-15 19:00:00+08'),
('P015','U009','G047','2018-08-10 08:00:00+08','2018-08-10 12:00:00+08',240.00,TRUE,'2018-08-10 12:00:00+08'),
('P016','U010','G049','2019-09-10 09:00:00+08','2019-09-10 12:30:00+08',210.00,TRUE,'2019-09-10 12:30:00+08'),
('P017','U011','G060','2019-11-12 16:00:00+08','2019-11-12 18:00:00+08',120.00,TRUE,'2019-11-12 18:00:00+08'),
('P018','U012','G013','2018-12-01 13:00:00+08','2018-12-01 15:45:00+08',165.00,TRUE,'2018-12-01 15:45:00+08'),
('P019','U004','G052','2024-09-01 11:00:00+08','2024-09-01 14:00:00+08',180.00,TRUE,'2024-09-01 14:00:00+08'),
('P020','U005','G036','2021-07-04 19:00:00+08','2021-07-04 22:00:00+08',180.00,TRUE,'2021-07-04 22:00:00+08'),
('P021','U006','G014','2021-08-01 17:00:00+08','2021-08-01 20:00:00+08',180.00,TRUE,'2021-08-01 20:00:00+08'),
('P022','U007','G039','2019-03-03 18:00:00+08','2019-03-03 19:30:00+08',90.00,TRUE,'2019-03-03 19:30:00+08'),
('P023','U008','G015','2020-12-12 20:00:00+08','2020-12-12 21:30:00+08',90.00,TRUE,'2020-12-12 21:30:00+08'),
('P024','U009','G045','2021-05-18 14:30:00+08','2021-05-18 17:00:00+08',150.00,TRUE,'2021-05-18 17:00:00+08'),
('P025','U010','G027','2022-12-02 19:00:00+08','2022-12-02 21:00:00+08',120.00,TRUE,'2022-12-02 21:00:00+08'),
('P026','U011','G038','2022-12-05 14:00:00+08','2022-12-05 18:30:00+08',270.00,TRUE,'2022-12-05 18:30:00+08'),
('P027','U012','G051','2018-09-11 10:00:00+08','2018-09-11 13:00:00+08',180.00,TRUE,'2018-09-11 13:00:00+08'),
('P028','U004','G031','2016-02-14 10:00:00+08','2016-02-14 16:00:00+08',360.00,TRUE,'2016-02-14 16:00:00+08'),
('P029','U005','G002','2022-11-21 18:00:00+08','2022-11-21 22:00:00+08',240.00,TRUE,'2022-11-21 22:00:00+08'),
('P030','U006','G030','2021-02-04 13:00:00+08','2021-02-04 16:00:00+08',180.00,TRUE,'2021-02-04 16:00:00+08'),
('P031','U007','G058','2019-10-01 09:00:00+08','2019-10-01 12:00:00+08',180.00,TRUE,'2019-10-01 12:00:00+08'),
('P032','U008','G017','2020-11-02 15:00:00+08','2020-11-02 17:00:00+08',120.00,TRUE,'2020-11-02 17:00:00+08'),
('P033','U009','G050','2018-07-07 08:00:00+08','2018-07-07 10:30:00+08',150.00,TRUE,'2018-07-07 10:30:00+08'),
('P034','U010','G037','2015-11-11 11:00:00+08','2015-11-11 15:00:00+08',240.00,TRUE,'2015-11-11 15:00:00+08'),
('P035','U011','G044','2019-01-01 10:00:00+08','2019-01-01 13:00:00+08',180.00,TRUE,'2019-01-01 13:00:00+08'),
('P036','U012','G046','2013-11-02 09:00:00+08','2013-11-02 11:00:00+08',120.00,TRUE,'2013-11-02 11:00:00+08'),
('P037','U004','G053','2022-02-02 20:00:00+08','2022-02-02 21:45:00+08',105.00,TRUE,'2022-02-02 21:45:00+08'),
('P038','U005','G056','2016-05-06 10:00:00+08','2016-05-06 13:00:00+08',180.00,TRUE,'2016-05-06 13:00:00+08'),
('P039','U006','G021','2020-06-06 19:00:00+08','2020-06-06 20:30:00+08',90.00,TRUE,'2020-06-06 20:30:00+08'),
('P040','U007','G039','2019-04-01 14:00:00+08','2019-04-01 15:00:00+08',60.00,TRUE,'2019-04-01 15:00:00+08'),
('P041','U008','G054','2021-08-08 21:00:00+08','2021-08-08 22:00:00+08',60.00,TRUE,'2021-08-08 22:00:00+08'),
('P042','U009','G013','2019-07-07 10:00:00+08','2019-07-07 12:00:00+08',120.00,TRUE,'2019-07-07 12:00:00+08'),
('P043','U010','G045','2020-03-23 16:00:00+08','2020-03-23 18:30:00+08',150.00,TRUE,'2020-03-23 18:30:00+08'),
('P044','U011','G060','2019-11-30 19:00:00+08','2019-11-30 21:00:00+08',120.00,TRUE,'2019-11-30 21:00:00+08'),
('P045','U012','G059','2021-01-01 10:00:00+08','2021-01-01 11:30:00+08',90.00,TRUE,'2021-01-01 11:30:00+08'),
('P046','U004','G024','2023-09-02 18:00:00+08',NULL,NULL,FALSE,'2023-09-02 18:00:00+08'),
('P047','U005','G001','2025-10-16 17:00:00+08',NULL,NULL,FALSE,'2025-10-16 17:00:00+08'),
('P048','U006','G013','2025-04-10 09:00:00+08','2025-04-10 11:20:00+08',140.00,TRUE,'2025-04-10 11:20:00+08'),
('P049','U007','G033','2025-07-07 14:00:00+08',NULL,NULL,FALSE,'2025-07-07 14:00:00+08'),
('P050','U008','G015','2024-12-24 20:00:00+08','2024-12-24 21:00:00+08',60.00,TRUE,'2024-12-24 21:00:00+08'),
('P051','U009','G021','2024-05-05 19:00:00+08','2024-05-05 20:45:00+08',105.00,TRUE,'2024-05-05 20:45:00+08'),
('P052','U010','G029','2023-12-12 21:00:00+08','2023-12-12 23:30:00+08',150.00,TRUE,'2023-12-12 23:30:00+08'),
('P053','U011','G038','2023-11-11 10:00:00+08',NULL,NULL,FALSE,'2023-11-11 10:00:00+08'),
('P054','U012','G046','2023-01-01 09:00:00+08','2023-01-01 11:00:00+08',120.00,TRUE,'2023-01-01 11:00:00+08'),
('P055','U004','G031','2022-01-01 06:00:00+08','2022-01-01 12:00:00+08',360.00,TRUE,'2022-01-01 12:00:00+08'),
('P056','U005','G052','2024-02-14 22:00:00+08','2024-02-15 01:00:00+08',180.00,TRUE,'2024-02-15 01:00:00+08'),
('P057','U006','G041','2019-04-13 18:00:00+08','2019-04-13 20:30:00+08',150.00,TRUE,'2019-04-13 20:30:00+08'),
('P058','U007','G039','2020-08-08 20:00:00+08','2020-08-08 21:10:00+08',70.00,TRUE,'2020-08-08 21:10:00+08'),
('P059','U008','G017','2024-06-06 12:00:00+08','2024-06-06 14:30:00+08',150.00,TRUE,'2024-06-06 14:30:00+08'),
('P060','U009','G013','2022-10-10 09:00:00+08','2022-10-10 11:00:00+08',120.00,TRUE,'2022-10-10 11:00:00+08'),
('P061','U010','G027','2024-01-01 20:00:00+08','2024-01-01 22:00:00+08',120.00,TRUE,'2024-01-01 22:00:00+08'),
('P062','U011','G044','2022-05-05 10:00:00+08','2022-05-05 13:00:00+08',180.00,TRUE,'2022-05-05 13:00:00+08'),
('P063','U012','G051','2020-10-10 08:00:00+08','2020-10-10 09:30:00+08',90.00,TRUE,'2020-10-10 09:30:00+08'),
('P064','U004','G024','2024-12-31 22:00:00+08','2025-01-01 00:30:00+08',150.00,TRUE,'2025-01-01 00:30:00+08'),
('P065','U005','G001','2023-06-06 18:00:00+08','2023-06-06 20:45:00+08',165.00,TRUE,'2023-06-06 20:45:00+08'),
('P066','U006','G030','2024-03-03 12:00:00+08','2024-03-03 13:45:00+08',105.00,TRUE,'2024-03-03 13:45:00+08'),
('P067','U007','G058','2022-08-08 14:00:00+08','2022-08-08 17:00:00+08',180.00,TRUE,'2022-08-08 17:00:00+08'),
('P068','U008','G054','2022-02-02 20:00:00+08',NULL,NULL,FALSE,'2022-02-02 20:00:00+08'),
('P069','U009','G047','2021-07-07 07:00:00+08','2021-07-07 09:30:00+08',150.00,TRUE,'2021-07-07 09:30:00+08'),
('P070','U010','G049','2020-02-02 15:00:00+08','2020-02-02 18:00:00+08',180.00,TRUE,'2020-02-02 18:00:00+08'),
('P071','U011','G038','2021-06-06 11:00:00+08','2021-06-06 15:00:00+08',240.00,TRUE,'2021-06-06 15:00:00+08'),
('P072','U012','G013','2017-01-01 10:00:00+08','2017-01-01 12:30:00+08',150.00,TRUE,'2017-01-01 12:30:00+08'),
('P073','U004','G001','2022-10-10 19:00:00+08','2022-10-10 22:10:00+08',190.00,TRUE,'2022-10-10 22:10:00+08'),
('P074','U005','G035','2018-08-08 08:00:00+08',NULL,NULL,FALSE,'2018-08-08 08:00:00+08'),
('P075','U006','G041','2021-02-02 17:00:00+08','2021-02-02 19:20:00+08',140.00,TRUE,'2021-02-02 19:20:00+08'),
('P076','U007','G039','2021-09-09 20:00:00+08','2021-09-09 21:10:00+08',70.00,TRUE,'2021-09-09 21:10:00+08'),
('P077','U008','G010','2020-01-20 18:00:00+08','2020-01-20 19:30:00+08',90.00,TRUE,'2020-01-20 19:30:00+08'),
('P078','U009','G021','2023-03-03 21:00:00+08',NULL,NULL,FALSE,'2023-03-03 21:00:00+08'),
('P079','U010','G011','2024-08-08 12:00:00+08','2024-08-08 14:00:00+08',120.00,TRUE,'2024-08-08 14:00:00+08'),
('P080','U011','G024','2024-09-09 09:00:00+08','2024-09-09 12:00:00+08',180.00,TRUE,'2024-09-09 12:00:00+08'),
('P081','U012','G059','2022-06-06 10:00:00+08','2022-06-06 12:00:00+08',120.00,TRUE,'2022-06-06 12:00:00+08'),
('P082','U004','G052','2025-02-14 21:00:00+08','2025-02-14 23:00:00+08',120.00,TRUE,'2025-02-14 23:00:00+08'),
('P083','U005','G001','2024-05-05 19:30:00+08','2024-05-05 22:30:00+08',180.00,TRUE,'2024-05-05 22:30:00+08'),
('P084','U006','G013','2023-09-09 15:00:00+08','2023-09-09 17:30:00+08',150.00,TRUE,'2023-09-09 17:30:00+08'),
('P085','U007','G033','2021-11-11 09:00:00+08','2021-11-11 09:45:00+08',45.00,TRUE,'2021-11-11 09:45:00+08'),
('P086','U008','G037','2017-03-03 12:00:00+08','2017-03-03 16:00:00+08',240.00,TRUE,'2017-03-03 16:00:00+08'),
('P087','U009','G047','2020-01-01 08:00:00+08','2020-01-01 10:00:00+08',120.00,TRUE,'2020-01-01 10:00:00+08'),
('P088','U010','G049','2021-10-10 14:00:00+08','2021-10-10 17:00:00+08',180.00,TRUE,'2021-10-10 17:00:00+08'),
('P089','U011','G060','2021-12-12 20:00:00+08','2021-12-12 22:30:00+08',150.00,TRUE,'2021-12-12 22:30:00+08'),
('P090','U012','G013','2024-07-07 09:00:00+08','2024-07-07 10:45:00+08',105.00,TRUE,'2024-07-07 10:45:00+08')
ON CONFLICT DO NOTHING;

-- ----------------------------
-- REVIEW_FLAGS (a few flagged reviews)
-- ----------------------------
INSERT INTO review_flags (rating_id, flagged_by, reason, flagged_at, resolved_by, resolved_at, action_taken) VALUES
('R002','U002','Contains spoilers and hateful language','2024-06-01 10:00:00+08','U002','2024-06-02 09:00:00+08','hidden'),
('R040','U002','Off-topic, user posted external links','2021-04-01 12:00:00+08',NULL,NULL,NULL)
ON CONFLICT DO NOTHING;

-- ----------------------------
-- MODERATION_LOGS (sample entries)
-- ----------------------------
INSERT INTO moderation_logs (admin_user, action, target_type, target_id, notes, created_at) VALUES
('U002','Hide review','rating','R002','Removed spoilers and flagged as hidden','2024-06-02 09:05:00+08'),
('U002','Warn user','user','U005','Sent warning about language in review','2024-06-01 10:05:00+08'),
('U003','Generated recommendations','system','U004','Batch job generated 20 recs','2024-10-01 08:00:00+08')
ON CONFLICT DO NOTHING;

-- ----------------------------
-- RECOMMENDATIONS (sample rows)
-- ----------------------------
INSERT INTO recommendations (user_id, game_id, score, generated_at, source) VALUES
('U004','G024',0.87234,'2024-10-01 08:00:00+08','hybrid'),
('U004','G052',0.78912,'2024-10-01 08:00:00+08','hybrid'),
('U005','G031',0.81200,'2024-11-01 09:00:00+08','collaborative'),
('U006','G013',0.95321,'2024-07-07 07:07:00+08','content_based'),
('U007','G033',0.90011,'2024-08-08 10:00:00+08','content_based'),
('U008','G037',0.72111,'2024-09-09 11:00:00+08','collaborative'),
('U009','G021',0.82222,'2024-05-05 12:00:00+08','hybrid'),
('U010','G029',0.82012,'2024-06-06 13:00:00+08','hybrid')
ON CONFLICT DO NOTHING;

-- ----------------------------
-- END OF seed_data.sql
-- ----------------------------
