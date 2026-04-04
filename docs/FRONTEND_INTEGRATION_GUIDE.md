# Frontend Integration Guide

For Kendall — React ↔ Flask API integration reference.

---

## Quick Start

### 1. Start the backend

```bash
cd malicious-file-analyzer

# First time only — create the venv with Python 3.10
python3.10 -m venv backend/venv
backend/venv/bin/pip install -r backend/requirements.txt

# Every time — start Flask in development mode
ENVIRONMENT=development backend/venv/bin/python3 backend/app.py
```

Server runs at `http://localhost:5000`. Confirm with:
```bash
curl http://localhost:5000/api/health
```

### 2. Start the frontend

The real React app is in `frontend/frontend-app/` (not the root `frontend/`):

```bash
cd frontend/frontend-app
npm install
npm start       # → http://localhost:3000
```

---

## API Base URL

The frontend `src/services/api.js` reads from `REACT_APP_API_URL`:

```js
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
})
```

For local dev no `.env` is needed — it defaults to `localhost:5000` automatically.

---

## Endpoints at a Glance

| Method | Path | Used by |
|---|---|---|
| GET | `/api/health` | Connection check |
| POST | `/api/analyze/upload` | File upload page |
| POST | `/api/analyze/url` | URL analyzer page |
| GET | `/api/results/recent` | Dashboard / history |
| GET | `/api/results/<scan_id>` | Results page |
| POST | `/api/analyze/email` | Lambda only (returns 501) |

---

## Response Shape — What to Expect

All success responses include `"success": true`. All errors include `"success": false`.

**Upload / URL response:**
```js
{
  success: true,
  scan_id: "uuid-string",       // use for /api/results/<scan_id>
  filename: "document.pdf",
  score: 0.45,                  // 0.0–1.0 float
  severity: "Moderate Risk",    // string label
  indicators: {
    urls: [],
    emails: [],
    ip_addresses: [],
    file_hashes: [],
    crypto_addresses: [],
    total_count: 0
  },
  explanation: [],              // array of human-readable strings
  analysis_time_seconds: 0.42
}
```

**Severity labels from the scoring engine:**
- `"Low Severity - Potentially Risky"` (score < 0.4)
- `"Moderate Risk"` (0.4–0.69)
- `"High Risk - Likely Malicious"` (0.7–0.89)
- `"Critical - Malicious"` (≥ 0.9)

---

## Common Issues & Fixes

### "Network Error" / "ERR_CONNECTION_REFUSED"

**Cause:** Flask server is not running.

**Fix:**
```bash
# Check if it's running
curl http://localhost:5000/api/health

# If not, start it (from project root)
ENVIRONMENT=development backend/venv/bin/python3 backend/app.py
```

---

### "CORS error" in browser console

**Symptom:** `Access to XMLHttpRequest blocked by CORS policy`

**Cause:** The backend's `CORS(app)` allows all origins, so this should not
happen. If it does:

1. Confirm Flask is actually running (not a 503 from something else on port 5000)
2. Check the browser Network tab — look at the actual response headers for
   `Access-Control-Allow-Origin`
3. If using a proxy in `package.json`, remove it — the `api.js` file already
   uses the full `http://localhost:5000` base URL

---

### "413 Payload Too Large"

**Cause:** Flask's default max request size is 16MB. Files near or over this
will fail.

**Fix:** Add to `backend/app.py` before `app.run(...)`:
```python
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB
```

---

### URL analyzer returns SSL error locally

**Symptom:**
```
SSLCertVerificationError: certificate verify failed: unable to get local issuer certificate
```

**Cause:** macOS Python 3.10 doesn't ship with the system cert bundle for
`requests`. This affects the URL download step, not anything frontend-facing.

**Fix (one-time, in terminal):**
```bash
/Applications/Python\ 3.10/Install\ Certificates.command
# or
backend/venv/bin/pip install certifi
backend/venv/bin/python3 -c "import ssl; print(ssl.get_default_verify_paths())"
```

---

### "Port 5000 is already in use" on macOS

**Cause:** macOS AirPlay Receiver uses port 5000 by default.

**Fix:** System Settings → General → AirDrop & Handoff → AirPlay Receiver → Off

Or run Flask on a different port:
```bash
PORT=5001 backend/venv/bin/python3 backend/app.py
```
And update `api.js` baseURL to `http://localhost:5001`.

---

### Upload returns `success: false` with "Analysis failed"

**Cause:** Almost always a missing Python dependency or file processor error.

**Debug steps:**
1. Check the Flask terminal output for the full traceback
2. Run a direct curl test to isolate frontend vs backend:
   ```bash
   curl -X POST -F "file=@/any/local/file.txt" http://localhost:5000/api/analyze/upload
   ```
3. If it works in curl but not from React, it's a `FormData` issue — confirm the
   file is appended with key `"file"`:
   ```js
   const formData = new FormData()
   formData.append('file', fileObject)  // key must be "file"
   ```

---

### Snowflake / storage errors in backend logs

If you see Snowflake connection errors in the Flask log but the API still
responds, the backend is in mock mode (data stored in memory only, lost on
restart). This is expected during frontend development.

To use real Snowflake: change `ENVIRONMENT=development` to `ENVIRONMENT=production`
when starting the server, and ensure the Snowflake credentials in `backend/.env`
are correct. A Duo MFA push will fire on startup.

---

## Testing the Full Flow

```bash
# 1. Upload a file
curl -s -X POST \
  -F "file=@README.md" \
  http://localhost:5000/api/analyze/upload | python3 -m json.tool

# 2. Use the returned scan_id to retrieve stored results
curl -s http://localhost:5000/api/results/<scan_id> | python3 -m json.tool

# 3. Check recent history
curl -s "http://localhost:5000/api/results/recent?limit=3" | python3 -m json.tool
```
