# Iron Dominion — Mobile RTS

A fully self-contained browser-based real-time strategy game targeting mobile and desktop.
Live via GitHub Pages (repo: `SoloAmigos/Iron-Dominion`, deploys from `main`).

## Architecture

Multi-file: `index.html` + `css/style.css` + `js/*.js` loaded as plain scripts (shared global scope, no modules/bundler).
PWA: `manifest.json` + `sw.js` (network-first SW — **bump `CACHE` version on every change batch** or players get stale files; current: v38).

| File | Owns |
|---|---|
| `js/config.js` | WPN/UT/BT stat tables, factions, upgrades, BUILD_CATEGORIES, COMBAT list |
| `js/state.js` | global mutable state (money, units, builds, fog, gameSpeed, gameStats…) |
| `js/world.js` | map generation, A* pathfinding, fog of war (`updateFog`/`tileVisAt`) |
| `js/units.js` | spawn/damage/kill, per-type unit update loops, orders (`orderMove`/`orderAttack`/`orderGarrison`/`issueOrder`) |
| `js/buildings.js` | construction, production queues, silo charge, repair-bay aura |
| `js/projectiles.js` | projectile flight + impact |
| `js/ai.js` | AI: build order, per-faction doctrine (FACMIX with `fAltR`/`sigFR`/`sigBR`), waves with flank/econ-raid/retreat |
| `js/render.js` | canvas renderer, procedural sprites (`bSpr`/`uSpr`), animated overlays, minimap, `iconURL()` |
| `js/audio.js` | audio engine v2: music sequencer (calm/intense), layered SFX, volume persistence |
| `js/ui.js` | command card, pointer/touch input, control groups, HUD buttons |
| `js/main.js` | menu screens, lobby, init, fixed-timestep game loop, endGame, save/load |
| `js/campaign.js` | scripted missions + objectives |

### Game Systems
- **Factions** — 4 playable: Vanguard (paladin spearheads), Crimson (inferno/arty siege), Scorpion (technical/scarab raids), Northwind (guardian/mortar wall). Each has signature units (`sig:true` in UT) with distinct AI doctrine rates via `FACMIX` in ai.js.
- **Signature unit badge** — ground sig units show a faction-colored ★ pip beside their HP bar in drawUnit().
- **Units** — ground (`cat:'inf'|'veh'`) + air (`cat:'air'`: raptor, gunship, bomber — airfield only, pad-based rearm)
- **Order system** — `orderMove(u,x,y,kind)` / `orderAttack(u,tgt)` / `orderGarrison(u,b)` are thin wrappers around `issueOrder`. Order types: `'move'` (no distraction), `'attack-move'` (engages nearby enemies en route), `'attack'` (hard-targets ordered target only), `'garrison'`, `'capture'`, `'patrol'`, `'stop'`.
- **Buildings** — incl. radar (sight:20), samsite, airfield, silo; `repairbay` (heals 4%HP/2.5s to friendly units in 110px radius when captured); `watchtower` (sight:14 fog reveal when captured).
- **Neutral capturables** — `repairbay`, `watchtower`, `oilrig`, `civil` — infantry with Capture Protocol upgrade can capture.
- **Fog of war** — per-tile vis 0/1/2; semi-fog hides enemy HP bars, damage fx, unit dust; ally vision shared via `isEnemy()`.
- **Multi-slot games** — up to several AI slots, alliances via `slotAlliance`, per-slot faction/difficulty in lobby.
- **AI** — staged waves (direct / flank-left / flank-right / economy-raid), retreat at 60% losses, per-faction unit mixes, air patrol loop.
- **Audio** — Web Audio procedural: compressor → sfx/ui/music buses + reverb send; 16-step music sequencer reacts to threat; 3 bar-level pattern variations per intensity.
- **Economy / Upgrades / Particles / Controls / Minimap** — see respective files.
- **Save/Load** — localStorage serialiser; pause menu Save, main menu Continue.

## Deployment Notes

- Git push to `main` **always 503** via the session proxy — fall back to GitHub MCP `mcp__github__push_files` every time.
- After every MCP push: verify pushed files with sha256 (local vs `mcp__github__get_file_contents` fetched bytes); retry on mismatch.
- Must reset local git to `origin/main` after MCP push (`git fetch origin main && git reset --hard origin/main`).
- UI theme: military (gunmetal/olive/khaki/stencil-amber, square corners) — do NOT reintroduce neon glows.

## Map Presets

| Key | Description |
|---|---|
| `desert` | Flat open dunes, river crossing optional |
| `forest` | Tree clusters, choke points |
| `urban` | City blocks, tight corridors |
| `river` | Horizontal river, bridge crossings |
| `frontline` | S-shaped no-man's-land |
| `snowpass` | Snow biome, mountain pass |
| `highlands` | Elevated ridge terrain |
| `archipelago` | Island chains |

Sizes: s2 (60×40), s4 (80×54), s6 (100×66). Spawns scale with `numSlots`.

## Key Constants & Gotchas

- `TILE=40`, `BM=14` (building sprite border margin)
- `SIM_DT` — fixed timestep, `gameSpeed` (1×/2×/4×) multiplies accumulator
- Building sprite system: `bSpr(type,fk)` draws on a 2× HiDPI canvas cached in `SPR{}`
- `findEnemy(u)` searches spatial hash — includes both units AND buildings via `shInsert`
- Air units skip ground pathfinding; they use a `loiter` point + `updateAir()` loop
- FACMIX doctrine fields: `fArty` (arty rate), `fAlt`/`fAltR` (faction alt sig + rate), `bRocket` (rocket infantry rate), `sigFR`/`sigBR` (factory/barracks sig override rates), `cadence` (wave timer multiplier)
- Scan auto-retarget fires every 0.3–0.5 s but only for `ts==='idle'` or units on `'attack-move'` orders; plain `'move'` and `'attack'` orders are immune to scan distraction.
- BICO icon dict in render.js line ~913: `{command,power,supply,market,barracks,factory,tech,silo,airfield,samsite,repairbay,watchtower}`

## Completed Features (all shipped to main)

- [x] Save/load (localStorage, pause Save / menu Continue)
- [x] Map presets: river, frontline, snowpass, highlands, archipelago
- [x] Neutral capturables: repairbay + watchtower (mechanics + sprites + animated overlays)
- [x] Music variety: 3 bar-level pattern variations per intensity, cycle on repeat
- [x] Superweapon visual differentiation (napalm fire zones, SAM trails, nuke shockwave)
- [x] Particle colour support + superweapon particles
- [x] Map redesign: 2 new maps, tactical terrain, snow biome, corrected layout data
- [x] Lobby: map dropdown, s6 size, player caps, live spawn preview
- [x] Per-faction AI doctrine (FACMIX fAltR/sigFR/sigBR rates)
- [x] Signature unit ★ badge (ground sig units, faction-coloured pip)
- [x] Repairbay + watchtower building sprites + animated overlays + BICO icons
- [x] Fix: restored orderMove/orderAttack/orderGarrison (were missing → all orders threw ReferenceError); scan no longer distracts plain-move or attack orders

## Roadmap

- [ ] Campaign expansion (scripted missions beyond tutorial)
- [ ] Multiplayer support
- [ ] End-game stats graph (income / army value over time)
- [ ] Sound polish round 2 (unit voice blips per category, low-power alarm loop)
