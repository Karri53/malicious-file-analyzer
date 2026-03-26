# SCORING VALIDATION REPORT

## Overview

This report updates scoring validation using the expanded dataset of **1,000 total samples**:

- **500 malicious samples**
- **500 clean samples**
- File types per class:
  - **125 TXT**
  - **125 DOCX**
  - **125 PDF**
  - **125 PNG**

Validation was performed against the current `regex_patterns.py` extractor with this temporary rule:

> **Flag a file as malicious if at least one indicator is extracted.**

That rule is fine for extraction testing, but it is too aggressive to serve as a final malware score.

---

## Dataset Used

### Malicious dataset
Location: `backend/test_data/malicious/`

Contains generated samples with indicators such as:

- suspicious URLs
- non-standard ports
- IPv4 addresses
- attacker email addresses
- Bitcoin and Ethereum wallet addresses
- MD5, SHA1, and SHA256 hashes

### Clean dataset
Location: `backend/test_data/clean/`

Contains benign business, education, civic, and library-style documents. Some clean files intentionally include normal URLs, emails, or internal/private IPs to test false-positive behavior.

---

## Validation Method

Text extraction was performed as follows:

- **TXT**: direct text read
- **DOCX**: paragraph extraction
- **PDF**: embedded text extraction
- **PNG**: no OCR performed

Because PNG images were not OCR processed, image-only text was **not** analyzed by the regex engine in this validation pass.

---

## Summary Metrics

- **Total files tested:** 1000
- **Malicious files:** 500
- **Clean files:** 500

### Confusion Matrix

- **True Positives:** 375
- **True Negatives:** 361
- **False Positives:** 139
- **False Negatives:** 125

### Accuracy Metrics

- **Accuracy:** 73.60%
- **Precision:** 72.96%
- **Recall:** 75.00%
- **F1 Score:** 73.96%

---

## File-Type Breakdown

| Class | Type | Count | Correct | False Positives | False Negatives |
|---|---:|---:|---:|---:|---:|
| Malicious | TXT  | 125 | 125 | 0 | 0 |
| Malicious | DOCX | 125 | 125 | 0 | 0 |
| Malicious | PDF  | 125 | 125 | 0 | 0 |
| Malicious | PNG  | 125 | 0 | 0 | 125 |
| Clean | TXT  | 125 | 78 | 47 | 0 |
| Clean | DOCX | 125 | 76 | 49 | 0 |
| Clean | PDF  | 125 | 82 | 43 | 0 |
| Clean | PNG  | 125 | 125 | 0 | 0 |

---

## Main Findings

### 1. The regex extractor performs well on text-based malicious samples
All malicious **TXT, DOCX, and PDF** samples were flagged correctly in this dataset.

That means the current patterns are successfully extracting the indicator types they were designed for when the text is available in machine-readable form.

### 2. PNG-based malicious samples were missed
All **125 malicious PNG files** became false negatives in this validation.

Reason:
- the files contain indicator text visually,
- but there is **no OCR stage** in the current validation flow,
- so the regex engine never receives the embedded text.

This is the single largest source of false negatives.

### 3. Clean files with benign indicators are over-flagged
The current scoring rule flags any extracted indicator as suspicious. That causes many clean files to be marked malicious when they contain:

- normal email addresses
- benign public URLs
- internal/private IP addresses
- well-known public DNS IPs like `8.8.8.8` or `1.1.1.1`

This is the single largest source of false positives.

### 4. Extraction does not equal maliciousness
The regex patterns themselves are mostly behaving as extractors. The larger issue is the **scoring logic**.

Examples:
- A clean newsletter email address is still an email.
- A university or government website is still a URL.
- A private RFC1918 address is still an IP address.

So a binary rule of “any indicator = malicious” is too coarse.

---

## False Positive Examples

The following clean files were flagged because the scoring logic treated ordinary indicators as malicious:

1. **`clean_003.txt`**
   - extracted email: `newsletter@library.org`
   - issue: benign organizational email address

2. **`clean_005.txt`**
   - extracted URL: `https://contoso.com/resources.`
   - extracted IP: `10.0.0.5`
   - issue: benign URL plus private internal IP

3. **`clean_006.txt`**
   - extracted URL: `https://city.gov/resources.`
   - extracted IP: `8.8.8.8`
   - issue: benign civic URL and common infrastructure IP

