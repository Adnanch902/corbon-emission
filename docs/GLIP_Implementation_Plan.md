# GLIP Full Implementation Plan (Aligned to Approved FYP Proposal)

## Summary
Build GLIP as a 3-service system: `frontend (React)` + `api (Node/Express/MongoDB)` + `ml-service (FastAPI/Python)`.  
Use public raw datasets to create a unified feature store, train AI models for `CO2, water, plastic, e-waste, forest loss`, serve predictions via API, and render dashboards + 3D globe in line with the proposal scope.

## Proposal-Aligned Decisions (Source of Truth: FYP Proposal)
1. **System Architecture**
- `frontend`: React + Vite + Tailwind + Three.js (`react-three-fiber`) + i18n (English/Urdu).
- `api`: Node.js + Express + Mongoose + JWT auth + role-based access (`user/admin/org`).
- `ml-service`: FastAPI + pandas + scikit-learn + PyTorch/TensorFlow (LSTM/RNN for trend prediction as defined in proposal).
- `queue/scheduler`: BullMQ + Redis for retraining jobs and periodic dataset refresh.
- `storage`: MongoDB (users, inputs, predictions, recommendations, audit logs), object store for model artifacts (`.pkl/.pt`).

2. **Dataset Layer (Public Raw Sources)**
- **CO2 / climate factors**: OWID CO2 dataset and source metadata (Global Carbon Project lineage).  
  https://ourworldindata.org/co2  
  https://ourworldindata.org/co2-dataset-sources
- **Food + environmental intensities** (food emissions/water/land proxies): OWID food-impact charts + FAOSTAT food balance series.  
  https://ourworldindata.org/environmental-impacts-of-food  
  https://www.fao.org/statistics/highlights-archive/highlights-detail/food-balance-sheets-2010-2023/
- **Water resources/use**: FAO AQUASTAT main database.  
  https://www.fao.org/aquastat/en/databases/maindatabase/
- **Plastic waste**: OWID plastic waste generation / pollution datasets (from cited original studies).  
  https://ourworldindata.org/grapher/plastic-waste-generation  
  https://ourworldindata.org/grapher/plastic-pollution
- **E-waste**: UN SDG e-waste indicator (via OWID), plus GEM 2024 reference context.  
  https://ourworldindata.org/grapher/electronic-waste-recycling-rate  
  https://ewastemonitor.info/the-global-e-waste-monitor-2024
- **Forest loss / land pressure**: Global Forest Watch tree cover loss + Footprint Network NFA data package.  
  https://www.globalforestwatch.org/blog/data-and-tools/2025-tree-cover-loss-data-explained/  
  https://www.footprintnetwork.org/licenses/public-data-package-free/
- **Electricity normalization factors**: World Bank electricity consumption indicator.  
  https://data.worldbank.org/indicator/EG.USE.ELEC.KH.PC?locations=1W

3. **Data Engineering Specification**
- Create ETL pipeline (`/ml/pipelines`):
  - ingest raw CSV/API dumps
  - harmonize country/year keys (ISO3 + year)
  - unit normalization (kg CO2e, m3 water, kg plastic, kg e-waste, ha forest impact proxy)
  - missing-value strategy: time interpolation then regional median backfill
  - provenance table per feature (`source_url`, `retrieved_at`, `license_note`)
- Build derived user-feature schema from lifestyle inputs:
  - travel: km/week by mode
  - food: servings/week by food group
  - shopping: items/month by category + packaging profile
  - gadgets: devices owned, replacement cycle, disposal method
  - electricity: kWh/month + grid region
- Save processed tables as versioned parquet + Mongo feature snapshots.

4. **Modeling Plan**
- **Core AI plan (proposal-aligned)**: LSTM/RNN-based prediction module for medium/long-horizon environmental trends.
- **Supporting tabular estimator**: multi-output regression can be used for stable current-impact estimation when sequence history is sparse.
- Outputs:
  - absolute impacts per category + total
  - normalized sustainability score (0–100, configurable weights)
  - confidence interval (bootstrap/quantile bands)
- Recommendation engine:
  - rule+model hybrid
  - calculates marginal improvement per actionable swap (e.g., car→bus, beef→lentils)
  - ranks by `impact_reduction / user_effort`.

