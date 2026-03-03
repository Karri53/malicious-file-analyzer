"""
Malicious Scoring Algorithm
Calculates maliciousness score based on found indicators.
Score ranges from 0.0 (safe) to 1.0 (highly malicious).
"""

import logging
from typing import Dict, List

logger = logging.getLogger(__name__)


class MaliciousScorer:
    """
    Calculates maliciousness score based on indicators found in file.
    """
    
    # Scoring weights (how much each indicator contributes)
    WEIGHTS = {
        'url': 0.15,              # URLs present
        'suspicious_tld': 0.15,   # Suspicious domains (.tk, .ml, .ga, .zip)
        'ip_address': 0.10,       # IP addresses (C2 servers)
        'email': 0.05,            # Email addresses
        'crypto_address': 0.25,   # Cryptocurrency (ransomware!)
        'file_hash': 0.10,        # File hashes (malware samples)
        'multiple_indicators': 0.10,  # Many indicators (suspicious)
        'port_in_url': 0.10       # URLs with ports (C2 communication)
    }
    
    # Suspicious top-level domains often used by attackers
    SUSPICIOUS_TLDS = ['.tk', '.ml', '.ga', '.cf', '.gq', '.zip', '.top', '.work']
    
    def __init__(self):
        """Initialize scorer"""
        logger.info("MaliciousScorer initialized")
    
    def calculate_score(self, indicators: Dict) -> Dict:
        """
        Calculate maliciousness score based on indicators
        
        WHY: Converts technical findings into risk assessment
        
        Args:
            indicators (dict): Extracted indicators from file
            
        Returns:
            dict: Score, severity, and explanation
        """
        score = 0.0
        reasons = []
        
        # Check for URLs
        url_count = len(indicators.get('urls', []))
        if url_count > 0:
            score += self.WEIGHTS['url']
            reasons.append(f"{url_count} URL(s) found")
            
            # Check for suspicious TLDs
            suspicious_urls = self._check_suspicious_tlds(indicators.get('urls', []))
            if suspicious_urls > 0:
                score += self.WEIGHTS['suspicious_tld']
                reasons.append(f"{suspicious_urls} suspicious domain(s) (.tk, .ml, etc.)")
            
            # Check for URLs with ports (often C2 servers)
            port_urls = self._check_urls_with_ports(indicators.get('urls', []))
            if port_urls > 0:
                score += self.WEIGHTS['port_in_url']
                reasons.append(f"{port_urls} URL(s) with non-standard ports")
        
        # Check for IP addresses
        ip_count = len(indicators.get('ip_addresses', []))
        if ip_count > 0:
            score += self.WEIGHTS['ip_address']
            reasons.append(f"{ip_count} IP address(es) found")
        
        # Check for email addresses
        email_count = len(indicators.get('emails', []))
        if email_count > 0:
            score += self.WEIGHTS['email']
            reasons.append(f"{email_count} email address(es) found")
        
        # Check for cryptocurrency addresses (MAJOR RED FLAG for ransomware)
        crypto_count = len(indicators.get('crypto_addresses', []))
        if crypto_count > 0:
            score += self.WEIGHTS['crypto_address']
            reasons.append(f"{crypto_count} cryptocurrency address(es) found (ransomware indicator!)")
        
        # Check for file hashes
        hash_count = len(indicators.get('file_hashes', []))
        if hash_count > 0:
            score += self.WEIGHTS['file_hash']
            reasons.append(f"{hash_count} file hash(es) found")
        
        # Check for multiple indicators (highly suspicious)
        total_indicators = indicators.get('total_count', 0)
        if total_indicators >= 5:
            score += self.WEIGHTS['multiple_indicators']
            reasons.append(f"High indicator count ({total_indicators} total)")
        
        # Cap score at 1.0
        score = min(score, 1.0)
        
        # Determine severity level
        severity = self._calculate_severity(score)
        
        result = {
            'score': round(score, 2),
            'severity': severity,
            'reasons': reasons,
            'total_indicators': total_indicators
        }
        
        logger.info(f"Calculated score: {score:.2f} ({severity})")
        return result
    
    def _check_suspicious_tlds(self, urls: List[str]) -> int:
        """
        Check for suspicious top-level domains
        
        WHY: Free domains like .tk are heavily used by attackers
        
        Args:
            urls (list): List of URLs
            
        Returns:
            int: Count of suspicious URLs
        """
        count = 0
        for url in urls:
            url_lower = url.lower()
            if any(tld in url_lower for tld in self.SUSPICIOUS_TLDS):
                count += 1
        return count
    
    def _check_urls_with_ports(self, urls: List[str]) -> int:
        """
        Check for URLs with non-standard ports
        
        WHY: C2 servers often use custom ports like :8080, :4444
        
        Args:
            urls (list): List of URLs
            
        Returns:
            int: Count of URLs with ports
        """
        count = 0
        for url in urls:
            # Look for :NNNN pattern (but not :80 or :443 which are standard)
            if ':' in url.split('//')[1] if '//' in url else url:
                # Extract port
                try:
                    port_part = url.split('//')[1].split(':')[1].split('/')[0]
                    port = int(port_part)
                    if port not in [80, 443]:  # Non-standard ports
                        count += 1
                except (IndexError, ValueError):
                    pass
        return count
    
    def _calculate_severity(self, score: float) -> str:
        """
        Convert numeric score to severity level
        
        WHY: Users understand "High Risk" better than "0.75"
        
        Args:
            score (float): Maliciousness score (0.0-1.0)
            
        Returns:
            str: Severity level
        """
        if score >= 0.7:
            return "High Severity - Likely Malicious"
        elif score >= 0.4:
            return "Moderate Severity - Suspicious"
        elif score >= 0.2:
            return "Low Severity - Potentially Risky"
        else:
            return "Minimal Severity - Likely Safe"
    
    def generate_explanation(self, score_result: Dict, indicators: Dict) -> str:
        """
        Generate human-readable explanation of score
        
        WHY: Users need to understand WHY something is dangerous
        
        Args:
            score_result (dict): Scoring result
            indicators (dict): Found indicators
            
        Returns:
            str: Detailed explanation
        """
        explanation = f"Maliciousness Score: {score_result['score']}/1.0\n"
        explanation += f"Severity: {score_result['severity']}\n\n"
        
        explanation += "Analysis:\n"
        for reason in score_result['reasons']:
            explanation += f"  • {reason}\n"
        
        if score_result['total_indicators'] == 0:
            explanation += "\nNo suspicious indicators found. File appears safe."
        elif score_result['score'] < 0.4:
            explanation += "\nSome indicators present but overall risk is low."
        elif score_result['score'] < 0.7:
            explanation += "\nMultiple suspicious indicators detected. Exercise caution."
        else:
            explanation += "\n⚠️  HIGH RISK: Strong indicators of malicious content. Do not open!"
        
        return explanation