4. **`clean_007.txt`**
   - extracted URL: `https://school.edu/resources.`
   - extracted IP: `192.168.1.10`
   - issue: benign education URL and private IP

5. **`clean_003.docx` / `clean_003.pdf`**
   - similar false-positive behavior repeated across file formats
   - issue: the underlying text is benign, but the same extraction rule is applied

---

## False Negative Examples

1. **`malicious_376.png`**
2. **`malicious_377.png`**
3. **`malicious_378.png`**
4. **`malicious_379.png`**
5. **`malicious_380.png`**

Reason for all of these:
- malicious indicators exist visually inside the image,
- no OCR pipeline was used,
- resulting indicator count = 0.

---

## Edge Cases Observed

### Trailing punctuation on URLs
Example extracted value:
- `https://contoso.com/resources.`

The URL regex currently includes trailing punctuation in some cases. That can make downstream normalization and comparison harder.

### Private IP addresses
Private addresses such as:
- `10.0.0.5`
- `192.168.1.10`
- `172.16.8.20`

are extracted correctly, but they should not automatically increase malicious score the same way as suspicious public IPs.

### Generic emails
Addresses such as:
- `hr@contoso.com`
- `advisor@school.edu`
- `newsletter@library.org`

are valid extractions, but they should not be treated as high-risk indicators without context.

### Image-only text
The current validation highlights a pipeline edge case:
- regex works only after text extraction,
- image files require OCR before regex matching can happen.

---

## Recommended Pattern and Scoring Improvements

### High-priority improvements

1. **Add OCR before regex scanning for image files**
   - Required for PNG/JPG indicator detection
   - This change would directly reduce the 125 image-based false negatives

2. **Separate extraction from scoring**
   - Keep regex extraction broad
   - Make scoring contextual
   - Example:
     - benign `.edu`, `.gov`, or company domains should score lower
     - suspicious TLDs and non-standard ports should score higher
     - private IPs should score lower than public IPs associated with C2 behavior

3. **Normalize extracted URLs**
   - Strip trailing punctuation such as `.`, `,`, `;`, `)`
   - This reduces noisy indicators and improves matching consistency

4. **Whitelist or de-prioritize known benign patterns**
   - internal/private IP ranges
   - common enterprise/support email formats
   - approved domains

### Regex-specific improvements

#### URL pattern
Current:
```python
r'https?://[^\s<>"{}|\^`\[\]]+'
```

Recommended direction:
- normalize punctuation after extraction, or
- tighten the regex so sentence-ending punctuation is excluded

#### Bitcoin pattern
Current:
```python
r'[13][a-km-zA-HJ-NP-Z1-9]{25,34}'
```

Recommended improvement:
- add support for **Bech32 (`bc1...`) Bitcoin addresses**
- current pattern only supports legacy Base58 styles beginning with `1` or `3`

#### IP scoring
The regex is acceptable for extraction because invalid IPv4 values are filtered after matching.
Recommended improvement:
- classify IPs into:
  - private
  - loopback
  - link-local
  - public
- only higher-risk categories should strongly affect score

#### Email scoring
Recommended improvement:
- do not treat all emails equally
- domain reputation or allowlist logic should be considered

---

## Recommended Next Steps

1. Integrate OCR for image files before calling the regex extractor.
2. Update scoring so that **indicator presence alone does not mark a file malicious**.
3. Add domain/TLD/IP reputation weighting.
4. Add URL cleanup/normalization.
5. Add dedicated tests for:
   - suspicious TLDs
   - non-standard ports
   - private vs public IPs
   - benign organizational emails
   - Bech32 Bitcoin addresses

---

## Deliverables Updated

- Test files:
  - `backend/test_data/malicious/`
  - `backend/test_data/clean/`

- Documentation:
  - `docs/SCORING_VALIDATION.md`

- Supporting outputs:
  - `docs/validation_results_1000.csv`
  - `docs/validation_results_1000.json`

---

## Final Assessment

Using the new 500/500 dataset, the current extractor-plus-binary-score approach achieved **73.60% accuracy**.

That number is acceptable for a first extraction pass, but it is not yet strong enough for production-style malware scoring because:

- image-based threats are missed without OCR
- benign indicators are over-penalized
- extraction is being treated as final classification

The most impactful upgrade is to **improve scoring context** and **add OCR support**.