5. **Public APIs / Interfaces**
- `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`
- `POST /lifestyle/entry`
- `POST /predict/current`
- `POST /predict/forecast?years=5|10`
- `POST /simulate` (what-if scenarios)
- `GET /dashboard/summary`
- `GET /recommendations`
- `GET /history`
- `GET /admin/dataset-status`, `POST /admin/retrain`
- ML internal:
  - `POST /ml/predict`
  - `POST /ml/forecast`
  - `POST /ml/recommend`
  - `GET /ml/health`

6. **Frontend Experience**
- Auth + onboarding wizard for lifestyle profile.
- Dashboard:
  - KPI cards for 5 impacts
  - trend charts (current vs projected)
  - scenario comparison panel
  - recommendations list with estimated savings
- 3D globe overlays:
  - CO2 cloud intensity
  - water stress visual markers
  - plastic/ocean and forest-loss layers
  - e-waste hotspots
- i18n:
  - English default, Urdu toggle, JSON locale bundles (minimum two-language support as in proposal).

7. **Security / Non-Functional**
- JWT access + refresh tokens, bcrypt hashing.
- Input validation (`zod`/`joi`), rate limiting, helmet, CORS allowlist.
- PII minimization + encrypted-at-rest DB settings.
- Target performance:
  - prediction response within proposal response window (`3–5s` under normal load)
  - dashboard load `<= 5s` normal load
- Observability:
  - structured logs, request IDs, error tracking, model version tags.

8. **Implementation Milestones**
- **M1 (Week 1-2):** Monorepo scaffold, auth, base DB schemas, API skeleton.
- **M2 (Week 3-4):** ETL pipelines + dataset registry + processed feature store.
- **M3 (Week 5-6):** V1 multi-output model training + inference endpoints.
- **M4 (Week 7):** recommendation engine + simulation API.
- **M5 (Week 8-9):** React dashboard + charts + Urdu/English.
- **M6 (Week 10):** 3D globe module integration.
- **M7 (Week 11):** testing, optimization, documentation, deployment.

## Test Plan
- **Unit tests**
  - ETL transforms, unit conversions, feature engineering, recommendation ranking logic.
- **Model tests**
  - per-target MAE/RMSE, drift checks, confidence-band sanity.
- **API tests**
  - auth, protected routes, prediction contract, validation errors.
- **Integration tests**
  - user input → prediction → dashboard render → recommendation.
- **UI tests**
  - responsive layouts, locale switching, 3D scene fallback for low-GPU/browser limits.
- **Acceptance scenarios**
  - new user full flow
  - what-if simulation changes outputs correctly
  - 5-year forecast shown with confidence range
  - admin retrain updates active model version.

## Assumptions and Defaults
- Use only publicly accessible datasets/APIs and cite source licenses in-app.
- First release uses global/national factors; city-level precision is out of scope for V1.
- Forest-loss output is modeled as an impact proxy from consumption patterns plus macro forest datasets.
- This implementation plan is subordinate to the approved proposal; if any conflict appears, proposal wording and scope take precedence.

## Decision-Complete Full Build Plan (Detailed)

### 1) Dataset Selection (Final)
Use only public datasets, fixed as V1 sources:

- CO2 and energy factors:
  - Our World in Data CO2 dataset
  - World Bank electricity consumption (`EG.USE.ELEC.KH.PC`)
- Food and consumption patterns:
  - FAOSTAT Food Balance Sheets
  - OWID food environmental impact tables
- Water footprint:
  - FAO AQUASTAT
- Plastic waste:
  - OWID plastic waste datasets
- E-waste:
  - Global E-waste Monitor (UNU/ITU/ISWA)
  - OWID e-waste indicator series
- Forest loss / land impact:
  - Global Forest Watch tree cover loss
  - Global Footprint Network (National Footprint Accounts)

Decision:
- Country-year level modeling for V1.
- User-level estimates generated by mapping lifestyle inputs to country-year factors.

### 2) Preprocessing Pipeline (Final)
Pipeline stages (fixed):

1. Ingest raw CSV/API dumps into `/data/raw`.
2. Standardize schema:
   - keys: `country_iso3`, `year`
   - numeric types cast and cleaned
