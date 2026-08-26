export const INFO_MODAL_TITLE = "CHOMP · Claims History of Oral Healthcare Medicaid Procedures";

export const INFO_MODAL_BODY =
    "CHOMP illustrates the 2018–2024 Medicaid dental claims data released by Health and Human " +
    "Services (HHS) Open Data on February 8th, 2026. We used the National Plan and Provider " +
    "Enumeration System (NPPES) to connect each claim to a ZIP3, enabling a geographical view " +
    "of the data. Medicaid dental coverage varies from state-to-state, with some states covering " +
    "different populations and different procedures. This may account for some level of the " +
    "perceived trends seen on this site. Our intention is to transform a massive dataset into " +
    "digestible, actionable insights at the local, state, and national level. We hope this tool " +
    "and the corresponding framework to organize the data can be useful for policymakers, " +
    "providers, researchers, and all others interested in improving oral and systemic health.";

export const INFO_MODAL_NOTES: string[] = [
    "HHS cell-suppresses any code-month under 12 claims or 12 unique beneficiaries.",
    "Geography floored at ZIP3 to prevent provider-level re-identification.",
    "Per-enrollee denominator uses 5-year pooled ACS C27007.",
    "Attribution to the servicing provider's practice address, not the patient's residence.",
    "0.1% of claims dropped for missing NPIs.",
    "County and state maps exclude ~3% of rows with malformed servicing IDs, addresses that failed to geocode, and U.S. territories without standard county FIPS.",
];
