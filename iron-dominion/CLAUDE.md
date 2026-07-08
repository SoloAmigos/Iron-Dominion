# Iron Dominion — Mobile RTS

A fully self-contained browser-based real-time strategy game targeting mobile and desktop.
Live via GitHub Pages (repo: `SoloAmigos/Iron-Dominion`, deploys from `main`).

## Architecture

Multi-file: `index.html` + `css/style.css` + `js/*.js` loaded as plain scripts (shared global scope, no modules/bundler).
PWA: `manifest.json` + `sw.js`. **Versioning: bump `GAME_VERSION` in `js/version.js` ONCE per change batch** (current: v60) — it is the single source of truth: `sw.js` builds its cache name from it via `importScripts('js/version.js')`, and the main menu shows it in the bottom `#verBadge` so a deployed push is verifiable at a glance in the live game. Do NOT hardcode a version anywhere else.

| File | Owns |
|---|---|
| `js/config.js` | WPN/UT/BT stat tables, factions, upgrades, BUILD_CATEGORIES, COMBAT list |
| `js/state.js` | global mutable state (money, units, builds, fog, gameSpeed, gameStats…) |
| `js/world.js` | map generation, A* pathfinding, fog of war (`updateFog`/`tileVisAt`) |
| `js/units.js` | spawn/damage/kill, per-type unit update loops, orders (`orderMove`/`orderAttack`/`orderGarrison`/`issueOrder`) |
| `js/buildings.js` | construction, production queues, silo charge, repair-bay aura |
| `js/projectiles.js` | projectile flight + impact |
| `js/ai.js` | AI: build order, per-faction doctrine (FACMIX with `fAltR`/`sigFR`/`sigBR`), waves with flank/econ-raid/retreat |
| `js/render.js` | canvas renderer, procedural sprites (`bSpr`/`uSpr`), animated overlays, minimap, `iconURL()` — **editable master; shipped split into `render.part1–8.js` (see Deployment Notes)** |
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

