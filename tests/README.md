
```
# Tests

## Run
- `npm test` — run all tests
- `npm test -- --coverage` — with coverage report
- `npm test -- tests/unit` — only unit tests

## Structure
- `tests/unit/` — pure function tests (fast, isolated)
- `tests/integration/` — React component + flow tests
- `tests/mocks/` — shared mocks for external services
```