3. Unit harmonization:
   - CO2 in `kg CO2e`
   - water in `m3`
   - plastic/e-waste in `kg`
   - forest in `ha` (or normalized forest-loss index)
4. Missing data handling:
   - time interpolation per country
   - regional median fallback
5. Feature engineering:
   - lifestyle feature vectors: travel, food, shopping, gadgets, electricity
   - per-category impact coefficients
6. Dataset assembly:
   - train table `/data/processed/train.parquet`
   - validation/test tables with time-aware split
7. Data versioning:
   - maintain `dataset_version.json` + source provenance log

### 3) Model Architecture (Final)
Proposal-aligned model architecture:

- Model A (proposal core prediction and trend estimation):
  - LSTM/RNN sequence model for 5-year and 10-year trajectory estimation from user history and contextual factors
  - Outputs: `co2`, `water`, `plastic`, `ewaste`, `forest_loss`
- Model B (supporting current-impact estimator):
  - Multi-output regression for robust current-state estimates when longitudinal history is limited

Recommendation engine:
- Hybrid:
  - rule base for actionable swaps
  - marginal-impact estimator from Model A sensitivities

Unified sustainability score:
- Weighted normalized composite (0–100), weights configurable in settings.

### 4) Training Strategy (Final)
Training decisions:

- Split strategy:
  - Train: earliest years
  - Validation: recent years
  - Test: latest holdout years (time-aware, no random leakage)
- Hyperparameter tuning:
  - Optuna or grid search on validation set
- Retraining frequency:
  - monthly scheduled retrain
  - manual retrain endpoint for admin
- Model registry:
  - save artifacts with version + metrics + training date
- Drift monitoring:
  - PSI or simple distribution shift checks on incoming user data

### 5) Evaluation Metrics (Final)
Per-output metrics:

- MAE
- RMSE
- MAPE (where denominator is stable)
- R²

Forecast metrics (LSTM):

- MAE by horizon (1y, 3y, 5y, 10y)
- sMAPE

System-level acceptance thresholds (V1):

- Core model quality tracked with MAE/RMSE/R² across outputs (proposal-compatible metric reporting)
- API latency:
  - single prediction <= 3s avg
  - dashboard summary <= 5s
- Recommendation relevance:
  - at least 3 high-impact actions returned per user profile

### 6) Deployment / Demo Flow (Final)
Stack fixed:

- Frontend: React + Vite + Tailwind + Three.js
- Backend API: Node.js + Express + MongoDB
- ML service: FastAPI (Python)
- Queue: Redis + BullMQ (retraining jobs)

Deployment plan:

- Dev:
  - local docker-compose for all services
- Demo:
  - Frontend on Vercel
  - API + ML on Render/Railway/AWS ECS
  - MongoDB Atlas
- Demo scenario script:
  1. user signup/login
  2. lifestyle input
  3. instant 5-impact output
  4. 5-year forecast
  5. what-if simulation
  6. personalized recommendations
  7. 3D visualization walkthrough

### 7) Documentation Structure (Final)
Required docs:

- `README.md` (project overview + quickstart)
- `docs/datasets.md` (sources, schema, licenses, update method)
- `docs/preprocessing.md` (ETL logic, unit rules, missing-value rules)
- `docs/modeling.md` (architecture, training config, metrics)
- `docs/api.md` (all request/response contracts)
- `docs/deployment.md` (infra, env vars, runbooks)
- `docs/demo-script.md` (step-by-step FYP presentation flow)
- `docs/limitations.md` (known constraints + future work)

### 8) Timeline and Milestones (11 Weeks)
- Week 1: monorepo setup, auth scaffold, DB schema
- Week 2: raw dataset ingestion + provenance logging
- Week 3: preprocessing pipeline + feature engineering
- Week 4: baseline multi-output model training
- Week 5: model tuning + evaluation report
- Week 6: FastAPI inference + Node integration
- Week 7: dashboard + charts + history view
- Week 8: recommendation engine + what-if simulation
- Week 9: Three.js 3D module integration
- Week 10: testing, optimization, model versioning, monitoring
- Week 11: final documentation, deployment, demo rehearsal, viva package
