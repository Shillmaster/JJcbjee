# Fractal Terminal PRD — BLOCK 72.2 Complete

## Original Problem Statement
Fractal Terminal - институциональный инструмент анализа. BLOCK 72.2: компактная стрелка 7D вместо floating panels.

## What's Been Implemented

### BLOCK 72.2 — 7D Compact Institutional Arrow (COMPLETE)

**Было:** Большая плавающая стрелка + floating panel
**Стало:** Маленькая диагональная стрелка интегрированная в график

**На графике 7D теперь:**
- ✅ Маленькая диагональная стрелка от NOW (угол ~30°)
- ✅ +2.4% и 7D label рядом со стрелкой
- ✅ Цвет: зелёный (BULLISH) / красный (BEARISH) / серый (NEUTRAL)
- ✅ Интегрирована в price context

**Текстовая строка под графиком:**
```
7D → BULLISH (+2.4%) | Conf: 42% | Sample: 15 | Hit: 60% | Timing: WAIT
```

**Файлы обновлены:**
- `/app/frontend/src/components/fractal/chart/layers/draw7dArrow.js`
- `/app/frontend/src/components/fractal/chart/ForecastSummary7d.jsx`

### 14D+ остаётся trajectory mode
- Полная траектория с fan
- Маркеры на ключевых днях (7d, 14d, 30d...)

## Prioritized Backlog

### P0 (Next)
- [ ] STEP 72.3 — 14D spline continuity (убрать gap NOW→14D)
- [ ] STEP 72.4 — 365D % axis normalization

### P1  
- [ ] BLOCK 73 — Interactive Phase Shading
- [ ] Market State Header

## Visual Hierarchy
- **7D** = timing bias (стрелка направления)
- **14D-90D** = tactical trajectory (волны с fan)
- **180D-365D** = structure (% normalized, будет)
