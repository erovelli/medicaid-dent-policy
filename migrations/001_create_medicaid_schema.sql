/*
 * Medicaid Schema Definition
 * 
 * This script creates the medicaid schema containing a normalized dimensional data model
 * for Medicaid dental provider spending and utilization data. The schema includes:
 * 
 * - providers: Dimension table for provider information (NPIs)
 * - procedures: Dimension table for HCPCS procedure codes
 * - months: Time dimension table for year-month periods
 * - provider_spending: Fact table with spending metrics, claims, and beneficiary counts
 *   (tracks both servicing and billing NPIs for dental procedures)
 *
 *
 * IMPORTANT: - provider_spending_staging: Staging table for data import/ETL
 * 
 * This is designed to support analysis of dental provider utilization patterns,
 * spending trends, and beneficiary access to dental services under Medicaid.
 */

CREATE SCHEMA IF NOT EXISTS medicaid;
SET search_path TO medicaid;

-- Providers (billing and servicing NPIs both reference this)
CREATE TABLE providers (
    npi                 VARCHAR(10) PRIMARY KEY,
    provider_name       TEXT,
    provider_type       TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Procedure codes (HCPCS)
CREATE TABLE procedures (
    hcpcs_code          VARCHAR(10) PRIMARY KEY,
    description         TEXT,
    category            TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Month dimension (YYYY‑MM)
CREATE TABLE months (
    month_id            SERIAL PRIMARY KEY,
    year                INTEGER NOT NULL,
    month               INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    month_start_date    DATE NOT NULL,
    month_end_date      DATE NOT NULL,
    UNIQUE (year, month)
);

CREATE TABLE provider_spending (
    id                          BIGSERIAL PRIMARY KEY,

    servicing_npi               VARCHAR(10) NOT NULL REFERENCES providers(npi),
    billing_npi                 VARCHAR(10) NOT NULL REFERENCES providers(npi),

    hcpcs_code                  VARCHAR(10) NOT NULL REFERENCES procedures(hcpcs_code),
    month_id                    INTEGER NOT NULL REFERENCES months(month_id),

    beneficiaries_served_count  INTEGER NOT NULL CHECK (beneficiaries_served_count >= 0),
    claims_count                INTEGER NOT NULL CHECK (claims_count >= 0),
    total_amount_paid           NUMERIC(18,2) NOT NULL CHECK (total_amount_paid >= 0),

    load_timestamp              TIMESTAMPTZ DEFAULT NOW(),

    -- Uniqueness based on the dataset’s grain:
    UNIQUE (servicing_npi, billing_npi, hcpcs_code, month_id)
);

CREATE TABLE medicaid.provider_spending_staging (
    servicing_npi               VARCHAR(10),
    billing_npi                 VARCHAR(10),
    hcpcs_code                  VARCHAR(10),
    year_month                  TEXT,
    beneficiaries_served_count  INTEGER,
    claims_count                INTEGER,
    total_amount_paid           NUMERIC(18,2)
);