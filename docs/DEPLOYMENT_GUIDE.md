## 1. Overview
This document outlines the deployment process for the Malicious File Analyzer system, including backend setup, AWS integration, and production readiness.

The system analyzes files for malicious indicators such as URLs, IP addresses, and emails. It supports multiple submission methods and integrates with cloud services.

---

## 2. System Architecture

The system consists of:

- Flask Backend API
- AWS S3 (file storage)
- AWS Lambda (email processing)
- Snowflake Database (results storage)

---

## 3. Backend Deployment

### Prerequisites
- Python 3.11 installed
- Virtual environment created
- Dependencies installed (pip install -r requirements.txt)
- AWS credentials (for production)
- Snowflake credentials (for production)

### Run Backend

cd backend
.\\venv\\Scripts\\Activate.ps1
python app.py

### Expected Output
- Running on http://127.0.0.1:5000
- Debug mode enabled

---

## 4. API Endpoints

- /api/health – system health check
- /api/analyze/upload – file upload analysis
- /api/analyze/url – URL analysis
- /api/analyze/email – email-based analysis
- /api/results/<scan_id> – specific result
- /api/results/recent – recent scans

---

## 5. Environment Variables

### AWS
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_SESSION_TOKEN
AWS_DEFAULT_REGION

### S3
S3_UPLOAD_BUCKET
S3_EMAIL_BUCKET
S3_RESULTS_BUCKET

### Snowflake
SNOWFLAKE_ACCOUNT
SNOWFLAKE_USER
SNOWFLAKE_PASSWORD
SNOWFLAKE_DATABASE
SNOWFLAKE_SCHEMA

### App Settings
FLASK_ENV
FLASK_PORT
MAX_FILE_SIZE_MB

---

## 6. AWS Deployment

### S3 Setup
- Create buckets for uploads, emails, and results
- Configure read/write permissions

### Lambda
- File: lambda/email_processor.py
- Runtime: Python 3.10
- Handler: email_processor.lambda_handler

### Responsibilities
- Read email data from S3
- Extract attachments
- Filter valid file types
- Send to backend API

### Trigger
- S3 PUT event

### Monitoring
Use CloudWatch to monitor:
- execution logs
- errors
- performance

---

## 7. Storage Behavior

### S3
- Uses real client when credentials exist
- Uses mock client in development

### Snowflake
- Stores scan results and indicators
- Supports mock vs production mode

---

## 8. Deployment Validation

### Backend
- Runs without errors
- /api/health returns success
- Upload works
- Results retrieve correctly

### AWS
- Buckets configured
- Lambda deployed
- Logs show successful execution

### Database
- Snowflake connection works
- Data inserts correctly

---

## 9. Performance Considerations

- Large files increase processing time
- Monitor concurrent requests
- Track Lambda execution time

---

## 10. Rollback

### Backend
- Stop server
- Revert to previous commit
- Restart backend

### Lambda
- Deploy previous version
- Restore environment variables

---

## 11. Known Limitations

- Root endpoint `/` is not used
- No authentication implemented
- No rate limiting
- File size validation can be improved

---

## 12. Deployment Readiness

System is ready when:
- API is running
- Upload + analysis works
- Results are stored and retrieved
- AWS services are functioning
"""

file_path = "/mnt/data/DEPLOYMENT_GUIDE_FULL.md"
with open(file_path, "w") as f:
    f.write(content)

file_path