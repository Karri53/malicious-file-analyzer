# Email Processing Architecture

## Overview
Email-based file analysis allows users to forward suspicious emails to `analyze@malware-analyzer.com` and receive automated analysis results via email reply within 2-3 minutes.

## System Components

### 1. AWS SES (Simple Email Service)
**Purpose:** Receive incoming emails and send results

**Configuration:**
- Domain: `malware-analyzer.com` (or assigned domain)
- Receiving address: `analyze@malware-analyzer.com`
- Receipt rule: Store in S3 → Trigger Lambda
- Sending: Use SES SMTP for results emails

**Setup Steps (Week 4 - When Credentials Arrive):**
1. Verify domain in AWS SES console
2. Add MX records to DNS (point to AWS SES)
3. Configure DKIM/SPF for email deliverability
4. Create receipt rule set
5. Add rule: `analyze@*` → S3 bucket → Lambda trigger
6. Move out of SES sandbox (request production access)

### 2. S3 Email Storage
**Purpose:** Temporary storage for incoming emails (24-hour retention)

**Bucket Configuration:**
- Bucket name: `malware-analyzer-emails`
- Region: us-east-1
- Folder structure:
```
  /incoming/YYYY/MM/DD/message-id/
  /processed/YYYY/MM/DD/message-id/
  /failed/YYYY/MM/DD/message-id/
```
- Lifecycle policy: Delete objects older than 24 hours
- Versioning: Disabled (emails are temporary)

**Permissions:**
- SES: Write to /incoming/
- Lambda: Read from /incoming/, Write to /processed/ and /failed/
- Bucket policy restricts access to SES and Lambda roles only

### 3. AWS Lambda Function
**Purpose:** Process emails, extract attachments, trigger analysis

**Function Details:**
- Name: `email-processor`
- Runtime: Python 3.10
- Timeout: 5 minutes (300 seconds)
- Memory: 512 MB
- Trigger: S3 PUT events on /incoming/ folder
- Environment variables:
```
  BACKEND_API_URL=http://[ec2-instance]:5000
  ALLOWED_FILE_TYPES=.pdf,.docx,.txt,.png
  MAX_ATTACHMENT_SIZE_MB=10
  MAX_ATTACHMENTS_PER_EMAIL=5
```

**Lambda Workflow:**
1. Triggered when SES stores email in S3
2. Download email from S3 (/incoming/)
3. Parse email using Python `email` library
4. Validate sender (rate limiting check)
5. Extract all attachments
6. Filter allowed file types (.pdf, .docx, .txt, .png)
7. For each valid attachment:
   - Upload to analysis S3 bucket
   - Call backend API POST /api/analyze/upload
   - Collect results
8. Generate results email (HTML template)
9. Send via SES to original sender
10. Move email to /processed/ folder
11. Log to CloudWatch

**Error Handling:**
- If attachment too large: Skip, note in results
- If unsupported type: Skip, note in results
- If API call fails: Retry once, then move to /failed/
- If email parsing fails: Move to /failed/, log error

**Required IAM Permissions:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::malware-analyzer-emails/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

### 4. Backend API Integration
**Endpoint:** POST /api/analyze/upload

**Lambda calls this endpoint for each attachment:**
```python
import requests

response = requests.post(
    f"{BACKEND_API_URL}/api/analyze/upload",
    files={'file': (filename, file_content, mime_type)},
    timeout=60
)
```

**Returns:** JSON with scan results (score, severity, indicators, explanation)

### 5. Results Email Template
**Format:** HTML email with inline CSS (for email client compatibility)

**Structure:**
- Header: "Malicious File Analysis Results"
- Summary table: File count, threat level, scan time
- Per-file results:
  - Filename
  - Severity badge (color-coded: Red/Yellow/Green)
  - Threat score (0.0-1.0)
  - Indicators found (list)
  - Explanation text
- Footer: Disclaimer, link to web dashboard (future)

**Example:**
```
Subject: Analysis Complete - 2 files analyzed

[HTML Email Body]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ MALICIOUS FILE ANALYSIS RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary:
✓ Files analyzed: 2
⚠ Threat level: MODERATE
⏱ Scan time: 2.3 seconds

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 invoice.pdf
Severity: 🟢 SAFE (Score: 0.0)
No malicious indicators detected.

📄 payment_request.docx
Severity: 🟡 MODERATE (Score: 0.45)
Indicators found:
  • 1 cryptocurrency address (Bitcoin)
  • 2 suspicious URLs
Explanation: Document contains payment
instructions with cryptocurrency address,
common in ransomware scenarios.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ DISCLAIMER: This is an automated analysis.
Always exercise caution with suspicious files.

Powered by Team Opulence | NSA Senior Design
```

## Data Flow Diagram
```
User forwards email to analyze@malware-analyzer.com
    ↓
AWS SES receives email
    ↓
Email stored in S3: /incoming/2026/03/22/msg-123/
    ↓
Lambda triggered by S3 PUT event
    ↓
Lambda downloads email from S3
    ↓
Lambda parses email:
    - Sender: user@example.com
    - Subject: "Suspicious attachment"
    - Attachments: 2 files (invoice.pdf, doc.docx)
    ↓
For each attachment:
    Lambda validates:
        ✓ Type allowed? (.pdf, .docx)
        ✓ Size OK? (< 10MB)
        ↓
    Lambda calls Backend API:
        POST /api/analyze/upload
        ↓
    Backend analyzes file
        ↓
    Backend returns:
        {score: 0.45, severity: "Moderate", ...}
    ↓
Lambda collects all results
    ↓
Lambda generates HTML results email
    ↓
Lambda sends via SES to user@example.com
    ↓
Lambda moves email to /processed/
    ↓
User receives results email (2-3 min total)
```

