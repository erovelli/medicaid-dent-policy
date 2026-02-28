-- table for enriched monthly procedure counts with geographic info
-- later populated from provider_spending_staging joined to nppes.npi_staging
BEGIN;
CREATE TABLE medicaid.provider_procedure_monthly_geo (
    servicing_npi VARCHAR(10),
    billing_npi VARCHAR(10),
    hcpcs_code VARCHAR(10),
    year_month TEXT,
    beneficiaries_served_count INTEGER,
    claims_count INTEGER,
    total_amount_paid NUMERIC(18,2),

    state VARCHAR(40),
    zip_code_5 VARCHAR(20),
    country_code VARCHAR(2)
);

COMMIT;