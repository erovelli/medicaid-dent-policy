/*
 * NPPES Schema Definition
 * 
 * This script creates the NPPES (National Plan and Provider Enumeration System) schema
 * and the npi_staging table, which serves as a normalized staging layer for National
 * Provider Identifier (NPI) data. 
 * 
 * IMPORTANT: The npi_staging table is designed to hold raw NPI data imported from the NPPES
 * 
 * The table includes comprehensive provider information
 * including identification details, mailing and practice addresses, taxonomies, licenses,
 * authorized official information, and other provider identifiers.
 * 
 */

BEGIN;
CREATE SCHEMA IF NOT EXISTS nppes;

DROP TABLE IF EXISTS nppes.npi_raw;

CREATE TABLE nppes.npi_raw (

    -- ============================
    -- Core Provider Identification
    -- ============================
    npi NUMERIC(10,0),
    entity_type_code VARCHAR(1),
    replacement_npi NUMERIC(10,0),
    employer_identification_number VARCHAR(9),

    provider_organization_name VARCHAR(100),
    provider_last_name VARCHAR(35),
    provider_first_name VARCHAR(35),
    provider_middle_name VARCHAR(20),
    provider_name_prefix_text VARCHAR(5),
    provider_name_suffix_text VARCHAR(5),
    provider_credential_text VARCHAR(20),

    provider_other_organization_name VARCHAR(100),
    provider_other_organization_name_type_code VARCHAR(1),
    provider_other_last_name VARCHAR(35),
    provider_other_first_name VARCHAR(35),
    provider_other_middle_name VARCHAR(20),
    provider_other_name_prefix_text VARCHAR(5),
    provider_other_name_suffix_text VARCHAR(5),
    provider_other_credential_text VARCHAR(20),
    provider_other_last_name_type_code VARCHAR(1),

    -- ============================
    -- Mailing Address
    -- ============================
    provider_first_line_business_mailing_address VARCHAR(55),
    provider_second_line_business_mailing_address VARCHAR(55),
    provider_business_mailing_address_city_name VARCHAR(40),
    provider_business_mailing_address_state_name VARCHAR(40),
    provider_business_mailing_address_postal_code VARCHAR(20),
    provider_business_mailing_address_country_code VARCHAR(2),
    provider_business_mailing_address_telephone_number VARCHAR(20),
    provider_business_mailing_address_fax_number VARCHAR(20),

    -- ============================
    -- Practice Location Address
    -- ============================
    provider_first_line_business_practice_location_address VARCHAR(55),
    provider_second_line_business_practice_location_address VARCHAR(55),
    provider_business_practice_location_address_city_name VARCHAR(40),
    provider_business_practice_location_address_state_name VARCHAR(40),
    provider_business_practice_location_address_postal_code VARCHAR(20),
    provider_business_practice_location_address_country_code VARCHAR(2),
    provider_business_practice_location_address_telephone_number VARCHAR(20),
    provider_business_practice_location_address_fax_number VARCHAR(20),

    -- ============================
    -- Dates & Status
    -- ============================
    provider_enumeration_date DATE,
    last_update_date DATE,
    npi_deactivation_reason_code VARCHAR(2),
    npi_deactivation_date DATE,
    npi_reactivation_date DATE,
    provider_sex_code VARCHAR(1),

    -- ============================
    -- Authorized Official
    -- ============================
    authorized_official_last_name VARCHAR(35),
    authorized_official_first_name VARCHAR(35),
    authorized_official_middle_name VARCHAR(20),
    authorized_official_title_or_position VARCHAR(35),
    authorized_official_telephone_number VARCHAR(20),

    -- ============================
    -- 15 Taxonomy Groups
    -- ============================
	    healthcare_provider_taxonomy_code_1 VARCHAR(10),
    provider_license_number_1 VARCHAR(20),
    provider_license_number_state_code_1 VARCHAR(2),
    healthcare_provider_primary_taxonomy_switch_1 VARCHAR(1),

    healthcare_provider_taxonomy_code_2 VARCHAR(10),
    provider_license_number_2 VARCHAR(20),
    provider_license_number_state_code_2 VARCHAR(2),
    healthcare_provider_primary_taxonomy_switch_2 VARCHAR(1),

    healthcare_provider_taxonomy_code_3 VARCHAR(10),
    provider_license_number_3 VARCHAR(20),
    provider_license_number_state_code_3 VARCHAR(2),
    healthcare_provider_primary_taxonomy_switch_3 VARCHAR(1),

    healthcare_provider_taxonomy_code_4 VARCHAR(10),
    provider_license_number_4 VARCHAR(20),
    provider_license_number_state_code_4 VARCHAR(2),
    healthcare_provider_primary_taxonomy_switch_4 VARCHAR(1),

    healthcare_provider_taxonomy_code_5 VARCHAR(10),
    provider_license_number_5 VARCHAR(20),
    provider_license_number_state_code_5 VARCHAR(2),
    healthcare_provider_primary_taxonomy_switch_5 VARCHAR(1),

    healthcare_provider_taxonomy_code_6 VARCHAR(10),
    provider_license_number_6 VARCHAR(20),
    provider_license_number_state_code_6 VARCHAR(2),
    healthcare_provider_primary_taxonomy_switch_6 VARCHAR(1),

    healthcare_provider_taxonomy_code_7 VARCHAR(10),
    provider_license_number_7 VARCHAR(20),
    provider_license_number_state_code_7 VARCHAR(2),
    healthcare_provider_primary_taxonomy_switch_7 VARCHAR(1),

    healthcare_provider_taxonomy_code_8 VARCHAR(10),
    provider_license_number_8 VARCHAR(20),
    provider_license_number_state_code_8 VARCHAR(2),
    healthcare_provider_primary_taxonomy_switch_8 VARCHAR(1),

    healthcare_provider_taxonomy_code_9 VARCHAR(10),
    provider_license_number_9 VARCHAR(20),
    provider_license_number_state_code_9 VARCHAR(2),
    healthcare_provider_primary_taxonomy_switch_9 VARCHAR(1),

    healthcare_provider_taxonomy_code_10 VARCHAR(10),
    provider_license_number_10 VARCHAR(20),
    provider_license_number_state_code_10 VARCHAR(2),
    healthcare_provider_primary_taxonomy_switch_10 VARCHAR(1),

    healthcare_provider_taxonomy_code_11 VARCHAR(10),
    provider_license_number_11 VARCHAR(20),
    provider_license_number_state_code_11 VARCHAR(2),
    healthcare_provider_primary_taxonomy_switch_11 VARCHAR(1),

    healthcare_provider_taxonomy_code_12 VARCHAR(10),
    provider_license_number_12 VARCHAR(20),
    provider_license_number_state_code_12 VARCHAR(2),
    healthcare_provider_primary_taxonomy_switch_12 VARCHAR(1),

    healthcare_provider_taxonomy_code_13 VARCHAR(10),
    provider_license_number_13 VARCHAR(20),
    provider_license_number_state_code_13 VARCHAR(2),
    healthcare_provider_primary_taxonomy_switch_13 VARCHAR(1),

    healthcare_provider_taxonomy_code_14 VARCHAR(10),
    provider_license_number_14 VARCHAR(20),
    provider_license_number_state_code_14 VARCHAR(2),
    healthcare_provider_primary_taxonomy_switch_14 VARCHAR(1),

    healthcare_provider_taxonomy_code_15 VARCHAR(10),
    provider_license_number_15 VARCHAR(20),
    provider_license_number_state_code_15 VARCHAR(2),
    healthcare_provider_primary_taxonomy_switch_15 VARCHAR(1),
	    -- ============================
    -- Other Provider Identifiers
    -- ============================

-- Group 1
    other_provider_identifier_1 VARCHAR(20),
    other_provider_identifier_type_code_1 VARCHAR(2),
    other_provider_identifier_state_1 VARCHAR(2),
    other_provider_identifier_issuer_1 VARCHAR(80),

-- Group 2
    other_provider_identifier_2 VARCHAR(20),
    other_provider_identifier_type_code_2 VARCHAR(2),
    other_provider_identifier_state_2 VARCHAR(2),
    other_provider_identifier_issuer_2 VARCHAR(80),

-- Group 3
    other_provider_identifier_3 VARCHAR(20),
    other_provider_identifier_type_code_3 VARCHAR(2),
    other_provider_identifier_state_3 VARCHAR(2),
    other_provider_identifier_issuer_3 VARCHAR(80),

-- Group 4
    other_provider_identifier_4 VARCHAR(20),
    other_provider_identifier_type_code_4 VARCHAR(2),
    other_provider_identifier_state_4 VARCHAR(2),
    other_provider_identifier_issuer_4 VARCHAR(80),

-- Group 5
    other_provider_identifier_5 VARCHAR(20),
    other_provider_identifier_type_code_5 VARCHAR(2),
    other_provider_identifier_state_5 VARCHAR(2),
    other_provider_identifier_issuer_5 VARCHAR(80),
	-- Group 6
    other_provider_identifier_6 VARCHAR(20),
    other_provider_identifier_type_code_6 VARCHAR(2),
    other_provider_identifier_state_6 VARCHAR(2),
    other_provider_identifier_issuer_6 VARCHAR(80),

-- Group 7
    other_provider_identifier_7 VARCHAR(20),
    other_provider_identifier_type_code_7 VARCHAR(2),
    other_provider_identifier_state_7 VARCHAR(2),
    other_provider_identifier_issuer_7 VARCHAR(80),

-- Group 8
    other_provider_identifier_8 VARCHAR(20),
    other_provider_identifier_type_code_8 VARCHAR(2),
    other_provider_identifier_state_8 VARCHAR(2),
    other_provider_identifier_issuer_8 VARCHAR(80),

-- Group 9
    other_provider_identifier_9 VARCHAR(20),
    other_provider_identifier_type_code_9 VARCHAR(2),
    other_provider_identifier_state_9 VARCHAR(2),
    other_provider_identifier_issuer_9 VARCHAR(80),

-- Group 10
    other_provider_identifier_10 VARCHAR(20),
    other_provider_identifier_type_code_10 VARCHAR(2),
    other_provider_identifier_state_10 VARCHAR(2),
    other_provider_identifier_issuer_10 VARCHAR(80),

-- Group 11
    other_provider_identifier_11 VARCHAR(20),
    other_provider_identifier_type_code_11 VARCHAR(2),
    other_provider_identifier_state_11 VARCHAR(2),
    other_provider_identifier_issuer_11 VARCHAR(80),

-- Group 12
    other_provider_identifier_12 VARCHAR(20),
    other_provider_identifier_type_code_12 VARCHAR(2),
    other_provider_identifier_state_12 VARCHAR(2),
    other_provider_identifier_issuer_12 VARCHAR(80),

-- Group 13
    other_provider_identifier_13 VARCHAR(20),
    other_provider_identifier_type_code_13 VARCHAR(2),
    other_provider_identifier_state_13 VARCHAR(2),
    other_provider_identifier_issuer_13 VARCHAR(80),

-- Group 14
    other_provider_identifier_14 VARCHAR(20),
    other_provider_identifier_type_code_14 VARCHAR(2),
    other_provider_identifier_state_14 VARCHAR(2),
    other_provider_identifier_issuer_14 VARCHAR(80),

-- Group 15
    other_provider_identifier_15 VARCHAR(20),
    other_provider_identifier_type_code_15 VARCHAR(2),
    other_provider_identifier_state_15 VARCHAR(2),
    other_provider_identifier_issuer_15 VARCHAR(80),

-- Group 16
    other_provider_identifier_16 VARCHAR(20),
    other_provider_identifier_type_code_16 VARCHAR(2),
    other_provider_identifier_state_16 VARCHAR(2),
    other_provider_identifier_issuer_16 VARCHAR(80),

-- Group 17
    other_provider_identifier_17 VARCHAR(20),
    other_provider_identifier_type_code_17 VARCHAR(2),
    other_provider_identifier_state_17 VARCHAR(2),
    other_provider_identifier_issuer_17 VARCHAR(80),

-- Group 18
    other_provider_identifier_18 VARCHAR(20),
    other_provider_identifier_type_code_18 VARCHAR(2),
    other_provider_identifier_state_18 VARCHAR(2),
    other_provider_identifier_issuer_18 VARCHAR(80),

-- Group 19
    other_provider_identifier_19 VARCHAR(20),
    other_provider_identifier_type_code_19 VARCHAR(2),
    other_provider_identifier_state_19 VARCHAR(2),
    other_provider_identifier_issuer_19 VARCHAR(80),

-- Group 20
    other_provider_identifier_20 VARCHAR(20),
    other_provider_identifier_type_code_20 VARCHAR(2),
    other_provider_identifier_state_20 VARCHAR(2),
    other_provider_identifier_issuer_20 VARCHAR(80),

-- Group 21
    other_provider_identifier_21 VARCHAR(20),
    other_provider_identifier_type_code_21 VARCHAR(2),
    other_provider_identifier_state_21 VARCHAR(2),
    other_provider_identifier_issuer_21 VARCHAR(80),

-- Group 22
    other_provider_identifier_22 VARCHAR(20),
    other_provider_identifier_type_code_22 VARCHAR(2),
    other_provider_identifier_state_22 VARCHAR(2),
    other_provider_identifier_issuer_22 VARCHAR(80),

-- Group 23
    other_provider_identifier_23 VARCHAR(20),
    other_provider_identifier_type_code_23 VARCHAR(2),
    other_provider_identifier_state_23 VARCHAR(2),
    other_provider_identifier_issuer_23 VARCHAR(80),

-- Group 24
    other_provider_identifier_24 VARCHAR(20),
    other_provider_identifier_type_code_24 VARCHAR(2),
    other_provider_identifier_state_24 VARCHAR(2),
    other_provider_identifier_issuer_24 VARCHAR(80),

-- Group 25
    other_provider_identifier_25 VARCHAR(20),
    other_provider_identifier_type_code_25 VARCHAR(2),
    other_provider_identifier_state_25 VARCHAR(2),
    other_provider_identifier_issuer_25 VARCHAR(80),

-- Group 26
    other_provider_identifier_26 VARCHAR(20),
    other_provider_identifier_type_code_26 VARCHAR(2),
    other_provider_identifier_state_26 VARCHAR(2),
    other_provider_identifier_issuer_26 VARCHAR(80),

-- Group 27
    other_provider_identifier_27 VARCHAR(20),
    other_provider_identifier_type_code_27 VARCHAR(2),
    other_provider_identifier_state_27 VARCHAR(2),
    other_provider_identifier_issuer_27 VARCHAR(80),

-- Group 28
    other_provider_identifier_28 VARCHAR(20),
    other_provider_identifier_type_code_28 VARCHAR(2),
    other_provider_identifier_state_28 VARCHAR(2),
    other_provider_identifier_issuer_28 VARCHAR(80),

-- Group 29
    other_provider_identifier_29 VARCHAR(20),
    other_provider_identifier_type_code_29 VARCHAR(2),
    other_provider_identifier_state_29 VARCHAR(2),
    other_provider_identifier_issuer_29 VARCHAR(80),

-- Group 30
    other_provider_identifier_30 VARCHAR(20),
    other_provider_identifier_type_code_30 VARCHAR(2),
    other_provider_identifier_state_30 VARCHAR(2),
    other_provider_identifier_issuer_30 VARCHAR(80),

-- Group 31
    other_provider_identifier_31 VARCHAR(20),
    other_provider_identifier_type_code_31 VARCHAR(2),
    other_provider_identifier_state_31 VARCHAR(2),
    other_provider_identifier_issuer_31 VARCHAR(80),

-- Group 32
    other_provider_identifier_32 VARCHAR(20),
    other_provider_identifier_type_code_32 VARCHAR(2),
    other_provider_identifier_state_32 VARCHAR(2),
    other_provider_identifier_issuer_32 VARCHAR(80),

-- Group 33
    other_provider_identifier_33 VARCHAR(20),
    other_provider_identifier_type_code_33 VARCHAR(2),
    other_provider_identifier_state_33 VARCHAR(2),
    other_provider_identifier_issuer_33 VARCHAR(80),

-- Group 34
    other_provider_identifier_34 VARCHAR(20),
    other_provider_identifier_type_code_34 VARCHAR(2),
    other_provider_identifier_state_34 VARCHAR(2),
    other_provider_identifier_issuer_34 VARCHAR(80),

-- Group 35
    other_provider_identifier_35 VARCHAR(20),
    other_provider_identifier_type_code_35 VARCHAR(2),
    other_provider_identifier_state_35 VARCHAR(2),
    other_provider_identifier_issuer_35 VARCHAR(80),

-- Group 36
    other_provider_identifier_36 VARCHAR(20),
    other_provider_identifier_type_code_36 VARCHAR(2),
    other_provider_identifier_state_36 VARCHAR(2),
    other_provider_identifier_issuer_36 VARCHAR(80),

-- Group 37
    other_provider_identifier_37 VARCHAR(20),
    other_provider_identifier_type_code_37 VARCHAR(2),
    other_provider_identifier_state_37 VARCHAR(2),
    other_provider_identifier_issuer_37 VARCHAR(80),

-- Group 38
    other_provider_identifier_38 VARCHAR(20),
    other_provider_identifier_type_code_38 VARCHAR(2),
    other_provider_identifier_state_38 VARCHAR(2),
    other_provider_identifier_issuer_38 VARCHAR(80),

-- Group 39
    other_provider_identifier_39 VARCHAR(20),
    other_provider_identifier_type_code_39 VARCHAR(2),
    other_provider_identifier_state_39 VARCHAR(2),
    other_provider_identifier_issuer_39 VARCHAR(80),

-- Group 40
    other_provider_identifier_40 VARCHAR(20),
    other_provider_identifier_type_code_40 VARCHAR(2),
    other_provider_identifier_state_40 VARCHAR(2),
    other_provider_identifier_issuer_40 VARCHAR(80),

-- Group 41
    other_provider_identifier_41 VARCHAR(20),
    other_provider_identifier_type_code_41 VARCHAR(2),
    other_provider_identifier_state_41 VARCHAR(2),
    other_provider_identifier_issuer_41 VARCHAR(80),

-- Group 42
    other_provider_identifier_42 VARCHAR(20),
    other_provider_identifier_type_code_42 VARCHAR(2),
    other_provider_identifier_state_42 VARCHAR(2),
    other_provider_identifier_issuer_42 VARCHAR(80),

-- Group 43
    other_provider_identifier_43 VARCHAR(20),
    other_provider_identifier_type_code_43 VARCHAR(2),
    other_provider_identifier_state_43 VARCHAR(2),
    other_provider_identifier_issuer_43 VARCHAR(80),

-- Group 44
    other_provider_identifier_44 VARCHAR(20),
    other_provider_identifier_type_code_44 VARCHAR(2),
    other_provider_identifier_state_44 VARCHAR(2),
    other_provider_identifier_issuer_44 VARCHAR(80),

-- Group 45
    other_provider_identifier_45 VARCHAR(20),
    other_provider_identifier_type_code_45 VARCHAR(2),
    other_provider_identifier_state_45 VARCHAR(2),
    other_provider_identifier_issuer_45 VARCHAR(80),

-- Group 46
    other_provider_identifier_46 VARCHAR(20),
    other_provider_identifier_type_code_46 VARCHAR(2),
    other_provider_identifier_state_46 VARCHAR(2),
    other_provider_identifier_issuer_46 VARCHAR(80),

-- Group 47
    other_provider_identifier_47 VARCHAR(20),
    other_provider_identifier_type_code_47 VARCHAR(2),
    other_provider_identifier_state_47 VARCHAR(2),
    other_provider_identifier_issuer_47 VARCHAR(80),

-- Group 48
    other_provider_identifier_48 VARCHAR(20),
    other_provider_identifier_type_code_48 VARCHAR(2),
    other_provider_identifier_state_48 VARCHAR(2),
    other_provider_identifier_issuer_48 VARCHAR(80),

-- Group 49
    other_provider_identifier_49 VARCHAR(20),
    other_provider_identifier_type_code_49 VARCHAR(2),
    other_provider_identifier_state_49 VARCHAR(2),
    other_provider_identifier_issuer_49 VARCHAR(80),

-- Group 50
    other_provider_identifier_50 VARCHAR(20),
    other_provider_identifier_type_code_50 VARCHAR(2),
    other_provider_identifier_state_50 VARCHAR(2),
    other_provider_identifier_issuer_50 VARCHAR(80),
	    -- ============================
    -- Organization / Group Fields
    -- ============================
    is_sole_proprietor VARCHAR(1),
    is_organization_subpart VARCHAR(1),
    parent_organization_lbn VARCHAR(100),
    parent_organization_tin VARCHAR(9),

    authorized_official_name_prefix_text VARCHAR(5),
    authorized_official_name_suffix_text VARCHAR(5),
    authorized_official_credential_text VARCHAR(20),

    healthcare_provider_taxonomy_group_1 VARCHAR(50),
    healthcare_provider_taxonomy_group_2 VARCHAR(50),
    healthcare_provider_taxonomy_group_3 VARCHAR(50),
    healthcare_provider_taxonomy_group_4 VARCHAR(50),
    healthcare_provider_taxonomy_group_5 VARCHAR(50),
    healthcare_provider_taxonomy_group_6 VARCHAR(50),
    healthcare_provider_taxonomy_group_7 VARCHAR(50),
    healthcare_provider_taxonomy_group_8 VARCHAR(50),
    healthcare_provider_taxonomy_group_9 VARCHAR(50),
    healthcare_provider_taxonomy_group_10 VARCHAR(50),
    healthcare_provider_taxonomy_group_11 VARCHAR(50),
    healthcare_provider_taxonomy_group_12 VARCHAR(50),
    healthcare_provider_taxonomy_group_13 VARCHAR(50),
    healthcare_provider_taxonomy_group_14 VARCHAR(50),
    healthcare_provider_taxonomy_group_15 VARCHAR(50),

    certification_date DATE
);

COMMIT;