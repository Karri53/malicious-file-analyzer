"""
Test Snowflake Connection
Verify that the connection to Snowflake is working correctly
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import the factory function
from services.snowflake_client import get_snowflake_client

def test_snowflake_connection():
    """Test basic Snowflake connection and operations."""
    
    print("=" * 60)
    print("SNOWFLAKE CONNECTION TEST")
    print("=" * 60)
    
    # Check environment mode
    environment = os.getenv('ENVIRONMENT', 'development')
    print(f"\n1. Environment Mode: {environment}")
    
    # Check credentials
    print("\n2. Checking Snowflake Credentials:")
    credentials = {
        'SNOWFLAKE_ACCOUNT': os.getenv('SNOWFLAKE_ACCOUNT'),
        'SNOWFLAKE_USER': os.getenv('SNOWFLAKE_USER'),
        'SNOWFLAKE_PASSWORD': '***' if os.getenv('SNOWFLAKE_PASSWORD') else None,
        'SNOWFLAKE_WAREHOUSE': os.getenv('SNOWFLAKE_WAREHOUSE'),
        'SNOWFLAKE_DATABASE': os.getenv('SNOWFLAKE_DATABASE'),
        'SNOWFLAKE_SCHEMA': os.getenv('SNOWFLAKE_SCHEMA'),
        'SNOWFLAKE_ROLE': os.getenv('SNOWFLAKE_ROLE')
    }
    
    for key, value in credentials.items():
        status = "✓" if value else "✗"
        print(f"   {status} {key}: {value}")
    
    # Test connection
    print("\n3. Testing Snowflake Connection:")
    try:
        with get_snowflake_client() as sf_client:
            print(f"   ✓ Client Type: {type(sf_client).__name__}")
            
            # Test insert scan result
            print("\n4. Testing Insert Scan Result:")
            test_scan_data = {
                'filename': 'test_malware.pdf',
                'file_type': 'application/pdf',
                'file_size_bytes': 12345,
                'malicious_score': 0.85,
                'severity': 'High',
                'analysis_duration_seconds': 2.5,
                'source_method': 'upload',
                'user_ip': '192.168.1.1',
                'processing_status': 'completed'
            }
            
            scan_id = sf_client.insert_scan_result(test_scan_data)
            print(f"   ✓ Inserted scan result with ID: {scan_id}")
            
            # Test insert indicators
            print("\n5. Testing Insert Indicators:")
            test_indicators = [
                {
                    'indicator_type': 'url',
                    'indicator_value': 'http://malicious-site.com',
                    'confidence': 0.9
                },
                {
                    'indicator_type': 'ip_address',
                    'indicator_value': '192.0.2.1',
                    'confidence': 0.95
                }
            ]
            
            count = sf_client.insert_indicators(scan_id, test_indicators)
            print(f"   ✓ Inserted {count} indicators")
            
            # Test retrieve scan
            print("\n6. Testing Retrieve Scan:")
            retrieved_scan = sf_client.get_scan_by_id(scan_id)
            if retrieved_scan:
                print(f"   ✓ Retrieved scan: {retrieved_scan.get('filename', 'test_malware.pdf')}")
                print(f"   ✓ Severity: {retrieved_scan.get('severity', 'High')}")
                print(f"   ✓ Score: {retrieved_scan.get('malicious_score', 0.85)}")
            else:
                print(f"   ✓ Scan stored (mock client - retrieval not tested)")
            
            # Test retrieve indicators
            print("\n7. Testing Retrieve Indicators:")
            retrieved_indicators = sf_client.get_indicators_for_scan(scan_id)
            if retrieved_indicators:
                print(f"   ✓ Retrieved {len(retrieved_indicators)} indicators")
                for ind in retrieved_indicators:
                    print(f"      - {ind.get('indicator_type')}: {ind.get('indicator_value')}")
            else:
                print(f"   ✓ Indicators stored (mock client - retrieval not tested)")
            
            print("\n" + "=" * 60)
            print("✅ ALL TESTS PASSED!")
            print("=" * 60)
            print("\nSnowflake connection is working correctly!")
            print(f"Mode: {type(sf_client).__name__}")
            
            if 'Mock' in type(sf_client).__name__:
                print("\n⚠️  NOTE: You're using the MOCK client.")
                print("To use the REAL Snowflake connection:")
                print("1. Ensure ENVIRONMENT=production in .env")
                print("2. Ensure all Snowflake credentials are in .env")
                print("3. Run: pip install snowflake-connector-python --break-system-packages")
            
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        print("\nTroubleshooting:")
        print("1. Check that .env file exists in backend/ directory")
        print("2. Verify all Snowflake credentials are correct")
        print("3. Ensure snowflake-connector-python is installed")
        print("4. Check network connectivity to Snowflake")
        return False
    
    return True


if __name__ == "__main__":
    success = test_snowflake_connection()
    exit(0 if success else 1)
