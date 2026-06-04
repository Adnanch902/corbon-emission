from app.ml_pipeline import forecast_confidence, forecast_trajectory, generate_recommendations


def test_forecast_has_expected_length():
    base = {"co2": 100.0, "water": 20.0, "plastic": 10.0, "ewaste": 3.0, "forest_loss": 1.0}
    data = forecast_trajectory(base, 5)
    assert len(data) == 5
    assert data[0]["year"] == 1.0
    assert data[-1]["co2"] < base["co2"]


def test_forecast_confidence_has_bounds():
    base = {"co2": 100.0, "water": 20.0, "plastic": 10.0, "ewaste": 3.0, "forest_loss": 1.0}
    data = forecast_trajectory(base, 3)
    confidence = forecast_confidence(base, data)
    assert len(confidence) == 3
    assert confidence[0]["lower_total"] < confidence[0]["upper_total"]


def test_recommendations_not_empty():
    impacts = {"co2": 120.0, "water": 10.0, "plastic": 3.0, "ewaste": 1.0, "forest_loss": 0.2}
    recs = generate_recommendations(impacts)
    assert len(recs) >= 1
    assert "title" in recs[0]
