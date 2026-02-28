#!/usr/bin/env bash
# Export aggregate views to JSON files.
# Each file is structured as { "<geo_key>": [ ...rows ordered by year_month or year ] }
#
# Requires DATABASE_URL to be set, e.g.:
#   export DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"

set -euo pipefail

OUT_DIR="${1:-exports}"
mkdir -p "$OUT_DIR"

psql_json() {
  local query="$1"
  local outfile="$2"
  psql "$DATABASE_URL" -t -A -c "$query" > "$outfile"
  echo "Exported: $outfile"
}

# 007 — provider_procedure_category_aggregate_monthly_state (key: state, order: year_month)
psql_json "
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
" "$OUT_DIR/provider_procedure_category_aggregate_monthly_state.json"

# 008 — provider_procedure_category_aggregate_annual_state (key: state, order: year)
psql_json "
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
" "$OUT_DIR/provider_procedure_category_aggregate_annual_state.json"

# 009 — provider_procedure_category_aggregate_monthly_zip3 (key: zip3, order: year_month)
psql_json "
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
" "$OUT_DIR/provider_procedure_category_aggregate_monthly_zip3.json"

# 010 — provider_procedure_category_aggregate_annual_zip3 (key: zip3, order: year)
psql_json "
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
" "$OUT_DIR/provider_procedure_category_aggregate_annual_zip3.json"
