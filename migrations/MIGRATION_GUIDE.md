# Migration & Data Loading Guide

This guide explains the order to run all migrations and how to upload your data in pgAdmin4.

## Migration Execution Order

Run these migrations **in order**, one at a time, using pgAdmin4 Query Tool:

### Step 1: Create Medicaid Schema
**File:** `001_create_medicaid_schema.sql`

Creates the core Medicaid schema with these empty tables:
- `medicaid.providers` - Provider dimension (will populate from NPPES)
- `medicaid.procedures` - HCPCS procedure codes dimension
- `medicaid.months` - Time dimension
- `medicaid.provider_spending` - Main fact table
- `medicaid.provider_spending_staging` - Staging table for raw data

**In pgAdmin4:**
1. Right-click your database → Query Tool
2. Copy entire contents of `001_create_medicaid_schema.sql`
3. Paste into query editor
4. Click Execute (F5)

---

### Step 2: Create NPPES Schema
**File:** `002_create_nppes_schema.sql`

Creates the NPPES (National Plan and Provider Enumeration System) schema:
- `nppes.npi_staging` - Staging table for raw NPI provider data

**In pgAdmin4:**
1. Open new Query Tool
2. Copy entire contents of `002_create_nppes_schema.sql`
3. Paste and Execute

---

### Step 3: Create Provider Procedure Monthly Geo Table
**File:** `003_create_provider_procedure_monthly_geo.sql`

Creates the enriched output table:
- `medicaid.provider_procedure_monthly_geo` - Monthly procedure data with geographic info

**In pgAdmin4:**
1. Open new Query Tool
2. Copy entire contents of `003_create_provider_procedure_monthly_geo.sql`
3. Paste and Execute

---

### Step 4: Add Performance Indexes
**File:** `004_add_staging_join_indexes.sql`

Creates indexes to speed up data joining:
- `idx_spending_servicing_npi` on staging table
- `idx_npi_staging_npi` on NPPES data

**In pgAdmin4:**
1. Open new Query Tool
2. Copy entire contents of `004_add_staging_join_indexes.sql`
3. Paste and Execute

---

## Data Loading Phase

After Step 4 is complete, upload your data files:

### Upload NPPES Data
**File:** Your NPPES CSV export (provider data from CMS)
**Target Table:** `nppes.npi_staging`

**In pgAdmin4:**
1. Open a new Query Tool
2. Paste this template and modify the file path:

```sql
\COPY nppes.npi_staging (
    npi, entity_type_code, replacement_npi, 
    employer_identification_number, provider_organization_name,
    provider_last_name, provider_first_name, provider_middle_name,
    provider_name_prefix_text, provider_name_suffix_text,
    provider_credential_text, provider_other_organization_name,
    provider_first_line_business_mailing_address,
    provider_business_mailing_address_city_name,
    provider_business_mailing_address_state_name,
    provider_business_mailing_address_postal_code,
    provider_business_mailing_address_country_code,
    provider_first_line_business_practice_location_address,
    provider_business_practice_location_address_city_name,
    provider_business_practice_location_address_state_name,
    provider_business_practice_location_address_postal_code,
    provider_business_practice_location_address_country_code,
    provider_enumeration_date, last_update_date
) FROM '/path/to/your/npi_data.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');
```

**Steps:**
1. Replace `/path/to/your/npi_data.csv` with your actual file path
2. Adjust column list to match your CSV columns
3. Execute the query

---

### Upload HHS Medicaid Spending Data
**File:** Your HHS Medicaid spending CSV (claims, beneficiaries, amounts)
**Target Table:** `medicaid.provider_spending_staging`

**In pgAdmin4:**
1. Open a new Query Tool
2. Paste this template:

```sql
\COPY medicaid.provider_spending_staging (
    servicing_npi, billing_npi, hcpcs_code, year_month,
    beneficiaries_served_count, claims_count, total_amount_paid
) FROM '/path/to/your/hhs_spending_data.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');
```

**Steps:**
1. Replace `/path/to/your/hhs_spending_data.csv` with your actual file path
2. Adjust column list to match your CSV columns
3. Execute the query

---

### Step 5: Populate Enriched Geo Table
**File:** `005_populate_provider_procedure_monthly_geo.sql`

After both data files are uploaded, this migration joins the staging data and creates the final enriched output table with geographic information and filters for dental procedures only (HCPCS codes starting with 'D').

**In pgAdmin4:**
1. Open new Query Tool
2. Copy entire contents of `005_populate_provider_procedure_monthly_geo.sql`
3. Paste and Execute

---

## Complete Workflow Summary

```
1. Execute 001_create_medicaid_schema.sql
   ↓
2. Execute 002_create_nppes_schema.sql
   ↓
3. Execute 003_create_provider_procedure_monthly_geo.sql
   ↓
4. Execute 004_add_staging_join_indexes.sql
   ↓
5. UPLOAD nppes.npi_staging data (NPPES CSV)
   ↓
6. UPLOAD medicaid.provider_spending_staging data (HHS spending CSV)
   ↓
7. Execute 005_populate_provider_procedure_monthly_geo.sql
   ↓
✓ Done! Query medicaid.provider_procedure_monthly_geo
```

---

## Tips for pgAdmin4

- **Open Query Tool:** Right-click your database → Query Tool
- **Execute:** Press F5 or click the Execute button
- **View Results:** Check the "Data Output" tab below the editor
- **Check Errors:** Review the "Messages" tab for any issues
- **File Paths:** Use absolute paths in `\COPY` commands
  - Mac/Linux: `/Users/username/path/to/file.csv`
  - Windows: `C:\\Users\\username\\path\\to\\file.csv` (double backslashes)

---

## If Something Goes Wrong

Each migration file starts with `BEGIN;` and ends with `COMMIT;`, so:
- If a migration succeeds, all changes are committed
- If it fails, nothing is saved (automatic rollback)
- Just fix the issue and try again

For detailed error messages, check the "Messages" tab in pgAdmin4 after executing.
