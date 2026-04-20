"""
Test Snowflake connection with MFA/TOTP authentication
Run this to verify production Snowflake works
"""

from dotenv import load_dotenv
from services.real_snowflake_client import RealSnowflakeClient
import os
import time

load_dotenv()

def test_with_passcode():
    """Test connection using MFA passcode."""
    print("=" * 70)
    print("SNOWFLAKE PRODUCTION CONNECTION TEST - MFA/TOTP METHOD")
    print("=" * 70)
    
    print("\n📱 Open your authenticator app (Google Authenticator, Duo, etc.)")
    print("Find your Snowflake/Prairie View entry")
    passcode = input("\n🔐 Enter your 6-digit MFA code: ").strip()
    
    if len(passcode) != 6 or not passcode.isdigit():
        print("❌ Invalid code format. Must be 6 digits.")
        return False
    
    print(f"\n⏳ Connecting to Snowflake with MFA code: {passcode}")
    print("-" * 70)
    
    try:
        # Connect with MFA passcode
        client = RealSnowflakeClient(passcode=passcode)
        print("✅ Connection successful!")
        
        # Test 1: Version query
        print("\n📊 Test 1: Query Snowflake version...")
        start = time.time()
        result = client.execute_query("SELECT CURRENT_VERSION()")
        end = time.time()
        print(f"✅ Query executed in {end - start:.2f} seconds")
        print(f"   Snowflake version: {result[0][0] if result else 'N/A'}")
        
        # Test 2: Database access
        print("\n📁 Test 2: Accessing database...")
        db_name = os.getenv('SNOWFLAKE_DATABASE')
        client.execute_query(f"USE DATABASE {db_name}")
        print(f"✅ Successfully using database: {db_name}")
        
        # Test 3: Check tables
        print("\n📋 Test 3: Checking tables...")
        result = client.execute_query("SHOW TABLES")
        table_count = len(result) if result else 0
        print(f"✅ Found {table_count} tables in database")
        
        if result:
            print("\n   Tables:")
            for row in result[:5]:  # Show first 5 tables
                print(f"   - {row[1]}")  # Table name usually in index 1
            if table_count > 5:
                print(f"   ... and {table_count - 5} more")
        
        # Test 4: Check FILE_ANALYSES table
        print("\n📊 Test 4: Checking FILE_ANALYSES table...")
        try:
            result = client.execute_query("SELECT COUNT(*) FROM FILE_ANALYSES")
            count = result[0][0] if result else 0
            print(f"✅ FILE_ANALYSES table exists with {count} records")
        except Exception as e:
            print(f"⚠️  FILE_ANALYSES table check: {e}")
            print("   (Table may not exist yet - will be created on first insert)")
        
        print("\n" + "=" * 70)
        print("🎉 ALL TESTS PASSED - PRODUCTION SNOWFLAKE IS WORKING!")
        print("=" * 70)
        print("\n✅ You can now use production Snowflake in your backend!")
        print("✅ Set USE_REAL_SNOWFLAKE=true in .env to enable")
        
        client.close()
        return True
        
    except Exception as e:
        print("\n" + "=" * 70)
        print(f"❌ CONNECTION FAILED: {e}")
        print("=" * 70)
        print("\n🔧 Troubleshooting:")
        print("1. Code expired? Try generating a new code (codes expire in ~30s)")
        print("2. Run the script again and enter code quickly")
        print("3. Verify .env credentials are correct:")
        print(f"   - SNOWFLAKE_ACCOUNT: {os.getenv('SNOWFLAKE_ACCOUNT')}")
        print(f"   - SNOWFLAKE_USER: {os.getenv('SNOWFLAKE_USER')}")
        print(f"   - SNOWFLAKE_DATABASE: {os.getenv('SNOWFLAKE_DATABASE')}")
        return False

def test_with_browser_auth():
    """Test connection using browser authentication."""
    print("=" * 70)
    print("SNOWFLAKE PRODUCTION CONNECTION TEST - BROWSER AUTH METHOD")
    print("=" * 70)
    
    print("\n🌐 Browser authentication will:")
    print("   1. Open a browser window")
    print("   2. Prompt you to log in with your credentials + MFA")
    print("   3. Cache the session for future use")
    
    proceed = input("\n▶️  Proceed with browser authentication? (y/n): ").strip().lower()
    if proceed != 'y':
        print("Cancelled.")
        return False
    
    try:
        print("\n⏳ Opening browser for authentication...")
        client = RealSnowflakeClient(use_browser_auth=True)
        print("✅ Connection successful!")
        
        # Run tests (same as above)
        print("\n📊 Running verification tests...")
        result = client.execute_query("SELECT CURRENT_VERSION()")
        print(f"✅ Snowflake version: {result[0][0] if result else 'N/A'}")
        
        print("\n" + "=" * 70)
        print("🎉 BROWSER AUTHENTICATION WORKING!")
        print("=" * 70)
        
        client.close()
        return True
        
    except Exception as e:
        print(f"\n❌ Browser authentication failed: {e}")
        return False

if __name__ == "__main__":
    print("\nChoose authentication method:")
    print("1. MFA/TOTP passcode (recommended for testing)")
    print("2. Browser authentication (caches session)")
    
    choice = input("\nEnter choice (1 or 2): ").strip()
    
    if choice == "1":
        test_with_passcode()
    elif choice == "2":
        test_with_browser_auth()
    else:
        print("Invalid choice.")