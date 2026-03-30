# AWS Configuration Guide

## 1. Overview

### What the AWS S3 Client Does
The AWS S3 client provides file storage operations for the Malicious File Analyzer backend. Its purpose is to upload files to Amazon S3, download them when needed, and delete them after processing is complete.

The project currently supports two storage client modes:

- `MockS3Client` for local development without AWS credentials
- `RealS3Client` for real AWS S3 operations when credentials are available

This allows development to continue even before AWS access is granted.

### Why We Need It
The backend needs temporary file storage because uploaded files may need to be processed after they are received. Instead of relying only on local storage, S3 provides a centralized place to store files temporarily.

Using S3 is useful because it:

- supports temporary upload storage
- works better for deployment than local-only storage
- allows cleanup using lifecycle policies
- gives the backend a consistent interface for file operations

### How It Integrates with the Backend
The backend does not directly choose between mock storage and real AWS storage in multiple places. Instead, it uses a factory function called `get_s3_client()` in `backend/services/aws_client.py`.

That function:

- returns `RealS3Client` if AWS credentials are detected
- otherwise returns `MockS3Client`

This keeps the rest of the backend independent from AWS-specific implementation details.

---

## 2. Code Architecture

### File Structure
Relevant files for the S3 integration are:

- `backend/services/aws_client.py`
- `backend/services/real_aws_client.py`

### `aws_client.py`
This file contains two important parts:

1. `MockS3Client`
2. `get_s3_client()`

`MockS3Client` simulates S3 operations using the local filesystem so development and testing can continue without AWS credentials.

`get_s3_client()` is the factory function that decides which client to return.

### Factory Pattern in `aws_client.py`
The project uses a factory pattern so the backend can request an S3 client without caring whether it is mock or real.

Current logic:

```python
def get_s3_client():
    aws_access_key = os.environ.get('AWS_ACCESS_KEY_ID')

    if aws_access_key:
        from .real_aws_client import RealS3Client
        logger.info("AWS credentials detected - using RealS3Client")
        return RealS3Client()
    else:
        logger.info("No AWS credentials - using MockS3Client")
        return MockS3Client()


        **Explanation:**
The `get_s3_client()` function implements a factory pattern that determines which storage client the backend should use at runtime. It checks whether the environment variable `AWS_ACCESS_KEY_ID` exists. If it does, the system assumes AWS credentials are available and returns an instance of `RealS3Client`, which uses the `boto3` library to interact with Amazon S3.

If the environment variable is not present, the function returns `MockS3Client`, which simulates S3 behavior using the local filesystem. This allows developers to test file upload, download, and deletion logic without needing actual AWS access.

This design keeps the rest of the backend code independent from AWS-specific implementation details. Any part of the system that needs file storage simply calls `get_s3_client()` and uses the returned object, regardless of whether it is a mock or real implementation. This improves modularity, simplifies testing, and makes the transition to real AWS services seamless once credentials are available.


## Lambda Email Processing Integration

The project includes an AWS Lambda function in `lambda/email_processor.py` that processes incoming email messages stored in S3. The function is triggered by an S3 `PUT` event and reads the raw email object from the configured email bucket.

After loading the email, the Lambda function parses attachments, filters them using allowed file types and attachment size limits, and sends each valid attachment to the backend API endpoint:

```text
POST /api/analyze/upload

This is important because the backend endpoint /api/analyze/email is not yet implemented, so the Lambda function currently relies on the upload analysis endpoint for file scanning. The upload endpoint processes the file, extracts text and indicators, calculates a maliciousness score, stores the results in Snowflake, and returns the analysis response.

The Lambda function uses these environment variables:

BACKEND_API_URL
ALLOWED_FILE_TYPES
MAX_ATTACHMENT_SIZE_MB
MAX_ATTACHMENTS_PER_EMAIL
SENDER_EMAIL

After processing, the Lambda function attempts to move the original email object to a processed or failed location in S3 and sends a results email through Amazon SES.


## Deployment Notes and Issues Encountered

