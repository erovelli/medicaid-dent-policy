CREATE OR REPLACE VIEW medicaid.provider_procedure_category_aggregate_monthly_state AS
SELECT
    state,
    year_month,
    category,
    SUM(total_beneficiaries_served) AS total_beneficiaries_served,
    SUM(total_claims) AS total_claims,
    SUM(total_amount_paid) AS total_amount_paid
FROM medicaid.provider_procedure_category_aggregate
GROUP BY
    state,
    year_month,
    category
ORDER BY
    state,
    year_month,
    category;
