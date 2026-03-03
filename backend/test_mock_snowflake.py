"""Test mock Snowflake client"""

from services.snowflake_client import get_snowflake_client
import uuid

def test_mock_snowflake():
    """Test mock Snowflake operations"""
    
    # Initialize client
    sf = get_snowflake_client()
    print("✓ Snowflake client initialized")
    
    # Create test scan data
    scan_id = str(uuid.uuid4())
    scan_data = {
        'scan_id': scan_id,
        'filename': 'test-document.pdf',
        'file_type': '.pdf',
        'file_hash': 'abc123def456',
        'malicious_score': 0.75,
        'severity': 'High Severity',
        'source_method': 'email',
        'analysis_duration': 2.5,
        'email_data': {
            'sender': 'test@example.com',
            'subject': 'Suspicious attachment'
        },
        'indicators': [
            {'type': 'url', 'value': 'http://malicious-site.com'},
            {'type': 'ip_address', 'value': '192.168.1.1'},
            {'type': 'email', 'value': 'attacker@evil.com'},
            {'type': 'crypto_address', 'value': '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'}
        ]
    }
    
    # Test save
    result = sf.save_scan_result(scan_data)
    print(f"✓ Save result: {result}")
    assert result['success'] == True, "Save failed"
    assert result['indicators_saved'] == 4, f"Expected 4 indicators, got {result['indicators_saved']}"
    
    # Test retrieve by ID
    retrieved = sf.get_scan_by_id(scan_id)
    print(f"✓ Retrieved scan: {retrieved['filename']}")
    assert retrieved is not None, "Scan not found"
    assert retrieved['filename'] == 'test-document.pdf', "Filename mismatch"
    assert len(retrieved['indicators']) == 4, f"Expected 4 indicators, got {len(retrieved['indicators'])}"
    assert 'email_source' in retrieved, "Email source data missing"
    
    # Test recent scans
    recent = sf.get_recent_scans(limit=5)
    print(f"✓ Recent scans: {len(recent)} found")
    assert len(recent) >= 1, "No recent scans found"
    
    # Test statistics
    stats = sf.get_scan_statistics()
    print(f"✓ Statistics: Total={stats['total_scans']}, High={stats['high_severity']}, Indicators={stats['total_indicators']}")
    assert stats['total_scans'] >= 1, "Statistics incorrect"
    assert stats['high_severity'] >= 1, "High severity count incorrect"
    assert stats['total_indicators'] == 4, f"Expected 4 indicators, got {stats['total_indicators']}"
    
    print("\n✅ All mock Snowflake tests passed!")

if __name__ == '__main__':
    test_mock_snowflake()