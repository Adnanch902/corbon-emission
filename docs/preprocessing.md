# Preprocessing

## Pipeline Stages
1. Ingest raw CSV/API dumps.
2. Standardize schema keys (`country_iso3`, `year`).
3. Harmonize units to shared impact units.
4. Handle missing values with interpolation + regional fallback.
5. Build lifestyle feature vectors.
6. Export processed train/validation/test sets.

## Proposed Paths
- Raw: `ml/data/raw/`
- Processed: `ml/data/processed/`
- Metadata: `ml/data/metadata/`

## Quality Checks
- No duplicate keys by country/year.
- Unit conversion sanity checks.
- Missingness report per feature.

