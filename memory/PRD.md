# Fractal Research Terminal — PRD

## Original Problem Statement
Поднять фронт, бэк и базу данных MongoDB с админкой для разработки. Фрактал - это изолированный модуль, полностью настроен.
Репозиторий: https://github.com/Shillmaster/ccccw44

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
        ├── pages/FractalAdminPage.js
        └── components/fractal/admin/
```

## What's Been Implemented

### 2026-02-18 — Full Stack Deployment
- ✅ Cloned GitHub repository ccccw44
- ✅ MongoDB running: `fractal_dev` database with 16 collections
- ✅ 5692 BTC candles loaded (2010-2026)
- ✅ TypeScript backend running (Fastify on port 8002)
- ✅ Frontend compiled and running (React + Craco)
- ✅ Admin panel fully functional

## Working Features

### Main Dashboard (/)
- Fractal Research Terminal with BTC chart
- Price Chart / Fractal Overlay modes
- VOLATILITY card (Crisis mode)
- Forecast indicators

### Admin Panel (/admin/fractal)
- **Overview Tab:** Governance, System Health, Catastrophic Guard
- **Shadow Divergence Tab:** Active vs Shadow comparison
- **Volatility Tab:** Regime Timeline, Performance by Regime
- **Alerts Tab:** Quota status, filters, history

## Database Collections
- fractal_canonical_ohlcv (5692 documents)
- fractal_alerts_log
- fractal_research_models
- fractal_state, fractal_windows
- admin_users, admin_audit_log
- + 10 more collections

## Tech Stack
- **Backend:** FastAPI (Python proxy) → Fastify (TypeScript)
- **Frontend:** React 19 + Craco + Tailwind CSS
- **Database:** MongoDB (fractal_dev)
- **Charts:** Recharts, Lightweight Charts

## Access URLs
- **Main:** https://tradeanalyzer-8.preview.emergentagent.com
- **Admin:** /admin/fractal

## Prioritized Backlog

### P0 (Ready for development)
- Fractal logic enhancements
- Telegram bot configuration

### P1
- API Contract Tightening v2.1
- Policy Tuning Suggestions

## Last Updated
2026-02-18 — Full deployment complete
