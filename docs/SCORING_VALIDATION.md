# Scoring Validation Report

## Scope
This validation pass focused on the indicator classes currently implemented in `regex_patterns.py`: URLs, IPv4 addresses, emails, Bitcoin addresses, Ethereum addresses, and file hashes (MD5, SHA1, SHA256). The extraction targets match the malicious-file-analyzer proposal, which explicitly calls for URLs/URIs, IP addresses, emails, hashes, and cryptocurrency addresses. fileciteturn0file1 fileciteturn0file0

## What was created
Dataset folders were created here:

- `backend/test_data/malicious/` — 24 files
- `backend/test_data/clean/` — 24 files

File mix in each class:

- 6 TXT
- 6 DOCX
- 6 PDF
- 6 PNG images with embedded text

The malicious set includes suspicious TLDs (`.top`, `.zip`, `.xyz`, `.ru`), non-standard ports (`:8080`, `:8443`, `:9443`, `:31337`), IPv4 addresses, email addresses, Bitcoin/Ethereum wallets, and hash values. The clean set intentionally includes legitimate URLs, emails, IPs, and hashes so false positives can be measured.

## Test method
Because the full repository and runner scripts (`test_regex_patterns.py`, `test_scoring.py`, `test_complete_analysis.py`) were not present in the environment, validation was run directly against the uploaded `regex_patterns.py` implementation and the generated files.

Extraction path used:

- TXT: plain text read
- DOCX: `python-docx`
- PDF: `pypdf`
- PNG: no OCR available in the current validation harness, so image text was treated as unreadable by the regex layer

Classification rule used for this validation:

- **Predicted malicious** if `total_count > 0`
- **Predicted clean** if `total_count == 0`

This is a regex-only proxy score, not a full malware verdict.

## Totals

- Total files tested: **48**
- Malicious files: **24**
- Clean files: **24**

Confusion matrix:

- True positives: **15**
- True negatives: **14**
- False positives: **10**
- False negatives: **9**

Metrics:

- Accuracy: **60.42%**
- Precision: **60.00%**
- Recall: **62.50%**

## False positives
The current patterns are effective at extraction, but extraction alone is not enough to determine maliciousness. These clean files were flagged only because they contained benign indicators:

1. `contacts_06.txt` — legitimate emails
2. `dev_notes_05.txt` — localhost-style development IP
3. `finance_12.docx` — legitimate HTTPS URL on port 443
4. `howto_15.pdf` — benign internal documentation URL
5. `internship_10.docx` — lab whitelist IP
6. `lab_16.pdf` — private lab IPs
7. `newsletter_08.docx` — normal website URL
8. `reference_11.docx` — benign software checksum
9. `release_17.pdf` — benign MD5 release checksum
10. `support_18.pdf` — helpdesk email

### False-positive takeaway
A file should **not** be scored as malicious just because it contains an indicator. Context matters.

## False negatives
These malicious files were missed:

1. `bech32_pdf_17.pdf` — uses `bc1...` Bitcoin format, unsupported by current Bitcoin regex
2. `edge_obfuscated_05.txt` — uses `hxxps://`, unsupported by strict URL regex
3. `missing_scheme_12.docx` — domain/path without `http://` or `https://`
4. `screen_19.png`
5. `screen_20.png`
6. `screen_21.png`
7. `screen_22.png`
8. `screen_23.png`
9. `screen_24.png`

### False-negative takeaway
There are two major gaps:

- Pattern coverage gaps for obfuscated or newer indicator formats
- File-ingestion gap for image-based text when OCR is absent

## Pattern-specific findings

### URLs
**Works for:**
- `https://evil.top/login`
- `http://example.com:8080/path`
- `https://cdn.bad.zip:8443/dropper.exe?x=1`

**Misses:**
- `hxxps://obfuscated.top/login`
- `update-center.top/path`
- `ftp://files.bad.top/payload`

### IP addresses
**Works for:**
- Normal IPv4 values
- Non-routable/private IPs
- Values with leading zeros such as `010.000.000.001`

**Misses correctly:**
- `999.999.999.999`

**Risk:**
Leading-zero addresses may be treated as valid even when they are log artifacts or ambiguous octal-like forms.

### Emails
**Works for:**
- Standard email addresses
- Plus-addressing like `user+tag@example.com`

**Misses:**
- Unicode-homoglyph addresses like `admіn@secure.top`

### Cryptocurrency
**Bitcoin works for:**
- Legacy `1...` addresses
- Script-hash `3...` addresses

**Bitcoin misses:**
- Bech32 `bc1...` addresses

**Ethereum works for:**
- Standard `0x` + 40 hex addresses

### Hashes
MD5, SHA1, and SHA256 extraction works correctly for straight hex strings, but there is no contextual check for phrases like `checksum`, `official release`, or `known-good`, so benign hashes can raise the score.

## Recommended regex improvements

### 1) Expand Bitcoin coverage to include Bech32
Current:
```python
r'\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b'
```

Recommended:
```python
r'\b(?:[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[ac-hj-np-z02-9]{11,71})\b'
```

### 2) Add optional support for obfuscated URLs
Keep the strict pattern for standard extraction, but add a second pattern for suspicious obfuscation:

```python
r'\b(?:https?|hxxps?)://[^\s<>"{}|\\^`\[\]]+'
```

### 3) Add a bare-domain indicator pattern
This helps catch malicious text like `update-center.top/path`:

```python
r'\b(?:[A-Za-z0-9-]+\.)+(?:top|zip|xyz|ru|click|shop|work)(?::\d{2,5})?(?:/[^
\s]*)?'
```

### 4) Keep extraction separate from malicious scoring
Recommended scoring logic:

- benign public site on port 443: low weight
- suspicious TLD: higher weight
- non-standard port on suspicious domain: higher weight
- multiple indicator types in one file: higher weight
- crypto wallet + ransom language: very high weight
- checksum near words like `release`, `official`, `SHA256`: lower weight unless paired with other malicious indicators

### 5) Add OCR or image text extraction
Without OCR, image-based lures and screenshots will be missed entirely.

### 6) Add context-aware allowlists
Examples:

- `127.0.0.1`, `localhost`, `10.0.0.0/8`, `192.168.0.0/16` in development docs
- internal documentation URLs
- helpdesk/support emails
- known-good software checksums in release notes

## Edge cases worth keeping in regression tests

- `bc1...` Bitcoin wallets
- `hxxp://` / `hxxps://` obfuscated URLs
- domain/path values with no scheme
- Unicode homoglyph emails/domains
- URLs ending with punctuation in prose
- private IPs in benign IT documentation
- legitimate SHA256 checksums in release notes
- screenshots containing malicious text

## Screenshots of results
Generated screenshots:

- `docs/test_results_screenshot_1.png`
- `docs/test_results_screenshot_2.png`

## Additional artifacts
Generated alongside this report:

- `docs/validation_results.json`
- `docs/validation_results.csv`
- `docs/pattern_test_results.json`
- `docs/validation_summary.txt`
- `docs/validation_run_output.txt`

## Bottom line
The current regex library is a solid first-pass extractor, but it is **not sufficient as a standalone maliciousness scorer**. The biggest issues are:

1. benign indicators causing false positives
2. unsupported indicator variants causing false negatives
3. image-based text being invisible without OCR

The fastest improvements would be:

- support `bc1...` Bitcoin addresses
- support obfuscated and bare-domain URLs
- add OCR for image files
- move from “indicator exists” scoring to weighted, context-aware scoring
