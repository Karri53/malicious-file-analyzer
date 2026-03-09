# Snowflake Setup Instructions
## Team Opulence - Malicious File Analyzer

### Files Created:
1. `.env` - Snowflake credentials (NEVER commit to Git!)
2. `real_snowflake_client.py` - Production Snowflake client
3. `snowflake_client.py` - Updated factory function
4. `requirements.txt` - Updated with snowflake-connector-python
5. `test_snowflake_connection.py` - Connection test script

---

## STEP 1: Install Snowflake Connector

```bash
cd ~/Desktop/malicious-file-analyzer/backend
source venv/bin/activate
pip install snowflake-connector-python --break-system-packages
```

---

## STEP 2: Place Files in Correct Locations

### A. Environment File (.env)
**Location:** `backend/.env`
- This file contains your Snowflake credentials
- IMPORTANT: Never commit this to Git (already in .gitignore)

### B. Real Snowflake Client (real_snowflake_client.py)
**Location:** `backend/services/real_snowflake_client.py`

### C. Updated Factory Function (snowflake_client.py)
**Location:** `backend/services/snowflake_client.py`
- REPLACE the existing file with this new version

### D. Updated Requirements (requirements.txt)
**Location:** `backend/requirements.txt`
- REPLACE the existing file with this new version

### E. Connection Test (test_snowflake_connection.py)
**Location:** `backend/test_snowflake_connection.py`

---

## STEP 3: Test the Connection

```bash
cd ~/Desktop/malicious-file-analyzer/backend
source venv/bin/activate
python test_snowflake_connection.py
```

**Expected Output:**
```
===========================================================
SNOWFLAKE CONNECTION TEST
===========================================================

1. Environment Mode: production

2. Checking Snowflake Credentials:
   ✓ SNOWFLAKE_ACCOUNT: sfedu02-ufb92927
   ✓ SNOWFLAKE_USER: khall
   ✓ SNOWFLAKE_PASSWORD: ***
   ✓ SNOWFLAKE_WAREHOUSE: OPULENCE_WH
   ✓ SNOWFLAKE_DATABASE: OPULENCE_DB
   ✓ SNOWFLAKE_SCHEMA: ANALYSIS_DATA
   ✓ SNOWFLAKE_ROLE: OPULENCE_ROLE

3. Testing Snowflake Connection:
   ✓ Client Type: RealSnowflakeClient

4. Testing Insert Scan Result:
   ✓ Inserted scan result with ID: [UUID]

5. Testing Insert Indicators:
   ✓ Inserted 2 indicators

6. Testing Retrieve Scan:
   ✓ Retrieved scan: test_malware.pdf
   ✓ Severity: High
   ✓ Score: 0.85

7. Testing Retrieve Indicators:
   ✓ Retrieved 2 indicators
      - url: http://malicious-site.com
      - ip_address: 192.0.2.1

===========================================================
✅ ALL TESTS PASSED!
===========================================================

Snowflake connection is working correctly!
Mode: RealSnowflakeClient
```

---

## STEP 4: Verify in Snowflake Web UI

1. Go to app.snowflake.com and log in
2. Navigate to: Data → Databases → OPULENCE_DB → ANALYSIS_DATA → Tables
3. Click on `SCAN_RESULTS` table
4. You should see the test record you just inserted!

---

## STEP 5: Using in Your Code

```python
from services.snowflake_client import get_snowflake_client

# The factory automatically picks the right client
with get_snowflake_client() as sf:
    # Insert scan result
    scan_id = sf.insert_scan_result({
        'filename': 'suspicious.pdf',
        'malicious_score': 0.85,
        'severity': 'High',
        'file_type': 'application/pdf',
        'source_method': 'upload'
    })
    
    # Insert indicators
    sf.insert_indicators(scan_id, [
        {'indicator_type': 'url', 'indicator_value': 'http://bad.com'},
        {'indicator_type': 'ip_address', 'indicator_value': '192.0.2.1'}
    ])
```

---

## Switching Between Mock and Real

The system automatically switches based on `.env` settings:

**Use REAL Snowflake:**
```
ENVIRONMENT=production
```

**Use MOCK Snowflake (for testing without database):**
```
ENVIRONMENT=development
```

---

## Troubleshooting

### Error: "Could not import RealSnowflakeClient"
**Solution:** Install the connector
```bash
pip install snowflake-connector-python --break-system-packages
```

### Error: "Failed to connect to Snowflake"
**Solutions:**
1. Check .env file has all credentials
2. Verify credentials are correct
3. Check network connection
4. Verify warehouse OPULENCE_WH is running in Snowflake UI

### Error: "Object does not exist"
**Solution:** Make sure you ran the setup SQL script in Snowflake to create all tables

---

## Next Steps

After successful connection:
1. ✅ Commit updated files to Git (except .env!)
2. ✅ Update teammates on how to set up their .env files
3. ✅ Integrate Snowflake into Flask API endpoints
4. ✅ Start storing real analysis results

---

## Security Reminders

⚠️ **NEVER commit .env file to Git!**
⚠️ **NEVER share credentials in Slack/email!**
⚠️ **Each team member needs their own .env file**

---

## Questions?

Contact Kay (Project Lead) if you encounter issues during setup.
