"""
AWS S3 Client - Mock Implementation
This mock version simulates S3 operations for testing without credentials.
Will be replaced with real boto3 implementation once AWS access is granted.
"""

import os
import hashlib
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class MockS3Client:
    """
    Mock S3 client for development without AWS credentials.
    Simulates S3 operations using local filesystem.
    """
    
    def __init__(self):
        """Initialize mock S3 client with local temp storage"""
        self.mock_storage_path = "/tmp/mock-s3-storage"
        os.makedirs(self.mock_storage_path, exist_ok=True)
        logger.info("MockS3Client initialized (using local filesystem)")
        
    def upload_file(self, file_path, bucket_name, object_name=None):
        """
        Simulate uploading a file to S3
        
        Args:
            file_path (str): Local file path to upload
            bucket_name (str): S3 bucket name (simulated)
            object_name (str): S3 object name (optional)
            
        Returns:
            dict: Upload result with success status and object URL
        """
        if object_name is None:
            object_name = os.path.basename(file_path)
            
        # Simulate upload by copying to mock storage
        mock_bucket_path = os.path.join(self.mock_storage_path, bucket_name)
        os.makedirs(mock_bucket_path, exist_ok=True)
        
        dest_path = os.path.join(mock_bucket_path, object_name)
        
        # Copy file to mock storage (simulates S3 upload)
        with open(file_path, 'rb') as source:
            with open(dest_path, 'wb') as dest:
                dest.write(source.read())
                
        logger.info(f"[MOCK] Uploaded {object_name} to bucket {bucket_name}")
        
        return {
            'success': True,
            'bucket': bucket_name,
            'key': object_name,
            'url': f"mock-s3://{bucket_name}/{object_name}"
        }
    
    def download_file(self, bucket_name, object_name, download_path):
        """
        Simulate downloading a file from S3
        
        Args:
            bucket_name (str): S3 bucket name
            object_name (str): S3 object name
            download_path (str): Local path to save file
            
        Returns:
            dict: Download result with success status
        """
        source_path = os.path.join(self.mock_storage_path, bucket_name, object_name)
        
        if not os.path.exists(source_path):
            logger.error(f"[MOCK] File not found: {object_name} in {bucket_name}")
            return {'success': False, 'error': 'File not found'}
        
        # Copy from mock storage (simulates S3 download)
        with open(source_path, 'rb') as source:
            with open(download_path, 'wb') as dest:
                dest.write(source.read())
                
        logger.info(f"[MOCK] Downloaded {object_name} from bucket {bucket_name}")
        
        return {'success': True, 'path': download_path}
    
    def delete_file(self, bucket_name, object_name):
        """
        Simulate deleting a file from S3
        
        Args:
            bucket_name (str): S3 bucket name
            object_name (str): S3 object name
            
        Returns:
            dict: Delete result with success status
        """
        file_path = os.path.join(self.mock_storage_path, bucket_name, object_name)
        
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"[MOCK] Deleted {object_name} from bucket {bucket_name}")
            return {'success': True}
        else:
            logger.warning(f"[MOCK] File not found for deletion: {object_name}")
            return {'success': False, 'error': 'File not found'}


# Factory function to create S3 client (will switch based on environment)
def get_s3_client():
    """
    Returns appropriate S3 client based on environment.
    
    In development without AWS credentials: returns MockS3Client
    In production with AWS credentials: returns real boto3 S3 client
    
    Returns:
        S3Client: Mock or real S3 client instance
    """
    # Check if AWS credentials are available
    aws_access_key = os.environ.get('AWS_ACCESS_KEY_ID')
    
    if aws_access_key:
        # TODO: Import and return real boto3 S3 client when credentials available
        # from real_aws_client import RealS3Client
        # return RealS3Client()
        logger.info("AWS credentials detected (boto3 not yet implemented)")
        return MockS3Client()
    else:
        logger.info("No AWS credentials - using MockS3Client")
        return MockS3Client()