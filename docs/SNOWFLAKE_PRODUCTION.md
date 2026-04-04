# Snowflake Production Setup

Team Opulence — Malicious File Analyzer

---

## Architecture

```
Backend API → snowflake_client.py (factory)
                 ├── ENVIRONMENT=production → RealSnowflakeClient
                 └── ENVIRONMENT=development → MockSnowflakeClient (in-memory)
```

`RealSnowflakeClient` writes to `OPULENCE_DB.ANALYSIS_DATA` and supports both
password-only and MFA (Duo push) authentication, controlled by the
`SNOWFLAKE_AUTHENTICATOR` environment variable.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SNOWFLAKE_ACCOUNT` | Yes | Account identifier (e.g. `sfedu02-ufb92927`) |
| `SNOWFLAKE_USER` | Yes | Snowflake username |
| `SNOWFLAKE_PASSWORD` | Yes | Password |
| `SNOWFLAKE_WAREHOUSE` | Yes | Warehouse name (e.g. `OPULENCE_WH`) |
| `SNOWFLAKE_DATABASE` | Yes | Database name (e.g. `OPULENCE_DB`) |
| `SNOWFLAKE_SCHEMA` | Yes | Schema name (e.g. `ANALYSIS_DATA`) |
| `SNOWFLAKE_ROLE` | No | Role (e.g. `OPULENCE_ROLE`) |
| `SNOWFLAKE_AUTHENTICATOR` | No | Set to `username_password_mfa` to enable MFA |
| `ENVIRONMENT` | Yes | `production` or `development` |

---

## Authentication Modes

### Password-only (Lambda / automated services)

Leave `SNOWFLAKE_AUTHENTICATOR` unset or blank. The connector uses username +
password directly — no interactive prompt.

```
# .env
SNOWFLAKE_AUTHENTICATOR=
```

### MFA — Duo Push (interactive / local dev)

Set `SNOWFLAKE_AUTHENTICATOR=username_password_mfa`. When the backend starts,
Snowflake triggers a Duo push to your registered device. Approve it within ~60
seconds or the connection times out.

MFA token caching is enabled automatically (`client_store_temporary_credential=True`),
so repeat connections within the same session do not re-prompt.

```
# .env
SNOWFLAKE_AUTHENTICATOR=username_password_mfa
```

> **Lambda / AWS services cannot use interactive MFA.** Use a Snowflake service
> account with MFA disabled, or key-pair authentication, for any automated
> pipeline (Lambda, cron jobs, CI/CD).

---

## Database Schema

Tables in `OPULENCE_DB.ANALYSIS_DATA`:

| Table | Purpose |
|---|---|
| `scan_results` | One row per file analyzed — score, severity, timestamps |
| `indicators` | Individual threat indicators linked to a scan |
| `email_sources` | Email metadata for files submitted via SES |
| `url_sources` | URL metadata for files submitted via URL downloader |
| `file_metadata` | Key-value store for extracted file properties |

---

## Testing the Connection

### 1. Install the connector (if not already installed)

```bash
pip install snowflake-connector-python
```

### 2. Test from Python

```python
from dotenv import load_dotenv
load_dotenv('backend/.env')

from backend.services.snowflake_client import get_snowflake_client

with get_snowflake_client() as sf:
    scans = sf.get_recent_scans(limit=5)
    print(f"Connected. Recent scans: {len(scans)}")
```

With `SNOWFLAKE_AUTHENTICATOR=username_password_mfa`, a Duo push fires when
`get_snowflake_client()` is called. Approve it on your phone.

### 3. Verify data persistence

```python
with get_snowflake_client() as sf:
    scan_id = sf.insert_scan_result({
        'filename': 'test.pdf',
        'malicious_score': 0.1,
        'severity': 'Safe',
        'source_method': 'test'
    })
    print(f"Inserted scan_id: {scan_id}")

    # Re-open connection and confirm it persisted
with get_snowflake_client() as sf:
    result = sf.get_scan_by_id(scan_id)
    print(f"Retrieved: {result}")
```

---

## Troubleshooting

**`250001 (08001): Failed to connect`**
Verify `SNOWFLAKE_ACCOUNT` format. Use the account identifier only
(e.g. `sfedu02-ufb92927`), not the full URL.

**`390144: JWT token is invalid`**
MFA token cache is stale. Delete `~/.snowflake/` and reconnect.

**Duo push never arrives**
Confirm your user has MFA enrolled in Snowflake:
```sql
DESC USER khall;
-- Check: MINS_TO_MFA_REAUTH
```

**`MockSnowflakeClient` is being used instead of real**
Ensure `ENVIRONMENT=production` is set and all 6 required vars are non-empty.
Check logs for `"Using MOCK Snowflake client"` and the reason.

**Connection closed / `OperationalError` mid-request**
The `_get_cursor()` method auto-reconnects. If it persists, check warehouse
auto-suspend settings in Snowflake console.