- **Normal `git push` to `main` works** — deploy with `git commit` + `git push origin main`. GitHub Pages serves from `main`. (Historical note: earlier sessions believed push "always 503s" and used `mcp__github__push_files` as the only write path. That was outdated — re-tested and confirmed working. The 503s were transient, tied to the window when the repo was being renamed. Don't reintroduce the MCP-only workaround.)
- Canonical remote: `SoloAmigos/ai-projects` (lowercase). The repo was renamed from a capitalized form; an outdated remote URL triggers a "this repository moved" redirect. Keep `origin` pointed at the lowercase name.
- Sanity-check after a deploy if desired: `git fetch origin main && git rev-parse origin/main:<path>` vs `git hash-object <file>` — but a clean `git push` exit is authoritative.
- **render.js is split into 8 load-order parts (`render.part1.js`…`render.part8.js`).** They are plain `<script>` tags sharing global scope, so functions resolve across files at call time. (The split originated as a workaround for the MCP push path's token limit; it's retained because it keeps individual files small and edits cheap.)
  - **`render.js` is the editable master.** To change the renderer: edit `render.js`, then regenerate the parts at the boundaries below. Prepend `'use strict';` to parts 2–8 and `node --check` each. Reassemble: `cat part1 + (parts 2–8 with first 'use strict' line stripped)` and diff against `render.js`. Note: part4 starts at line 1033 with `/* --- vehicle sprites --- */` comment.
  - **Current render.js split boundaries (lines in render.js → part file):** `1→part1`, `233→part2`, `832→part3`, `1058→part4`, `1310→part5`, `1555→part6`, `1809→part7`, `2009→part8`.
  - When changing the renderer, commit all changed parts together with `index.html` (loads the 8 parts in order) + `sw.js` (cache bump) in one push.
- Commit authorship: set `git config user.email noreply@anthropic.com` and `git config user.name Claude` (already configured locally) so the stop hook doesn't flag commits as Unverified.
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
- BICO icon dict in render.js (drawBuilding, render.part6.js): `{command,power,supply,market,barracks,factory,tech,silo,airfield,samsite,repairbay,watchtower}`

## Completed Features (all shipped to main)

- [x] ART & MUSIC OVERHAUL (v60): music — chord progressions + per-faction moods (_MOODS: key/scale/bpm per faction, Scorpion phrygian, Northwind slow F-minor), chord-following bass/stab/pad, 16th arpeggios (intensity>.28), 2-bar lead melody phrases (_PHR) with detuned vibrato voice; art — universal terrain finishing pass in buildGround (macro tonal patches, directional sun sweep, pebble/crack crunch, vignette), drawApron() worn-earth aprons + access ruts under every built structure, vehicle motion dust. Screenshot harness: test/shotstub.js + shot_build.sh use @napi-rs/canvas for real PNG renders — ALWAYS view before/after shots when changing art.

- [x] Deploy pipeline repaired: removed the custom Pages workflow (built for source=Actions, but Pages deploys from branch — it never succeeded and its concurrency group raced/killed the automatic deploy; v58 died this way). Branch deploy is now the only pipeline; .nojekyll added at repo root. SW fetches with cache:'no-cache' (ETag revalidation beats Pages' 10-min HTTP cache). Menu badge is now a LIVE update checker: fetches deployed version.js, shows "⬆️ vXX AVAILABLE — TAP TO UPDATE" (clears caches + reloads). ALWAYS verify deploy success after push: GET api.github.com/repos/SoloAmigos/ai-projects/actions/runs — a green push is NOT a live deploy.

- [x] BUG-HUNT PASS (98 headless tests across 4 suites in the dev workflow): fixed — arcing weapons (arty/mortar) fired inside their minRng on ordered attacks (now back off + hold fire; idle path disengages huggers); dozers got permanently stuck "repairing" GLA holes (fix aborts on isHole/!built); enemy-owned garrison buildings were enterable via direct order (team gate added; neutrals still capturable); trucks: Hold (H) had no resume path and raw-spawned trucks never harvested — move orders now (re)enable auto-harvest and the truck card shows a ▶ Harvest/⏸ Hold toggle (mobile-accessible)
- [x] Tunnel UX fixed: entering deselects the unit (taps then reach the tunnel card), card lists EVERY networked occupant with icon/hp (tap a row = surface HERE), EXIT ALL button, hidden units' own card offers "Surface here"; hidden units excluded from enter-orders
- [x] AI pacing fixed: ⚠️ `SLOT_DIFFS` in config.js is the LIVE per-slot AI table (the old `DIFF` is legacy/labels only — do NOT tune it). Was first:35s/wave:25s/trickle:100 on medium (attacks at ~1-2 min on all difficulties). Now easy 250s first/6-unit probes/no air before 300s, medium 150s/12/200s, hard 95s/horde/120s; sane trickle (8/25/60) and start cash; ai.js reads waveMax + airAt from it (air production AND patrols gated)
- [x] Version badge: `js/version.js` `GAME_VERSION` single source (SW cache + always-visible main-menu badge, hidden in-game via `hideVerBadge()`)
- [x] AIR OVERHAUL: updateAir rewritten as a full state machine — obeys move/attack orders (was frozen ignoring `loiter`), returns to pad and LANDS when idle, parks (slow heal) until ordered, rearms landed (10s) and resumes its order; stable strafe orbit with radial correction; legality-aware `airScan` sees units AND buildings
- [x] AA layer: central air-targeting legality (ground guns can never shoot airborne craft, manual orders included, with UI refusal toasts); raptor→`aam` air-superiority missiles; new `flak` AA vehicle (faction names Avenger/Gattling Crawler/Quad Cannon/Hailstorm); SAM buffed (80dmg/300rng); flak tracer + air-burst `flakpuff` fx
- [x] Bomber balance: bigbomb 220/185/1.4→200/120/1.15, rng 250 (inside SAM envelope) — one sortie (690) can no longer one-pass a SAM site (900); AI builds flak vs enemy air, 2nd samsite in bo, hard AI fields up to 2 bombers
- [x] GLA holes WIRED (were dead code — kill() never created them): finished Scorpion buildings collapse into targetable holes (30% hp pool) instead of dying, rebuild THEMSELVES after 15s with no dozer (attackable during rebuild), second kill is permanent; crater render + rebuild arc + HP bar + cards
- [x] Tunnel Network (new building, all factions, faction-named): ground units enter any tunnel (tap-to-enter), exit at ANY tunnel (`tunnelExitAt`), 10-unit network cap, tenants heal underground, tenants transfer when a tunnel dies and die with the last one; sandbagged shaft sprite + BICO
- [x] Fixes: garrison approach now works for 2×2 buildings (rect-distance acceptance); landed aircraft render on the ground (`zHeight||30` draw bug); air wrecks spin/burn/crash with scorch
- [x] render.js master/parts drift REPAIRED: master had a stray `PLACEHOLDER_DO_NOT_PUSH` line and was missing Batch 5 art that existed only in the shipped parts — parts were reassembled as the new canonical master, then re-split (new boundaries below)

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
- [x] Art overhaul: faction-distinct buildings (command/power/barracks/factory/supply/tech painters per faction), sub-faction command-center add-ons, progressive battle-damage wear (cracks→scorch→blown panels→embers), real building death explosions + smouldering rubble, distinct per-faction unit sprites
- [x] render.js split into 8 load-order parts (render.part1–8.js) to fit the MCP push path; render.js kept as editable master (see Deployment Notes)
- [x] Batch 5 building art: faction-distinct sprites for market, silo, turret, airfield, radar, samsite (24 new painter functions)
- [x] Batch 6 unit art: faction-distinct tank/arty hulls (Crusader/Warlord/Marauder/Glacier; Thunderer/Dragonfire/Junk Lobber/Avalanche) + infantry faction body kits (Vanguard olive/Crimson dark armor/Scorpion keffiyeh-tan/Northwind blue parka); `drawSoldier` now takes `fk` param; split points updated to `1,232,831,1033,1264,1509,1743,1940`; cache v46
- [x] Fix: restored `separation()`, `findEnemyInRange()`, `astar()` shim, and `updateDozer` completion — stale units.js had called 4 dead functions causing every simStep() to throw and freeze the canvas black; cache v47
- [x] Fix: `moveUnit` path format — `findPath()` returns `[{x,y},...]` pixel objects; old code used `wp[0]*TILE+TILE/2` (tile-array format) → NaN positions → units frozen silently; changed to `wp.x`/`wp.y`; cache v48

## Roadmap

- [ ] Campaign expansion (scripted missions beyond tutorial)
- [ ] Multiplayer support
- [ ] End-game stats graph (income / army value over time)
- [ ] Sound polish round 2 (unit voice blips per category, low-power alarm loop)
