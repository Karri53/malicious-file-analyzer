"""
Snowflake Client Factory
Automatically switches between MockSnowflakeClient and RealSnowflakeClient
based on environment configuration
"""

import os
from typing import Union
import logging

logger = logging.getLogger(__name__)


class MockSnowflakeClient:
    """
    Mock Snowflake client for development and testing.
    Stores data in memory only.
    """
    
    def __init__(self):
        """Initialize mock client with empty storage."""
        self.scans = {}
        self.indicators = {}
        self.email_sources = {}
        self.url_sources = {}
        self.metadata = {}
        logger.info("Mock Snowflake client initialized")
    
    def insert_scan_result(self, scan_data: dict) -> str:
        """Mock insert scan result - stores in memory."""
        import uuid
        scan_id = str(uuid.uuid4())
        self.scans[scan_id] = {
            **scan_data,
            'scan_id': scan_id,
            'upload_timestamp': 'mock_timestamp'
        }
        logger.info(f"[MOCK] Inserted scan result: {scan_id}")
        return scan_id
    
    def insert_indicators(self, scan_id: str, indicators: list) -> int:
        """Mock insert indicators - stores in memory."""
        if scan_id not in self.indicators:
            self.indicators[scan_id] = []
        self.indicators[scan_id].extend(indicators)
        logger.info(f"[MOCK] Inserted {len(indicators)} indicators for scan {scan_id}")
        return len(indicators)
    
    def insert_email_source(self, scan_id: str, email_data: dict) -> str:
        """Mock insert email source."""
        import uuid
        email_source_id = str(uuid.uuid4())
        self.email_sources[email_source_id] = {
            **email_data,
            'scan_id': scan_id
        }
        logger.info(f"[MOCK] Inserted email source: {email_source_id}")
        return email_source_id
    
    def insert_url_source(self, scan_id: str, url_data: dict) -> str:
        """Mock insert URL source."""
        import uuid
        url_source_id = str(uuid.uuid4())
        self.url_sources[url_source_id] = {
            **url_data,
            'scan_id': scan_id
        }
        logger.info(f"[MOCK] Inserted URL source: {url_source_id}")
        return url_source_id
    
    def insert_file_metadata(self, scan_id: str, metadata: dict) -> int:
        """Mock insert file metadata."""
        if scan_id not in self.metadata:
            self.metadata[scan_id] = {}
        self.metadata[scan_id].update(metadata)
        logger.info(f"[MOCK] Inserted {len(metadata)} metadata entries for scan {scan_id}")
        return len(metadata)
    
    def get_scan_by_id(self, scan_id: str) -> dict:
        """Mock get scan by ID."""
        return self.scans.get(scan_id)
    
    def get_recent_scans(self, limit: int = 10) -> list:
        """Mock get recent scans."""
        return list(self.scans.values())[:limit]
    
    def get_indicators_for_scan(self, scan_id: str) -> list:
        """Mock get indicators."""
        return self.indicators.get(scan_id, [])
    
    def close(self):
        """Mock close connection."""
        logger.info("[MOCK] Connection closed")
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()


def get_snowflake_client():
    """
    Smart factory function that returns appropriate Snowflake client.
    
    Returns:
        - RealSnowflakeClient if ENVIRONMENT='production' and credentials exist
        - MockSnowflakeClient otherwise
    
    Usage:
        from services.snowflake_client import get_snowflake_client
        
        with get_snowflake_client() as sf:
            scan_id = sf.insert_scan_result(scan_data)
    """
    environment = os.getenv('ENVIRONMENT', 'development')
    
    # Check if all Snowflake credentials are present
    required_vars = [
        'SNOWFLAKE_ACCOUNT',
        'SNOWFLAKE_USER',
        'SNOWFLAKE_PASSWORD',
        'SNOWFLAKE_WAREHOUSE',
        'SNOWFLAKE_DATABASE',
        'SNOWFLAKE_SCHEMA'
    ]
    
    has_credentials = all(os.getenv(var) for var in required_vars)
    
    # Use real client if environment is production AND credentials exist
    if environment == 'production' and has_credentials:
        try:
            from services.real_snowflake_client import RealSnowflakeClient
            logger.info("Using REAL Snowflake client (production mode)")
            return RealSnowflakeClient()
        except ImportError as e:
            logger.warning(
                f"Could not import RealSnowflakeClient: {e}. "
                "Falling back to MockSnowflakeClient. "
                "Install snowflake-connector-python: pip install snowflake-connector-python"
            )
            return MockSnowflakeClient()
        except Exception as e:
            logger.error(
                f"Failed to initialize RealSnowflakeClient: {e}. "
                "Falling back to MockSnowflakeClient."
            )
            return MockSnowflakeClient()
    else:
        # Use mock client for development or if credentials missing
        if not has_credentials:
            logger.info("Using MOCK Snowflake client (missing credentials)")
        else:
            logger.info("Using MOCK Snowflake client (development mode)")
        return MockSnowflakeClient()
