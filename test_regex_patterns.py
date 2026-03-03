"""Test regex pattern extraction"""

from utils.regex_patterns import IndicatorExtractor

def test_indicator_extraction():
    """Test extracting all types of indicators"""
    
    extractor = IndicatorExtractor()
    
    # Test text with various indicators
    test_text = """
    Malicious Document Analysis Report
    
    Suspicious URLs found:
    - https://malicious-phishing-site.com/login
    - http://evil-domain.tk/payload.exe
    - https://ransomware-c2.com:8080/api
    
    Command & Control IPs:
    - 192.168.1.100
    - 10.0.0.50
    - 203.0.113.42
    
    Attacker contact emails:
    - attacker@evil-domain.com
    - phishing@malware-site.tk
    
    Ransomware payment addresses:
    - Bitcoin: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
    - Ethereum: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
    
    Known malware hashes:
    - MD5: 5d41402abc4b2a76b9719d911017c592
    - SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    """
    
    print("🔍 Extracting Indicators from Test Text...\n")
    
    # Extract all indicators
    indicators = extractor.extract_all_indicators(test_text)
    
    # Display results
    print(f"📊 EXTRACTION RESULTS:")
    print(f"  ✓ URLs found: {len(indicators['urls'])}")
    for url in indicators['urls']:
        print(f"    - {url}")
    
    print(f"\n  ✓ IP addresses found: {len(indicators['ip_addresses'])}")
    for ip in indicators['ip_addresses']:
        print(f"    - {ip}")
    
    print(f"\n  ✓ Email addresses found: {len(indicators['emails'])}")
    for email in indicators['emails']:
        print(f"    - {email}")
    
    print(f"\n  ✓ Crypto addresses found: {len(indicators['crypto_addresses'])}")
    for crypto in indicators['crypto_addresses']:
        print(f"    - {crypto['type']}: {crypto['value']}")
    
    print(f"\n  ✓ File hashes found: {len(indicators['file_hashes'])}")
    for hash_obj in indicators['file_hashes']:
        print(f"    - {hash_obj['type']}: {hash_obj['value'][:16]}...")
    
    print(f"\n  📈 Total indicators: {indicators['total_count']}")
    
    # Verify expected results
    assert len(indicators['urls']) == 3, f"Expected 3 URLs, found {len(indicators['urls'])}"
    assert len(indicators['ip_addresses']) == 3, f"Expected 3 IPs, found {len(indicators['ip_addresses'])}"
    assert len(indicators['emails']) == 2, f"Expected 2 emails, found {len(indicators['emails'])}"
    assert len(indicators['crypto_addresses']) >= 1, "Expected crypto addresses"
    assert len(indicators['file_hashes']) >= 1, "Expected file hashes"
    
    print("\n✅ All indicator extraction tests passed!")


def test_individual_extractors():
    """Test each extractor individually"""
    
    extractor = IndicatorExtractor()
    
    # Test URL extraction
    url_text = "Visit https://example.com and http://test.org for more info"
    urls = extractor.extract_urls(url_text)
    assert len(urls) == 2, f"Expected 2 URLs, found {len(urls)}"
    print("✓ URL extraction working")
    
    # Test IP extraction
    ip_text = "Server at 192.168.1.1 and 10.0.0.1 are compromised"
    ips = extractor.extract_ip_addresses(ip_text)
    assert len(ips) == 2, f"Expected 2 IPs, found {len(ips)}"
    print("✓ IP extraction working")
    
    # Test email extraction
    email_text = "Contact admin@example.com or support@test.org"
    emails = extractor.extract_emails(email_text)
    assert len(emails) == 2, f"Expected 2 emails, found {len(emails)}"
    print("✓ Email extraction working")
    
    # Test Bitcoin extraction
    btc_text = "Send payment to 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
    cryptos = extractor.extract_crypto_addresses(btc_text)
    assert len(cryptos) >= 1, "Expected Bitcoin address"
    print("✓ Cryptocurrency extraction working")
    
    print("\n✅ Individual extractor tests passed!")


if __name__ == '__main__':
    print("=" * 60)
    print("REGEX PATTERN TESTS")
    print("=" * 60)
    print()
    
    test_indicator_extraction()
    print()
    test_individual_extractors()
    print()
    print("=" * 60)
    print("🎉 ALL REGEX TESTS PASSED!")
    print("=" * 60)