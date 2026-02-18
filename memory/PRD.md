# Fractal Terminal PRD — BLOCK 73.1 Complete

## What's Been Implemented

### BLOCK 73.1 — Primary Match Selection Engine ✅ (Feb 18, 2026)

**Цель:** Заменить наивный `matches[0]` на weighted multi-criteria scoring engine.

**Реализовано:**
- Создан сервис `/app/backend/src/modules/fractal/match/primary-selector.service.ts`
- Типы добавлены в `focus.types.ts`: `PrimaryMatch`, `PrimarySelection`
- Интеграция в `focus-pack.builder.ts`
- Frontend обновлён: `FractalHybridChart.jsx` использует `primarySelection.primaryMatch`

**Scoring Components:**
1. **Similarity** (0..1) — DTW/correlation score
2. **Volatility Alignment** (0..1) — волатильность текущего vs historical window
3. **Stability** (0..1) — консистентность паттерна
4. **Outcome Quality** (0..1) — risk-adjusted returns (sigmoid + DD penalty)
5. **Recency Bonus** (0..1) — более новые matches предпочтительнее

**Веса по горизонту:**
```
TIMING (7d, 14d):   sim=35%, vol=20%, stab=15%, out=15%, rec=15%
TACTICAL (30d, 90d): sim=30%, vol=20%, stab=20%, out=20%, rec=10%
STRUCTURE (180d+):   sim=25%, vol=15%, stab=25%, out=25%, rec=10%
```

**API Response:**
```json
{
  "focusPack": {
    "primarySelection": {
      "primaryMatch": { ... },
      "candidateCount": 10,
      "selectionMethod": "WEIGHTED_SCORE"
    }
  }
}
```

### STEP A — Canvas Refactor (3 Modes) ✅

**Три режима визуализации:**
1. **Price** (Synthetic Model) — forecast + probability corridor
2. **Replay** (Historical) — fractal overlay + aftermath
3. **Hybrid** (Dual View) — synthetic vs replay comparison

### Previous Implementations ✅
- BLOCK 70.2: Real Horizon Binding (7D-365D)
- BLOCK 72: 7D Insight Block (Arrow + Probability)
- 14D+ Spline Smoothing (Catmull-Rom)

---

## Prioritized Backlog

### P1 (Next)
- [ ] **365D Axis Normalization** — Y-axis switch to percentage scale for 180D/365D horizons
- [ ] **BLOCK 73.2 — Divergence Engine** — Calculate and display `Divergence Score` between synthetic and primary replay

### P2
- [ ] BLOCK 74 — Multi-Horizon Intelligence Stack
- [ ] BLOCK 75 — Memory & Self-Validation Layer

### P3
- [ ] BLOCK 76+ — Institutional-grade architectural refactoring

---

## Technical Notes

### Files Changed (BLOCK 73.1)
- `/app/backend/src/modules/fractal/match/primary-selector.service.ts` — NEW
- `/app/backend/src/modules/fractal/match/index.ts` — NEW
- `/app/backend/src/modules/fractal/focus/focus.types.ts` — Updated
- `/app/backend/src/modules/fractal/focus/focus-pack.builder.ts` — Updated
- `/app/frontend/src/components/fractal/chart/FractalHybridChart.jsx` — Updated

### API Endpoint
`GET /api/fractal/v2.1/focus-pack?symbol=BTC&focus=30d`

### Testing
- Backend API: CURL verified
- Frontend: Screenshot verified (Hybrid mode displays correctly)
