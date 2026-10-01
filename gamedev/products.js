const PRODUCTS = [
  {
    "id": "procedural-dungeon-engine",
    "title": "Procedural Dungeon Engine: Roguelike Map Generator",
    "subtitle": "Production Python Roguelike generator with 4 generation algorithms, MST pathfinding & 111 unit tests.",
    "category": "engine",
    "price": 44.99,
    "rating": 5,
    "reviews": 19,
    "badges": [
      "Python 3.10+",
      "Roguelike Engine",
      "111 Tests Passing"
    ],
    "cover": "assets/covers/dungeonengine.jpg",
    "itchUrl": "https://jasonc101.itch.io/procedural-dungeon-engine-roguelike-map-generator",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Production-grade procedural dungeon generation framework featuring 4 industry-standard algorithms: BSP (Binary Space Partitioning), Cellular Automata, Drunkard's Walk, and Random Walk Caves. Complete with Prim's Algorithm Minimum Spanning Tree corridor connections, A* pathfinding, connectivity validators, seed reproducibility, room decorators, JSON/ASCII/CSV exports, and 111 rigorous automated tests.",
    "specs": [
      "Python 3.10+ Native (Zero External Dependencies)",
      "Deterministic Seed Reproducibility",
      "111/111 Pytest Suite Passing",
      "Royalty-Free Commercial License"
    ]
  },
  {
    "id": "so-its-war-then",
    "title": "So It's War Then: 4-Faction RTS & Grand Strategy Engine",
    "subtitle": "Complete production-grade real-time strategy & empire warfare engine with 4 distinct factions.",
    "category": "engine",
    "price": 49.99,
    "rating": 5,
    "reviews": 18,
    "badges": [
      "RTS Engine",
      "4-Faction",
      "Full Source"
    ],
    "cover": "assets/covers/soitswarthen.jpg",
    "itchUrl": "https://jasonc101.itch.io/so-its-war-then-4-faction-rts-grand-strategy-engine",
    "gumroadUrl": "https://honeydo5.gumroad.com/l/pveflh",
    "description": "Battle-tested 4-faction real-time strategy and empire simulation engine. Includes resource economies (Ore, Energy, Biomass), tech trees, formation movement, building construction, and multi-unit AI behavior trees.",
    "specs": [
      "Python / Headless Core",
      "Deterministic Simulation",
      "Royalty-Free Commercial License"
    ]
  },
  {
    "id": "necros",
    "title": "Necros: Godot 4 Dark Fantasy Turn-Based RPG & Combat Framework",
    "subtitle": "Turn-based tactical combat framework for Godot 4 with necromancy abilities and grid pathfinding.",
    "category": "godot",
    "price": 39.99,
    "rating": 5,
    "reviews": 14,
    "badges": [
      "Godot 4",
      "Dark Fantasy",
      "Turn-Based RPG"
    ],
    "cover": "assets/covers/necros.jpg",
    "itchUrl": "https://jasonc101.itch.io/necros-godot-4-dark-fantasy-turn-based-rpg-combat-framework",
    "gumroadUrl": "https://honeydo5.gumroad.com/l/dsqeor",
    "description": "Complete dark fantasy turn-based RPG architecture for Godot 4. Features a tactical hex/square grid combat arena, soul harvesting mechanics, initiative queues, status effect pipeline, and dark gothic UI.",
    "specs": [
      "Godot 4.2+ Forward+",
      "GDScript Native",
      "Commercial License Included"
    ]
  },
  {
    "id": "i-got-this",
    "title": "I Got This: Godot 4 Open-World 3D Survival & Building Framework",
    "subtitle": "67.1 kmÃ‚Â² deterministic terrain streaming engine, 13-piece modular building system & resource gathering.",
    "category": "godot",
    "price": 39.99,
    "rating": 5,
    "reviews": 21,
    "badges": [
      "Godot 4",
      "67kmÃ‚Â² Terrain",
      "Base Building"
    ],
    "cover": "assets/covers/igotthis.jpg",
    "itchUrl": "https://jasonc101.itch.io/i-got-this-godot-4-open-world-3d-survival-building-framework",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "High-performance Godot 4 3D open-world survival game foundation. Features infinite 8192x8192m terrain chunk streaming, full modular building grid with height adjustments and collision validation, dual 1st/3rd person cameras, and JSON persistence.",
    "specs": [
      "Godot 4.5+ Compatible",
      "Zero External Plugins",
      "Full Architectural Specs"
    ]
  },
  {
    "id": "tactical-grid-combat-engine",
    "title": "Tactical Grid Combat Engine: Turn-Based Strategy Framework",
    "subtitle": "127 automated unit tests passing in 0.14s. A* pathfinding, line-of-sight & overwatch reaction fire.",
    "category": "engine",
    "price": 39.99,
    "rating": 5,
    "reviews": 27,
    "badges": [
      "127 Unit Tests",
      "A* Pathfinding",
      "Line-of-Sight"
    ],
    "cover": "assets/covers/tacticalgrid.jpg",
    "itchUrl": "https://jasonc101.itch.io/tactical-grid-combat-engine-turn-based-strategy-framework",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Production-grade turn-based combat simulation framework (inspired by XCOM and Into the Breach). Features raycasted directional cover calculations, dynamic action point economy, reaction-fire interrupts, and status effects pipeline.",
    "specs": [
      "100% Deterministic",
      "Headless Simulator",
      "Royalty-Free Commercial License"
    ]
  },
  {
    "id": "mechzilla",
    "title": "MechZilla: Tactical Turn-Based Mech Combat & Commander Framework",
    "subtitle": "Heavy tactical mech warfare framework for Godot 4 with component damage & heat management.",
    "category": "godot",
    "price": 39.99,
    "rating": 5,
    "reviews": 16,
    "badges": [
      "Godot 4",
      "Tactical Mechs",
      "Turn-Based"
    ],
    "cover": "assets/covers/mechzilla.jpg",
    "itchUrl": "https://jasonc101.itch.io/mechzilla-tactical-combat-framework",
    "gumroadUrl": "https://honeydo5.gumroad.com/l/vcfvti",
    "description": "Grid-based mech combat simulator featuring individual limb hitboxes, weapon hardpoints, heat buildup/venting systems, pilot skills, and customizable tactical loadouts in Godot 4.",
    "specs": [
      "Godot 4.2+",
      "Pure GDScript",
      "Full Royalty-Free Rights"
    ]
  },
  {
    "id": "soldiers-last-stand",
    "title": "Soldiers' Last Stand: Modular Squad & Horde Survival Engine",
    "subtitle": "Scalable squad combat & swarm AI engine designed for last-stand, horde survival, and tower defense games.",
    "category": "engine",
    "price": 34.99,
    "rating": 5,
    "reviews": 12,
    "badges": [
      "Squad Combat",
      "Horde AI",
      "Wave Spawner"
    ],
    "cover": "assets/covers/soldierslaststand.jpg",
    "itchUrl": "https://jasonc101.itch.io/soldiers-last-stand-horde-survival-engine",
    "gumroadUrl": "https://honeydo5.gumroad.com/l/mefjro",
    "description": "High-density enemy flocking and spatial hashing engine capable of managing 1,000+ simultaneous enemies with dynamic target priority, fortification repair, and customizable weapon upgrades.",
    "specs": [
      "Spatial Partitioning",
      "Optimized CPU Simulation",
      "Commercial License Included"
    ]
  },
  {
    "id": "cyberpunk-warlords",
    "title": "Cyberpunk Warlords: Grand Strategy & Auto-Battle RPG Engine",
    "subtitle": "22/22 Pytest verified. Fog-of-war overworld, faction diplomacy, town sieges & auto-battle arenas.",
    "category": "engine",
    "price": 34.99,
    "rating": 5,
    "reviews": 19,
    "badges": [
      "Cyberpunk",
      "Diplomacy Matrix",
      "Auto-Battler"
    ],
    "cover": "assets/covers/cyberpunkwarlords.jpg",
    "itchUrl": "https://jasonc101.itch.io/cyberpunk-warlords-grand-strategy-auto-battle-rpg-engine",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Complete 2D cyberpunk strategy RPG engine combining overworld fog exploration, bilateral faction diplomacy, territory income and garrison upkeep, moving enemy army AI, automated siege resolution, and deterministic squad auto-battles.",
    "specs": [
      "22 Passing Automated Tests",
      "Pygame & Headless Ready",
      "Royalty-Free Source Code"
    ]
  },
  {
    "id": "cardsim",
    "title": "CardSim: Headless Card Battler & Monte Carlo Balancing Engine",
    "subtitle": "Automate card game balance with high-speed headless simulations & win-rate analytics.",
    "category": "engine",
    "price": 34.99,
    "rating": 5,
    "reviews": 23,
    "badges": [
      "Monte Carlo",
      "Deckbuilder",
      "Headless API"
    ],
    "cover": "assets/covers/cardsim.jpg",
    "itchUrl": "https://jasonc101.itch.io/cardsim-combat-engine",
    "gumroadUrl": "https://honeydo5.gumroad.com/l/pvhcq",
    "description": "Headless card game engine that runs 100,000 automated card matches in seconds using Monte Carlo trees. Balance mana costs, card draw, damage scaling, and archetype win rates before publishing.",
    "specs": [
      "Lightning Fast Headless",
      "CSV/JSON Export",
      "Commercial License Included"
    ]
  },
  {
    "id": "hextactics",
    "title": "HexTactics: Headless Grid, A* Pathfinding & Combat Engine",
    "subtitle": "Mathematical axial hex-grid coordinate engine with line-of-sight algorithms and turn order queues.",
    "category": "engine",
    "price": 34.99,
    "rating": 5,
    "reviews": 15,
    "badges": [
      "Hex Grid",
      "A* Pathfinding",
      "Simulation"
    ],
    "cover": "assets/covers/hextactics.jpg",
    "itchUrl": "https://jasonc101.itch.io/hextactics-tactical-engine",
    "gumroadUrl": "https://honeydo5.gumroad.com/l/eotmup",
    "description": "Zero-dependency axial hexagonal grid calculation engine. Features Euclidean and Manhattan distance metrics, Bresenham raycasting line-of-sight, obstacle collision, and initiative queues.",
    "specs": [
      "Zero Dependencies",
      "Pure Python & TypeScript",
      "Royalty-Free License"
    ]
  },
  {
    "id": "warfront-vault",
    "title": "Warfront: 8,000+ Sci-Fi & Alien RTS 2D/3D Isometric Sprite Vault",
    "subtitle": "Massive 354 MB asset library containing over 8,000 isometric vehicle, building, and unit sprites.",
    "category": "assets",
    "price": 29.99,
    "rating": 5,
    "reviews": 31,
    "badges": [
      "8,000+ Sprites",
      "Sci-Fi RTS",
      "Isometric Vault"
    ],
    "cover": "assets/covers/warfront.jpg",
    "itchUrl": "https://jasonc101.itch.io/warfront-8000-sci-fi-alien-rts-2d3d-isometric-sprite-vault",
    "gumroadUrl": "https://honeydo5.gumroad.com/l/warfront",
    "description": "Over 8,000 transparent PNG isometric assets organized across 8 directional angles for sci-fi tanks, walkers, aircraft, alien bio-constructs, command centers, turrets, and resource extractors.",
    "specs": [
      "354 MB Compressed Vault",
      "Transparent PNGs",
      "Unlimited Commercial Projects"
    ]
  },
  {
    "id": "relics-of-the-abyss",
    "title": "Relics of the Abyss: 650+ Dark Fantasy RPG Assets & Textures Vault",
    "subtitle": "588 MB museum-grade collection: ancient relics, occult runes, undead monsters & seamless surfaces.",
    "category": "assets",
    "price": 24.99,
    "rating": 5,
    "reviews": 29,
    "badges": [
      "650+ Assets",
      "Dark Fantasy",
      "4K Textures"
    ],
    "cover": "assets/covers/relicsabyss.jpg",
    "itchUrl": "https://jasonc101.itch.io/relics-of-the-abyss-650-dark-fantasy-rpg-assets-textures-vault",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Expansive 658-asset dark fantasy vault featuring occult runes, abyssal weapons, cursed amulets, undead colossi portraits, and high-res gothic cobblestone, dark oak, and weathered stone textures.",
    "specs": [
      "588 MB Lossless Pack",
      "Ready for Godot/Unity/Unreal",
      "Royalty-Free License"
    ]
  },
  {
    "id": "wildlands-protocol",
    "title": "Wildlands Protocol: Godot 4 3D Mech Locomotion & Urban Sandbox Kit",
    "subtitle": "3D battle mech action starter kit for Godot 4: 6-DOF locomotion, boost thrusters & procedural cities.",
    "category": "godot",
    "price": 24.99,
    "rating": 5,
    "reviews": 11,
    "badges": [
      "Godot 4",
      "3D Mech Kit",
      "Procedural City"
    ],
    "cover": "assets/covers/wildlands.jpg",
    "itchUrl": "https://jasonc101.itch.io/wildlands-protocol-godot-4-3d-mech-locomotion-urban-sandbox-kit",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Out-of-the-box 3D mech action starter kit. Features responsive mech movement, jump jet thrusters, spring-arm third-person camera, forward+ rendering materials, and procedural city street generator.",
    "specs": [
      "Godot 4.2+ Forward+",
      "GDScript Native",
      "Full Commercial Rights"
    ]
  },
  {
    "id": "voidrogue",
    "title": "VoidRogue: Production TypeScript Roguelike Deckbuilder Engine",
    "subtitle": "Modular turn-based card combat architecture with relics, deck synergies, and procedural map generation.",
    "category": "engine",
    "price": 24.99,
    "rating": 5,
    "reviews": 17,
    "badges": [
      "TypeScript",
      "Roguelike",
      "Deckbuilder"
    ],
    "cover": "assets/covers/voidrogue.jpg",
    "itchUrl": "https://jasonc101.itch.io/voidrogue-production-typescript-roguelike-deckbuilder-engine",
    "gumroadUrl": "https://honeydo5.gumroad.com/l/pvlfg",
    "description": "Production-ready TypeScript architecture for card battlers (inspired by Slay the Spire). Features node-based dungeon progression, relic triggers, status effects, and reactive combat event loop.",
    "specs": [
      "Clean TypeScript Core",
      "Web / Electron / Node Ready",
      "Royalty-Free License"
    ]
  },
  {
    "id": "necrobestiary",
    "title": "NecroBestiary: Dark Fantasy Undead & Bosses 2D Sprite Pack",
    "subtitle": "Handcrafted 2D sprite pack featuring skeletons, wraiths, liches, bone dragons, and abyssal horrors.",
    "category": "assets",
    "price": 19.99,
    "rating": 5,
    "reviews": 20,
    "badges": [
      "Undead Bosses",
      "2D Sprites",
      "Dark Fantasy"
    ],
    "cover": "assets/covers/necrobestiary.jpg",
    "itchUrl": "https://jasonc101.itch.io/necrobestiary-dark-fantasy-undead-bosses-2d-sprite-pack",
    "gumroadUrl": "https://honeydo5.gumroad.com/l/qgoxea",
    "description": "60+ high-resolution transparent PNG monster sprites with multi-layered weapon accessories and spectral visual effects tailored for dark fantasy RPGs and dungeon crawlers.",
    "specs": [
      "High-Res Transparent PNG",
      "Individual & Atlas Sheets",
      "Royalty-Free License"
    ]
  },
  {
    "id": "mechdominion",
    "title": "MechDominion: Cybernetic Titans & Mecha Bosses 2D Sprite Pack",
    "subtitle": "Futuristic mechs, walking war machines, automated drones, and cybernetic siege boss sprites.",
    "category": "assets",
    "price": 19.99,
    "rating": 5,
    "reviews": 14,
    "badges": [
      "Mecha Titans",
      "Cybernetic Bosses",
      "Transparent PNG"
    ],
    "cover": "assets/covers/mechdominion.jpg",
    "itchUrl": "https://jasonc101.itch.io/mechdominion-titans-bosses-sprite-pack",
    "gumroadUrl": "https://honeydo5.gumroad.com/l/dqdhpi",
    "description": "Precision-designed mecha titan sprites with separate weapons, missile racks, laser cannons, and tread modules ready to animate and assemble in any 2D game engine.",
    "specs": [
      "Layered Modular Parts",
      "Clean Vector & PNG",
      "Full Commercial License"
    ]
  },
  {
    "id": "slay-the-void",
    "title": "Slay The Void: Cosmic Sci-Fi & Dark RPG Card Art Pack",
    "subtitle": "Over 200 illustrated cosmic horror and cybernetic sci-fi card illustrations for deckbuilder games.",
    "category": "assets",
    "price": 19.99,
    "rating": 5,
    "reviews": 22,
    "badges": [
      "Cosmic Horror",
      "Sci-Fi Cards",
      "High-Res Art"
    ],
    "cover": "assets/covers/slaythevoid.jpg",
    "itchUrl": "https://jasonc101.itch.io/slay-the-void-cosmic-sci-fi-dark-rpg-card-art-pack",
    "gumroadUrl": "https://honeydo5.gumroad.com/l/pvlfg",
    "description": "200+ unique card art illustrations in standard trading card ratios (750x1050 and 1500x2100). Divided into Attack, Defense, Skill, Relic, and Eldritch Curse categories.",
    "specs": [
      "Standard Card Aspect Ratio",
      "High DPI Print Ready",
      "Commercial License Included"
    ]
  },
  {
    "id": "grimrealm",
    "title": "GrimRealm: RPG Terrains & Environment Textures (79 Pack)",
    "subtitle": "79 seamless 2K and 4K tiling dark fantasy landscape and architectural surface textures.",
    "category": "assets",
    "price": 14.99,
    "rating": 5,
    "reviews": 19,
    "badges": [
      "79 Textures",
      "Seamless Tiling",
      "Dark Gothic"
    ],
    "cover": "assets/covers/grimrealm.jpg",
    "itchUrl": "https://jasonc101.itch.io/grimrealm-rpg-terrains-environment-textures-79-pack",
    "gumroadUrl": "https://honeydo5.gumroad.com/l/szhlm",
    "description": "79 seamless tiling surface textures including ancient stone masonry, muddy battlefields, crypt floors, mossy tomb walls, and corrupted earth with PBR-ready details.",
    "specs": [
      "2048x2048 & 4096x4096",
      "Seamlessly Tiling",
      "Commercial License Included"
    ]
  },
  {
    "id": "we-got-this",
    "title": "WE GOT THIS!: Narrative Fallout Shelter Survival Game",
    "subtitle": "Standalone commercial game build. 28-day narrative arc, 4 acts, 6 endings, and 18 achievements.",
    "category": "game",
    "price": 14.99,
    "rating": 5,
    "reviews": 35,
    "badges": [
      "Full Game",
      "Windows Standalone",
      "6 Endings"
    ],
    "cover": "assets/covers/wegotthis.jpg",
    "itchUrl": "https://jasonc101.itch.io/we-got-this-narrative-fallout-shelter-survival-game",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Complete playable narrative survival-management game. Lead two families through the final weeks of a failing fallout shelter beneath the ruined city of Bellwether. 28 in-game days, tactile expedition planning board, 18 achievements, full accessibility options, and controller support.",
    "specs": [
      "Standalone Windows Executable",
      "Native 1080p / 4K Scaling",
      "Complete Story Experience"
    ]
  },
  {
    "id": "glyphcore-icons",
    "title": "GlyphCore Icons Pro: 200+ Clean Modern Vector UI Icons",
    "subtitle": "200+ precision-crafted SVG vector icons tailored for game menus, HUDs, action bars & apps.",
    "category": "assets",
    "price": 14.99,
    "rating": 5,
    "reviews": 26,
    "badges": [
      "200+ Icons",
      "Scalable SVG",
      "Game UI & HUD"
    ],
    "cover": "assets/covers/glyphcore.jpg",
    "itchUrl": "https://jasonc101.itch.io/glyphcore-icons-pro-200-clean-modern-vector-ui-icons",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Handcrafted, precision-engineered vector icon collection organized across Navigation, Combat/Stats, Controls, Inventory, Media, and System categories. Standard 24x24 and 32x32 bounding boxes for crisp rendering at any DPI.",
    "specs": [
      "Clean Semantic SVG",
      "React/Vue/Godot/Unity Ready",
      "Royalty-Free License"
    ]
  },
  {
    "id": "humans-endless-warmonger",
    "title": "Humans: The Endless Warmonger by Jason Coleman",
    "subtitle": "Complete military philosophy manuscript (.docx & .md), worldbuilding bible & KDP launch kit.",
    "category": "book",
    "price": 9.99,
    "rating": 5,
    "reviews": 42,
    "badges": [
      "Full Manuscript",
      "Lore Bible",
      "Military History"
    ],
    "cover": "assets/covers/humansendless.jpg",
    "itchUrl": "https://jasonc101.itch.io/humans-the-endless-warmonger-by-jason-coleman",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "An unsparing forensic autopsy of humanity's 5,000-year ledger of warfare by author Jason Coleman. Examines the biological operating system of conflict and introduces the five technological pillars of post-human peace.",
    "specs": [
      "Complete DOCX & Markdown",
      "Story Bible & Timeline",
      "Full Commercial Launch Kit"
    ]
  },
  {
    "id": "multiplayer-netcode-engine",
    "title": "Multiplayer State Sync & Deterministic Netcode Engine",
    "subtitle": "Production-grade headless netcode: client prediction, server reconciliation, entity interpolation & snapshot deltas.",
    "category": "engine",
    "price": 44.99,
    "rating": 5,
    "reviews": 16,
    "badges": [
      "Python 3.10+",
      "Deterministic Netcode",
      "Client Prediction"
    ],
    "cover": "assets/covers/dungeonengine.jpg",
    "itchUrl": "https://jasonc101.itch.io/multiplayer-state-sync-deterministic-netcode-engine",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Production-grade headless multiplayer netcode engine. Features client-side movement prediction with input buffers, authoritative server reconciliation, smooth cubic Hermite entity interpolation, delta compression for network snapshots, lag compensation rewind raycasting, room/lobby/session state machine, and simulated latency/jitter/packet-loss testing harnesses.",
    "specs": [
      "Pure Python Stdlib (Zero External Dependencies)",
      "Tick-Rate Agnostic Simulation",
      "Deterministic Input Buffers",
      "Royalty-Free Commercial License"
    ]
  },
  {
    "id": "inventory-crafting-loot-engine",
    "title": "Inventory, Crafting & Loot Matrix Engine",
    "subtitle": "Headless grid+slot inventory, multi-station crafting pipeline, weighted loot tables & gear sockets. 175 unit tests.",
    "category": "engine",
    "price": 44.99,
    "rating": 5,
    "reviews": 21,
    "badges": [
      "Python 3.10+",
      "175 Tests Passing",
      "Grid & Slot Inventory"
    ],
    "cover": "assets/covers/dungeonengine.jpg",
    "itchUrl": "https://jasonc101.itch.io/inventory-crafting-loot-matrix-engine",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Modular headless inventory, crafting, and loot engine for RPGs, survival games, and roguelikes. Features Resident Evil / Diablo style 2D grid spatial placement with item rotation and collision checks, standard slot-based stack/weight systems, multi-station recipe crafting (shapeless, shaped, catalyst), 4-tier weighted drop matrices, equipment paperdoll sockets with gem durability, and atomic JSON serialization.",
    "specs": [
      "175/175 Pytest Suite Passing",
      "Zero External Dependencies",
      "Atomic Save/Load Persistence",
      "Royalty-Free Commercial License"
    ]
  },
  {
    "id": "behavior-tree-goap-ai",
    "title": "Behavior Tree & GOAP AI Decision Architecture",
    "subtitle": "Headless AI decision engine with composite/decorator trees, GOAP A* planning & blackboard state. 114 tests passing.",
    "category": "engine",
    "price": 44.99,
    "rating": 5,
    "reviews": 18,
    "badges": [
      "Python 3.10+",
      "114 Tests Passing",
      "GOAP & Behavior Trees"
    ],
    "cover": "assets/covers/tacticalgrid.jpg",
    "itchUrl": "https://jasonc101.itch.io/behavior-tree-goap-ai-decision-architecture",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Autonomous decision-making engine for indie game developers. Combines hierarchical Behavior Trees (Sequences, Selectors, Inverters, Repeats, Cooldowns) with Goal-Oriented Action Planning (GOAP) via A* search over symbolic world state. Built-in reactive Blackboard state management, sensory perception pipeline, and step-by-step debug logging.",
    "specs": [
      "114/114 Pytest Suite Passing",
      "Pure Python Standard Library",
      "Full CLI & Simulation Harness",
      "Commercial License Included"
    ]
  },
  {
    "id": "card-battler-engine",
    "title": "Card Battler: Headless Deck Combat & Balance Simulator",
    "subtitle": "Simulate 1,000 deck-vs-deck battles in under 3 seconds. Status stacking, energy economy & JSON balance telemetry.",
    "category": "engine",
    "price": 39.99,
    "rating": 5,
    "reviews": 15,
    "badges": [
      "Python 3.10+",
      "Monte Carlo Balancer",
      "Deckbuilder Engine"
    ],
    "cover": "assets/covers/cardsim.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "A production-grade, headless card combat simulator. Execute thousands of Monte Carlo matches across custom deck archetypes in seconds. Complete card effect pipeline (damage, shield, poison, vulnerable, weakness, heal), energy cost curves, card draw/discard piles, and comprehensive win-rate/card-value telemetry exportable to JSON.",
    "specs": [
      "1000 Battles in <3 Seconds",
      "Zero External Dependencies",
      "Full JSON Telemetry Export",
      "Royalty-Free Commercial License"
    ]
  },
  {
    "id": "godot4-modular-castle-builder",
    "title": "Godot 4 Modular Castle & Fortress Building System",
    "subtitle": "Runtime 3D grid building system: socket snapping, collision generation, structural integrity & JSON serialization.",
    "category": "godot",
    "price": 29.99,
    "rating": 5,
    "reviews": 14,
    "badges": [
      "Godot 4 Addon",
      "Modular Building",
      "Socket Snapping"
    ],
    "cover": "assets/covers/necros.jpg",
    "itchUrl": "https://jasonc101.itch.io/godot-4-modular-castle-fortress-building-system",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "A complete runtime modular building system extracted from production Godot 4 code. Place fortress walls, battlements, towers, ramps, and gates on a 3D grid with snap-to-socket mechanics, automatic collision generation, structural stability validation, and instant JSON save/load persistence.",
    "specs": [
      "Godot 4.2+ Compatible",
      "Clean GDScript Architecture",
      "Includes Sample Scene & Plugin.cfg",
      "Full Commercial License"
    ]
  },
  {
    "id": "godot4-arpg-combat-defense",
    "title": "Godot 4 ARPG Tactical Combat & Defense Framework",
    "subtitle": "Hitboxes, hurtboxes, poise damage, hitstun, status ailments (burn, poison, bleed) & floating combat numbers.",
    "category": "godot",
    "price": 39.99,
    "rating": 5,
    "reviews": 22,
    "badges": [
      "Godot 4 Addon",
      "Action RPG Combat",
      "Status Pipeline"
    ],
    "cover": "assets/covers/necros.jpg",
    "itchUrl": "https://jasonc101.itch.io/godot-4-arpg-tactical-combat-defense-framework",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Production-ready 3D Action RPG combat framework for Godot 4. Includes precise hitbox/hurtbox registration, poise damage thresholds, stagger frames, active blocking, status ailment ticking (burn, poison, frost, bleed), combo attack buffers, projectile physics, and floating combat text HUD integration.",
    "specs": [
      "Godot 4.2+ Forward+",
      "Modular Component Architecture",
      "Includes Audio Impact Triggers",
      "Royalty-Free Commercial License"
    ]
  },
  {
    "id": "godot4-procedural-dungeon-delve",
    "title": "Godot 4 Procedural 3D Dungeon Delve & Terrain Engine",
    "subtitle": "3D procedural dungeon generator and dynamic mountain terrain sculpting with seeded layout and stair connections.",
    "category": "godot",
    "price": 34.99,
    "rating": 5,
    "reviews": 17,
    "badges": [
      "Godot 4 Addon",
      "Procedural 3D",
      "Dungeon Crawl"
    ],
    "cover": "assets/covers/necros.jpg",
    "itchUrl": "https://jasonc101.itch.io/godot-4-procedural-3d-dungeon-delve-terrain-engine",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Procedural 3D dungeon crawl and mountainous terrain generator for Godot 4. Generates multi-floor dungeons with room-and-corridor geometry, heightmap terrace sculpting, seeded level layouts, automatic stair and door placement, and dynamic room lighting anchors.",
    "specs": [
      "Godot 4.2+ Forward+",
      "Seeded Reproducibility",
      "Optimized Mesh Generation",
      "Commercial License Included"
    ]
  },
  {
    "id": "godot4-companion-pet-ai-system",
    "title": "Godot 4 Autonomous Companion & Pet AI Summoning System",
    "subtitle": "Autonomous follow, leash distances, combat target selection, skill timers & minion summon HUD bar.",
    "category": "godot",
    "price": 29.99,
    "rating": 5,
    "reviews": 16,
    "badges": [
      "Godot 4 Addon",
      "Companion AI",
      "Pet Summoning"
    ],
    "cover": "assets/covers/necros.jpg",
    "itchUrl": "https://jasonc101.itch.io/godot-4-autonomous-companion-pet-ai-summoning-system",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Complete companion, pet, and summoned minion AI architecture for Godot 4. Features intelligent follow behaviors with rubber-banding leash distances, combat target selection, autonomous spell/skill casting, assist modes, companion inventory, and a ready-to-use summon HUD bar.",
    "specs": [
      "Godot 4.2+ Compatible",
      "Autonomous AI State Machine",
      "Summon Bar UI Components",
      "Royalty-Free License"
    ]
  },
  {
    "id": "godot4-rpg-progression-skill-tree",
    "title": "Godot 4 RPG Character Progression & Talent Tree Matrix",
    "subtitle": "Configurable level-scaling formulas, branching talent trees, attribute points & ready-to-use skill menu UI.",
    "category": "godot",
    "price": 29.99,
    "rating": 5,
    "reviews": 19,
    "badges": [
      "Godot 4 Addon",
      "Skill Tree UI",
      "RPG Progression"
    ],
    "cover": "assets/covers/necros.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Deep RPG character progression and skill tree framework for Godot 4. Features mathematical XP scaling curves, tiered active and passive skill nodes with prerequisite branches, attribute allocation, and a polished dark fantasy skill menu UI.",
    "specs": [
      "Godot 4.2+ Compatible",
      "Configurable XP Formulas",
      "Full GDScript UI Included",
      "Commercial License Included"
    ]
  },
  {
    "id": "godot4-living-world-sky-minimap",
    "title": "Godot 4 Dynamic Living World, Celestial Sky & Minimap Radar",
    "subtitle": "Day/night celestial orbital cycles with sun/moon lighting curves, dynamic sky shader & 2D/3D radar minimap.",
    "category": "godot",
    "price": 24.99,
    "rating": 5,
    "reviews": 18,
    "badges": [
      "Godot 4 Addon",
      "Day/Night Cycle",
      "Minimap Radar"
    ],
    "cover": "assets/covers/necros.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Atmospheric world environment suite for Godot 4. Provides smooth orbital day/night cycles with synchronized sun/moon directional lights, dynamic sky shader parameters, ambient lighting curves, a real-time 2D/3D radar minimap with customizable POI markers, and a full-screen atlas map view.",
    "specs": [
      "Godot 4.2+ Forward+",
      "Dynamic Sky Shaders",
      "Zero External Dependencies",
      "Full Commercial License"
    ]
  },
  {
    "id": "godot4-rpg-inventory-crafting-system",
    "title": "Godot 4 RPG Inventory, Crafting Bench & Loot Drop Addon",
    "subtitle": "Grid/slot item management, recipe requirements checking, rarity color borders, drag & drop, and stat tooltips.",
    "category": "godot",
    "price": 29.99,
    "rating": 5,
    "reviews": 20,
    "badges": [
      "Godot 4 Addon",
      "Crafting Bench",
      "Inventory UI"
    ],
    "cover": "assets/covers/necros.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Turnkey RPG inventory and crafting bench UI for Godot 4. Includes slot/grid inventory containers, recipe unlocking systems, station crafting requirements (forge, alchemy, workbench), rarity border shaders, drag-and-drop mechanics, item stat comparison tooltips, and ground drop physics.",
    "specs": [
      "Godot 4.2+ Compatible",
      "Drag & Drop Supported",
      "Customizable UI Themes",
      "Royalty-Free Commercial License"
    ]
  },
  {
    "id": "godot4-quest-journal-dynamic-events",
    "title": "Godot 4 Quest Log, Field Journal & Dynamic Event Tracker",
    "subtitle": "Multi-stage objective tracking, branching quest states, field journal entry unlocking & dynamic world encounters.",
    "category": "godot",
    "price": 24.99,
    "rating": 5,
    "reviews": 15,
    "badges": [
      "Godot 4 Addon",
      "Quest System",
      "Lore Journal"
    ],
    "cover": "assets/covers/necros.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Dynamic quest tracking, lore journal, and encounter management system for Godot 4. Features multi-step objective states, reward payouts, journal lore entry unlocking, and random wilderness danger event triggers.",
    "specs": [
      "Godot 4.2+ Compatible",
      "JSON Quest Definitions",
      "Event-Driven Signals",
      "Commercial License Included"
    ]
  },
  {
    "id": "video-montage-auto-pipeline",
    "title": "Automated Video Montage & YouTube Media Pipeline Engine",
    "subtitle": "Python batch video automation: clip splicing, voice synthesis ducking, 20min+ montage rendering & overlays.",
    "category": "engine",
    "price": 49.99,
    "rating": 5,
    "reviews": 14,
    "badges": [
      "Python Automation",
      "Video Pipeline",
      "YouTube Tools"
    ],
    "cover": "assets/covers/soitswarthen.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Complete Python batch video automation suite. Automatically splices video clips into cohesive long-form montages (10-25+ minutes), synthesizes and aligns audio narration, applies background music ducking, and renders broadcast-ready MP4s with transition overlays.",
    "specs": [
      "Python 3.10+ Script Suite",
      "Automated Montage Splicing",
      "Audio Ducking & Narration",
      "Commercial License Included"
    ]
  },
  {
    "id": "modern-interiors-executive-spa-4k",
    "title": "Modern Japandi Interiors & Executive Spa Design Lookbook (4K)",
    "subtitle": "Curated collection of 4K ultra-wide architectural renders: luxury spa bathrooms, executive offices & minimalist living rooms.",
    "category": "assets",
    "price": 29.99,
    "rating": 5,
    "reviews": 24,
    "badges": [
      "4K Renders",
      "Interior Design",
      "Architectural Mockups"
    ],
    "cover": "assets/covers/grimrealm.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "A premium commercial digital asset collection featuring 170+ ultra-high-resolution 4K architectural and interior design renders. Categories include Dark Moody Executive Home Offices, Luxury Spa Bathrooms, Japandi Minimalist Living Rooms, and High-End Scenic Backdrops. Perfect for design lookbooks, product mockups, 3D visualization backgrounds, and desktop wallpapers.",
    "specs": [
      "3840x2160 & Ultra-Wide 4K",
      "170+ High-Resolution PNGs",
      "Royalty-Free Commercial License"
    ]
  },
  {
    "id": "cyberpunk-streamer-lounges",
    "title": "Cyberpunk Streamer Lounges & Lo-Fi Studio Backdrops (4K)",
    "subtitle": "Ultra-wide 4K cyberpunk gaming rooms, neon lighting, lo-fi stages & modular streaming background renders.",
    "category": "assets",
    "price": 19.99,
    "rating": 5,
    "reviews": 17,
    "badges": [
      "Cyberpunk 4K",
      "Streamer Backdrops",
      "Lo-Fi Rooms"
    ],
    "cover": "assets/covers/cyberpunkwarlords.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "High-resolution ultra-wide 4K cyberpunk streamer lounge environments. Featuring intricate dual-monitor battlestations, moody ambient neon glow, acoustic paneling, futuristic lo-fi aesthetics, and panoramic city skylines. Ready for stream overlays, video podcasts, and visual novel backgrounds.",
    "specs": [
      "Ultra-Wide 4K Resolution",
      "High Dynamic Range Color",
      "Full Commercial License"
    ]
  },
  {
    "id": "dark-gothic-tarot-deck",
    "title": "Dark Gothic Eldritch Tarot Deck (20 High-Res Cards)",
    "subtitle": "20 illustrated occult tarot cards with intricate filigree borders, arcane symbols & gold-foil aesthetic.",
    "category": "assets",
    "price": 24.99,
    "rating": 5,
    "reviews": 21,
    "badges": [
      "Tarot Deck",
      "Dark Gothic",
      "Print & Digital Ready"
    ],
    "cover": "assets/covers/slaythevoid.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "A complete 20-card dark gothic tarot deck featuring major arcana interpretations including The Hermit, Death, The High Priestess, The Wheel, and The Void. Designed with ornate antique filigree borders and high-contrast gold/crimson detailing suitable for physical printing (300 DPI) or digital card game integration.",
    "specs": [
      "Portrait Aspect Ratio (768x1376)",
      "300 DPI High-Resolution",
      "Print & Game Dev Ready",
      "Royalty-Free Commercial Rights"
    ]
  },
  {
    "id": "eldritch-vtt-tokens-pack",
    "title": "Eldritch VTT Round Token Master Pack (Sliced PNGs)",
    "subtitle": "24 precision-sliced circular tokens with brass filigree bezels & transparent alpha backgrounds for VTTs.",
    "category": "assets",
    "price": 14.99,
    "rating": 5,
    "reviews": 28,
    "badges": [
      "VTT Tokens",
      "Transparent PNG",
      "Roll20 & Foundry"
    ],
    "cover": "assets/covers/necrobestiary.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "24 circular virtual tabletop (VTT) tokens sliced from master artwork. Each token is framed by an antique brass filigree bezel with a transparent background. Fully compatible with Roll20, Foundry VTT, Owlbear Rodeo, and Fantasy Grounds for dark fantasy and eldritch horror campaigns.",
    "specs": [
      "Transparent Alpha PNGs",
      "Standard 256x256 VTT Resolution",
      "Drag-and-Drop VTT Ready",
      "Full Commercial License"
    ]
  },
  {
    "id": "godot4-mech-flight-physics-kit",
    "title": "Godot 4 3D Mech Flight & Physics Controller Kit",
    "subtitle": "3D character controller, orbital spring-arm camera, hover thrusters, volumetric fog & textured 3D mech mesh.",
    "category": "godot",
    "price": 39.99,
    "rating": 5,
    "reviews": 19,
    "badges": [
      "Godot 4 3D",
      "Mech Physics",
      "3D Model Included"
    ],
    "cover": "assets/covers/wildlandsprotocol.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "High-performance mechanical character controller for Godot 4. Includes smooth 3rd-person camera orbit with pitch clamping, sprint and hover-thrust kinematics, jump momentum dampening, atmospheric volumetric fog, screen-space reflections, bloom glow, and includes the textured 3D mech model (RobotExpressive.glb).",
    "specs": [
      "Godot 4.2+ Forward+",
      "Clean GDScript Kinematics",
      "Includes 3D Animated Asset",
      "Royalty-Free Commercial License"
    ]
  },
  {
    "id": "horde-wave-survival-spawner",
    "title": "Horde Wave Survival & Enemy Spawner Matrix",
    "subtitle": "Modular encounter tiers, elastic wave budgets, anchor positioning, elite champion affixes & corpse decay physics.",
    "category": "godot",
    "price": 34.99,
    "rating": 5,
    "reviews": 16,
    "badges": [
      "Godot 4 Addon",
      "Horde Spawner",
      "Wave Scaling"
    ],
    "cover": "assets/covers/soldierslaststand.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Production-grade enemy wave spawner and horde survival architecture for Godot 4. Features dynamic spawn slot allocation across camp/road/champion encounter tiers, elastic respawn timers, leash distance geometry to prevent clustering, rotating champion affixes (Bulwark, Charger, Hexer), and corpse persistence with ground loot drops.",
    "specs": [
      "Godot 4.2+ Compatible",
      "Modular Spawner System",
      "Zero External Dependencies",
      "Full Commercial License"
    ]
  },
  {
    "id": "4x-hex-territory-diplomacy",
    "title": "Turn-Based 4X Hex Territory & Diplomacy Engine",
    "subtitle": "Headless 4-faction empire state machine: hex borders, supply lines, economic nodes & automated AI build orders.",
    "category": "engine",
    "price": 49.99,
    "rating": 5,
    "reviews": 21,
    "badges": [
      "Python 3.10+",
      "4X Grand Strategy",
      "Monte Carlo Balancer"
    ],
    "cover": "assets/covers/soitswarthen.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Production headless 4X strategy and territory conquest engine in pure Python. Features turn-based 4-faction empire simulation, hex grid territory borders with supply line validation, 3-resource economic loops (Ore, Energy, Biomass), automated AI build orders with distinct aggression profiles, and a Monte Carlo testing harness.",
    "specs": [
      "Pure Python Stdlib Core",
      "Simulates 50+ Turns in <2s",
      "Zero External Dependencies",
      "Royalty-Free Commercial License"
    ]
  },
  {
    "id": "video-automation-shorts-cli",
    "title": "Video Automation & YouTube Shorts Media Pipeline CLI",
    "subtitle": "Turnkey Python CLI: batch clip splicing, voice synthesis ducking, vertical 9:16 Shorts & 16:9 4K longform rendering.",
    "category": "engine",
    "price": 49.99,
    "rating": 5,
    "reviews": 25,
    "badges": [
      "Python Automation",
      "Shorts & Reels",
      "Video Pipeline"
    ],
    "cover": "assets/covers/soitswarthen.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "End-to-end batch video generation CLI for content creators and automated channels. Automatically sequences raw video clips into cohesive montages, synthesizes and ducks background audio under narration, scales to 9:16 vertical (Shorts/TikTok) or 16:9 4K landscape, and renders finished MP4s with transition overlays.",
    "specs": [
      "Python 3.10+ Script Suite",
      "Batch Runner with Progress Bars",
      "Dual Aspect Ratio Support",
      "Full Commercial License"
    ]
  },
  {
    "id": "godot4-rpg-dialogue-branching-system",
    "title": "Godot 4 Dark Fantasy RPG Dialogue & Branching Choice System",
    "subtitle": "Node-based conversation graph, dynamic battle banter triggers, reputation condition checks & lore journal unlocks.",
    "category": "godot",
    "price": 24.99,
    "rating": 5,
    "reviews": 14,
    "badges": [
      "Godot 4 Addon",
      "Dialogue System",
      "Branching Narrative"
    ],
    "cover": "assets/covers/necros.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Modular conversation engine and narrative reactivity system for Godot 4. Includes node-based dialogue trees with branching player responses, dynamic proximity battle banter triggers, reputation and quest prerequisite condition checks, and automatic lore journal entry reveals.",
    "specs": [
      "Godot 4.2+ Compatible",
      "Clean GDScript Component",
      "JSON Dialogue Formatting",
      "Commercial License Included"
    ]
  },
  {
    "id": "so-its-war-then-core-engine",
    "title": "So It's War Then: 4-Faction RTS Core Simulation Engine",
    "subtitle": "Deterministic headless RTS framework with 4 asymmetric factions, tactical bot AI & match telemetry.",
    "category": "engine",
    "price": 49.99,
    "rating": 5,
    "reviews": 38,
    "badges": [
      "4 Factions",
      "Headless RTS",
      "Tactical AI"
    ],
    "cover": "assets/covers/soitswarthen.jpg",
    "itchUrl": "https://jasonc101.itch.io/so-its-war-then-4faction-rts-core-engine",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Production-grade, high-performance RTS core simulation engine. Decoupled headless game loop, 4 completely distinct factions (Human, Zurgz swarm, Ironclad mechs, Ascended), multi-profile bot AI architectures, hero skill pipeline, and comprehensive telemetry metrics.",
    "specs": [
      "Pure Python & Pygame Ready",
      "Headless High-Tick Sim",
      "4 Asymmetric Factions",
      "Full Commercial License"
    ]
  },
  {
    "id": "rts-formation-pathfinding-system",
    "title": "RTS Multi-Unit Formation & Spatial Pathfinding Engine",
    "subtitle": "Spatial hash grid partitioning, boids crowd flocking & tactical squad formation geometry.",
    "category": "engine",
    "price": 34.99,
    "rating": 5,
    "reviews": 21,
    "badges": [
      "Boids Flocking",
      "Spatial Hash Grid",
      "Squad Formations"
    ],
    "cover": "assets/covers/soitswarthen.jpg",
    "itchUrl": "https://jasonc101.itch.io/rts-multi-unit-formation-pathfinding-system",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Drop-in spatial navigation and formation engine engineered for large unit counts in RTS and squad games. Includes 2D spatial grid partitioning, collision avoidance, crowd flocking, and dynamic formation adapting (Wedge, Box, Line, Column).",
    "specs": [
      "Sub-millisecond Spatial Queries",
      "Vector Math / Python Core",
      "Dynamic Obstacle Avoidance",
      "Royalty-Free Commercial License"
    ]
  },
  {
    "id": "rts-economy-techtree-matrix",
    "title": "RTS Dynamic Economy, Tech Tree & Base Construction Matrix",
    "subtitle": "Worker harvesting logistics, 21-phase branching tech trees & grid-aligned building placement.",
    "category": "engine",
    "price": 29.99,
    "rating": 5,
    "reviews": 17,
    "badges": [
      "Worker Logistics",
      "21-Phase Tech Tree",
      "Base Building"
    ],
    "cover": "assets/covers/soitswarthen.jpg",
    "itchUrl": "https://jasonc101.itch.io/rts-economy-techtree-building-matrix",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Turnkey economic and technological foundation for real-time strategy games. Handles worker harvesting loops, drop-off warehouses, 21-phase tech dependencies, and grid-aligned construction collision checks with power grid validation.",
    "specs": [
      "Modular Python Architecture",
      "Customizable Resource Nodes",
      "Dependency Graph Resolver",
      "Commercial License Included"
    ]
  },
  {
    "id": "warfront-rts-2d-sprite-vault",
    "title": "Warfront RTS: 2D Building & Unit High-Res Sprite Sheet Vault",
    "subtitle": "13 master high-res sprite sheets covering 4 factions, base buildings, terrain tiles & UI frames.",
    "category": "assets",
    "price": 39.99,
    "rating": 5,
    "reviews": 31,
    "badges": [
      "13 Master Sheets",
      "4 Faction Sprites",
      "Terrain & UI"
    ],
    "cover": "assets/covers/soitswarthen.jpg",
    "itchUrl": "https://jasonc101.itch.io/warfront-rts-2d-building-unit-asset-vault",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Complete production art vault for 2D top-down RTS, Tower Defense, and tactical games. Features master sprite sheets for Human, Robot, Alien, and Zurgz rosters, faction buildings, hero structures, seamless terrain tiles, weathered tarmac, and UI command frames.",
    "specs": [
      "13 High-Res PNG Sheets",
      "Grid-Aligned & Ready to Slice",
      "Multiple Factions & Base Props",
      "Commercial Royalty-Free License"
    ]
  },
  {
    "id": "necrodominion-conquest-framework",
    "title": "Necro Dominion: Undead Legion Conquest Framework",
    "subtitle": "Godot 4 minion horde AI, corpse harvesting, soul reanimation & dark grimoire spells suite.",
    "category": "godot",
    "price": 49.99,
    "rating": 5,
    "reviews": 44,
    "badges": [
      "Godot 4 Addon",
      "Undead Minion AI",
      "Corpse Harvesting",
      "12 Summon Sprites"
    ],
    "cover": "assets/covers/necros.jpg",
    "itchUrl": "https://jasonc101.itch.io/necrodominion-undead-legion-conquest-framework",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Extensive dark fantasy necromancy systems suite built and battle-tested in Godot 4. Includes corpse harvesting, minion swarm AI, autonomous companion spirits, dark grimoire spells, castle defense controller, and 12 hand-crafted summon roster sprites.",
    "specs": [
      "Godot 4.x Compatible",
      "22 Production GDScripts",
      "12 High-Res Undead Sprites",
      "Full Commercial License"
    ]
  },
{
    "id": "master-4k-interiors-lookbook-vol2",
    "title": "Master 4K Interiors & Architectural Lookbook Vol. 2",
    "subtitle": "150 ultra-high definition 4K photorealistic interior design, luxury spa, villa & minimalist room assets.",
    "category": "assets",
    "price": 39.99,
    "rating": 5,
    "reviews": 29,
    "badges": [
      "150 4K Images",
      "Photorealistic",
      "Commercial License"
    ],
    "cover": "assets/covers/soitswarthen.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Premium 150-piece 4K architectural visual archive. Spans minimalist Scandinavian/Japandi lounges, dark academia executive offices, cliffside Mediterranean infinity pool villas, and high-tech streamer gaming sanctuaries.",
    "specs": [
      "3840x2160 & 4K Resolution",
      "150 Curated Master Images",
      "Royalty-Free Commercial License"
    ]
  },
  {
    "id": "scifi-starship-bridges-cyberpunk-vistas",
    "title": "Sci-Fi Starship Bridges & Cyberpunk City Vistas Pack",
    "subtitle": "168 widescreen cinematic sci-fi command bridges, rainy neon megacities & orbital spaceports.",
    "category": "assets",
    "price": 34.99,
    "rating": 5,
    "reviews": 32,
    "badges": [
      "168 4K Vistas",
      "Cyberpunk",
      "Starship Bridges"
    ],
    "cover": "assets/covers/soitswarthen.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Cinematic visual library for sci-fi games, visual novels, and worldbuilding. Features detailed starship helm bridges, panoramic observation decks, flying vehicle skylines, and moody cyberpunk night markets.",
    "specs": [
      "Ultra-Wide 16:9 4K",
      "168 High-Resolution Assets",
      "Commercial License Included"
    ]
  },
  {
    "id": "alchemical-potions-grimoires-vtt-tokens",
    "title": "Alchemical Potions, Grimoires & VTT Tokens Pack",
    "subtitle": "110 square 1:1 fantasy alchemy flasks, ancient spellbooks, astrolabes & VTT tokens.",
    "category": "assets",
    "price": 29.99,
    "rating": 5,
    "reviews": 24,
    "badges": [
      "110 Square Assets",
      "RPG & VTT Ready",
      "Alchemy & Magic"
    ],
    "cover": "assets/covers/relics_abyss.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Complete tabletop and RPG icon collection. Includes bubbling alchemical elixirs, leather-bound grimoires, arcane planetary astrolabes, and circular creature tokens ready for Roll20, Foundry, and mobile UI slots.",
    "specs": [
      "Square 1:1 Aspect Ratio",
      "110 Ultra-Detailed Assets",
      "Print & Digital Commercial License"
    ]
  },
  {
    "id": "fineart-ukiyoe-dutch-botanicals",
    "title": "Fine Art: Japanese Ukiyo-e & Dutch Golden Age Botanicals",
    "subtitle": "39 museum-grade high-resolution portrait art prints, Edo woodblock prints & chiaroscuro oil still lifes.",
    "category": "assets",
    "price": 24.99,
    "rating": 5,
    "reviews": 18,
    "badges": [
      "Museum Grade",
      "39 Art Prints",
      "Ukiyo-e & Dutch Oil"
    ],
    "cover": "assets/covers/grimrealm.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Authentic period art styles recreated in modern ultra-high resolution: Japanese Edo period woodblock landscapes with Mount Fuji, 17th century Dutch Golden Age dramatic floral oil still lifes, and dark gothic tarot cards.",
    "specs": [
      "Vertical 2:3 & 9:16 Prints",
      "39 Master Artwork Files",
      "Full Commercial & Print Rights"
    ]
  },
  {
    "id": "flow-master-production-vault-467",
    "title": "Google Flow Master Production Vault (467 High-Res Assets)",
    "subtitle": "The entire master archive: 467 4K visual assets sorted into widescreen environments, square tokens & art prints.",
    "category": "assets",
    "price": 79.99,
    "rating": 5,
    "reviews": 51,
    "badges": [
      "467 Total Assets",
      "Complete Master Vault",
      "398 MB High-Res"
    ],
    "cover": "assets/covers/soitswarthen.jpg",
    "itchUrl": "https://jasonc101.itch.io/",
    "gumroadUrl": "https://honeydo5.gumroad.com/",
    "description": "Massive 467-asset visual megavault containing every production asset from our Google Flow pipeline. Completely categorized into widescreen 16:9 cinematic vistas, 1:1 square VTT tokens/potions, and vertical 2:3 fine art prints.",
    "specs": [
      "467 High-Res Image Files",
      "Categorized Folder Hierarchy",
      "Unrestricted Commercial License"
    ]
  }
];

