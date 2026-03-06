"""Test malicious scoring algorithm"""

from services.scoring import MaliciousScorer

def test_high_risk_score():
    """Test file with many malicious indicators"""
    
    scorer = MaliciousScorer()
    
    # Simulate indicators from highly malicious file
    indicators = {
        'urls': [
            'https://malicious-site.tk/payload',
            'http://evil-c2.com:8080/api',
            'https://phishing.ml/login'
        ],
        'ip_addresses': ['192.168.1.100', '10.0.0.50'],
        'emails': ['attacker@evil.com'],
        'crypto_addresses': [
            {'type': 'bitcoin', 'value': '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'}
        ],
        'file_hashes': [
            {'type': 'md5', 'value': 'abc123...'}
        ],
        'total_count': 8
    }
    
    result = scorer.calculate_score(indicators)
    
    print("🔴 HIGH RISK FILE TEST:")
    print(f"  Score: {result['score']}/1.0")
    print(f"  Severity: {result['severity']}")
    print(f"  Reasons:")
    for reason in result['reasons']:
        print(f"    • {reason}")
    
    # High risk should have score >= 0.7
    assert result['score'] >= 0.7, f"Expected high score, got {result['score']}"
    assert 'High Severity' in result['severity'], f"Expected high severity, got {result['severity']}"
    
    # Generate explanation
    explanation = scorer.generate_explanation(result, indicators)
    print(f"\n📄 Explanation:\n{explanation}")
    
    print("\n✅ High risk test passed!")
    return result


def test_moderate_risk_score():
    """Test file with some suspicious indicators"""
    
    scorer = MaliciousScorer()
    
    # Moderate indicators
    indicators = {
        'urls': ['https://example.com/document'],
        'ip_addresses': ['192.168.1.1'],
        'emails': [],
        'crypto_addresses': [],
        'file_hashes': [],
        'total_count': 2
    }
    
    result = scorer.calculate_score(indicators)
    
    print("\n🟡 MODERATE RISK FILE TEST:")
    print(f"  Score: {result['score']}/1.0")
    print(f"  Severity: {result['severity']}")
    print(f"  Reasons:")
    for reason in result['reasons']:
        print(f"    • {reason}")
    
    # Moderate risk should be 0.2-0.7
    assert 0.2 <= result['score'] < 0.7, f"Expected moderate score, got {result['score']}"
    
    print("\n✅ Moderate risk test passed!")
    return result


def test_low_risk_score():
    """Test file with minimal/no indicators"""
    
    scorer = MaliciousScorer()
    
    # Clean file - no indicators
    indicators = {
        'urls': [],
        'ip_addresses': [],
        'emails': [],
        'crypto_addresses': [],
        'file_hashes': [],
        'total_count': 0
    }
    
    result = scorer.calculate_score(indicators)
    
    print("\n🟢 LOW RISK FILE TEST:")
    print(f"  Score: {result['score']}/1.0")
    print(f"  Severity: {result['severity']}")
    print(f"  Reasons: {result['reasons'] if result['reasons'] else 'None'}")
    
    # Low risk should be < 0.2
    assert result['score'] < 0.2, f"Expected low score, got {result['score']}"
    
    # Generate explanation
    explanation = scorer.generate_explanation(result, indicators)
    print(f"\n📄 Explanation:\n{explanation}")
    
    print("\n✅ Low risk test passed!")
    return result


def test_ransomware_detection():
    """Test that ransomware indicators score very high"""
    
    scorer = MaliciousScorer()
    
    # Ransomware typically has crypto addresses
    indicators = {
        'urls': [],
        'ip_addresses': [],
        'emails': ['pay@ransomware.com'],
        'crypto_addresses': [
            {'type': 'bitcoin', 'value': '1BTC...'},
            {'type': 'ethereum', 'value': '0xETH...'}
        ],
        'file_hashes': [],
        'total_count': 3
    }
    
    result = scorer.calculate_score(indicators)
    
    print("\n💀 RANSOMWARE TEST:")
    print(f"  Score: {result['score']}/1.0")
    print(f"  Severity: {result['severity']}")
    print(f"  Crypto addresses detected: YES")
    
    # Crypto addresses should boost score significantly
    assert result['score'] >= 0.3, "Crypto addresses should increase score"
    assert any('crypto' in reason.lower() for reason in result['reasons']), "Should mention crypto"
    
    print("\n✅ Ransomware detection test passed!")
    return result


if __name__ == '__main__':
    print("=" * 70)
    print("MALICIOUS SCORING TESTS")
    print("=" * 70)
    print()
    
    test_high_risk_score()
    test_moderate_risk_score()
    test_low_risk_score()
    test_ransomware_detection()
    
    print()
    print("=" * 70)
    print("🎉 ALL SCORING TESTS PASSED!")
    print("=" * 70)
