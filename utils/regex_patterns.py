"""
Regex Pattern Library
Patterns for extracting indicators of compromise from text.
Used to find URLs, IPs, emails, hashes, and cryptocurrency addresses.
"""

import re
from typing import List, Dict

class IndicatorExtractor:
    """
    Extracts security indicators from text using regex patterns.
    """
    
    # URL Pattern - finds http/https URLs
    URL_PATTERN = r'https?://[^\s<>"{}|\\^`\[\]]+'
    
    # IP Address Pattern - finds IPv4 addresses
    IP_PATTERN = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
    
    # Email Pattern - finds email addresses
    EMAIL_PATTERN = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    
    # Bitcoin Address Pattern - finds Bitcoin wallet addresses
    BITCOIN_PATTERN = r'\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b'
    
    # Ethereum Address Pattern - finds Ethereum wallet addresses
    ETHEREUM_PATTERN = r'\b0x[a-fA-F0-9]{40}\b'
    
    # MD5 Hash Pattern - 32 hex characters
    MD5_PATTERN = r'\b[a-fA-F0-9]{32}\b'
    
    # SHA1 Hash Pattern - 40 hex characters
    SHA1_PATTERN = r'\b[a-fA-F0-9]{40}\b'
    
    # SHA256 Hash Pattern - 64 hex characters
    SHA256_PATTERN = r'\b[a-fA-F0-9]{64}\b'
    
    def __init__(self):
        """Initialize extractor with compiled patterns"""
        self.patterns = {
            'url': re.compile(self.URL_PATTERN),
            'ip_address': re.compile(self.IP_PATTERN),
            'email': re.compile(self.EMAIL_PATTERN),
            'bitcoin': re.compile(self.BITCOIN_PATTERN),
            'ethereum': re.compile(self.ETHEREUM_PATTERN),
            'md5': re.compile(self.MD5_PATTERN),
            'sha1': re.compile(self.SHA1_PATTERN),
            'sha256': re.compile(self.SHA256_PATTERN)
        }
    
    def extract_urls(self, text: str) -> List[str]:
        """
        Extract all URLs from text
        
        WHY: URLs are primary malware delivery method
        
        Args:
            text (str): Text to search
            
        Returns:
            list: Found URLs
        """
        return list(set(self.patterns['url'].findall(text)))
    
    def extract_ip_addresses(self, text: str) -> List[str]:
        """
        Extract all IP addresses from text
        
        WHY: Command & control servers use IP addresses
        
        Args:
            text (str): Text to search
            
        Returns:
            list: Found IP addresses
        """
        ips = self.patterns['ip_address'].findall(text)
        # Filter out invalid IPs (e.g., 999.999.999.999)
        valid_ips = []
        for ip in ips:
            parts = ip.split('.')
            if all(0 <= int(part) <= 255 for part in parts):
                valid_ips.append(ip)
        return list(set(valid_ips))
    
    def extract_emails(self, text: str) -> List[str]:
        """
        Extract all email addresses from text
        
        WHY: Phishing emails contain attacker contact info
        
        Args:
            text (str): Text to search
            
        Returns:
            list: Found email addresses
        """
        return list(set(self.patterns['email'].findall(text)))
    
    def extract_crypto_addresses(self, text: str) -> List[Dict]:
        """
        Extract cryptocurrency addresses from text
        
        WHY: Ransomware demands payment to crypto wallets
        
        Args:
            text (str): Text to search
            
        Returns:
            list: Found crypto addresses with types
        """
        addresses = []
        
        # Bitcoin addresses
        bitcoin = self.patterns['bitcoin'].findall(text)
        for addr in bitcoin:
            addresses.append({'type': 'bitcoin', 'value': addr})
        
        # Ethereum addresses
        ethereum = self.patterns['ethereum'].findall(text)
        for addr in ethereum:
            addresses.append({'type': 'ethereum', 'value': addr})
        
        return addresses
    
    def extract_file_hashes(self, text: str) -> List[Dict]:
        """
        Extract file hashes from text
        
        WHY: Malware samples identified by hash values
        
        Args:
            text (str): Text to search
            
        Returns:
            list: Found hashes with types
        """
        hashes = []
        
        # SHA256 (check first - most specific)
        sha256 = self.patterns['sha256'].findall(text)
        for h in sha256:
            hashes.append({'type': 'sha256', 'value': h})
        
        # SHA1
        sha1 = self.patterns['sha1'].findall(text)
        for h in sha1:
            # Exclude if already found as SHA256
            if not any(existing['value'] == h for existing in hashes):
                hashes.append({'type': 'sha1', 'value': h})
        
        # MD5
        md5 = self.patterns['md5'].findall(text)
        for h in md5:
            # Exclude if already found as SHA1 or SHA256
            if not any(existing['value'] == h for existing in hashes):
                hashes.append({'type': 'md5', 'value': h})
        
        return hashes
    
    def extract_all_indicators(self, text: str) -> Dict:
        """
        Extract all indicators from text
        
        WHY: One-stop function to find everything
        
        Args:
            text (str): Text to search
            
        Returns:
            dict: All found indicators organized by type
        """
        indicators = {
            'urls': self.extract_urls(text),
            'ip_addresses': self.extract_ip_addresses(text),
            'emails': self.extract_emails(text),
            'crypto_addresses': self.extract_crypto_addresses(text),
            'file_hashes': self.extract_file_hashes(text),
            'total_count': 0
        }
        
        # Calculate total
        indicators['total_count'] = (
            len(indicators['urls']) +
            len(indicators['ip_addresses']) +
            len(indicators['emails']) +
            len(indicators['crypto_addresses']) +
            len(indicators['file_hashes'])
        )
        
        return indicators