## Security Considerations

### 1. Email Validation
- Rate limiting: Max 10 emails per sender per hour
- Sender verification: Check domain reputation (future)
- Attachment count limit: Max 5 attachments per email
- Total email size: Max 10MB

### 2. Attachment Filtering
**Allowed types:**
- PDF (.pdf)
- Word documents (.docx, .doc)
- Text files (.txt)
- Images (.png, .jpg)

**Blocked types:**
- Executables (.exe, .dll, .bat, .sh, .app)
- Scripts (.js, .vbs, .ps1, .py)
- Archives (.zip, .rar, .7z) - prevents zip bombs
- Macros (.xlsm, .docm) - security risk

### 3. Privacy Protection
- Emails deleted after 24 hours (S3 lifecycle)
- Sender email addresses hashed in logs
- No email content stored in Snowflake (only attachments analyzed)
- Results sent only to original sender (no CC/BCC)

### 4. Anti-Abuse Measures
- CloudWatch alarms for Lambda errors (> 10/hour)
- SES bounce/complaint tracking
- Automatic blocklist for abusive senders
- Cost monitoring (Lambda + SES usage)

## Testing Plan

### Unit Tests (Lambda Function)
- Email parsing function
- Attachment extraction
- File type validation
- Results email generation
- S3 movement (incoming → processed)

### Integration Tests
- S3 → Lambda trigger
- Lambda → Backend API call
- SES sending functionality
- End-to-end: Email in → Results out

### Test Cases

**Test 1: Single Clean Attachment**
- Email with 1 PDF (clean resume)
- Expected: Results email with score 0.0, "Safe"

**Test 2: Multiple Mixed Attachments**
- Email with 3 files (clean PDF, malicious TXT, image)
- Expected: Results with 3 separate analyses

**Test 3: Oversized Attachment**
- Email with 15MB PDF
- Expected: Results noting "File too large, skipped"

**Test 4: Blocked File Type**
- Email with .exe attachment
- Expected: Results noting "File type not allowed"

**Test 5: No Attachments**
- Email with no attachments
- Expected: Results noting "No attachments found"

**Test 6: Rate Limit**
- Send 11 emails from same address in 1 hour
- Expected: 11th email rejected

## Cost Estimate

### Monthly Costs (Estimated)

**AWS SES:**
- Receiving: $0.10 per 1,000 emails
- Sending: $0.10 per 1,000 emails
- Estimate: 100 emails/day = 3,000/month
- Cost: 3,000 × $0.10/1000 × 2 = **$0.60/month**

**AWS Lambda:**
- Requests: $0.20 per 1M requests
- Compute: $0.00001667 per GB-second
- Estimate: 100 invocations/day = 3,000/month
- Avg duration: 10 seconds, 512MB = 0.5GB × 10s = 5 GB-seconds
- Cost: (3,000 × $0.20/1M) + (3,000 × 5 × $0.00001667) = **$0.25/month**

**AWS S3:**
- Storage: $0.023 per GB
- Requests: $0.005 per 1,000 PUT, $0.0004 per 1,000 GET
- Estimate: Minimal (24-hour retention, small emails)
- Cost: **< $1/month**

**Total: ~$2-3/month** (negligible for academic project)

## Implementation Timeline

### Week 3 (Current - Design Phase)
- ✅ Architecture documentation (this file)
- ✅ Lambda function code written (not deployed)
- ✅ Email template designed
- ✅ SES configuration documented

### Week 4 (Implementation - When Credentials Arrive)
- Day 1: Domain verification, DNS setup
- Day 2: S3 bucket creation, lifecycle policy
- Day 3: Lambda function deployment, IAM roles
- Day 4: SES receipt rules, test email flow
- Day 5: End-to-end testing, bug fixes

### Week 5 (Polish)
- Results email styling improvements
- Error handling refinement
- Rate limiting implementation
- Documentation updates

## Monitoring & Logging

### CloudWatch Metrics
- Lambda invocations (count)
- Lambda errors (count, error rate)
- Lambda duration (avg, p95, p99)
- SES bounces/complaints (count)

### CloudWatch Alarms
- Lambda error rate > 10% (5 min period)
- SES bounce rate > 5% (1 hour period)
- Lambda duration > 4 minutes (timeout warning)

### Logs to Capture
- Email received (sender, subject, attachment count)
- Each attachment processed (filename, size, type)
- API call results (scan_id, score, severity)
- Results email sent (recipient, timestamp)
- Any errors (with full traceback)

## Future Enhancements

### Phase 2 (Post-Semester)
- Web dashboard for results history
- Multiple recipient support (CC/BCC analysis)
- Attachment batch analysis (analyze all at once)
- Custom email templates per user
- Whitelisting trusted senders (auto-approve)
- Scheduled digest emails (daily summary)

### Phase 3 (Advanced)
- Machine learning scoring (improve accuracy)
- Sandboxed execution analysis (beyond static)
- Integration with threat intelligence feeds
- Multi-language support (internationalization)
- Mobile app for results viewing

## References

1. AWS SES Documentation: https://docs.aws.amazon.com/ses/
2. AWS Lambda Python: https://docs.aws.amazon.com/lambda/latest/dg/python-handler.html
3. Python email library: https://docs.python.org/3/library/email.html
4. Email security best practices: https://www.cloudflare.com/learning/email-security/
5. NIST Cybersecurity Framework 2.0: https://www.nist.gov/cyberframework