# Iron Dominion — Mobile RTS

A fully self-contained browser-based real-time strategy game targeting mobile and desktop.
Live via GitHub Pages (repo: `SoloAmigos/Iron-Dominion`, deploys from `main`).

## Architecture

Multi-file: `index.html` + `css/style.css` + `js/*.js` loaded as plain scripts (shared global scope, no modules/bundler).
PWA: `manifest.json` + `sw.js` (cache-first service worker — **bump the `CACHE` version on every change batch** or players get stale files).

| File | Owns |
|---|---|
| `js/config.js` | WPN/UT/BT stat tables, factions, upgrades, BUILD_CATEGORIES, COMBAT list |
| `js/state.js` | global mutable state (money, units, builds, fog, gameSpeed, gameStats…) |
| `js/world.js` | map generation, A* pathfinding, fog of war (`updateFog`/`tileVisAt`) |
| `js/units.js` | spawn/damage/kill, per-type unit update loops, orders |
| `js/buildings.js` | construction, production queues, silo charge |
| `js/projectiles.js` | projectile flight + impact |
| `js/ai.js` | AI: build order, faction doctrine (FACMIX), waves with flank/econ-raid/retreat |
| `js/render.js` | canvas renderer, procedural sprites, minimap, `iconURL()` |
| `js/audio.js` | audio engine v2: music sequencer (calm/intense), layered SFX, volume persistence |
| `js/ui.js` | command card, pointer/touch input, control groups, HUD buttons |
| `js/main.js` | menu screens, lobby, init, fixed-timestep game loop, endGame |
| `js/campaign.js` | scripted missions + objectives |

### Game Systems
- **Factions** — 4 playable (Vanguard, Crimson, Scorpion, Northwind) with signature units and AI combat doctrine
- **Units** — ground (`cat:'inf'|'veh'`) + air (`cat:'air'`: raptor, gunship, bomber — airfield only, pad-based rearm)
- **Buildings** — incl. radar tower (sight:20), samsite, airfield, silo; dozer build menu grouped Production/Combat/Economy with Power standalone
- **Fog of war** — per-tile vis 0/1/2; semi-fog hides enemy HP bars, damage fx, unit dust; ally vision shared via `isEnemy()`
- **Multi-slot games** — up to several AI slots, alliances via `slotAlliance`, per-slot faction choice in lobby
- **AI** — staged waves (direct / flank-left / flank-right / economy-raid), retreat at 60% losses, per-faction unit mixes
- **Audio** — Web Audio procedural: compressor → sfx/ui/music buses + reverb send; 16-step music sequencer reacts to threat
- **Economy / General / Upgrades / Particles / Controls / Minimap** — see respective files

## Development Notes

- Default map: 60×40 tiles at 40px (multiple sizes/presets in lobby)
- `gameSpeed` (1×/2×/4×) multiplies the fixed-timestep accumulator
- Git: pushes to `main` may 503 via the session proxy — fall back to GitHub MCP `push_files`
- UI theme: military (gunmetal/olive/khaki/stencil-amber, square corners) — do NOT reintroduce neon glows

## Planned Improvements

- [x] Save/load game state (localStorage serializer — pause menu Save, main menu Continue)
- [x] More map generator presets — `river` (horizontal river with bridge crossings) + `frontline` (S-shaped no-man's land)
- [x] More neutral capturables — `repairbay` (heals nearby units every 2.5s) + `watchtower` (sight:14 fog reveal)
- [ ] Campaign expansion
- [ ] Multiplayer support
- [ ] End-game stats graph (income/army value over time)
- [ ] Sound polish round 2 (unit voice blips per category, low-power alarm loop)
