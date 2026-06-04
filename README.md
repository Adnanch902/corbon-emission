
## GLIP - Green Lifestyle Impact Predictor

This repository currently contains:
- Existing frontend prototype (React + Vite)
- API scaffold (`services/api`)
- ML service scaffold (`services/ml-service`)
- Project planning and dataset documentation (`docs/`)

## Frontend Run
1. `npm install`
2. Copy `.env.example` to `.env`
2. `npm run dev`

## API Run (Scaffold)
1. `cd services/api`
2. `npm install`
3. Copy `.env.example` to `.env`
4. `npm run dev`

## ML Service Run (Scaffold)
1. `cd services/ml-service`
2. `python -m venv .venv`
3. `.venv\\Scripts\\activate`
4. `pip install -r requirements.txt`
5. Copy `.env.example` to `.env`
6. `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`

## Full Stack via Docker
Use:
- `docker compose up --build`

This starts MongoDB, Redis, API, and ML service.
  
