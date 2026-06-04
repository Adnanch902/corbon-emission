from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd


ROOT_DIR = Path(__file__).resolve().parents[3]
RAW_PATH = ROOT_DIR / "docs" / "global_lifestyle_carbon_dataset.csv"
PROCESSED_DIR = ROOT_DIR / "services" / "ml-service" / "data" / "processed"
METADATA_DIR = ROOT_DIR / "services" / "ml-service" / "data" / "metadata"
PROCESSED_PATH = PROCESSED_DIR / "train.csv"
VERSION_PATH = METADATA_DIR / "dataset_version.json"
PROVENANCE_PATH = METADATA_DIR / "provenance.json"


def build_feature_store() -> None:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    METADATA_DIR.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(RAW_PATH).dropna().copy()

    # Normalized feature aliases to keep downstream modeling stable.
    df["country_iso3"] = "GLOBAL"
    df["year"] = 2026
    df["kg_co2e"] = df["total_co2_per_week"].astype(float)
    df["m3_water_proxy"] = (df["food_kg_per_week"] * 0.9 + df["electricity_kwh_per_month"] * 0.03).astype(float)
    df["kg_plastic_proxy"] = (df["shopping_spend_usd_per_month"] * 0.02).astype(float)
    df["kg_ewaste_proxy"] = (df["gadgets_usage_hours_per_day"] * 0.4).astype(float)
    df["ha_forest_proxy"] = (df["food_kg_per_week"] * 0.05 + df["transport_km_per_week"] * 0.0015).astype(float)

    df.to_csv(PROCESSED_PATH, index=False)

    VERSION_PATH.write_text(
        json.dumps(
            {
                "dataset_version": datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S"),
                "source": str(RAW_PATH),
                "processed_path": str(PROCESSED_PATH),
                "rows": int(len(df)),
                "generated_at": datetime.now(timezone.utc).isoformat(),
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    PROVENANCE_PATH.write_text(
        json.dumps(
            {
                "features": [
                    {
                        "name": "kg_co2e",
                        "source_url": "docs/global_lifestyle_carbon_dataset.csv",
                        "license_note": "Local project dataset; cite project attributions.",
                    },
                    {
                        "name": "m3_water_proxy",
                        "source_url": "docs/global_lifestyle_carbon_dataset.csv",
                        "license_note": "Derived proxy from lifestyle food and electricity fields.",
                    },
                    {
                        "name": "kg_plastic_proxy",
                        "source_url": "docs/global_lifestyle_carbon_dataset.csv",
                        "license_note": "Derived proxy from shopping spend field.",
                    },
                    {
                        "name": "kg_ewaste_proxy",
                        "source_url": "docs/global_lifestyle_carbon_dataset.csv",
                        "license_note": "Derived proxy from device usage field.",
                    },
                    {
                        "name": "ha_forest_proxy",
                        "source_url": "docs/global_lifestyle_carbon_dataset.csv",
                        "license_note": "Derived proxy from food and transport fields.",
                    },
                ],
                "retrieved_at": datetime.now(timezone.utc).isoformat(),
                "missing_data_strategy": "drop empty source rows, then generate normalized proxy columns",
                "unit_normalization": {
                    "co2": "kg CO2e",
                    "water": "m3 proxy",
                    "plastic": "kg proxy",
                    "ewaste": "kg proxy",
                    "forest_loss": "ha proxy",
                },
            },
            indent=2,
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    build_feature_store()
    print(f"Feature store built at {PROCESSED_PATH}")
