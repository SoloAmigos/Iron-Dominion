# Iron Dominion — Mobile RTS

A fully self-contained browser-based real-time strategy game targeting mobile and desktop.

## Architecture

Single-file HTML game (`index.html`) — all CSS, JS, and canvas rendering in one file.

### Game Systems
- **Factions** — 4 playable factions (Vanguard, Crimson, Scorpion, Northwind), each with unique stats, signature units, and faction-coloured procedural sprites
- **Units** — 13 unit types (dozer, truck, ranger, rocket, tank, arty, paladin, dominator, technical, guardian, drone, inferno, scarab, mortar); infantry drawn procedurally, vehicles drawn with canvas sprites
- **Buildings** — 9 building types (command, power, supply, barracks, factory, turret, market, tech, silo); each with detailed procedural pixel art
- **Pathfinding** — A* on a tile grid with line-of-sight smoothing and stuck detection
- **Fog of war** — per-tile visibility stamped by units/buildings, rendered via ImageData
- **AI** — scripted build order, wave attacks, defensive response, upgrade purchasing, superweapon firing
- **Economy** — supply trucks mine gold piles → deliver to supply depots; markets generate passive income; power grid affects production speed
- **General system** — XP/rank progression; skill points unlock special powers (Repair, Drop, Strike, Nuke)
- **Upgrades** — Weapons I/II and Armor I/II researched at the Tech Lab
- **Particles** — fire, smoke, sparks, debris, laser traces, flame jets, heal crosses, paratroop chutes
- **Audio** — Web Audio API procedural SFX (no asset files needed)
- **Controls** — touch (tap/drag/pinch/long-press box-select), mouse (left-drag box, right-click command, wheel zoom), keyboard (WASD/arrows + Escape)
- **Minimap** — live minimap canvas with fog, unit dots, and viewport indicator

## Development Notes

- Map: 60×40 tiles at 40px each (2400×1600 world px)
- Player base: bottom-left area (~tile 4,31); enemy base: top-right (~tile 51,4)
- Difficulty affects AI trickle income, wave interval, first wave delay, army cap, and whether the enemy builds a missile silo

## Planned Improvements

- [ ] Split into separate JS/CSS/HTML files for easier editing
- [ ] Add more map variety / random map generation options
- [ ] Multiplayer support
- [ ] Additional factions
- [ ] Save/load game state
- [ ] Sound improvements (music track)
