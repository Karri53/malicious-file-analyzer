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