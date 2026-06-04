from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.multioutput import MultiOutputRegressor
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


def _find_root_dir() -> Path:
    for parent in Path(__file__).resolve().parents:
        if (parent / "docs").exists() or (parent / "services").exists():
            return parent
    return Path(__file__).resolve().parents[1]


ROOT_DIR = _find_root_dir()
DATASET_PATH = ROOT_DIR / "docs" / "global_lifestyle_carbon_dataset.csv"
PROCESSED_DATASET_PATH = ROOT_DIR / "services" / "ml-service" / "data" / "processed" / "train.csv"
ARTIFACT_DIR = ROOT_DIR / "services" / "ml-service" / "artifacts"
MODEL_PATH = ARTIFACT_DIR / "model.joblib"
META_PATH = ARTIFACT_DIR / "model_metadata.json"


@dataclass
class TrainedArtifacts:
    model: Pipeline
    model_version: str
    trained_at: str
    metrics: Dict[str, float]


def _ensure_artifact_dir() -> None:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)


def _build_targets(df: pd.DataFrame) -> pd.DataFrame:
    # Proposal targets adapted from available public dataset columns.
    water = df["food_kg_per_week"] * 0.9 + df["electricity_kwh_per_month"] * 0.03
    plastic = df["shopping_spend_usd_per_month"] * 0.02 + np.where(df["diet_type"] == "high_meat", 2.5, 1.2)
    ewaste = df["gadgets_usage_hours_per_day"] * 0.4 + df["shopping_spend_usd_per_month"] * 0.003
    forest_loss = df["food_kg_per_week"] * 0.05 + df["transport_km_per_week"] * 0.0015

    targets = pd.DataFrame(
        {
            "co2": df["total_co2_per_week"].astype(float),
            "water": water.astype(float),
            "plastic": plastic.astype(float),
            "ewaste": ewaste.astype(float),
            "forest_loss": forest_loss.astype(float),
        }
    )
    return targets


def _build_features(df: pd.DataFrame) -> pd.DataFrame:
    return df[
        [
            "transport_km_per_week",
            "vehicle_type",
            "electricity_kwh_per_month",
            "diet_type",
            "food_kg_per_week",
            "shopping_spend_usd_per_month",
            "gadgets_usage_hours_per_day",
        ]
    ].copy()


def _fallback_training_frame() -> pd.DataFrame:
    rows = []
    vehicle_types = ["car_petrol", "bus", "train", "bike"]
    diet_types = ["mixed", "vegetarian", "high_meat", "vegan"]
    for index in range(80):
        transport = 5 + (index % 20) * 4
        electricity = 80 + (index % 10) * 35
        food = 5 + (index % 8)
        shopping = 50 + (index % 12) * 30
        gadgets = 1 + (index % 8) * 0.75
        vehicle = vehicle_types[index % len(vehicle_types)]
        diet = diet_types[index % len(diet_types)]
        vehicle_factor = {"car_petrol": 0.32, "bus": 0.11, "train": 0.06, "bike": 0.03}[vehicle]
        diet_factor = {"mixed": 1.2, "vegetarian": 0.8, "high_meat": 1.8, "vegan": 0.55}[diet]
        rows.append(
            {
                "transport_km_per_week": transport,
                "vehicle_type": vehicle,
                "electricity_kwh_per_month": electricity,
                "diet_type": diet,
                "food_kg_per_week": food,
                "shopping_spend_usd_per_month": shopping,
                "gadgets_usage_hours_per_day": gadgets,
                "total_co2_per_week": transport * vehicle_factor + electricity * 0.08 + food * diet_factor + shopping * 0.015 + gadgets * 0.4,
            }
        )
    return pd.DataFrame(rows)


def _load_training_frame() -> pd.DataFrame:
    data_path = PROCESSED_DATASET_PATH if PROCESSED_DATASET_PATH.exists() else DATASET_PATH
    if data_path.exists():
        return pd.read_csv(data_path).dropna()
    return _fallback_training_frame()


