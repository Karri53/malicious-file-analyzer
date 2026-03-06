"""
Complete End-to-End Analysis Test
Tests the full pipeline: File Processing → Indicator Extraction → Scoring
"""

from services.file_processor import FileProcessor
from utils.regex_patterns import IndicatorExtractor
from services.scoring import MaliciousScorer
import tempfile
import os

def test_complete_malicious_file_analysis():
    """Test analyzing a malicious file end-to-end"""
    
    print("=" * 70)
    print("🔍 COMPLETE MALICIOUS FILE ANALYSIS")
    print("=" * 70)
    print()
    
    # Create malicious test file
    malicious_content = """
    URGENT: Your account has been compromised!
    
    Click here immediately to verify your identity:
    https://phishing-site.tk/verify-account
    
    Or contact our support team:
    Email: support@malware-domain.ml
    
    Payment required to unlock your files:
    Bitcoin: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
    
    Server details:
    IP: 192.168.1.100
    Command & Control: http://evil-c2.com:8080/api
    
    File hash: 5d41402abc4b2a76b9719d911017c592
    """
    
    test_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt')
    test_file.write(malicious_content)
    test_file.close()
    
    print(f"📄 Test file created: {test_file.name}\n")
    
    # STEP 1: Process file
    print("STEP 1: Processing file...")
    processor = FileProcessor()
    file_result = processor.process_file(test_file.name)
    
    if not file_result['success']:
        print(f"❌ File processing failed: {file_result['errors']}")
        return
    
    print(f"  ✓ Filename: {file_result['filename']}")
    print(f"  ✓ File type: {file_result['file_type']}")
    print(f"  ✓ File size: {file_result['file_size']} bytes")
    print(f"  ✓ File hash: {file_result['file_hash'][:16]}...")
    print(f"  ✓ Text extracted: {file_result['text_length']} characters\n")
    
    # STEP 2: Extract indicators
    print("STEP 2: Extracting indicators...")
    extractor = IndicatorExtractor()
    indicators = extractor.extract_all_indicators(file_result['extracted_text'])
    
    print(f"  ✓ URLs found: {len(indicators['urls'])}")
    for url in indicators['urls']:
        print(f"    - {url}")
    
    print(f"  ✓ IP addresses: {len(indicators['ip_addresses'])}")
    for ip in indicators['ip_addresses']:
        print(f"    - {ip}")
    
    print(f"  ✓ Emails: {len(indicators['emails'])}")
    for email in indicators['emails']:
        print(f"    - {email}")
    
    print(f"  ✓ Crypto addresses: {len(indicators['crypto_addresses'])}")
    for crypto in indicators['crypto_addresses']:
        print(f"    - {crypto['type']}: {crypto['value']}")
    
    print(f"  ✓ File hashes: {len(indicators['file_hashes'])}")
    
    print(f"\n  📊 Total indicators: {indicators['total_count']}\n")
    
    # STEP 3: Calculate score
    print("STEP 3: Calculating maliciousness score...")
    scorer = MaliciousScorer()
    score_result = scorer.calculate_score(indicators)
    
    print(f"  🎯 Score: {score_result['score']}/1.0")
    print(f"  ⚠️  Severity: {score_result['severity']}")
    print(f"  📝 Reasons:")
    for reason in score_result['reasons']:
        print(f"    • {reason}")
    
    # STEP 4: Generate explanation
    print("\nSTEP 4: Generating explanation...")
    explanation = scorer.generate_explanation(score_result, indicators)
    print(f"\n{explanation}")
    
    # Cleanup
    os.remove(test_file.name)
    
    # Verify results
    assert file_result['success'] == True, "File processing should succeed"
    assert indicators['total_count'] > 0, "Should find indicators"
    assert score_result['score'] > 0.5, "Malicious file should score high"
    
    print("\n" + "=" * 70)
    print("✅ COMPLETE ANALYSIS TEST PASSED!")
    print("=" * 70)


def test_complete_clean_file_analysis():
    """Test analyzing a clean file end-to-end"""
    
    print("\n" + "=" * 70)
    print("🔍 COMPLETE CLEAN FILE ANALYSIS")
    print("=" * 70)
    print()
    
    # Create clean test file
    clean_content = """
    Project Status Report
    Date: March 3, 2026
    
    Summary:
    The malware analysis project is progressing well.
    We have completed the file processing engine and 
    regex pattern library. All tests are passing.
    
    Next steps:
    - Complete integration testing
    - Deploy to production
    - Create documentation
    
    Team: Karrington Hall, Kendall Brown, LeMikkos Starks, Brandon Nobles
    """
    
    test_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt')
    test_file.write(clean_content)
    test_file.close()
    
    print(f"📄 Test file created: {test_file.name}\n")
    
    # Process through pipeline
    processor = FileProcessor()
    file_result = processor.process_file(test_file.name)
    
    extractor = IndicatorExtractor()
    indicators = extractor.extract_all_indicators(file_result['extracted_text'])
    
    scorer = MaliciousScorer()
    score_result = scorer.calculate_score(indicators)
    
    print(f"📊 Results:")
    print(f"  Indicators found: {indicators['total_count']}")
    print(f"  Score: {score_result['score']}/1.0")
    print(f"  Severity: {score_result['severity']}")
    
    explanation = scorer.generate_explanation(score_result, indicators)
    print(f"\n{explanation}")
    
    # Cleanup
    os.remove(test_file.name)
    
    # Verify clean file scores low
    assert score_result['score'] < 0.3, "Clean file should score low"
    
    print("\n" + "=" * 70)
    print("✅ CLEAN FILE TEST PASSED!")
    print("=" * 70)


if __name__ == '__main__':
    print("\n")
    print("╔" + "=" * 68 + "╗")
    print("║" + " " * 15 + "COMPLETE ANALYSIS PIPELINE TEST" + " " * 21 + "║")
    print("╚" + "=" * 68 + "╝")
    print()
    
    test_complete_malicious_file_analysis()
    test_complete_clean_file_analysis()
    
    print("\n")
    print("╔" + "=" * 68 + "╗")
    print("║" + " " * 20 + "🎉 ALL TESTS PASSED! 🎉" + " " * 21 + "║")
    print("╚" + "=" * 68 + "╝")
    print()
