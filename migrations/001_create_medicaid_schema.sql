/*
 * Medicaid Schema Definition
 * 
 * IMPORTANT: - provider_spending_raw: Staging table for data import/ETL
 * 
 * This is designed to support analysis of dental provider utilization patterns,
 * spending trends, and beneficiary access to dental services under Medicaid.
 */

CREATE SCHEMA IF NOT EXISTS medicaid;
SET search_path TO medicaid;

DROP TABLE IF EXISTS medicaid.provider_spending_raw;

CREATE TABLE medicaid.provider_spending_raw (
    servicing_npi               VARCHAR(10),
    billing_npi                 VARCHAR(10),
    hcpcs_code                  VARCHAR(10),
    year_month                  TEXT,
    beneficiaries_served_count  INTEGER,
    claims_count                INTEGER,
    total_amount_paid           NUMERIC(18,2)
);