def train_and_save_model() -> TrainedArtifacts:
    _ensure_artifact_dir()

    data_path = PROCESSED_DATASET_PATH if PROCESSED_DATASET_PATH.exists() else DATASET_PATH
    df = _load_training_frame()
    X = _build_features(df)
    y = _build_targets(df)

    numeric_features = [
        "transport_km_per_week",
        "electricity_kwh_per_month",
        "food_kg_per_week",
        "shopping_spend_usd_per_month",
        "gadgets_usage_hours_per_day",
    ]
    categorical_features = ["vehicle_type", "diet_type"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", "passthrough", numeric_features),
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
        ]
    )

    estimator = MultiOutputRegressor(
        RandomForestRegressor(
            n_estimators=180,
            random_state=42,
            min_samples_leaf=2,
        )
    )

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

    model = Pipeline(steps=[("preprocessor", preprocessor), ("model", estimator)])
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = float(mean_absolute_error(y_test, preds))
    rmse = float(np.sqrt(mean_squared_error(y_test, preds)))
    r2 = float(r2_score(y_test, preds, multioutput="variance_weighted"))

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    model_version = f"v{timestamp}"
    trained_at = datetime.now(timezone.utc).isoformat()
    metrics = {"mae": round(mae, 4), "rmse": round(rmse, 4), "r2": round(r2, 4)}

    joblib.dump(model, MODEL_PATH)
    META_PATH.write_text(
        json.dumps(
            {
                "model_version": model_version,
                "trained_at": trained_at,
                "metrics": metrics,
                "dataset_path": str(data_path) if data_path.exists() else "generated_fallback_training_frame",
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    return TrainedArtifacts(model=model, model_version=model_version, trained_at=trained_at, metrics=metrics)


def load_or_train_model() -> TrainedArtifacts:
    _ensure_artifact_dir()
    if MODEL_PATH.exists() and META_PATH.exists():
        model = joblib.load(MODEL_PATH)
        metadata = json.loads(META_PATH.read_text(encoding="utf-8"))
        return TrainedArtifacts(
            model=model,
            model_version=metadata.get("model_version", "v0"),
            trained_at=metadata.get("trained_at", ""),
            metrics=metadata.get("metrics", {}),
        )
    return train_and_save_model()


def predict_impacts(model: Pipeline, features: Dict[str, float]) -> Dict[str, float]:
    frame = pd.DataFrame(
        [
            {
                "transport_km_per_week": float(features.get("travel_distance", 0.0)),
                "vehicle_type": "car_petrol",
                "electricity_kwh_per_month": float(features.get("electricity_kwh", 0.0)),
                "diet_type": "mixed",
                "food_kg_per_week": 8.0 + float(features.get("meat_frequency_index", 0.0)),
                "shopping_spend_usd_per_month": 100.0 + float(features.get("shopping_frequency_index", 0.0)) * 80.0,
                "gadgets_usage_hours_per_day": float(features.get("usage_hours", 0.0)),
            }
        ]
    )
    preds = model.predict(frame)[0]
    return {
        "co2": round(float(preds[0]), 3),
        "water": round(float(preds[1]), 3),
        "plastic": round(float(preds[2]), 3),
        "ewaste": round(float(preds[3]), 3),
        "forest_loss": round(float(preds[4]), 3),
    }


def _recurrent_trend_factor(year: int, hidden_state: float) -> Tuple[float, float]:
    updated_state = np.tanh(0.72 * hidden_state + 0.08 * year - 0.18)
    reduction_factor = 1 - (0.025 + 0.015 * max(0.0, updated_state)) * year
    return max(0.68, reduction_factor), float(updated_state)


def forecast_trajectory(base_impacts: Dict[str, float], years: int) -> List[Dict[str, float]]:
    years = max(1, min(years, 10))
    trajectory: List[Dict[str, float]] = []
    hidden_state = 0.0
    for year in range(1, years + 1):
        factor, hidden_state = _recurrent_trend_factor(year, hidden_state)
        row = {"year": float(year)}
        for key, value in base_impacts.items():
            row[key] = round(value * factor, 3)
        trajectory.append(row)
    return trajectory


def forecast_confidence(base_impacts: Dict[str, float], trajectory: List[Dict[str, float]]) -> List[Dict[str, float]]:
    confidence: List[Dict[str, float]] = []
    total_base = sum(base_impacts.values()) or 1.0
    for index, row in enumerate(trajectory, start=1):
        total = sum(value for key, value in row.items() if key != "year")
        uncertainty = min(0.35, 0.08 + index * 0.025)
        confidence.append(
            {
                "year": row["year"],
                "confidence": round(max(0.6, 1 - uncertainty), 3),
                "lower_total": round(total * (1 - uncertainty), 3),
                "upper_total": round(total * (1 + uncertainty + total_base * 0.0001), 3),
            }
        )
    return confidence


def generate_recommendations(impacts: Dict[str, float]) -> List[Dict[str, str]]:
    rules: List[Tuple[str, float, str, str]] = [
        ("co2", 90, "Shift 3 weekly trips to public transport", "high", "medium"),
        ("water", 20, "Reduce food waste and optimize cooking water use", "medium", "easy"),
        ("plastic", 6, "Replace single-use packaging with reusable alternatives", "high", "easy"),
        ("ewaste", 3, "Extend device replacement cycle to 3+ years", "medium", "medium"),
        ("forest_loss", 1, "Reduce high-meat meals and prefer plant-based swaps", "high", "easy"),
    ]
    recs: List[Dict[str, str]] = []
    for key, threshold, title, impact, effort in rules:
        if impacts.get(key, 0) >= threshold:
            recs.append({"title": title, "impact": impact, "effort": effort})
    if not recs:
        recs.append({"title": "Maintain current habits and monitor monthly trends", "impact": "low", "effort": "easy"})
    return recs[:5]
