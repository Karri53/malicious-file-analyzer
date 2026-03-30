# Backend API Reference for Frontend Integration

## Base URL
`http://localhost:5000`

## Endpoints

### 1. Health Check
**GET** `/api/health`

**Response:**
```json
{
  "status": "healthy"
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
  "scan_id": "20260323_abc123",
  "filename": "document.pdf",
  "file_size": 45632,
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
    "Found 1 suspicious URL",
    "Found 1 email address",
    "Found 1 cryptocurrency address (Bitcoin)"
  ],
  "timestamp": "2026-03-23T14:30:00"
}
```

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

**Response:** Same as File Upload endpoint

**Frontend use:** URL submission page

---

## Error Responses

All endpoints return errors in this format:
```json
{
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

Backend accepts requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Create React App)

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