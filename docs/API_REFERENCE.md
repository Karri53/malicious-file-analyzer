# Backend API Reference for Frontend Integration

## Base URL
`http://localhost:5000`

## Endpoints

### 1. Health Check
**GET** `/api/health`

**Response:**
```json
{
  "status": "healthy",
  "service": "Malicious File Analyzer API",
  "version": "1.0.0"
}
```

**Frontend use:** Test connection, display server status

---

### 2. File Upload Analysis
**POST** `/api/analyze/upload`

**Request:**
- Content-Type: `multipart/form-data`
- Body: File with key `file`

**Example (Axios):**
```javascript
const formData = new FormData();
formData.append('file', fileObject);

const response = await axios.post('/api/analyze/upload', formData);
```

**Response:**
```json
{
  "success": true,
  "scan_id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "document.pdf",
  "score": 0.45,
  "severity": "Moderate Risk",
  "indicators": {
    "urls": ["http://suspicious.com"],
    "emails": ["scam@example.com"],
    "crypto_addresses": ["1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"],
    "ip_addresses": [],
    "file_hashes": [],
    "total_count": 3
  },
  "explanation": [
    "1 URL(s) found",
    "1 email address(es) found",
    "1 cryptocurrency address(es) found"
  ],
  "analysis_time_seconds": 0.42
}
```

> Note: `scan_id` is a UUID (not a date-based string). `file_size` and `timestamp`
> are stored in Snowflake but not returned in this response. Use `GET /api/results/<scan_id>` to retrieve full stored metadata.

**Frontend use:** File upload page, results display

---

### 3. URL Download & Analysis
**POST** `/api/analyze/url`

**Request:**
```json
{
  "url": "http://example.com/file.pdf"
}
```

**Example (Axios):**
```javascript
const response = await axios.post('/api/analyze/url', {
  url: 'http://example.com/file.pdf'
});
```

**Response:** Same shape as File Upload endpoint, plus a `url` field:
```json
{
  "success": true,
  "scan_id": "...",
  "url": "http://example.com/file.pdf",
  "filename": "file.pdf",
  "score": 0.1,
  "severity": "...",
  "indicators": { ... },
  "explanation": [ ... ],
  "analysis_time_seconds": 1.23
}
```

**Frontend use:** URL submission page

---

### 4. Get Scan by ID
**GET** `/api/results/<scan_id>`

**Response (found):**
```json
{
  "success": true,
  "scan": {
    "scan_id": "550e8400-...",
    "filename": "document.pdf",
    "malicious_score": 0.45,
    "severity": "Moderate Risk",
    "upload_timestamp": "2026-04-04T16:09:00",
    "file_type": ".pdf",
    "file_size_bytes": 45632
  },
  "indicators": [
    { "indicator_type": "urls", "indicator_value": "http://...", "confidence": 1.0 }
  ]
}
```

**Response (not found):** `404` with `{ "success": false, "error": "Scan not found: <id>" }`

---

### 5. Recent Scans
**GET** `/api/results/recent?limit=10`

**Query params:** `limit` (default 10, max 50)

**Response:**
```json
{
  "success": true,
  "count": 2,
  "scans": [ { ... }, { ... } ]
}
```

**Frontend use:** Dashboard / history page

---

### 6. Email Analysis *(not yet implemented)*
**POST** `/api/analyze/email`

Returns `501 Not Implemented`. This endpoint is called by the AWS Lambda processor, not the frontend directly.

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "error": "Description of what went wrong"
}
```

**Common errors:**
- `400 Bad Request`: Missing file, invalid URL format
- `413 Payload Too Large`: File > 10MB
- `500 Internal Server Error`: Backend processing error

**Frontend handling:**
```javascript
try {
  const response = await axios.post('/api/analyze/upload', formData);
  // Handle success
} catch (error) {
  if (error.response) {
    // Show error.response.data.error to user
    console.error('API Error:', error.response.data.error);
  } else {
    // Network error
    console.error('Network Error:', error.message);
  }
}
```

---

## CORS Configuration

`flask-cors` is configured with `CORS(app)` — **all origins are allowed** in
development. Both of the following will work without changes:

- `http://localhost:3000` (Create React App / `react-scripts start`)
- `http://localhost:5173` (Vite)

> For production, restrict origins by changing to:
> `CORS(app, origins=["https://your-domain.com"])`

---

## Testing Tips

**Test with curl:**
```bash
# Upload test
curl -X POST -F "file=@test.pdf" http://localhost:5000/api/analyze/upload

# URL test
curl -X POST http://localhost:5000/api/analyze/url \
  -H "Content-Type: application/json" \
  -d '{"url": "http://localhost:8000/test.pdf"}'
```

**Test with Postman:**
1. Create new request
2. POST to `http://localhost:5000/api/analyze/upload`
3. Body → form-data → Key: `file`, Type: File, Value: Choose file
4. Send

---

## Rate Limiting
None currently implemented (add in Week 5 if needed)

## Authentication
None currently required (public API for academic project)