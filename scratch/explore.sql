--
-- scratch/explore.sql
--
-- Quick exploratory queries against the medicaid schema.  These are
-- ad-hoc analyses used during development to understand the Medicaid
-- dental provider spending data pulled into the `provider_spending_staging`
-- table.  The script contains two separate segments:
--
-- 1. Summarize spending and claims by HCPCS code (filtered to dental codes
--    beginning with 'D').  Useful for identifying the most-common procedure
--    codes in the staging dataset.
--
-- 2. Join the staging rows for dental procedures to the NPPES `npi_staging`
--    table in order to inspect provider practice location fields for a
--    sample of records.
--
-- These queries are not intended for production use; they help with
-- exploration and planning of downstream ETL/enrichment.

SELECT
    hcpcs_code,
    SUM(claims_count)        AS total_claims_count,
    SUM(total_amount_paid)   AS total_amount_paid
FROM medicaid.provider_spending_staging
WHERE hcpcs_code LIKE 'D%'
GROUP BY hcpcs_code
ORDER BY total_claims_count DESC;


SELECT
    p.*,
    n.provider_first_line_business_practice_location_address,
	n.provider_second_line_business_practice_location_address,
	n.provider_business_practice_location_address_city_name,
	n.provider_business_practice_location_address_state_name, 
	n.provider_business_practice_location_address_postal_code, 
	n.provider_business_practice_location_address_country_code, 
	n.provider_business_practice_location_address_telephone_number
FROM medicaid.provider_spending_staging p
JOIN nppes.npi_staging n
    ON p.servicing_npi = n.npi
WHERE p.hcpcs_code LIKE 'D%'
LIMIT 100;