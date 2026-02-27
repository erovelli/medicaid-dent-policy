-- add indexes used during staging joins
-- improves performance when joining provider_spending_staging to nppes.npi_staging
CREATE INDEX idx_spending_servicing_npi
ON medicaid.provider_spending_staging(servicing_npi);

CREATE INDEX idx_npi_staging_npi
ON nppes.npi_staging(npi);