"""
Snowflake Database Client - Mock Implementation
Simulates Snowflake operations using in-memory storage for testing.
Will be replaced with real snowflake-connector-python once credentials available.
"""

import logging
from datetime import datetime
from typing import Dict, List, Optional
import uuid

logger = logging.getLogger(__name__)


class MockSnowflakeClient:
    """
    Mock Snowflake client for development without credentials.
    Stores data in memory (simulates database tables).
    """
    
    def __init__(self):
        """Initialize mock Snowflake client with in-memory tables"""
        # Simulate tables as dictionaries and lists
        self.scan_results = {}  # scan_id -> scan record
        self.indicators = []     # list of indicator records
        self.email_sources = {}  # scan_id -> email source record
        self.url_sources = {}    # scan_id -> url source record
        self.file_metadata = []  # list of metadata records
        
        logger.info("MockSnowflakeClient initialized (using in-memory storage)")
    
    def save_scan_result(self, scan_data: Dict) -> Dict:
        """
        Save a complete scan result to database
        
        Args:
            scan_data (dict): Complete scan information including:
                - scan_id: Unique identifier
                - filename: Original filename
                - file_type: File extension
                - file_hash: SHA256 hash
                - malicious_score: Score 0.0-1.0
                - severity: Low/Moderate/High Severity
                - indicators: List of found indicators
                - source_method: email/url/upload
                - email_data: Email metadata (if source_method=email)
                - url_data: URL metadata (if source_method=url)
                
        Returns:
            dict: Result with success status and scan_id
        """
        scan_id = scan_data.get('scan_id')
        
        # Save main scan record
        self.scan_results[scan_id] = {
            'scan_id': scan_id,
            'filename': scan_data.get('filename'),
            'file_type': scan_data.get('file_type'),
            'file_hash': scan_data.get('file_hash'),
            'malicious_score': scan_data.get('malicious_score'),
            'severity': scan_data.get('severity'),
            'upload_timestamp': datetime.now().isoformat(),
            'source_method': scan_data.get('source_method', 'unknown'),
            'analysis_duration': scan_data.get('analysis_duration', 0)
        }
        
        # Save indicators
        indicators_saved = 0
        for indicator in scan_data.get('indicators', []):
            self.indicators.append({
                'indicator_id': str(uuid.uuid4()),
                'scan_id': scan_id,
                'indicator_type': indicator.get('type'),
                'indicator_value': indicator.get('value'),
                'created_at': datetime.now().isoformat()
            })
            indicators_saved += 1
        
        # Save source-specific data
        if scan_data.get('source_method') == 'email':
            email_data = scan_data.get('email_data', {})
            self.email_sources[scan_id] = {
                'email_source_id': str(uuid.uuid4()),
                'scan_id': scan_id,
                'sender_email': email_data.get('sender'),
                'subject': email_data.get('subject'),
                'received_at': datetime.now().isoformat()
            }
        elif scan_data.get('source_method') == 'url':
            url_data = scan_data.get('url_data', {})
            self.url_sources[scan_id] = {
                'url_source_id': str(uuid.uuid4()),
                'scan_id': scan_id,
                'original_url': url_data.get('url'),
                'download_status': 'success',
                'created_at': datetime.now().isoformat()
            }
        
        logger.info(f"[MOCK] Saved scan result: {scan_id} with {indicators_saved} indicators")
        
        return {
            'success': True,
            'scan_id': scan_id,
            'indicators_saved': indicators_saved
        }
    
    def get_scan_by_id(self, scan_id: str) -> Optional[Dict]:
        """
        Retrieve a scan result by ID
        
        Args:
            scan_id (str): Scan identifier
            
        Returns:
            dict: Scan result with indicators, or None if not found
        """
        scan = self.scan_results.get(scan_id)
        
        if scan:
            # Get associated indicators
            scan_indicators = [
                ind for ind in self.indicators 
                if ind['scan_id'] == scan_id
            ]
            scan['indicators'] = scan_indicators
            
            # Get source-specific data
            if scan_id in self.email_sources:
                scan['email_source'] = self.email_sources[scan_id]
            if scan_id in self.url_sources:
                scan['url_source'] = self.url_sources[scan_id]
            
            logger.info(f"[MOCK] Retrieved scan: {scan_id}")
        else:
            logger.warning(f"[MOCK] Scan not found: {scan_id}")
            
        return scan
    
    def get_recent_scans(self, limit: int = 10) -> List[Dict]:
        """
        Get most recent scan results
        
        Args:
            limit (int): Maximum number of results
            
        Returns:
            list: Recent scan results
        """
        scans = list(self.scan_results.values())
        scans.sort(key=lambda x: x['upload_timestamp'], reverse=True)
        
        logger.info(f"[MOCK] Retrieved {len(scans[:limit])} recent scans")
        return scans[:limit]
    
    def get_scan_statistics(self) -> Dict:
        """
        Get overall statistics
        
        Returns:
            dict: Statistics including total scans, severity counts, etc.
        """
        total = len(self.scan_results)
        
        severities = {
            'high': 0,
            'moderate': 0,
            'low': 0
        }
        
        for scan in self.scan_results.values():
            severity = scan.get('severity', '').lower()
            if 'high' in severity:
                severities['high'] += 1
            elif 'moderate' in severity:
                severities['moderate'] += 1
            elif 'low' in severity:
                severities['low'] += 1
        
        stats = {
            'total_scans': total,
            'high_severity': severities['high'],
            'moderate_severity': severities['moderate'],
            'low_severity': severities['low'],
            'total_indicators': len(self.indicators),
            'email_scans': len(self.email_sources),
            'url_scans': len(self.url_sources)
        }
        
        logger.info(f"[MOCK] Statistics retrieved: {total} scans")
        return stats


def get_snowflake_client():
    """
    Returns appropriate Snowflake client based on environment.
    
    Returns:
        SnowflakeClient: Mock or real Snowflake client
    """
    import os
    snowflake_account = os.environ.get('SNOWFLAKE_ACCOUNT')
    
    if snowflake_account:
        # TODO: Import and return real Snowflake client when credentials available
        logger.info("Snowflake credentials detected (real client not yet implemented)")
        return MockSnowflakeClient()
    else:
        logger.info("No Snowflake credentials - using MockSnowflakeClient")
        return MockSnowflakeClient()