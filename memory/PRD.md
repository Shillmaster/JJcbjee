# Fractal Terminal PRD — STEP A Complete

## What's Been Implemented

### STEP A — Canvas Refactor (3 Modes) ✅

**Новая архитектура с 3 режимами:**

1. **Price** (Synthetic Model)
   - Свечи + SMA + Phase Shading
   - Synthetic forecast + Fan (P10-P90)
   - 7D: Arrow mode / 14D+: Trajectory mode

2. **Replay** (Historical)
   - Fractal overlay
   - Historical match + aftermath
   - No synthetic projection

3. **Hybrid** (Dual View) - NEW
   - Свечи + SMA
   - Synthetic line (green solid)
   - Replay line (purple dashed)
   - Divergence calculation

**Файлы созданы:**
- `/app/frontend/src/components/fractal/chart/FractalHybridChart.jsx`
- `/app/frontend/src/components/fractal/chart/layers/drawHybridForecast.js`

**Файлы обновлены:**
- `/app/frontend/src/pages/FractalPage.js` (3 mode switcher)
- `/app/frontend/src/components/fractal/chart/FractalChartCanvas.jsx` (mode prop)

### Hybrid Summary Panel:
- SYNTHETIC: +3.9% (Model Projection)
- REPLAY: -5.3% (Historical 71% sim)
- DIVERGENCE: 9.2% MODERATE

## Visual Hierarchy
- **Price Mode** = Pure synthetic model
- **Replay Mode** = Pure historical analogue
- **Hybrid Mode** = Model vs History comparison

## Prioritized Backlog

### P0 (Next)
- [ ] BLOCK 73.1 — Primary Match Selection Engine (backend)
- [ ] 365D % axis normalization

### P1  
- [ ] BLOCK 73.2 — Divergence confidence modifier
- [ ] Interactive Phase Shading

## Technical Notes
- 3 режима не ломают друг друга
- Каждый рендер-пайплайн изолирован
- Hybrid использует matches[0] пока, после 73.1 будет primaryMatch
