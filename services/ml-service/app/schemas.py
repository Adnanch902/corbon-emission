from pydantic import BaseModel, Field
from typing import Dict, List


class LifestyleFeatures(BaseModel):
    features: Dict[str, float] = Field(default_factory=dict)


class PredictResponse(BaseModel):
    model_version: str
    impacts: Dict[str, float]
    sustainability_score: float


class ForecastResponse(BaseModel):
    model_version: str
    years: int
    trajectory: List[Dict[str, float]]
    confidence: List[Dict[str, float]]


class RecommendResponse(BaseModel):
    model_version: str
    recommendations: List[Dict[str, str]]


class TrainResponse(BaseModel):
    model_version: str
    trained_at: str
    metrics: Dict[str, float]
