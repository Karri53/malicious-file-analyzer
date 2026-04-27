<div align="center">
  <img src="frontend/frontend-app/public/OpulenceLogo.png" alt="Team Opulence Logo" width="150"/>
  <br></br>
  <img src="NEXUS Logo.png" alt="NEXUS Logo" height="600" width="600"/>
  
  **Malicious File Analyzer**
  
  
  > NSA Senior Design Project | Prairie View A&M University | Fall 2025 – Spring 2026
  
  [![Project Status](https://img.shields.io/badge/Status-Production%20Ready-green)](https://github.com/Karri53/malicious-file-analyzer)
  [![Timeline](https://img.shields.io/badge/Timeline-Fall%202025%20--%20Spring%202026-blue)](https://github.com/Karri53/malicious-file-analyzer)
  [![Team](https://img.shields.io/badge/Team-Team%20Opulence-purple)](https://github.com/Karri53/malicious-file-analyzer)
</div>

---

## 📋 Table of Contents
- [Overview](#overview)
- [Team Members](#team-members)
- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [Key Differentiators](#key-differentiators)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Presentations & Deliverables](#presentations--deliverables)
- [Current Progress](#current-progress)
- [Documentation](#documentation)
- [Performance Metrics](#performance-metrics)

---

## 🎯 Overview

**NEXUS** (Advanced Static Analysis & Threat Intelligence) addresses a critical cybersecurity challenge: **how can organizations analyze potentially malicious files with speed, transparency, and privacy?**

Built in partnership with the **National Security Agency (NSA)**, this platform enables users to analyze suspicious files through three methods: direct file upload, URL analysis, or .eml email file processing. All file processing occurs with complete metadata extraction, providing forensic-level detail at real-time speed.

**Project Duration:** Fall 2025 – Spring 2026  
**IAC Presentation:** April 24, 2026  
**Final Presentation:** April 28, 2026  
**Status:** Production Ready

---

## 👥 Team Members

**Team Opulence**

| Role | Name | Responsibilities | GitHub |
|------|------|-----------------|--------|
| **Project Lead** | Karrington Hall | System architecture, backend development, Snowflake integration, team coordination | [@Karri53](https://github.com/Karri53) |
| **UI/UX Developer** | Kendall Brown | React frontend, user experience, responsive design, accessibility | [@kbrownpv](https://github.com/kbrownpv) |
| **Testing & Data Evaluator** | LeMikkos Starks | RegEx pattern validation, test dataset creation, performance benchmarking | [@lstarks1513](https://github.com/lstarks1513) |
| **Backend Developer** | Brandon Nobles | Flask API development, file processing engine, .eml parsing | [@BRegardQ](https://github.com/BRegardQ) |

**Course Instructor:** Dr. Noushin Ghaffari  
**NSA Academic Liaison:** Dr. Gregory Stevenson  
**NSA Software Engineer:** Mr. Andrew Hutton  
**Snowflake Senior Engineer:** Mr. Jonathan Martindale

**Graduation Date:** May 9, 2026

---

## ❓ The Problem

**Current Reality:**
- Organizations receive potentially malicious files via email, downloads, and file transfers
- Traditional antivirus provides scores without explanation (black box approach)
- Manual analysis takes 2-4 hours per file
- Existing tools require uploading sensitive data to third-party servers
- Privacy concerns limit adoption in healthcare, finance, and legal sectors

**Real-World Impact:**
- **$4.45M** average cost of a data breach *(IBM 2023)*
- **45%** of malware delivered through files, links, and phishing content
- **92%** of organizations rely on signature-based detection (only catches known threats)
- **2-4 hours** required for manual file analysis

---

## ✨ Our Solution

A **multi-vector analysis platform** combining speed, transparency, and privacy:

### 📁 File Upload Analysis
```
User uploads file → Static analysis performed
↓
Complete metadata extracted (IPs, URLs, registry keys, hidden text)
↓
Results displayed with threat score and evidence
```

### 🔗 URL Analysis
```
User pastes file URL → File fetched in isolated environment
↓
Analyzed without downloading to user's device
↓
Results displayed instantly
```

### 📧 Email File Analysis (.eml)
```
User uploads .eml file → Email metadata and attachments extracted
↓
Analyzed for phishing indicators and malicious content
↓
Complete threat assessment provided
```

**All methods use static analysis** (reading files, not executing them) with complete metadata extraction.

---

## 🎯 Key Differentiators

### 1. Explainable Results
Unlike VirusTotal or traditional AV that provides only scores, NEXUS shows **why** files are flagged:
- Suspicious IP addresses and domains
- Phishing language and keywords
- Dangerous file extensions in URLs
- Hidden text extracted via OCR (Tesseract)
- Behavioral indicators with weighted scoring and combo bonuses

### 2. Privacy-First Architecture
- Files analyzed **in memory only**
- **Immediately discarded** after analysis
- Only metadata retained (30-day retention in Snowflake)
- **No third-party uploads**

### 3. Multi-Vector Analysis
- File upload (.pdf, .docx, .txt, .eml, .png, .jpg, .jpeg, .webp)
- URL analysis (remote fetching in sandbox with 10MB limit and 30s timeout)
- Email file processing (.eml with header, body, and attachment extraction)

### 4. Performance
- **<8 seconds** average processing time
- **90% detection accuracy** (90–95% on text-based files, 65–80% on PDFs, 30–60% on images)
- **30x faster** than manual analysis

---

## 🚀 Features

### Core Capabilities
- ✅ Static file analysis for 8 supported file formats
- ✅ Automated indicator extraction (15+ regex patterns)
  - IPv4 addresses
  - URLs and domains
  - Email addresses
  - Cryptocurrency addresses (Bitcoin, Ethereum)
  - File hashes (MD5, SHA1, SHA256)
  - Phishing keywords and suspicious patterns
- ✅ OCR text extraction from images (Tesseract)
- ✅ Behavioral scoring algorithm (0–100 scale)
- ✅ Severity classification (Clean / Warning / Malicious)
- ✅ Complete file metadata (type, size, MD5, SHA256)
- ✅ Historical scan tracking in Snowflake
- ✅ Professional UI with responsive design
- ✅ Accessibility compliant (WCAG 2.1 AA)
- ✅ Dark/light mode support

### Analysis Methods
- **File Upload** – Direct file analysis with drag-and-drop
- **URL Analysis** – Remote file fetching and analysis
- **Email Analysis** – .eml file processing with header/body extraction

### Results & Reporting
- Visual threat score gauge (color-coded: green/amber/red)
- Human-readable explanations for every indicator found
- Detailed indicator breakdown with severity badges
- File metadata display (hashes, type, size, scan time)
- Scan history with clickable results

---

## 🛠️ Technology Stack

### Frontend
```
React 18                - UI framework
Vite                    - Build tool
Responsive CSS          - Custom styling (inline)
Axios                   - HTTP client
React Router v6         - Navigation
WCAG 2.1 AA             - Accessibility standards
```

### Backend
```
Python 3.11             - Core language
Flask                   - Web framework & API routing
pdfplumber              - PDF text extraction
python-docx             - Word document parsing
Pillow                  - Image processing & preprocessing
pytesseract             - OCR engine (Tesseract wrapper)
Tesseract OCR           - Hidden text extraction from images
requests                - URL downloading with safety controls
hashlib                 - MD5 & SHA256 file hashing
```

### Database
```
Snowflake               - Cloud data warehouse
                        - 3 tables: scan_results, scan_indicators, scan_reasons
                        - 30-day metadata retention
                        - MFA authentication support
                        - Mock client for development
```

### DevOps & Tools
```
Git/GitHub              - Version control
Python venv             - Virtual environments
npm                     - Frontend package management
```

---

## 📁 Project Structure

```
malicious-file-analyzer/
│
├── backend/                          # Python Flask API
│   ├── services/                     # Business logic
│   │   ├── file_processor.py         # ✅ Multi-format file parsing
│   │   ├── scoring.py                # ✅ Threat scoring algorithm
│   │   ├── snowflake_client.py       # ✅ Snowflake factory pattern
│   │   ├── real_snowflake_client.py  # ✅ Production Snowflake client
│   │   ├── mock_snowflake_client.py  # ✅ Development mock client
│   │   └── url_downloader.py         # ✅ Safe URL fetching
│   │
│   ├── utils/                        # Helper functions
│   │   └── regex_patterns.py         # ✅ 15+ indicator patterns
│   │
│   ├── test_data/                    # Test datasets
│   │   ├── malicious/                # ✅ 500 malicious samples
│   │   └── clean/                    # ✅ 500 clean samples
│   │
│   ├── tests/                        # Unit & integration tests
│   ├── app.py                        # ✅ Main Flask application
│   ├── requirements.txt              # ✅ Python dependencies
│   └── .env.example                  # ✅ Environment variables
│
├── frontend/frontend-app/            # React application
│   ├── public/                       # Static assets
│   │   └── OpulenceLogo.png          # ✅ Team logo
│   │
│   ├── src/
│   │   ├── components/               # UI components
│   │   │   ├── Nav.jsx               # ✅ Navigation bar
│   │   │   └── Footer.jsx            # ✅ Footer component
│   │   │
│   │   ├── pages/                    # Page components
│   │   │   ├── Home.jsx              # ✅ Landing page
│   │   │   ├── URLAnalyzer.jsx       # ✅ URL analysis
│   │   │   ├── FileUpload.jsx        # ✅ File upload (.eml support)
│   │   │   └── Results.jsx           # ✅ Results display
│   │   │
│   │   ├── utils/                    # Utilities
│   │   │   ├── ThemeContext.jsx       # ✅ Dark/light mode context
│   │   │   └── scoreUtils.js         # ✅ Score normalization
│   │   │
│   │   ├── services/                 # API layer
│   │   │   └── api.js                # ✅ Axios API calls
│   │   │
│   │   ├── App.jsx                   # ✅ Main component
│   │   ├── App.css                   # ✅ Global styles
│   │   └── index.js                  # ✅ Entry point
│   │
│   ├── package.json                  # ✅ Dependencies
│   └── tailwind.config.js            # ✅ Tailwind configuration
│
├── docs/                             # Documentation
│   ├── wireframes/                   # ✅ UI design mockups
│   ├── API_REFERENCE.md              # ✅ REST API documentation
│   ├── BACKEND_IMPROVEMENTS.md       # ✅ Code review notes
│   ├── EMAIL_ARCHITECTURE.md         # ✅ Email processing design
│   ├── SNOWFLAKE_SETUP_GUIDE.md      # ✅ Database setup
│   ├── TEAM_ONBOARDING.md            # ✅ Dev environment setup
│   └── UI_DESIGN.md                  # ✅ Frontend specifications
│
├── presentations/                    # Presentation deliverables
│   ├── IAC_Presentation_04-24-2026.pptx          # ✅ IAC presentation (non-technical)
│   ├── NEXUS_Final_Presentation_04-28-2026.pptx   # ✅ Final presentation (technical)
│   ├── NEXUS_Technical_Memo.docx                  # ✅ Technical memo handout
│   └── NEXUS_Live_Demo.mp4                        # ✅ Live demonstration recording
│
├── scripts/                          # Utility scripts
│   └── setup_snowflake.sql           # ✅ Database schema
│
├── .gitignore                        # ✅ Git ignore rules
├── README.md                         # ✅ This file
└── LICENSE                           # MIT License
```

---

## 🚀 Getting Started

### Prerequisites

**Required Software:**
- **Python 3.11+** – [Download](https://www.python.org/downloads/)
- **Node.js 18+** – [Download](https://nodejs.org/)
- **Git** – [Download](https://git-scm.com/)
- **Tesseract OCR** – Required for image text extraction

### Tesseract OCR Installation

**macOS (Homebrew):**
```bash
brew install tesseract
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install tesseract-ocr libtesseract-dev
```

**Windows:**
1. Download installer from [GitHub Tesseract releases](https://github.com/UB-Mannheim/tesseract/wiki)
2. Run installer and note installation path
3. Add Tesseract to PATH: `C:\Program Files\Tesseract-OCR`

**Verify Installation:**
```bash
tesseract --version
```

### Quick Start

**Step 1: Clone Repository**
```bash
git clone https://github.com/Karri53/malicious-file-analyzer.git
cd malicious-file-analyzer
```

**Step 2: Backend Setup**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Step 3: Configure Environment**
```bash
cp .env.example .env
# Edit .env with Snowflake credentials (or leave USE_REAL_SNOWFLAKE=false for dev mode)
```

**Step 4: Run Backend**
```bash
python app.py
# API available at http://localhost:5000
```

**Step 5: Frontend Setup**
```bash
cd ../frontend/frontend-app
npm install
npm run dev
# UI available at http://localhost:3000
```

### Environment Modes

| Mode | Setting | Database | Auth Required |
|------|---------|----------|---------------|
| **Development** (default) | `USE_REAL_SNOWFLAKE=false` | MockSnowflakeClient (in-memory) | No |
| **Production** | `USE_REAL_SNOWFLAKE=true` | Snowflake Cloud | MFA passcode |

The application behavior is identical in both modes — the frontend never knows which database backend is active.

### Database Setup

See [docs/SNOWFLAKE_SETUP_GUIDE.md](docs/SNOWFLAKE_SETUP_GUIDE.md) for complete Snowflake configuration.

---

## 🎬 Presentations & Deliverables

### Presentations

| Deliverable | Audience | Date | Description |
|------------|----------|------|-------------|
| [**IAC Presentation**](https://drive.google.com/file/d/1LUGC_jKVcXDpKHvKz-T46vrX8VTAXrJm/view?usp=sharing) | Industry Advisory Council | April 24, 2026 | Non-technical overview: problem statement, solution, user experience, and live demo for industry professionals and faculty |
| [**Final Technical Presentation**](https://drive.google.com/file/d/18aQoWu9vcyPlacJPeKa4_W2HhSa52LeG/view?usp=sharing) | Course Instructor & NSA | April 28, 2026 | Technical deep-dive: system architecture, codebase walkthrough, scoring engine, testing methodology, and live demo |

### Supporting Materials

| Deliverable | Format | Description |
|------------|--------|-------------|
| [**Technical Memo**](https://drive.google.com/file/d/1D9W8sFt37jOmXKBLmv88f2hzsd7ArS6q/view?usp=sharing) | PDF (.pdf) | Printed handout accompanying the IAC presentation — mirrors slide content with figure captions, technical glossary (Appendix A), and team contact information |
| [**Live Demo Recording**](https://drive.google.com/file/d/1tkNvwVEn6SU5lfFwT5B3pAnhz6tdmuaj/view?usp=sharing) | Video (.mp4) | Full walkthrough of all three analysis methods: file upload (malicious + clean), URL analysis, and .eml email scanning with results interpretation |

### Presentation Structure

**IAC Presentation (Non-Technical, ~20 min):**
1. Problem Statement & AT&T Case Study
2. Our Solution: NEXUS
3. System Architecture (high-level)
4. Frontend Design & User Experience
5. Testing & Performance Results
6. Live Demonstration
7. Conclusion & Q&A

**Final Technical Presentation (~20 min):**
1. Problem Statement
2. Our Solution
3. Project Timeline & Tech Stack
4. System Architecture & Tool Integration
5. Backend Implementation (code walkthroughs)
6. Frontend Design & User Experience
7. Testing & Validation Results
8. Live Demonstration
9. Conclusion & Q&A

---

## 📊 Current Progress

**Project Status:** Production Ready  
**Completion:** 100%

### Fall 2025 – Project Initiation

- Requirements gathering with NSA liaisons
- Technology stack selection and architecture design
- Team role assignment and initial research

### Spring 2026 – Development & Completion

**Backend Development (Weeks 1–3):**
- Flask API with 3 analysis endpoints + 2 utility endpoints (results, health check)
- File processing engine supporting 8 formats (PDF, DOCX, TXT, PNG, JPG, JPEG, WebP, EML)
- RegEx pattern library with 15+ detection patterns (URLs, IPs, emails, crypto addresses, file hashes)
- Weighted scoring algorithm with combination bonuses and email-context calibration
- Tesseract OCR integration with 4-step image preprocessing pipeline
- Snowflake database integration with MFA authentication and mock client fallback
- URL downloader with 10MB size limit, 30s timeout, and streaming safety controls

**Frontend Development (Weeks 4–5):**
- React application with Vite build tooling
- Three analysis pages: File Upload (with .eml support), URL Analysis, Results Dashboard
- Custom UI with sage green/gold color scheme
- WCAG 2.1 AA accessibility compliance
- Dark/light mode with React Context
- Real-time progress indicators and drag-and-drop file upload

**Testing & Validation (Week 5):**
- 1,000-file test dataset (500 malicious, 500 clean) across 4 formats (DOCX, PDF, TXT, PNG)
- Detection reliability: 90–95% on text files, 65–80% on PDFs, 30–60% on images
- Average processing time: <8 seconds per file

**Integration & Polish (Weeks 6–7):**
- Production Snowflake authentication with MFA
- IAC presentation (April 24) and Final presentation (April 28)
- Technical memo handout and live demo recording
- Documentation completion and code review

---

## 📚 Documentation

### Technical Documentation
- **[API Reference](docs/API_REFERENCE.md)** – Complete REST API endpoint documentation
- **[Snowflake Setup Guide](docs/SNOWFLAKE_SETUP_GUIDE.md)** – Database configuration and schema
- **[Backend Improvements](docs/BACKEND_IMPROVEMENTS.md)** – Code review and optimization notes
- **[Email Architecture](docs/EMAIL_ARCHITECTURE.md)** – Email processing pipeline design
- **[Team Onboarding](docs/TEAM_ONBOARDING.md)** – Development environment setup

### Design Documentation
- **[UI Design](docs/UI_DESIGN.md)** – Frontend specifications and wireframes

### Presentations & Deliverables
- **[IAC Presentation](https://drive.google.com/file/d/1LUGC_jKVcXDpKHvKz-T46vrX8VTAXrJm/view?usp=sharing)** – Non-technical industry presentation
- **[Final Technical Presentation](https://drive.google.com/file/d/18aQoWu9vcyPlacJPeKa4_W2HhSa52LeG/view?usp=sharing)** – Technical deep-dive
- **[Technical Memo](https://drive.google.com/file/d/1D9W8sFt37jOmXKBLmv88f2hzsd7ArS6q/view?usp=sharing)** – Printed handout with glossary
- **[Live Demo Video](https://drive.google.com/file/d/1tkNvwVEn6SU5lfFwT5B3pAnhz6tdmuaj/view?usp=sharing)** – Full platform walkthrough

---

## 📈 Performance Metrics

### Detection Reliability by File Type

| File Type | Detection Reliability | Notes |
|-----------|----------------------|-------|
| **.DOCX** | 90–95% (High) | Text directly readable, consistent pattern matching |
| **.TXT** | 90–95% (High) | Plain text format, very reliable extraction |
| **.PDF** | 65–80% (Moderate–High) | Depends on embedded vs. scanned text |
| **.PNG** (Images) | 30–60% (Variable) | OCR accuracy depends on image quality, font, contrast |

### Speed Metrics
- **<8 seconds** average processing time
- **30x faster** than manual analysis (2–4 hours per file)

### Scoring Model
- **0–30:** Clean / Low Risk – No significant threats detected
- **31–69:** Warning / Moderate Risk – Suspicious content, exercise caution
- **70–100:** Malicious / High Risk – Highly suspicious, immediate attention recommended

### Test Coverage
- **1,000 files** in test dataset (500 clean + 500 malicious)
- **4 file formats** tested (DOCX, PDF, TXT, PNG – 250 each)
- **15+ regex patterns** verified
- **Weighted scoring** with 7 individual indicators and 3 combination bonuses

---

## 🤝 Contributing

This is an academic project for Prairie View A&M University's Senior Design course (COMP 4208 P02). The project was completed in Spring 2026.

### For Team Members

```bash
git pull origin main
# Make changes
git add .
git commit -m "Description of changes"
git push origin main
```

---

## 📄 License

This project is developed under the guidance of Prairie View A&M University and the National Security Agency. All rights reserved.

For academic and educational purposes only.

---

## ⚠️ Disclaimer

This tool provides automated malware analysis for educational and research purposes. Results should not be considered definitive. For critical security decisions, consult with certified cybersecurity professionals and your organization's IT security team.

---

## 🙏 Acknowledgments

- **National Security Agency (NSA)** – Project partnership and technical guidance
- **Dr. Gregory Stevenson** – NSA academic liaison and mentor
- **Mr. Andrew Hutton** – NSA software engineering mentor
- **Dr. Noushin Ghaffari** – Course instructor
- **Mr. Jonathan Martindale** – Snowflake senior engineer and technical liaison
- **Prairie View A&M University** – Academic support and resources
- **Snowflake** – Database platform and academic access

---

<div align="center">

**Built with 🛡️ by Team Opulence**

*Advanced Static Analysis & Threat Intelligence*

**Graduating May 9, 2026**

[View Project](https://github.com/Karri53/malicious-file-analyzer) · [Documentation](docs/) · [Presentations](presentations/)

</div>