- The original deployment commands were written for macOS/Linux (`source`, `cp`) and were updated for Windows PowerShell compatibility.
- The Lambda function depends on a reachable backend API URL. Local or deployed testing will fail if `BACKEND_API_URL` is incorrect or the Flask backend is not running.
- The Lambda function expects an S3 event with `Records[0].s3.bucket.name` and `Records[0].s3.object.key`, so local testing requires a realistic S3 event JSON payload.
- The current backend endpoint `/api/analyze/email` is not implemented yet. Lambda currently sends attachments to `/api/analyze/upload` instead.
- The S3 key move logic in `email_processor.py` uses string replacement for `/incoming/`, so the exact S3 object key format should be verified during deployment testing.


# AWS Configuration Guide

## Overview

This document outlines the configuration and setup process for integrating Amazon S3 into the Malicious File Analyzer backend. The system uses AWS S3 for file storage, enabling upload, retrieval, and deletion of analyzed files.

The application dynamically switches between a mock S3 client (for local development) and a real AWS S3 client when valid credentials are provided.

---

## AWS Services Used

* **Amazon S3** – Scalable object storage for uploaded files and analysis results

---

## Prerequisites

Before running the application with AWS integration, ensure the following:

* Access to AWS Academy Lab (or AWS account)
* Python virtual environment activated
* Required dependencies installed:

  ```
  pip install -r requirements.txt
  ```

---

## S3 Bucket Setup

1. Log into AWS Console
2. Navigate to **S3 (Simple Storage Service)**
3. Click **Create bucket**
4. Configure:

   * **Bucket name:** `malware-analyzer-uploads-temp`
   * **Region:** `us-east-1`
5. Leave default settings (block public access enabled)
6. Click **Create bucket**

---

## AWS Credentials Setup

This project uses **temporary AWS credentials** provided by AWS Academy Lab.

Each session requires setting the following environment variables:

### PowerShell (Windows)

```
$env:AWS_ACCESS_KEY_ID = "your-access-key"
$env:AWS_SECRET_ACCESS_KEY = "your-secret-key"
$env:AWS_SESSION_TOKEN = "your-session-token"
$env:AWS_DEFAULT_REGION = "us-east-1"
```

### Verification

To verify credentials are working:

```
python -c "import boto3; print(boto3.client('sts').get_caller_identity())"
```

A valid response confirms successful authentication.

---

## Application Behavior

The system uses a factory pattern to determine which S3 client to use:

* **MockS3Client** → Used when no AWS credentials are present
* **RealS3Client** → Used when AWS credentials are detected

This is handled in:

```
backend/services/aws_client.py
```

---

## Running S3 Integration Test

From the backend directory:

```
python test_mock_s3.py
```

### Expected Output

* File creation confirmation
* Successful upload to S3
* Successful download from S3
* Content verification
* Successful deletion

---

## Verification in AWS Console

1. Navigate to your S3 bucket
2. Refresh the bucket contents
3. Confirm uploaded file appears:

   ```
   test-upload.txt
   ```

---

## Troubleshooting

### InvalidAccessKeyId Error

* Cause: Missing or incorrect credentials
* Solution: Ensure all environment variables are set correctly, including:

  * `AWS_SESSION_TOKEN`

---

### File Not Appearing in Bucket

* Ensure delete operation is disabled during testing
* Refresh S3 console
* Confirm correct bucket name

---

### Credentials Expired

* AWS Academy credentials are temporary
* Restart lab and reconfigure environment variables

---

## Security Considerations

* Credentials are never hardcoded in the source code
* Environment variables are used for secure credential injection
* In production, IAM roles would replace manual credential configuration

---

## Future Improvements

* Implement lifecycle rules to automatically delete files after 24 hours
* Integrate AWS Lambda for automated file analysis
* Replace temporary credentials with IAM roles for production deployment

---

## Summary

The AWS S3 integration is fully functional and supports:

* File upload
* File download
* File deletion

The system is designed to be flexible, secure, and production-ready with minimal changes.
