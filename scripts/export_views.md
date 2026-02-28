# Export Aggregate Views to JSON

Set `DATABASE_URL` before running any command:

```sh
export DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
```

---

## 007 — provider_procedure_category_aggregate_monthly_state (key: state)

```sh
psql "$DATABASE_URL" -t -A -c "
SELECT json_build_object(state, rows)
FROM (
  SELECT state, json_agg(
    json_build_object(
      'year_month',                 year_month,
      'category',                   category,
      'total_beneficiaries_served', total_beneficiaries_served,
      'total_claims',               total_claims,
      'total_amount_paid',          total_amount_paid
    ) ORDER BY year_month, category
  ) AS rows
  FROM medicaid.provider_procedure_category_aggregate_monthly_state
  WHERE state IS NOT NULL
  GROUP BY state
) subq;
" > exports/provider_procedure_category_aggregate_monthly_state.json
```

---

## 008 — provider_procedure_category_aggregate_annual_state (key: state)

```sh
psql "$DATABASE_URL" -t -A -c "
SELECT json_build_object(state, rows)
FROM (
  SELECT state, json_agg(
    json_build_object(
      'year',                       year,
      'category',                   category,
      'total_beneficiaries_served', total_beneficiaries_served,
      'total_claims',               total_claims,
      'total_amount_paid',          total_amount_paid
    ) ORDER BY year, category
  ) AS rows
  FROM medicaid.provider_procedure_category_aggregate_annual_state
  WHERE state IS NOT NULL
  GROUP BY state
) subq;
" > exports/provider_procedure_category_aggregate_annual_state.json
```

---

## 009 — provider_procedure_category_aggregate_monthly_zip3 (key: zip3)

```sh
psql "$DATABASE_URL" -t -A -c "
SELECT json_build_object(zip3, rows)
FROM (
  SELECT zip3, json_agg(
    json_build_object(
      'year_month',                 year_month,
      'category',                   category,
      'total_beneficiaries_served', total_beneficiaries_served,
      'total_claims',               total_claims,
      'total_amount_paid',          total_amount_paid
    ) ORDER BY year_month, category
  ) AS rows
  FROM medicaid.provider_procedure_category_aggregate_monthly_zip3
  WHERE zip3 IS NOT NULL
  GROUP BY zip3
) subq;
" > exports/provider_procedure_category_aggregate_monthly_zip3.json
```

---

## 010 — provider_procedure_category_aggregate_annual_zip3 (key: zip3)

```sh
psql "$DATABASE_URL" -t -A -c "
SELECT json_build_object(zip3, rows)
FROM (
  SELECT zip3, json_agg(
    json_build_object(
      'year',                       year,
      'category',                   category,
      'total_beneficiaries_served', total_beneficiaries_served,
      'total_claims',               total_claims,
      'total_amount_paid',          total_amount_paid
    ) ORDER BY year, category
  ) AS rows
  FROM medicaid.provider_procedure_category_aggregate_annual_zip3
  WHERE zip3 IS NOT NULL
  GROUP BY zip3
) subq;
" > exports/provider_procedure_category_aggregate_annual_zip3.json
```
