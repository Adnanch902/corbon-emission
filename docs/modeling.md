# Modeling

## Planned Model Stack
- Current impact estimator: multi-output random-forest regression.
- Forecast estimator: recurrent trend forecaster for 1-10 year trajectories.
- Recommendation engine: rule + marginal impact model.

## Outputs
- Category impacts: `co2`, `water`, `plastic`, `ewaste`, `forest_loss`
- Total sustainability score (0-100)
- Confidence/uncertainty bands

## Evaluation
- MAE, RMSE, R2 per target
- Forecast horizon metrics (1y, 3y, 5y, 10y)
- Drift checks at inference time

## Current MVP Implementation
- Training uses the processed feature store when available, otherwise the documented lifestyle dataset.
- Model metadata is persisted with `model_version`, `trained_at`, MAE, RMSE, and R2.
- Forecast output includes lower/upper total confidence bands for dashboard display.
