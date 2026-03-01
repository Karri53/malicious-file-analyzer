-- Snowflake Database Setup Script
-- Malicious File Analyzer
-- Run this in Snowflake Web UI

-- Create database
CREATE DATABASE IF NOT EXISTS MALWARE_ANALYZER_DB;
USE DATABASE MALWARE_ANALYZER_DB;

-- Create schema
CREATE SCHEMA IF NOT EXISTS ANALYSIS_DATA;
USE SCHEMA ANALYSIS_DATA;

-- Create warehouse (if not provided by university)
CREATE WAREHOUSE IF NOT EXISTS COMPUTE_WH
  WAREHOUSE_SIZE = 'XSMALL'
  AUTO_SUSPEND = 300
  AUTO_RESUME = TRUE
  INITIALLY_SUSPENDED = TRUE;

-- Use the warehouse
USE WAREHOUSE COMPUTE_WH;

-- Table 1: Main scan results
CREATE TABLE IF NOT EXISTS scan_results (
    scan_id VARCHAR(100) PRIMARY KEY,
    filename VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size_bytes INTEGER,
    upload_timestamp TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
    malicious_score FLOAT NOT NULL,
    severity VARCHAR(50) NOT NULL,
    analysis_duration_seconds FLOAT,
    source_method VARCHAR(20), -- 'email', 'url', or 'upload'
    user_ip VARCHAR(50),
    processing_status VARCHAR(50) DEFAULT 'completed'
);

-- Table 2: Individual indicators found in scans
CREATE TABLE IF NOT EXISTS indicators (
    indicator_id VARCHAR(100) PRIMARY KEY,
    scan_id VARCHAR(100) NOT NULL,
    indicator_type VARCHAR(50) NOT NULL, -- 'url', 'ip_address', 'email', 'hash', 'crypto'
    indicator_value VARCHAR(2000) NOT NULL,
    confidence FLOAT DEFAULT 1.0,
    created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
    FOREIGN KEY (scan_id) REFERENCES scan_results(scan_id)
);

-- Table 3: Email-specific data
CREATE TABLE IF NOT EXISTS email_sources (
    email_source_id VARCHAR(100) PRIMARY KEY,
    scan_id VARCHAR(100) NOT NULL,
    sender_email VARCHAR(500),
    recipient_email VARCHAR(500),
    subject VARCHAR(1000),
    received_at TIMESTAMP_NTZ,
    attachment_count INTEGER,
    FOREIGN KEY (scan_id) REFERENCES scan_results(scan_id)
);

-- Table 4: URL-specific data
CREATE TABLE IF NOT EXISTS url_sources (
    url_source_id VARCHAR(100) PRIMARY KEY,
    scan_id VARCHAR(100) NOT NULL,
    original_url VARCHAR(2000),
    download_status VARCHAR(50),
    download_time_seconds FLOAT,
    created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
    FOREIGN KEY (scan_id) REFERENCES scan_results(scan_id)
);

-- Table 5: File metadata
CREATE TABLE IF NOT EXISTS file_metadata (
    metadata_id VARCHAR(100) PRIMARY KEY,
    scan_id VARCHAR(100) NOT NULL,
    metadata_key VARCHAR(200) NOT NULL,
    metadata_value VARCHAR(5000),
    created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
    FOREIGN KEY (scan_id) REFERENCES scan_results(scan_id)
);

-- Create indexes for common queries
CREATE INDEX idx_scan_timestamp ON scan_results(upload_timestamp);
CREATE INDEX idx_scan_severity ON scan_results(severity);
CREATE INDEX idx_scan_method ON scan_results(source_method);
CREATE INDEX idx_indicator_type ON indicators(indicator_type);
CREATE INDEX idx_indicator_scan ON indicators(scan_id);

-- Create views for analytics

-- View 1: Summary statistics
CREATE OR REPLACE VIEW scan_statistics AS
SELECT 
    COUNT(*) as total_scans,
    COUNT(DISTINCT DATE_TRUNC('day', upload_timestamp)) as active_days,
    AVG(malicious_score) as avg_score,
    COUNT(CASE WHEN severity = 'High Severity' THEN 1 END) as high_severity_count,
    COUNT(CASE WHEN severity = 'Moderate Severity' THEN 1 END) as moderate_severity_count,
    COUNT(CASE WHEN severity = 'Low Severity' THEN 1 END) as low_severity_count,
    COUNT(CASE WHEN source_method = 'email' THEN 1 END) as email_scans,
    COUNT(CASE WHEN source_method = 'url' THEN 1 END) as url_scans,
    COUNT(CASE WHEN source_method = 'upload' THEN 1 END) as upload_scans
FROM scan_results;

-- View 2: Recent high-risk scans
CREATE OR REPLACE VIEW recent_high_risk AS
SELECT 
    s.scan_id,
    s.filename,
    s.malicious_score,
    s.severity,
    s.upload_timestamp,
    s.source_method,
    COUNT(i.indicator_id) as indicator_count
FROM scan_results s
LEFT JOIN indicators i ON s.scan_id = i.scan_id
WHERE s.severity = 'High Severity'
  AND s.upload_timestamp >= DATEADD(day, -7, CURRENT_TIMESTAMP())
GROUP BY s.scan_id, s.filename, s.malicious_score, s.severity, s.upload_timestamp, s.source_method
ORDER BY s.upload_timestamp DESC;

-- View 3: Indicator trends
CREATE OR REPLACE VIEW indicator_trends AS
SELECT 
    i.indicator_type,
    COUNT(*) as occurrence_count,
    COUNT(DISTINCT i.scan_id) as scan_count,
    COUNT(DISTINCT i.indicator_value) as unique_values
FROM indicators i
JOIN scan_results s ON i.scan_id = s.scan_id
WHERE s.upload_timestamp >= DATEADD(day, -30, CURRENT_TIMESTAMP())
GROUP BY i.indicator_type
ORDER BY occurrence_count DESC;

-- Grant permissions (adjust role as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ANALYSIS_DATA TO ROLE SYSADMIN;
-- GRANT SELECT ON ALL VIEWS IN SCHEMA ANALYSIS_DATA TO ROLE SYSADMIN;

-- Verify setup
SELECT 'Database setup complete!' as status;
SHOW TABLES;
