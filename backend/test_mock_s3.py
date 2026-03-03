"""Test mock S3 client"""

from services.aws_client import get_s3_client
import tempfile
import os

def test_mock_s3():
    """Test mock S3 operations"""
    
    # Initialize client
    s3 = get_s3_client()
    
    # Create a test file
    test_content = b"This is a test file for S3 upload"
    test_file = tempfile.NamedTemporaryFile(delete=False, suffix='.txt')
    test_file.write(test_content)
    test_file.close()
    
    print(f"✓ Created test file: {test_file.name}")
    
    # Test upload
    result = s3.upload_file(
        file_path=test_file.name,
        bucket_name='malware-analyzer-uploads-temp',
        object_name='test-upload.txt'
    )
    print(f"✓ Upload result: {result}")
    
    # Test download
    download_path = tempfile.mktemp(suffix='.txt')
    result = s3.download_file(
        bucket_name='malware-analyzer-uploads-temp',
        object_name='test-upload.txt',
        download_path=download_path
    )
    print(f"✓ Download result: {result}")
    
    # Verify downloaded content matches
    with open(download_path, 'rb') as f:
        downloaded_content = f.read()
    assert downloaded_content == test_content, "Content mismatch!"
    print(f"✓ Content verified - matches original")
    
    # Test delete
    result = s3.delete_file(
        bucket_name='malware-analyzer-uploads-temp',
        object_name='test-upload.txt'
    )
    print(f"✓ Delete result: {result}")
    
    # Cleanup
    os.remove(test_file.name)
    os.remove(download_path)
    
    print("\n✅ All mock S3 tests passed!")

if __name__ == '__main__':
    test_mock_s3()