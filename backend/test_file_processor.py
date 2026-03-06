"""Test file processor with real text files"""

from services.file_processor import FileProcessor
import tempfile
import os

def test_text_file():
    """Test processing a text file with malicious content"""
    processor = FileProcessor()
    
    # Create test text file with indicators
    test_content = """
    Suspicious Document - DO NOT OPEN
    
    Please click this link to verify your account:
    https://malicious-phishing-site.com/login
    
    Or contact us at: attacker@evil-domain.com
    Server IP: 192.168.1.100
    Bitcoin address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
    
    This is a test document for malware analysis.
    """
    
    test_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt')
    test_file.write(test_content)
    test_file.close()
    
    print(f"✓ Created test file: {test_file.name}")
    
    # Process file
    result = processor.process_file(test_file.name)
    
    print(f"\n📄 Processing Results:")
    print(f"  ✓ Success: {result['success']}")
    print(f"  ✓ Filename: {result['filename']}")
    print(f"  ✓ File type: {result['file_type']}")
    print(f"  ✓ File size: {result['file_size']} bytes")
    print(f"  ✓ File hash: {result['file_hash'][:16]}...")
    print(f"  ✓ Text extracted: {result['text_length']} characters")
    print(f"\n📝 Extracted Text Preview:")
    print(result['extracted_text'][:200] + "...")
    
    # Verify
    assert result['success'] == True, "Processing failed"
    assert result['text_length'] > 0, "No text extracted"
    assert 'malicious-phishing-site.com' in result['extracted_text'], "URL not found"
    
    # Cleanup
    os.remove(test_file.name)
    
    print(f"\n✅ Text file test passed!")


def test_invalid_file():
    """Test validation of invalid files"""
    processor = FileProcessor()
    
    # Test non-existent file
    result = processor.validate_file("/nonexistent/file.pdf")
    assert result['valid'] == False, "Should reject non-existent file"
    print("✓ Correctly rejected non-existent file")
    
    # Test unsupported file type
    test_file = tempfile.NamedTemporaryFile(delete=False, suffix='.exe')
    test_file.close()
    
    result = processor.validate_file(test_file.name)
    assert result['valid'] == False, "Should reject .exe files"
    print("✓ Correctly rejected .exe file (security!)")
    
    os.remove(test_file.name)
    
    print("✅ Validation tests passed!")


def test_file_hash():
    """Test hash calculation"""
    processor = FileProcessor()
    
    # Create test file
    test_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt')
    test_file.write("Test content for hashing")
    test_file.close()
    
    # Calculate hash
    hash1 = processor.calculate_file_hash(test_file.name)
    hash2 = processor.calculate_file_hash(test_file.name)
    
    print(f"✓ File hash: {hash1}")
    assert hash1 == hash2, "Hash should be consistent"
    assert len(hash1) == 64, "SHA256 hash should be 64 characters"
    print("✓ Hash is consistent and correct length")
    
    os.remove(test_file.name)
    
    print("✅ Hash test passed!")


if __name__ == '__main__':
    print("=" * 60)
    print("FILE PROCESSOR TESTS")
    print("=" * 60)
    print()
    
    test_text_file()
    print()
    test_invalid_file()
    print()
    test_file_hash()
    print()
    print("=" * 60)
    print("🎉 ALL FILE PROCESSOR TESTS PASSED!")
    print("=" * 60)
