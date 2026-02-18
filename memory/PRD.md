# Fractal Terminal PRD — BLOCK 72 Complete

## Original Problem Statement
Клонировать репозиторий https://github.com/Shillmaster/ttrtrt66, поднять фронт, бэкенд, админку. Работать только с областью Fractal. Завершить STEP 2 + BLOCK 72 — 7D Institutional Redesign.

## Architecture
- **Backend**: TypeScript/Fastify (запускается через Python proxy на port 8001)
- **Frontend**: React/CRA (port 3000)
- **Database**: MongoDB (local)
- **Key Module**: `/app/backend/src/modules/fractal/`

## User Personas
- Institutional Traders (target: hedge funds, prop trading)
- Quantitative Analysts
- System Administrators (via Admin Panel)

## Core Requirements (Static)
1. Multi-horizon fractal analysis (7D/14D/30D/90D/180D/365D)
2. Real-time horizon switching with full redraw
3. Distribution-based forecasting
4. Pattern matching engine
5. Admin dashboard for monitoring

## What's Been Implemented
### Date: 2026-02-18

**STEP 2 — Real Horizon Binding (COMPLETE)**
- HorizonSelector UI with tier color coding
- useFocusPack Hook with AbortController, caching
- FractalMainChart using focusPack
- Dynamic markers based on current focus
- FocusInfoPanel with live metrics

**BLOCK 72 — 7D Institutional Redesign (COMPLETE)**

1. ✅ **7D Probability Capsule** - вместо "палки" рисуем probability distribution:
   - P10-P90 (outer band - full range)
   - P25-P75 (inner band - working zone)  
   - P50 (median marker)
   - BULLISH/BEARISH/NEUTRAL badge
   - P10 Floor line

2. ✅ **7D OUTLOOK Panel** - институциональная панель под графиком:
   - Expected (P50): +2.43%
   - Target Price: $69,106
   - Range (P10→P90): -15.1% → 16.6%
   - Working Zone (P25→P75): -2.5% → 3.8%
   - Confidence: 42%
   - Sample Size: 15 matches
   - Tail Risk (P10): -15.1%
   - Hit Rate: 60%
   - TIMING: WAIT/ENTER/EXIT

3. ✅ **Conditional Rendering**:
   - 7D → CAPSULE_7D mode (probability capsule)
   - 14D/30D/90D → TRAJECTORY mode (aftermath fan)
   - 180D/365D → TRAJECTORY mode (normalized scale planned)

**Files Created/Modified:**
- `/app/frontend/src/components/fractal/chart/layers/drawForecastCapsule7d.js` (NEW)
- `/app/frontend/src/components/fractal/chart/ForecastSummary7d.jsx` (NEW)
- `/app/frontend/src/components/fractal/chart/FractalMainChart.jsx` (UPDATED)
- `/app/frontend/src/components/fractal/chart/FractalChartCanvas.jsx` (UPDATED)

## Prioritized Backlog

### P0 (Next)
- [ ] STEP 72.4 — 180D/365D Axis Normalization (% вместо raw price)
- [ ] BLOCK 73 — Interactive Phase Shading (hover/click на фазы)

### P1
- [ ] Market State Header (BULLISH/BEARISH при переключении горизонта)
- [ ] Fractal Explorer (matches library with outcomes)

### P2
- [ ] 14D similar capsule treatment
- [ ] Export functionality
- [ ] Real-time WebSocket updates

## Technical Notes
- Backend runs as proxy: Python FastAPI (8001) → TypeScript Fastify (8002)
- Frontend .env: REACT_APP_BACKEND_URL must match preview domain
- Focus-pack API returns distributionSeries with p10, p25, p50, p75, p90
