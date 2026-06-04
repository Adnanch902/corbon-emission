# Deployment

## Local Development
1. Frontend runs with Vite on `5173`.
2. API runs on `4000`.
3. ML service runs on `8000`.
4. MongoDB and Redis run via Docker.

## Docker Compose
- Use `docker-compose.yml` at repo root to run `mongo`, `redis`, `api`, `ml-service`.
- Validate compose configuration with `docker compose config`.

## Release Validation
- Frontend production build: `npm run build`
- API unit, E2E, and performance tests: `cd services/api && npm test`
- ML syntax validation without bytecode writes: `python -B -c "import ast, pathlib; [ast.parse(p.read_text(encoding='utf-8')) for p in pathlib.Path('services/ml-service').rglob('*.py')]; print('python parse ok')"`
- Docker rehearsal check: `docker compose config`

## Demo Rehearsal Flow
1. Start services with `docker compose up --build`.
2. Open the frontend and create a user account.
3. Submit lifestyle input and confirm current prediction appears on the dashboard.
4. Open prediction, recommendation, history, and what-if simulation views.
5. Confirm English/Urdu language toggle appears on the home page.

## Environment Strategy
- Keep `.env.example` in each service.
- Use environment-specific values in real `.env` files.

## Next Production Steps
- Frontend: Vercel
- API/ML: Render, Railway, or AWS ECS
- Database: MongoDB Atlas
- Redis: managed Redis provider
