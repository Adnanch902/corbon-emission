import os
from fastapi import FastAPI
from .schemas import (
    LifestyleFeatures,
    PredictResponse,
    ForecastResponse,
    RecommendResponse,
    TrainResponse
)
from .ml_pipeline import (
    generate_recommendations,
    forecast_trajectory,
    forecast_confidence,
    load_or_train_model,
    predict_impacts,
    train_and_save_model,
)

MODEL_VERSION = os.getenv("MODEL_VERSION", "v0.1.0")

app = FastAPI(title="GLIP ML Service", version=MODEL_VERSION)
artifacts = load_or_train_model()


@app.get("/ml/health")
def health() -> dict:
  return {
    "status": "ok",
    "service": "glip-ml-service",
    "model_version": artifacts.model_version,
    "trained_at": artifacts.trained_at,
    "metrics": artifacts.metrics,
  }


@app.post("/ml/predict", response_model=PredictResponse)
def predict(payload: LifestyleFeatures) -> PredictResponse:
  impacts = predict_impacts(artifacts.model, payload.features)
  score = max(0.0, min(100.0, 100.0 - impacts["co2"] * 0.25 - impacts["plastic"] * 0.8))
  return PredictResponse(
    model_version=artifacts.model_version,
    impacts=impacts,
    sustainability_score=round(score, 2),
  )


@app.post("/ml/forecast", response_model=ForecastResponse)
def forecast(payload: LifestyleFeatures, years: int = 5) -> ForecastResponse:
  impacts = predict_impacts(artifacts.model, payload.features)
  trajectory = forecast_trajectory(impacts, years)
  confidence = forecast_confidence(impacts, trajectory)
  return ForecastResponse(model_version=artifacts.model_version, years=years, trajectory=trajectory, confidence=confidence)


@app.post("/ml/recommend", response_model=RecommendResponse)
def recommend(payload: LifestyleFeatures) -> RecommendResponse:
  impacts = predict_impacts(artifacts.model, payload.features)
  recommendations = generate_recommendations(impacts)
  return RecommendResponse(
    model_version=artifacts.model_version,
    recommendations=recommendations,
  )


@app.post("/ml/train", response_model=TrainResponse)
def train() -> TrainResponse:
  global artifacts
  artifacts = train_and_save_model()
  return TrainResponse(
    model_version=artifacts.model_version,
    trained_at=artifacts.trained_at,
    metrics=artifacts.metrics,
  )
