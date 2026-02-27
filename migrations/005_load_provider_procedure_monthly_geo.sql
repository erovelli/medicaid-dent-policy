-- populate provider_procedure_monthly_geo from staging data (dental codes only)
INSERT INTO medicaid.provider_procedure_monthly_geo
SELECT
    p.servicing_npi,
    p.billing_npi,
    p.hcpcs_code,
    p.year_month,
    p.beneficiaries_served_count,
    p.claims_count,
    p.total_amount_paid,

    n.provider_business_practice_location_address_state_name   AS state,
    n.provider_business_practice_location_address_postal_code  AS zip_code_5,
    n.provider_business_practice_location_address_country_code AS country_code
FROM medicaid.provider_spending_staging p


JOIN nppes.npi_staging n
  ON p.servicing_npi = n.npi::text
WHERE p.hcpcs_code LIKE 'D%';