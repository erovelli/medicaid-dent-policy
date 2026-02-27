-- INSERT GEOJSON TO geojson.zip3_codes
-- ogr2ogr \\n  -f "PostgreSQL" \\n  PG:"host=localhost user=erovelli dbname=erovelli" \\n  zip3codes.geojson \\n  -nln geojson.zip3_codes \\n  -nlt MULTIPOLYGON \\n  -lco GEOMETRY_NAME=geom \\n  -lco FID=id \\n  -append \\n  -sql "SELECT \"3dig_zip\" AS zip3, * FROM zip3codes"

-- aggregate combined table by zip3, billing code, and year_month
-- cast hcpcs_code to category based on below range
-- Category | Code Range

-- Diagnostic | D0100–D0999
-- Preventive | D1000–D1999
-- Restorative | D2000–D2999
-- Endodontics | D3000–D3999
-- Periodontics | D4000–D4999
-- Prosthodontics (removable) | D5000–D5899
-- Maxillofacial Prosthetics | D5900–D5999
-- Implant Services | D6000–D6199
-- Prosthodontics (fixed) | D6200–D6999
-- Oral Surgery | D7000–D7999
-- Orthodontics | D8000–D8999
-- Adjunctive General Services | D9000–D9999
CREATE OR REPLACE VIEW medicaid.provider_spending_zip3 AS
WITH cleaned AS (
    SELECT
        LEFT(NULLIF(TRIM(zip_code_5), ''), 3) AS zip3,
        hcpcs_code,
        year_month,
        beneficiaries_served_count,
        claims_count,
        total_amount_paid,

        -- Extract numeric portion safely (handles codes like D1234)
        CASE
            WHEN hcpcs_code ~ '^D[0-9]{4}$'
            THEN SUBSTRING(hcpcs_code FROM 2 FOR 4)::int
            ELSE NULL
        END AS hcpcs_numeric
    FROM medicaid.provider_procedure_monthly_geo
)

SELECT
    zip3,
    hcpcs_code,

    CASE
        WHEN hcpcs_numeric BETWEEN 100 AND 999   THEN 'Diagnostic'
        WHEN hcpcs_numeric BETWEEN 1000 AND 1999 THEN 'Preventive'
        WHEN hcpcs_numeric BETWEEN 2000 AND 2999 THEN 'Restorative'
        WHEN hcpcs_numeric BETWEEN 3000 AND 3999 THEN 'Endodontics'
        WHEN hcpcs_numeric BETWEEN 4000 AND 4999 THEN 'Periodontics'
        WHEN hcpcs_numeric BETWEEN 5000 AND 5899 THEN 'Prosthodontics (removable)'
        WHEN hcpcs_numeric BETWEEN 5900 AND 5999 THEN 'Maxillofacial Prosthetics'
        WHEN hcpcs_numeric BETWEEN 6000 AND 6199 THEN 'Implant Services'
        WHEN hcpcs_numeric BETWEEN 6200 AND 6999 THEN 'Prosthodontics (fixed)'
        WHEN hcpcs_numeric BETWEEN 7000 AND 7999 THEN 'Oral Surgery'
        WHEN hcpcs_numeric BETWEEN 8000 AND 8999 THEN 'Orthodontics'
        WHEN hcpcs_numeric BETWEEN 9000 AND 9999 THEN 'Adjunctive General Services'
        ELSE 'Uncategorized'
    END AS category,

    year_month,

    SUM(beneficiaries_served_count) AS total_beneficiaries_served,
    SUM(claims_count) AS total_claims,
    SUM(total_amount_paid) AS total_amount_paid

FROM cleaned
GROUP BY
    zip3,
    hcpcs_code,
    category,
    year_month

ORDER BY
    zip3,
    category,
    hcpcs_code,
    year_month;



-- aggregate hcps categories
CREATE OR REPLACE VIEW medicaid.provider_spending_category_month AS
SELECT
    zip3,
    year_month,
    category,
    SUM(total_beneficiaries_served) AS total_beneficiaries_served,
    SUM(total_claims) AS total_claims,
    SUM(total_amount_paid) AS total_amount_paid
FROM
    medicaid.provider_spending_zip3
GROUP BY
    zip3,
    year_month,
    category
ORDER BY
    zip3,
    year_month,
    category;

-- combine aggregated data with geojson
CREATE OR REPLACE VIEW geojson.zip3_with_spending AS
SELECT
    z.zip3,
    z.geom,
    json_agg(
        json_build_object(
            'C', p.category,
            'YM', p.year_month,
            'TBS', p.total_beneficiaries_served,
            'TC', p.total_claims,
            'TAP', p.total_amount_paid
        )
        ORDER BY p.year_month, p.category
    ) AS spending
FROM
    geojson.zip3_codes z
LEFT JOIN
    medicaid.provider_spending_category_month p
    ON z.zip3 = p.zip3
GROUP BY
    z.id, z.zip3, z.geom
ORDER BY
    z.zip3;


-- EXPORT enriched view to geojson
-- ogr2ogr \
-- -f "GeoJSON" \
-- zip3_spending.geojson \
-- PG:"host=localhost user=erovelli dbname=erovelli" \
-- -sql "SELECT * FROM geojson.zip3_with_spending ORDER BY zip3 ASC"


2257524