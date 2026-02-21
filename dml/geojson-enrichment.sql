-- INSERT GEOJSON TO geojson.zip3_codes
-- ogr2ogr \\n  -f "PostgreSQL" \\n  PG:"host=localhost user=erovelli dbname=erovelli" \\n  zip3codes.geojson \\n  -nln geojson.zip3_codes \\n  -nlt MULTIPOLYGON \\n  -lco GEOMETRY_NAME=geom \\n  -lco FID=id \\n  -append \\n  -sql "SELECT \"3dig_zip\" AS zip3, * FROM zip3codes"

-- aggregate combined table by zip3, billing code, and year_month
CREATE OR REPLACE VIEW medicaid.provider_spending_zip3 AS
SELECT
    LEFT(NULLIF(TRIM(postal_code), ''), 3) AS zip3,
    hcpcs_code,
    year_month,
    SUM(beneficiaries_served_count) AS total_beneficiaries_served,
    SUM(claims_count) AS total_claims,
    SUM(total_amount_paid) AS total_amount_paid
FROM medicaid.provider_spending_enriched
GROUP BY
    zip3,
    hcpcs_code,
    year_month
ORDER BY
    zip3,
    hcpcs_code,
    year_month;


-- combine aggregated data with geojson
CREATE OR REPLACE VIEW geojson.zip3_with_spending AS
SELECT
    z.id,
    z.zip3,
    z.geom,
    json_agg(
        json_build_object(
            'hcpcs_code', p.hcpcs_code,
            'year_month', p.year_month,
            'total_beneficiaries_served', p.total_beneficiaries_served,
            'total_claims', p.total_claims,
            'total_amount_paid', p.total_amount_paid
        ) ORDER BY p.year_month
    ) AS spending
FROM
    geojson.zip3_codes z
LEFT JOIN
    medicaid.provider_spending_zip3 p
ON
    z.zip3 = p.zip3
GROUP BY
    z.id, z.zip3, z.geom
ORDER BY
    z.zip3;


-- EXPORT enriched view to geojson
-- ogr2ogr \\n  -f "GeoJSON" \\n  zip3_spending.geojson \\n  PG:"host=localhost user=erovelli dbname=erovelli" \\n  -sql "SELECT * FROM geojson.zip3_with_spending"