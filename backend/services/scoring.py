"""
Malicious Scoring Algorithm
Calculates maliciousness score based on found indicators.
Score ranges from 0.0 (safe) to 1.0 (highly malicious).
"""

import logging
import re
from typing import Dict, List

logger = logging.getLogger(__name__)


class MaliciousScorer:
    """
    Calculates maliciousness score based on indicators found in file.
    """

    # Scoring weights
    WEIGHTS = {
        "url": 0.18,
        "extra_url": 0.05,
        "suspicious_tld": 0.20,
        "ip_address": 0.12,
        "email": 0.08,
        "crypto_address": 0.30,
        "port_in_url": 0.18,
        "phishing_keyword": 0.10,
        "multiple_indicators": 0.15,
        "combo_bonus": 0.15,
        "url_path_keyword": 0.10,
        "dangerous_url_extension": 0.20,
        "ip_based_url": 0.15,
        "url_shortener": 0.12,
    }

    # Suspicious top-level domains often used by attackers
    SUSPICIOUS_TLDS = [".tk", ".ml", ".ga", ".cf", ".gq", ".zip", ".top", ".work"]

    # Phishing keywords often used
    PHISHING_KEYWORDS = [
        "urgent",
        "immediately",
        "click",
        "reset password",
        "verify account",
        "verify your account",
        "login",
        "sign in",
        "action required",
        "confirm account",
        "update account",
    ]

    URL_PATH_KEYWORDS = [
        "login",
        "verify",
        "update",
        "secure",
        "invoice",
        "payment",
        "reset",
        "signin",
        "auth",
        "confirm",
    ]

    DANGEROUS_URL_EXTENSIONS = [
        ".exe",
        ".zip",
        ".scr",
        ".js",
        ".bat",
        ".docm",
        ".xlsm",
        ".rar",
    ]

    URL_SHORTENERS = [
        "bit.ly",
        "tinyurl.com",
        "t.co",
        "goo.gl",
        "rb.gy",
    ]

    def __init__(self):
        """Initialize scorer"""
        logger.info("MaliciousScorer initialized")

    def calculate_score(
        self, indicators: Dict, email_text: str = "", file_type: str = ""
    ) -> Dict:
        """
        Calculate maliciousness score based on indicators
        """
        score = 0.0
        reasons = []
        is_email_file = file_type == ".eml"

        port_urls = 0
        phishing_hits = 0

        # Check for URLs
        url_count = len(indicators.get("urls", []))
        if url_count > 0:
            score += 0.03 if is_email_file else self.WEIGHTS["url"]
            reasons.append(f"{url_count} URL(s) found")

            suspicious_urls = self._check_suspicious_tlds(indicators.get("urls", []))
            if suspicious_urls > 0:
                score += self.WEIGHTS["suspicious_tld"]
                reasons.append(
                    f"{suspicious_urls} suspicious domain(s) (.tk, .ml, etc.)"
                )

            port_urls = self._check_urls_with_ports(indicators.get("urls", []))
            if port_urls > 0:
                score += self.WEIGHTS["port_in_url"]
                reasons.append(f"{port_urls} URL(s) with non-standard ports")

            path_keyword_hits = self._check_url_path_keywords(
                indicators.get("urls", [])
            )
            if path_keyword_hits > 0:
                score += self.WEIGHTS["url_path_keyword"]
                reasons.append(
                    f"{path_keyword_hits} suspicious URL path keyword(s) found"
                )

            dangerous_ext_hits = self._check_dangerous_url_extensions(
                indicators.get("urls", [])
            )
            if dangerous_ext_hits > 0:
                score += self.WEIGHTS["dangerous_url_extension"]
                reasons.append(
                    f"{dangerous_ext_hits} dangerous file extension URL(s) found"
                )

            ip_url_hits = self._check_ip_based_urls(indicators.get("urls", []))
            if ip_url_hits > 0:
                score += self.WEIGHTS["ip_based_url"]
                reasons.append(f"{ip_url_hits} IP-based URL(s) found")

            shortener_hits = self._check_url_shorteners(indicators.get("urls", []))
            if shortener_hits > 0:
                score += self.WEIGHTS["url_shortener"]
                reasons.append(f"{shortener_hits} shortened URL(s) found")

            if url_count >= 2:
                extra_weight = 0.01 if is_email_file else self.WEIGHTS["extra_url"]
                score += min(
                    0.08 if is_email_file else 0.20, (url_count - 1) * extra_weight
                )
                reasons.append(f"Multiple URLs found ({url_count})")

        # Check for phishing language in email/body text
        phishing_hits = self._check_phishing_keywords(email_text)
        if phishing_hits > 0:
            score += min(0.25, phishing_hits * self.WEIGHTS["phishing_keyword"])
            reasons.append(f"{phishing_hits} phishing keyword(s) found")

        # Check for IP addresses
        ip_count = len(indicators.get("ip_addresses", []))
        if ip_count > 0:
            score += self.WEIGHTS["ip_address"]
            reasons.append(f"{ip_count} IP address(es) found")

        # Check for email addresses
        email_count = len(indicators.get("emails", []))
        if email_count > 0:
            score += 0.02 if is_email_file else self.WEIGHTS["email"]
            reasons.append(f"{email_count} email address(es) found")

        # Check for cryptocurrency addresses
        crypto_count = len(indicators.get("crypto_addresses", []))
        if crypto_count > 0:
            score += self.WEIGHTS["crypto_address"]
            reasons.append(
                f"{crypto_count} cryptocurrency address(es) found (ransomware indicator!)"
            )

        # Check for multiple indicators
        total_indicators = indicators.get("total_count", 0)
        if total_indicators >= (30 if is_email_file else 5):
            score += self.WEIGHTS["multiple_indicators"]
            reasons.append(f"High indicator count ({total_indicators} total)")

        # Combo bonus
        categories = 0
        if url_count > 0:
            categories += 1
        if ip_count > 0:
            categories += 1
        if email_count > 0:
            categories += 1
        if crypto_count > 0:
            categories += 1
        if phishing_hits > 0:
            categories += 1

        if categories >= (4 if is_email_file else 3):
            score += self.WEIGHTS["combo_bonus"]
            reasons.append("Multiple suspicious indicator types detected")

        if not is_email_file and url_count > 0 and email_count > 0:
            score += 0.15
            reasons.append("URL combined with email address")
        elif is_email_file and url_count > 0 and email_count > 0 and phishing_hits > 0:
            score += 0.05
            reasons.append("Email contains links plus phishing language")

        if url_count > 0 and port_urls > 0:
            score += 0.15
            reasons.append("URL uses suspicious network port")

        if url_count > 0 and phishing_hits > 0:
            score += 0.04 if is_email_file else 0.10
            reasons.append("Phishing language combined with URL")

        # Cap score at 1.0
        score = min(score, 1.0)

        severity = self._calculate_severity(score)

        result = {
            "score": round(score, 2),
            "severity": severity,
            "reasons": reasons,
            "total_indicators": total_indicators,
        }

        logger.info(f"Calculated score: {score:.2f} ({severity})")
        return result

    def _check_suspicious_tlds(self, urls: List[str]) -> int:
        count = 0
        for url in urls:
            url_lower = url.lower()
            if any(tld in url_lower for tld in self.SUSPICIOUS_TLDS):
                count += 1
        return count

    def _check_urls_with_ports(self, urls: List[str]) -> int:
        count = 0
        for url in urls:
            try:
                target = url.split("//")[1] if "//" in url else url
                if ":" in target:
                    port_part = target.split(":")[1].split("/")[0]
                    port = int(port_part)
                    if port not in [80, 443]:
                        count += 1
            except (IndexError, ValueError):
                pass
        return count

    def _check_phishing_keywords(self, text: str) -> int:
        if not text:
            return 0

        text_lower = text.lower()
        count = 0
        for keyword in self.PHISHING_KEYWORDS:
            if keyword in text_lower:
                count += 1
        return count

    def _check_url_path_keywords(self, urls: List[str]) -> int:
        count = 0
        for url in urls:
            url_lower = url.lower()
            if any(keyword in url_lower for keyword in self.URL_PATH_KEYWORDS):
                count += 1
        return count

    def _check_dangerous_url_extensions(self, urls: List[str]) -> int:
        count = 0
        for url in urls:
            url_lower = url.lower()
            if any(ext in url_lower for ext in self.DANGEROUS_URL_EXTENSIONS):
                count += 1
        return count

    def _check_ip_based_urls(self, urls: List[str]) -> int:
        count = 0
        ip_pattern = re.compile(r"https?://(?:\d{1,3}\.){3}\d{1,3}")
        for url in urls:
            if ip_pattern.search(url):
                count += 1
        return count

    def _check_url_shorteners(self, urls: List[str]) -> int:
        count = 0
        for url in urls:
            url_lower = url.lower()
            if any(shortener in url_lower for shortener in self.URL_SHORTENERS):
                count += 1
        return count

    def _calculate_severity(self, score: float) -> str:
        if score >= 0.65:
            return "High Severity"
        elif score >= 0.40:
            return "Moderate Severity"
        elif score >= 0.20:
            return "Low Severity"
        else:
            return "Minimal Severity"

    def generate_explanation(self, score_result: Dict, indicators: Dict) -> str:
        explanation = f"Maliciousness Score: {score_result['score']}/1.0\n"
        explanation += f"Severity: {score_result['severity']}\n\n"

        explanation += "Analysis:\n"
        for reason in score_result["reasons"]:
            explanation += f"  • {reason}\n"

        if score_result["total_indicators"] == 0:
            explanation += "\nNo suspicious indicators found. File appears safe."
        elif score_result["score"] < 0.4:
            explanation += "\nSome indicators present but overall risk is low."
        elif score_result["score"] < 0.7:
            explanation += (
                "\nMultiple suspicious indicators detected. Exercise caution."
            )
        else:
            explanation += (
                "\n⚠️  HIGH RISK: Strong indicators of malicious content. Do not open!"
            )

        return explanation
