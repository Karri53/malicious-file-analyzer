# Architecture Overview

## System Architecture

### High-Level Overview
```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │Email Client  │  │              │       │
│  │(React App)   │  │(Outlook/Gmail│  │              │       │
│  └──────┬───────┘  └──────┬───────┘  │              │       │
└─────────┼──────────────────┼──────────┴──────────────────────┘
          │                  │
          │ HTTPS            │ SMTP
          │                  │
┌─────────┼──────────────────┼──────────────────────────────────┐
│         ▼                  ▼         CLOUD LAYER              │
│  ┌──────────────┐   ┌──────────────┐                         │
│  │   AWS EC2    │   │   AWS SES    │                         │
│  │ Flask Backend│   │Email Gateway │                         │
│  └──────┬───────┘   └──────┬───────┘                         │
│         │                  │                                  │
│         │                  ▼                                  │
│         │           ┌──────────────┐                         │
│         │           │ AWS Lambda   │                         │
│         │           │Email Processor│                        │
│         │           └──────┬───────┘                         │
│         │                  │                                  │
│         ▼                  ▼                                  │
│  ┌────────────────────────────────┐                         │
│  │         AWS S3                  │                         │
│  │  ┌──────────┐  ┌──────────┐   │                         │
│  │  │  Uploads │  │  Emails  │   │                         │
│  │  │(24hr TTL)│  │          │   │                         │
│  │  └──────────┘  └──────────┘   │                         │
│  └────────────────┬───────────────┘                         │
└───────────────────┼──────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  ANALYSIS ENGINE     │
         │  - PDF Parser        │
         │  - Word Parser       │
         │  - Regex Engine      │
         │  - Scoring Algorithm │
         └──────────┬───────────┘
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
   ┌──────────────┐    ┌──────────────┐
   │  Snowflake   │    │  Response    │
   │  Database    │    │  to User     │
   └──────────────┘    └──────────────┘
```

## Data Flow

### Method 1: Email Forwarding
```
1. User forwards email → analyze@domain.com
2. AWS SES receives email
3. SES stores raw email in S3 bucket (malware-analyzer-emails)
4. SES triggers Lambda function (email_processor)
5. Lambda:
   - Downloads email from S3
   - Parses email (sender, subject, body)
   - Extracts all attachments
   - For each attachment:
     a. Uploads to S3 (malware-analyzer-uploads-temp)
     b. Calls backend API: POST /api/analyze-email
6. Backend:
   - Downloads file from S3
   - Extracts text/metadata
   - Runs regex patterns
   - Calculates malicious score
   - Saves results to Snowflake
   - Deletes file from S3
   - Returns results to Lambda
7. Lambda:
   - Formats results as email
   - Sends email via SES to original sender
8. User receives results email (2-3 minutes after forwarding)
```

### Method 2: URL Analysis
```
1. User submits URL via React frontend
2. Frontend sends POST /api/analyze-url to backend
3. Backend:
   - Downloads file from URL to server
   - Uploads file to S3
   - Processes file (extract text, run regex)
   - Calculates score
   - Saves to Snowflake
   - Deletes from S3
   - Returns results as JSON
4. Frontend displays results in browser
```

### Method 3: Direct Upload
```
1. User uploads file via React frontend
2. Frontend sends multipart POST /api/upload
3. Backend receives file upload
4. Same process as URL method
5. Returns results to frontend
```

## Database Schema (Snowflake)

### scan_results
```sql
scan_id (PK)              VARCHAR(100)
filename                  VARCHAR(500)
file_type                 VARCHAR(50)
file_size_bytes           INTEGER
upload_timestamp          TIMESTAMP
malicious_score           FLOAT
severity                  VARCHAR(50)
analysis_duration_seconds FLOAT
source_method             VARCHAR(20)   -- 'email', 'url', 'upload'
```

### indicators
```sql
indicator_id (PK)         VARCHAR(100)
scan_id (FK)              VARCHAR(100)
indicator_type            VARCHAR(50)   -- 'url', 'ip', 'email', etc.
indicator_value           VARCHAR(2000)
confidence                FLOAT
created_at                TIMESTAMP
```

### email_sources
```sql
email_source_id (PK)      VARCHAR(100)
scan_id (FK)              VARCHAR(100)
sender_email              VARCHAR(500)
recipient_email           VARCHAR(500)
subject                   VARCHAR(1000)
received_at               TIMESTAMP
attachment_count          INTEGER
```

### url_sources
```sql
url_source_id (PK)        VARCHAR(100)
scan_id (FK)              VARCHAR(100)
original_url              VARCHAR(2000)
download_status           VARCHAR(50)
download_time_seconds     FLOAT
created_at                TIMESTAMP
```

## Security Considerations

### File Isolation
- Files never execute on server
- Static analysis only (read, don't run)
- Files auto-delete after 24 hours
- Isolated S3 buckets with lifecycle policies

### API Security
- CORS configured for frontend domain only
- Input validation on all endpoints
- File size limits enforced (50MB)
- Rate limiting (future enhancement)

### Credentials Management
- Environment variables via .env files
- .env files never committed to Git
- IAM roles for AWS service communication
- Snowflake credentials encrypted

## Scalability

### Current Architecture (MVP)
- Single EC2 instance (t3.micro)
- Handles ~10-50 requests/hour
- Suitable for academic project

### Future Scaling Options
- Auto-scaling EC2 instances
- Container orchestration (ECS/EKS)
- API Gateway for request management
- CloudFront CDN for frontend
- ElastiCache for session management
