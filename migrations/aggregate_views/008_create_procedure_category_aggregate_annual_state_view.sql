CREATE OR REPLACE VIEW medicaid.provider_procedure_category_aggregate_annual_state AS
SELECT
    state,
    LEFT(year_month, 4) AS year,
    category,
    SUM(total_beneficiaries_served) AS total_beneficiaries_served,
    SUM(total_claims) AS total_claims,
    SUM(total_amount_paid) AS total_amount_paid
FROM medicaid.provider_procedure_category_aggregate
GROUP BY
    state,
    year,
    category
ORDER BY
    state,
    year,
    category;
