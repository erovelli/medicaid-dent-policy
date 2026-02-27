-- add indexes used during staging joins
-- improves performance when joining provider_spending_staging to nppes.npi_staging
BEGIN;
CREATE INDEX idx_spending_raw_servicing_npi
ON medicaid.provider_spending_raw(servicing_npi);

CREATE INDEX idx_npi_raw_npi
ON nppes.npi_raw(npi);
COMMIT;
