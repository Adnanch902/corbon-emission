# API Contracts (V1)

Base URL: `/api/v1`

## Auth
- `POST /auth/signup` returns `accessToken`, `refreshToken`, backward-compatible `token`, and `user`.
- `POST /auth/login` returns `accessToken`, `refreshToken`, backward-compatible `token`, and `user`.
- `POST /auth/refresh` accepts `{ "refreshToken": "..." }` and rotates both tokens.
- `POST /auth/logout` clears the saved refresh token for the authenticated user.

## User Flow
- `POST /lifestyle/entry`
- `POST /predict/current`
- `POST /predict/forecast?years=5|10`
- `POST /simulate`
- `GET /dashboard/summary`
- `GET /recommendations`
- `GET /history`

## Admin
- `GET /admin/dataset-status`
- `POST /admin/retrain`

## Internal ML Service
- `GET /ml/health`
- `POST /ml/predict` returns five impact values and a sustainability score.
- `POST /ml/forecast` returns a recurrent trajectory plus `confidence` bands.
- `POST /ml/recommend` returns ranked action recommendations.
