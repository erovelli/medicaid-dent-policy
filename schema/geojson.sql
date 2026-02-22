CREATE SCHEMA IF NOT EXISTS geojson;

CREATE TABLE geojson.zip3_codes (
    id SERIAL PRIMARY KEY,
    zip3 TEXT,
    geom GEOMETRY(MultiPolygon, 4326)
);