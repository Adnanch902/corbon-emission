# Limitations

- Current frontend uses live API values where authenticated data exists and demo fallbacks for unauthenticated presentation.
- Country-level factors are planned; city-level precision is out of scope for V1.
- Forecast confidence is an MVP uncertainty band, not a peer-reviewed climate forecast.
- Recommendation quality depends on the current rules and should be validated with domain review before production use.
- Production security controls include JWT rotation, helmet, CORS, and rate limiting, but still need deployment-level secret management.
