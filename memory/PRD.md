# Fractal Research Terminal — PRD

## Original Problem Statement
Поднять фронт, бэк и базу данных MongoDB с админкой для разработки. Бэк касается только логики. Фрактал - это изолированный модуль, полностью настроен.
Репозиторий: https://github.com/Shillmaster/Finade3

## Core Architecture
```
/app
├── backend (FastAPI proxy → Fastify TypeScript)
│   ├── server.py              # Python proxy (port 8001)
│   └── src/
│       ├── app.fractal.ts     # Isolated Fractal entrypoint (port 8002)
│       └── modules/fractal/   # Fractal business logic
└── frontend (React + Craco)
    └── src/
        ├── pages/FractalPage.js
        └── pages/FractalAdminPage.js
```

## What's Been Implemented

### 2026-02-18 — Initial Setup Complete
- ✅ Cloned GitHub repository Finade3
- ✅ Configured MongoDB connection (MONGO_URL → MONGODB_URI)
- ✅ Installed backend dependencies (npm)
- ✅ Installed frontend dependencies (yarn)
- ✅ TypeScript backend running (Fastify on port 8002)
- ✅ Bootstrap data loaded: 5694 candles (2010-2026)
- ✅ Frontend compiled and running

## Working Features

### Main Dashboard (/)
- Fractal Research Terminal with BTC chart
- Price Chart / Fractal Overlay modes
- VOLATILITY card (Crisis mode: RV30 80.6%, RV90 55.9%)
- SIZING BREAKDOWN table

### Admin Panel (/admin/fractal)
- **Overview Tab:**
  - Governance: NORMAL, Contract: FROZEN
  - System Health: 96% HEALTHY
  - Catastrophic Guard: 4% OK
  - Reliability: 75% WARN
  - Tail Risk: P95 Max Drawdown 25.0%
  - Performance Windows (30/60/90 Day)

- **Volatility Tab:**
  - Volatility Attribution: OK
  - Sample Period: 2025-11-20 → 2026-02-17
  - Regime Timeline (90 days): LOW/NORMAL/HIGH/EXPANSION/CRISIS
  - Protection Report
  - Performance by Regime table

## API Endpoints
- `GET /api/health` — proxy health
- `GET /api/fractal/health` — fractal module health + bootstrap status
- `GET /api/fractal/v2.1/terminal` — main decision data
- `GET /api/fractal/v2.1/admin/volatility/attribution` — volatility attribution

## Tech Stack
- **Backend:** FastAPI (Python proxy) → Fastify (TypeScript)
- **Frontend:** React 19 + Craco + Tailwind CSS
- **Database:** MongoDB
- **Charts:** Recharts, Lightweight Charts

## Prioritized Backlog

### P0 (High Priority)
- [ ] Regime Alert System (Telegram)
- [ ] API Contract Tightening v2.1

### P1 (Medium Priority)
- [ ] Policy Tuning Suggestions
- [ ] Admin Policy Editor (BLOCK 66)

### P2 (Future)
- [ ] PHASE 4 - Cycle Engine (Bitcoin halving context)

## Access
- **URL:** https://fullstack-sandbox.preview.emergentagent.com
- **Admin:** /admin/fractal
- **Auth:** Not required (open access)

## Last Updated
2026-02-18 — Initial setup and deployment complete
