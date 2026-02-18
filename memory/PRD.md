# Fractal Terminal PRD — BLOCK 73.4 Complete

## What's Been Implemented

### BLOCK 73.4 — Interactive Match Replay ✅ (Feb 18, 2026)

**Backend:**
- New endpoint `/api/fractal/v2.1/replay-pack` returns replay data for specific match
- `replay-pack.builder.ts` generates:
  - replayPath from match aftermath (normalized to NOW)
  - matchMeta (similarity, phase, score)
  - outcomes at standard horizons (7d, 14d, etc.)
  - divergence metrics vs synthetic

**Frontend:**
- `MatchPicker` component shows top 5 matches as clickable chips
- Click on chip fetches `/api/fractal/v2.1/replay-pack`
- Chart updates replay line (purple) to selected match
- Divergence metrics recalculate for selected match
- "AUTO" badge shows which match was auto-selected

### BLOCK 73.3 — Unified Path Builder ✅ (Feb 18, 2026)

**Backend:**
- `unified-path.builder.ts` creates single source of truth
- syntheticPath: t=0..N (t=0 = NOW)
- replayPath: same length, anchored to NOW
- markers computed FROM syntheticPath (no discrepancies)

**Frontend:**
- `drawHybridForecast.js` updated to use unifiedPath
- Fallback to legacy format for backward compat
- Both synthetic and replay start from NOW (no breaks)

---

### BLOCK 73.2 — Divergence Engine ✅
- RMSE, MAPE, Correlation, TerminalDelta
- Grades A/B/C/D/F with warnings

### BLOCK 73.1 — Primary Match Selection ✅
- Weighted scoring for match selection

---

## API Endpoints

### GET /api/fractal/v2.1/focus-pack
Returns complete FocusPack with unifiedPath

### GET /api/fractal/v2.1/replay-pack
**New (BLOCK 73.4)**
- Query: `symbol`, `focus`, `matchId`
- Returns: replayPack with replayPath, outcomes, divergence

---

## Prioritized Backlog

### P1 (Next)
- [ ] BLOCK 73.5 — Phase Shading Interactivity
- [ ] Auto-penalty in sizing based on divergence

### P2
- [ ] Tooltip component scores
- [ ] BLOCK 74 — Multi-Horizon Intelligence Stack

---

## Technical Notes

### Files Created/Modified (BLOCK 73.3/73.4)

**Backend:**
- `/app/backend/src/modules/fractal/path/unified-path.builder.ts` — NEW
- `/app/backend/src/modules/fractal/path/index.ts` — NEW
- `/app/backend/src/modules/fractal/replay/replay-pack.builder.ts` — NEW
- `/app/backend/src/modules/fractal/replay/index.ts` — NEW
- `/app/backend/src/modules/fractal/focus/focus-pack.builder.ts` — Modified
- `/app/backend/src/modules/fractal/focus/focus.routes.ts` — Modified
- `/app/backend/src/modules/fractal/focus/focus.types.ts` — Modified

**Frontend:**
- `/app/frontend/src/components/fractal/chart/layers/drawHybridForecast.js` — Modified
- `/app/frontend/src/components/fractal/chart/FractalHybridChart.jsx` — Modified

### Testing Results
- Backend: 100% pass rate
- Frontend: UI working, external ingress caching issue

---

## User Personas
- Institutional Trader: Uses multi-horizon analysis for position sizing
- Quant Researcher: Validates synthetic vs replay trajectories

## Core Requirements (Static)
- Real-time BTC fractal analysis
- Multi-horizon support (7D-365D)
- Hybrid mode: Synthetic + Replay trajectories
- Divergence metrics for model validation
- Interactive match selection (NEW)
