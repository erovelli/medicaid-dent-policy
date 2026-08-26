import { INFO_MODAL_BODY, INFO_MODAL_NOTES } from "./infoModal";

export const NAV_PAGES = ["project", "data", "team", "credits", "contact"] as const;
export type NavPage = (typeof NAV_PAGES)[number];

export const NAV_LABELS: Record<NavPage, string> = {
    project: "Project",
    data: "Data",
    team: "Team",
    credits: "Credits",
    contact: "Contact",
};

export const REPO_URL = "https://github.com/erovelli/CHOMP";

export type PageSection =
    | { kind: "paragraph"; body: string }
    | { kind: "list"; heading?: string; items: readonly string[] }
    | { kind: "links"; heading?: string; items: readonly { label: string; href: string }[] }
    | { kind: "rule" }
    | {
          kind: "people";
          items: readonly { name: string; photo?: string }[];
      };

export interface PageContent {
    title: string;
    lede?: string;
    sections: readonly PageSection[];
}

export const PAGE_CONTENT: Record<NavPage, PageContent> = {
    project: {
        title: "About the project",
        sections: [{ kind: "paragraph", body: INFO_MODAL_BODY }],
    },
    data: {
        title: "Data & methodology",
        sections: [
            {
                kind: "links",
                items: [
                    {
                        label: "Data dictionary",
                        href: `${REPO_URL}/blob/main/docs/DATA_DICTIONARY.md`,
                    },
                    {
                        label: "Known limitations",
                        href: `${REPO_URL}/blob/main/docs/LIMITATIONS.md`,
                    },
                    {
                        label: "Architecture notes",
                        href: `${REPO_URL}/blob/main/docs/ARCHITECTURE.md`,
                    },
                ],
            },
            { kind: "list", heading: "Important notes", items: INFO_MODAL_NOTES },
        ],
    },
    team: {
        title: "Team",
        sections: [
            {
                kind: "people",
                items: [
                    { name: "Kenneth Liu" },
                    { name: "Clark Morgan" },
                    { name: "Samat Borbiev" },
                    { name: "Ningsheng Zhao" },
                    { name: "Md Shahinoor Rahman" },
                    { name: "Evan Rovelli" },
                    { name: "Matt Ngaw" },
                    { name: "Jake Gilbert" },
                    { name: "Hawazin Elani" },
                ],
            },
        ],
    },
    credits: {
        title: "Credits & acknowledgments",
        sections: [
            {
                kind: "links",
                heading: "Data sources",
                items: [
                    {
                        label: "HHS Open Data, Medicaid Provider Spending (2018–2024)",
                        href: "https://opendata.hhs.gov/datasets/medicaid-provider-spending/",
                    },
                    {
                        label: "CMS NPPES",
                        href: "https://download.cms.gov/nppes/NPI_Files.html",
                    },
                    {
                        label: "NBER NPPES historical archives",
                        href: "https://data.nber.org/npi/zip/",
                    },
                    {
                        label: "CMS Medicaid DQ Atlas",
                        href: "https://www.medicaid.gov/dq-atlas/welcome",
                    },
                    {
                        label: "U.S. Census ACS, table B27007",
                        href: "https://data.census.gov/table/ACSST1Y2023.S2704",
                    },
                ],
            },
            {
                kind: "links",
                heading: "Geographies",
                items: [
                    {
                        label: "U.S. Census TIGER/Line 2023",
                        href: "https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html",
                    },
                    {
                        label: "U.S. Department of State, Office of the Geographer, Large Scale International Boundaries (LSIB)",
                        href: "https://geodata.state.gov/geonetwork/srv/api/records/3bdb81a0-c1b9-439a-a0b1-85dac30c59b2",
                    },
                ],
            },
            {
                kind: "paragraph",
                body: "CDT Code on Dental Procedures and Nomenclature © American Dental Association. All rights reserved. CHOMP displays procedure spending grouped by CDT division and does not reproduce individual CDT codes or procedure-level descriptions.",
            },
            {
                kind: "links",
                items: [
                    {
                        label: "ADA CDT licensing",
                        href: "https://www.ada.org/publications/ada-store-products/licensing-for-commercial-users",
                    },
                ],
            },
            { kind: "rule" },
            {
                kind: "links",
                heading: "Software & basemap",
                items: [
                    {
                        label: "Third-party licenses",
                        href: `${import.meta.env.BASE_URL}THIRD_PARTY_LICENSES.md`,
                    },
                    {
                        label: "© OpenStreetMap contributors",
                        href: "https://www.openstreetmap.org/copyright",
                    },
                    { label: "Protomaps", href: "https://protomaps.com/" },
                    {
                        label: "MapLibre GL JS (BSD-3-Clause)",
                        href: "https://github.com/maplibre/maplibre-gl-js/blob/main/LICENSE.txt",
                    },
                    { label: "d3-geo", href: "https://github.com/d3/d3-geo" },
                ],
            },
        ],
    },
    contact: {
        title: "Get in touch",
        sections: [
            {
                kind: "links",
                items: [
                    { label: "Report a bug or data issue", href: `${REPO_URL}/issues/new` },
                    { label: "Suggest a feature", href: `${REPO_URL}/issues/new` },
                    { label: "Browse the source", href: REPO_URL },
                ],
            },
            {
                kind: "paragraph",
                body: "For research collaborations, methodology questions, or partnerships that don't fit the issue tracker, reach any team member directly via GitHub.",
            },
        ],
    },
};
