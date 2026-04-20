"""
Real Snowflake Database Client
Connects to production Snowflake database with MFA support
"""

import os
import logging
import snowflake.connector
from dotenv import load_dotenv
from datetime import datetime
import uuid

load_dotenv()

logger = logging.getLogger(__name__)

class RealSnowflakeClient:
    """
    Production Snowflake database client with MFA/TOTP support.
    
    Usage:
        # With MFA passcode
        client = RealSnowflakeClient(passcode="123456")
        
        # With browser authentication (caches session)
        client = RealSnowflakeClient(use_browser_auth=True)
    """
    
    def __init__(self, passcode=None, use_browser_auth=False):
        """
        Initialize Snowflake connection.
        
        Args:
            passcode (str, optional): 6-digit MFA/TOTP code from authenticator app
            use_browser_auth (bool, optional): Use browser-based authentication
        """
        # Check required environment variables
        required_vars = [
            'SNOWFLAKE_ACCOUNT',
            'SNOWFLAKE_USER',
            'SNOWFLAKE_DATABASE'
        ]
        
        missing = [var for var in required_vars if not os.getenv(var)]
        if missing:
            raise ValueError(
                f"Missing required Snowflake credentials in environment variables. "
                f"Check .env file for: {', '.join(missing)}"
            )
        
        # Build connection parameters
        connection_params = {
            'account': os.getenv('SNOWFLAKE_ACCOUNT'),
            'user': os.getenv('SNOWFLAKE_USER'),
            'warehouse': os.getenv('SNOWFLAKE_WAREHOUSE', 'COMPUTE_WH'),
            'database': os.getenv('SNOWFLAKE_DATABASE'),
            'schema': os.getenv('SNOWFLAKE_SCHEMA', 'PUBLIC'),
        }
        
        # Handle authentication methods
        if use_browser_auth:
            # Browser-based authentication (opens browser, caches session)
            connection_params['authenticator'] = 'externalbrowser'
            logger.info("Using browser-based authentication")
        elif passcode:
            # MFA/TOTP passcode authentication
            connection_params['password'] = os.getenv('SNOWFLAKE_PASSWORD')
            connection_params['passcode'] = passcode
            logger.info("Using password + MFA passcode authentication")
        else:
            # Password-only (will fail if MFA required)
            connection_params['password'] = os.getenv('SNOWFLAKE_PASSWORD')
            logger.info("Using password authentication (MFA may be required)")
        
        try:
            logger.info(f"Connecting to Snowflake account: {connection_params['account']}")
            self.connection = snowflake.connector.connect(**connection_params)
            logger.info(f"✅ Successfully connected to Snowflake database: {connection_params['database']}")
            self.account = connection_params['account']
            self.database = connection_params['database']
        except Exception as e:
            logger.error(f"Failed to connect to Snowflake: {str(e)}")
            raise

    def _get_cursor(self):
        """Get a database cursor."""
        if not self.connection or self.connection.is_closed():
            raise Exception("Snowflake connection is closed")
        return self.connection.cursor()

    def execute_query(self, query, params=None):
        """
        Execute a SQL query and return results.
        
        Args:
            query (str): SQL query to execute
            params (tuple, optional): Query parameters for parameterized queries
            
        Returns:
            list: Query results
        """
        cursor = self._get_cursor()
        try:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            # Fetch results if available
            try:
                results = cursor.fetchall()
                return results
            except:
                # No results to fetch (INSERT, UPDATE, etc.)
                return None
        finally:
            cursor.close()

    def insert_scan_result(self, scan_data):
        """
        Insert a file scan result into the database.
        
        Args:
            scan_data (dict): Scan results to insert
            
        Returns:
            str: Scan ID
        """
        scan_id = str(uuid.uuid4())
        
        query = """
        INSERT INTO FILE_ANALYSES (
            scan_id,
            filename,
            file_type,
            file_size,
            threat_score,
            severity,
            scan_timestamp,
            analysis_duration,
            md5_hash,
            sha256_hash
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        params = (
            scan_id,
            scan_data.get('filename'),
            scan_data.get('file_type'),
            scan_data.get('file_size'),
            scan_data.get('score'),
            scan_data.get('severity'),
            datetime.utcnow(),
            scan_data.get('analysis_time_seconds'),
            scan_data.get('hashes', {}).get('md5'),
            scan_data.get('hashes', {}).get('sha256')
        )
        
        cursor = self._get_cursor()
        try:
            cursor.execute(query, params)
            self.connection.commit()
            logger.info(f"Inserted scan result: {scan_id}")
            
            # Insert indicators
            indicators = scan_data.get('indicators', {})
            self._insert_indicators(scan_id, indicators)
            
            return scan_id
        except Exception as e:
            self.connection.rollback()
            logger.error(f"Failed to insert scan result: {str(e)}")
            raise
        finally:
            cursor.close()

    def _insert_indicators(self, scan_id, indicators):
        """Insert detected indicators for a scan."""
        cursor = self._get_cursor()
        try:
            for indicator_type, values in indicators.items():
                # Skip total_count
                if indicator_type == 'total_count':
                    continue
                
                # Insert each indicator
                if isinstance(values, list):
                    for value in values:
                        query = """
                        INSERT INTO INDICATORS (
                            scan_id,
                            indicator_type,
                            indicator_value,
                            detected_at
                        ) VALUES (%s, %s, %s, %s)
                        """
                        params = (scan_id, indicator_type, str(value), datetime.utcnow())
                        cursor.execute(query, params)
            
            self.connection.commit()
            logger.info(f"Inserted indicators for scan: {scan_id}")
        except Exception as e:
            self.connection.rollback()
            logger.error(f"Failed to insert indicators: {str(e)}")
            raise
        finally:
            cursor.close()

    def get_all_scans(self, limit=100):
        """Retrieve all scan results."""
        query = f"SELECT * FROM FILE_ANALYSES ORDER BY scan_timestamp DESC LIMIT {limit}"
        cursor = self._get_cursor()
        try:
            cursor.execute(query)
            results = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            return [dict(zip(columns, row)) for row in results]
        finally:
            cursor.close()

    def get_scan_by_id(self, scan_id):
        """Retrieve a specific scan by ID."""
        query = "SELECT * FROM FILE_ANALYSES WHERE scan_id = %s"
        cursor = self._get_cursor()
        try:
            cursor.execute(query, (scan_id,))
            result = cursor.fetchone()
            if result:
                columns = [desc[0] for desc in cursor.description]
                return dict(zip(columns, result))
            return None
        finally:
            cursor.close()

    def get_indicators_for_scan(self, scan_id):
        """Retrieve all indicators for a specific scan."""
        query = "SELECT * FROM INDICATORS WHERE scan_id = %s"
        cursor = self._get_cursor()
        try:
            cursor.execute(query, (scan_id,))
            results = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            return [dict(zip(columns, row)) for row in results]
        finally:
            cursor.close()

    def close(self):
        """Close the Snowflake connection."""
        if self.connection and not self.connection.is_closed():
            self.connection.close()
            logger.info("Snowflake connection closed")

    def __enter__(self):
        """Context manager entry."""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()


def get_snowflake_client(passcode=None, use_browser_auth=False):
    """
    Factory function to get production Snowflake client.
    
    Args:
        passcode (str, optional): MFA/TOTP passcode
        use_browser_auth (bool, optional): Use browser authentication
        
    Returns:
        RealSnowflakeClient: Connected client instance
    """
    try:
        return RealSnowflakeClient(passcode=passcode, use_browser_auth=use_browser_auth)
    except Exception as e:
        logger.error(f"Failed to create Snowflake client: {str(e)}")
        raise