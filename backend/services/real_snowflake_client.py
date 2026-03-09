"""
Real Snowflake Client Implementation
Connects to actual Snowflake database for malware analysis results storage
"""

import snowflake.connector
import os
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)


class RealSnowflakeClient:
    """
    Production Snowflake client with connection pooling and error handling.
    Stores malware analysis results in OPULENCE_DB.ANALYSIS_DATA schema.
    """
    
    def __init__(self):
        """Initialize connection to Snowflake using environment variables."""
        self.account = os.getenv('SNOWFLAKE_ACCOUNT')
        self.user = os.getenv('SNOWFLAKE_USER')
        self.password = os.getenv('SNOWFLAKE_PASSWORD')
        self.warehouse = os.getenv('SNOWFLAKE_WAREHOUSE')
        self.database = os.getenv('SNOWFLAKE_DATABASE')
        self.schema = os.getenv('SNOWFLAKE_SCHEMA')
        self.role = os.getenv('SNOWFLAKE_ROLE')
        
        # Validate all required credentials are present
        if not all([self.account, self.user, self.password, self.warehouse, 
                   self.database, self.schema]):
            raise ValueError(
                "Missing required Snowflake credentials in environment variables. "
                "Check .env file."
            )
        
        self.connection = None
        self._connect()
    
    def _connect(self):
        """Establish connection to Snowflake."""
        try:
            self.connection = snowflake.connector.connect(
                account=self.account,
                user=self.user,
                password=self.password,
                warehouse=self.warehouse,
                database=self.database,
                schema=self.schema,
                role=self.role
            )
            logger.info(f"Connected to Snowflake: {self.database}.{self.schema}")
        except Exception as e:
            logger.error(f"Failed to connect to Snowflake: {str(e)}")
            raise
    
    def _get_cursor(self):
        """Get a cursor, reconnecting if necessary."""
        if self.connection is None or self.connection.is_closed():
            self._connect()
        return self.connection.cursor()
    
    def insert_scan_result(self, scan_data: dict) -> str:
        """
        Insert a scan result into the scan_results table.
        
        Args:
            scan_data: Dictionary containing scan information
                Required keys: filename, malicious_score, severity
                Optional keys: file_type, file_size_bytes, analysis_duration_seconds,
                              source_method, user_ip, processing_status
        
        Returns:
            str: The scan_id of the inserted record
        """
        scan_id = str(uuid.uuid4())
        
        query = """
        INSERT INTO scan_results (
            scan_id, filename, file_type, file_size_bytes, upload_timestamp,
            malicious_score, severity, analysis_duration_seconds, 
            source_method, user_ip, processing_status
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        )
        """
        
        values = (
            scan_id,
            scan_data['filename'],
            scan_data.get('file_type'),
            scan_data.get('file_size_bytes'),
            datetime.utcnow(),
            scan_data['malicious_score'],
            scan_data['severity'],
            scan_data.get('analysis_duration_seconds'),
            scan_data.get('source_method', 'upload'),
            scan_data.get('user_ip'),
            scan_data.get('processing_status', 'completed')
        )
        
        cursor = self._get_cursor()
        try:
            cursor.execute(query, values)
            self.connection.commit()
            logger.info(f"Inserted scan result: {scan_id}")
            return scan_id
        except Exception as e:
            self.connection.rollback()
            logger.error(f"Failed to insert scan result: {str(e)}")
            raise
        finally:
            cursor.close()
    
    def insert_indicators(self, scan_id: str, indicators: list) -> int:
        """
        Insert multiple indicators for a scan.
        
        Args:
            scan_id: The scan ID these indicators belong to
            indicators: List of dicts with keys: indicator_type, indicator_value, confidence
        
        Returns:
            int: Number of indicators inserted
        """
        if not indicators:
            return 0
        
        query = """
        INSERT INTO indicators (
            indicator_id, scan_id, indicator_type, indicator_value, 
            confidence, created_at
        ) VALUES (
            %s, %s, %s, %s, %s, %s
        )
        """
        
        cursor = self._get_cursor()
        try:
            for indicator in indicators:
                values = (
                    str(uuid.uuid4()),
                    scan_id,
                    indicator['indicator_type'],
                    indicator['indicator_value'],
                    indicator.get('confidence', 1.0),
                    datetime.utcnow()
                )
                cursor.execute(query, values)
            
            self.connection.commit()
            logger.info(f"Inserted {len(indicators)} indicators for scan {scan_id}")
            return len(indicators)
        except Exception as e:
            self.connection.rollback()
            logger.error(f"Failed to insert indicators: {str(e)}")
            raise
        finally:
            cursor.close()
    
    def insert_email_source(self, scan_id: str, email_data: dict) -> str:
        """Insert email source information."""
        email_source_id = str(uuid.uuid4())
        
        query = """
        INSERT INTO email_sources (
            email_source_id, scan_id, sender_email, recipient_email,
            subject, received_at, attachment_count
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s
        )
        """
        
        values = (
            email_source_id,
            scan_id,
            email_data.get('sender_email'),
            email_data.get('recipient_email'),
            email_data.get('subject'),
            email_data.get('received_at'),
            email_data.get('attachment_count', 1)
        )
        
        cursor = self._get_cursor()
        try:
            cursor.execute(query, values)
            self.connection.commit()
            logger.info(f"Inserted email source: {email_source_id}")
            return email_source_id
        except Exception as e:
            self.connection.rollback()
            logger.error(f"Failed to insert email source: {str(e)}")
            raise
        finally:
            cursor.close()
    
    def insert_url_source(self, scan_id: str, url_data: dict) -> str:
        """Insert URL source information."""
        url_source_id = str(uuid.uuid4())
        
        query = """
        INSERT INTO url_sources (
            url_source_id, scan_id, original_url, download_status,
            download_time_seconds, created_at
        ) VALUES (
            %s, %s, %s, %s, %s, %s
        )
        """
        
        values = (
            url_source_id,
            scan_id,
            url_data.get('original_url'),
            url_data.get('download_status', 'success'),
            url_data.get('download_time_seconds'),
            datetime.utcnow()
        )
        
        cursor = self._get_cursor()
        try:
            cursor.execute(query, values)
            self.connection.commit()
            logger.info(f"Inserted URL source: {url_source_id}")
            return url_source_id
        except Exception as e:
            self.connection.rollback()
            logger.error(f"Failed to insert URL source: {str(e)}")
            raise
        finally:
            cursor.close()
    
    def insert_file_metadata(self, scan_id: str, metadata: dict) -> int:
        """
        Insert file metadata key-value pairs.
        
        Args:
            scan_id: The scan ID this metadata belongs to
            metadata: Dictionary of metadata key-value pairs
        
        Returns:
            int: Number of metadata entries inserted
        """
        if not metadata:
            return 0
        
        query = """
        INSERT INTO file_metadata (
            metadata_id, scan_id, metadata_key, metadata_value, created_at
        ) VALUES (
            %s, %s, %s, %s, %s
        )
        """
        
        cursor = self._get_cursor()
        try:
            count = 0
            for key, value in metadata.items():
                values = (
                    str(uuid.uuid4()),
                    scan_id,
                    key,
                    str(value),
                    datetime.utcnow()
                )
                cursor.execute(query, values)
                count += 1
            
            self.connection.commit()
            logger.info(f"Inserted {count} metadata entries for scan {scan_id}")
            return count
        except Exception as e:
            self.connection.rollback()
            logger.error(f"Failed to insert metadata: {str(e)}")
            raise
        finally:
            cursor.close()
    
    def get_scan_by_id(self, scan_id: str) -> dict:
        """Retrieve a scan result by ID."""
        query = "SELECT * FROM scan_results WHERE scan_id = %s"
        
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
    
    def get_recent_scans(self, limit: int = 10) -> list:
        """Retrieve the most recent scans."""
        query = """
        SELECT * FROM scan_results 
        ORDER BY upload_timestamp DESC 
        LIMIT %s
        """
        
        cursor = self._get_cursor()
        try:
            cursor.execute(query, (limit,))
            results = cursor.fetchall()
            
            columns = [desc[0] for desc in cursor.description]
            return [dict(zip(columns, row)) for row in results]
        finally:
            cursor.close()
    
    def get_indicators_for_scan(self, scan_id: str) -> list:
        """Retrieve all indicators for a specific scan."""
        query = "SELECT * FROM indicators WHERE scan_id = %s"
        
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


# Factory function
def get_snowflake_client():
    """
    Factory function to get Snowflake client based on environment.
    Returns RealSnowflakeClient if all credentials are present.
    """
    try:
        return RealSnowflakeClient()
    except Exception as e:
        logger.error(f"Failed to create Snowflake client: {str(e)}")
        raise
