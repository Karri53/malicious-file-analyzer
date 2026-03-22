# Lambda Function Deployment Guide

## Prerequisites
- AWS credentials with Lambda, S3, and SES permissions
- Python 3.10 installed locally
- AWS CLI configured

## Deployment Steps

### 1. Create Deployment Package
```bash
cd lambda

# Create virtual environment
python3 -m venv lambda_env
source lambda_env/bin/activate

# Install dependencies
pip install -r requirements.txt -t package/

# Copy function code
cp email_processor.py package/

# Create ZIP file
cd package
zip -r ../email_processor.zip .
cd ..
```

### 2. Create Lambda Function in AWS Console

1. Go to AWS Lambda console
2. Click "Create function"
3. Choose "Author from scratch"
4. Function name: `email-processor`
5. Runtime: Python 3.10
6. Architecture: x86_64
7. Click "Create function"

### 3. Upload Code

1. In Lambda function page, click "Upload from" → ".zip file"
2. Select `email_processor.zip`
3. Click "Save"

### 4. Configure Function

**Environment Variables:**
```
BACKEND_API_URL=http://[your-ec2-ip]:5000
ALLOWED_FILE_TYPES=.pdf,.docx,.txt,.png
MAX_ATTACHMENT_SIZE_MB=10
MAX_ATTACHMENTS_PER_EMAIL=5
SENDER_EMAIL=analyze@malware-analyzer.com
```

**Timeout:** 5 minutes (300 seconds)

**Memory:** 512 MB

**Handler:** email_processor.lambda_handler

### 5. Create IAM Role

Attach these policies to Lambda execution role:
- AmazonS3FullAccess (or custom S3 policy)
- AmazonSESFullAccess (or custom SES policy)
- CloudWatchLogsFullAccess

### 6. Configure S3 Trigger

1. In Lambda function, click "Add trigger"
2. Select "S3"
3. Bucket: malware-analyzer-emails
4. Event type: PUT
5. Prefix: incoming/
6. Click "Add"

### 7. Test Function

Create test event:
```json
{
  "Records": [
    {
      "s3": {
        "bucket": {
          "name": "malware-analyzer-emails"
        },
        "object": {
          "key": "incoming/2026/03/22/test-message-id"
        }
      }
    }
  ]
}
```

## Monitoring

View logs in CloudWatch:
- Log group: /aws/lambda/email-processor
- Check for errors, attachment counts, analysis results

## Troubleshooting

**Error: "Unable to import module"**
- Ensure all dependencies are in package/
- Check Python version matches (3.10)

**Error: "Timeout"**
- Increase timeout setting
- Check backend API response time

**Error: "Access Denied"**
- Verify IAM role has S3/SES permissions
- Check bucket policy