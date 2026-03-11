# AWS Configuration Guide

## Overview
This guide walks through setting up all required AWS services for the Malicious File Analyzer.

## Prerequisites
- AWS Account (via University or AWS Educate)
- AWS CLI installed
- IAM user with administrative permissions

## Backend S3 Client Configuration

The backend uses a factory pattern to choose between a mock S3 client and a real AWS S3 client.

### Client Selection Logic
- If `AWS_ACCESS_KEY_ID` is present in the environment, the backend uses `RealS3Client`
- If AWS credentials are not present, the backend falls back to `MockS3Client`

This allows local development and testing to continue even before real AWS credentials are provided.

### Relevant Backend Files
- `backend/services/aws_client.py`
- `backend/services/real_aws_client.py`
- `backend/test_mock_s3.py`

### Required Environment Variables
Add these values to `.env` when AWS credentials are available:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=us-east-1
S3_BUCKET_NAME=malware-analyzer-uploads-temp-pvamu

## Step 1: Configure AWS CLI
```bash
aws configure
AWS Access Key ID: [Your key]
AWS Secret Access Key: [Your secret]
Default region name: us-east-1
Default output format: json
```

## Step 2: Create S3 Buckets

### Create Upload Bucket
```bash
aws s3 mb s3://malware-analyzer-uploads-temp-pvamu
```

### Create Email Bucket
```bash
aws s3 mb s3://malware-analyzer-emails-pvamu
```

### Create Results Bucket
```bash
aws s3 mb s3://malware-analyzer-results-pvamu
```

### Configure Lifecycle Policy (Auto-delete after 24hrs)

Create file `s3-lifecycle.json`:
```json
{
  "Rules": [
    {
      "Id": "DeleteAfter24Hours",
      "Status": "Enabled",
      "ExpirationInDays": 1,
      "Filter": { "Prefix": "" }
    }
  ]
}
```

Apply to upload bucket:
```bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket malware-analyzer-uploads-temp-pvamu \
  --lifecycle-configuration file://s3-lifecycle.json
```

## Step 3: Configure IAM Permissions

Create `iam-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::malware-analyzer-*/*",
        "arn:aws:s3:::malware-analyzer-*"
      ]
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
      "Resource": "*"
    }
  ]
}
```

Create policy:
```bash
aws iam create-policy \
  --policy-name MalwareAnalyzerPolicy \
  --policy-document file://iam-policy.json
```

## Step 4: Set Up AWS SES

### Verify Domain
1. Go to AWS Console → SES → Verified Identities
2. Click "Create Identity"
3. Select "Domain"
4. Enter your domain name
5. Add provided DNS records to your domain

### Create Receipt Rule
1. SES → Email Receiving → Rule Sets
2. Create rule set: `malware-analyzer-rules`
3. Add rule:
   - Recipients: `analyze@yourdomain.com`
   - Actions:
     - S3: Store in malware-analyzer-emails-pvamu
     - Lambda: Trigger email-processor function

## Step 5: Deploy Lambda Function

Create deployment package:
```bash
cd lambda
pip install requests -t .
zip -r email-processor.zip .
```

Deploy:
```bash
aws lambda create-function \
  --function-name email-processor \
  --runtime python3.11 \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-role \
  --handler email_processor.lambda_handler \
  --zip-file fileb://email-processor.zip \
  --timeout 300 \
  --environment Variables="{BACKEND_API_URL=https://your-backend.com/api}"
```

## Step 6: Launch EC2 Instance
```bash
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.micro \
  --key-name your-key-pair \
  --security-groups malware-analyzer-sg \
  --user-data file://ec2-userdata.sh
```

### Security Group Rules
```bash
# Allow HTTP from anywhere
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow HTTPS from anywhere
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
```

## Troubleshooting

### S3 Access Denied
- Check IAM permissions
- Verify bucket policy
- Ensure bucket exists

### SES Email Not Received
- Verify domain is confirmed
- Check receipt rule is active
- Look at CloudWatch logs

### Lambda Function Errors
- Check CloudWatch logs
- Verify environment variables
- Test function manually in console
