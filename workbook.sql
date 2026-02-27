


CREATE TABLE medicaid.provider_procedure_monthly_geo (
    servicing_npi VARCHAR(10),
    billing_npi VARCHAR(10),
    hcpcs_code VARCHAR(10),
    year_month TEXT,
    beneficiaries_served_count INTEGER,
    claims_count INTEGER,
    total_amount_paid NUMERIC(18,2),

    practice_address_line1 VARCHAR(55),
    practice_address_line2 VARCHAR(55),
    city VARCHAR(40),
    state VARCHAR(40),
    postal_code VARCHAR(20),
    country_code VARCHAR(2),
    phone VARCHAR(20)
);



CREATE INDEX idx_spending_servicing_npi
ON medicaid.provider_spending_staging(servicing_npi);

CREATE INDEX idx_npi_staging_npi
ON nppes.npi_staging(npi);

ANALYZE medicaid.provider_spending_staging;
ANALYZE nppes.npi_staging;

INSERT INTO medicaid.provider_procedure_monthly_geo
SELECT
    p.servicing_npi,
    p.billing_npi,
    p.hcpcs_code,
    p.year_month,
    p.beneficiaries_served_count,
    p.claims_count,
    p.total_amount_paid,

    n.provider_first_line_business_practice_location_address,
    n.provider_second_line_business_practice_location_address,
    n.provider_business_practice_location_address_city_name,
    n.provider_business_practice_location_address_state_name,
    n.provider_business_practice_location_address_postal_code,
    n.provider_business_practice_location_address_country_code,
    n.provider_business_practice_location_address_telephone_number
FROM medicaid.provider_spending_staging p
JOIN nppes.npi_staging n
  ON p.servicing_npi = n.npi::text
WHERE p.hcpcs_code LIKE 'D%';

