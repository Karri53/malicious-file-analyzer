# 🛡️ Malicious File Analyzer

> **NSA Senior Design Project | Prairie View A&M University | Spring 2026**  
> A cloud-based security platform for safely analyzing suspicious email attachments without exposing users to malware.

[![Project Status](https://img.shields.io/badge/Status-Week%204%20Complete-green)](https://github.com/Karri53/malicious-file-analyzer)
[![Timeline](https://img.shields.io/badge/Timeline-7%20Weeks%20(Mar%202--Apr%2017)-blue)](https://github.com/Karri53/malicious-file-analyzer)
[![Team](https://img.shields.io/badge/Team-Team%20Opulence-purple)](https://github.com/Karri53/malicious-file-analyzer)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Team Members](#team-members)
- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [7-Week Timeline](#7-week-timeline)
- [Current Progress](#current-progress)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Weekly Goals](#weekly-goals)
- [Documentation](#documentation)

---

## 🎯 Overview

This project addresses a critical cybersecurity challenge: **how can users safely analyze potentially malicious files without downloading them to their personal devices?**

Built in partnership with the **National Security Agency (NSA)**, this web-based platform enables users to forward suspicious emails, paste file URLs, or upload documents for automated security analysis. All file processing occurs server-side using AWS infrastructure, ensuring zero risk to end users.

**Project Duration:** 7 weeks (March 2 - April 17, 2026)  
**Current Status:** Week 1 - Foundation & Setup  
**Completion:** 14% (Day 1/49 complete)

---

## 👥 Team Members

**Team Opulence**

| Role | Name | Responsibilities | GitHub |
|------|------|-----------------|--------|
| **Project Lead** | Karrington Hall | Architecture design, AWS/Snowflake integration, team coordination, majority of implementation | [@Karri53](https://github.com/Karri53) |
| **UI Developer** | Kendall Brown | React frontend, user experience, responsive design | [@kbrownpv](https://github.com/kbrownpv) |
| **RegEx & Data Evaluator** | LeMikkos Starks | Pattern matching, indicator extraction, scoring algorithms | [@lstarks1513](https://github.com/lstarks1513) |
| **Backend Developer** | Brandon Nobles | Flask API support, file processing, database integration | [@BRegardQ](https://github.com/BRegardQ) |

**Faculty Advisor:** Dr. Nourshin Ghaffari  

**NSA Liaison:** Dr. Gregory Stevenson 

**NSA Software Engineer:** Mr. Andrew Hutton

**Snowflake Liaison:** Mr. Jonathan Martindale

---

## ❓ The Problem

**Current Reality:**
- Users receive emails with potentially malicious attachments (PDFs, Word docs, images)
- Opening these files risks malware infection, data theft, or ransomware
- Traditional antivirus requires downloading files first (too late!)
- Non-technical users can't assess file safety

**Real-World Impact:**
- **94%** of malware is delivered via email attachments *(Verizon DBIR 2023)*
- Average ransomware attack costs **$4.54M** *(IBM Security)*
- Phishing emails increased **61%** in 2023 *(Cloudflare)*

---

## ✨ Our Solution

A **three-tier analysis platform** prioritizing user safety:

### 1️⃣ Email Forwarding (Primary Method - Safest)
```
User forwards suspicious email → analyze@[domain].com
↓
Attachments automatically extracted and analyzed
↓
Results emailed back in 2-3 minutes
```
**Zero clicks. Zero downloads. Zero risk.**

### 2️⃣ URL Analysis (Secondary Method)
```
User pastes file link → File downloads to our server
↓
Analyzed safely in isolated environment
↓
Results displayed instantly
```

### 3️⃣ Direct Upload (Fallback)
```
User uploads file → Processed server-side
↓
Results shown on dashboard
```

**All methods use static analysis** (reading files, not executing them) per NSA security guidance from Dr. Stevenson.

---

## 🚀 Features

### Core Features (MVP - Weeks 1-4)
- ✅ Multi-method file submission (email/URL/upload)
- ✅ Static file analysis for PDFs, Word docs, PNG/JPG images
- ✅ Automated indicator extraction (URLs, IPs, emails, hashes, crypto addresses)
- ✅ Malicious scoring algorithm (0.0 - 1.0 scale)
- ✅ Severity classification (Low/Moderate/High)
- ✅ Results display with detailed explanations
- ✅ CSV export of findings
- ✅ Historical scan tracking in Snowflake

### Enhanced Features (Weeks 5-7)
- 🔄 Professional UI with responsive design
- 🔄 Comprehensive testing and bug fixes
- 🔄 Production deployment on AWS EC2
- 🔄 Demo video and presentation materials

### Future Enhancements (Post-Project)
- 💡 Machine learning-based threat detection
- 💡 Custom regex pattern builder
- 💡 Integration with threat intelligence feeds
- 💡 API for third-party integration
- 💡 Support for additional file types

---

## 🛠️ Technology Stack

### Frontend
```
React 18          - UI framework
Axios             - HTTP client
React Router      - Navigation
Tailwind CSS      - Styling (or custom CSS)
```

### Backend
```
Python 3.10       - Core language
Flask             - Web framework
pdfplumber        - PDF text extraction
python-docx       - Word document parsing
Pillow            - Image metadata extraction
```

### Cloud Infrastructure (AWS)
```
S3                - Temporary file storage (auto-delete 24hrs)
SES               - Email receiving/sending automation
Lambda            - Serverless email processing
EC2               - Backend API hosting (t3.micro)
IAM               - Security & permissions management
```

### Database
```
Snowflake         - Permanent result storage
                  - Historical analytics
                  - Structured data queries
```

### DevOps
```
GitHub            - Version control & collaboration
Git               - Source control
AWS CLI           - Cloud resource management
```

---

## 📅 7-Week Timeline

**Start Date:** March 2, 2026 (Sunday)  
**End Date:** April 17, 2026 (Friday)  
**Total Duration:** 7 weeks (49 days)

### Week-by-Week Breakdown:

| Week | Dates | Focus | Key Deliverables |
|------|-------|-------|-----------------|
| **Week 1** | Mar 2-8 | Foundation & Setup | AWS S3 configured, Snowflake DB created, all dev environments ready |
| **Week 2** | Mar 9-15 | Backend Core Development | Flask API routes, file processing engine, scoring algorithm |
| **Week 3** | Mar 16-22 | Email Integration | AWS SES configured, Lambda function working, email flow complete |
| **Week 4** | Mar 23-29 | Frontend Development | React app with all 3 analysis methods, results display |
| **Week 5** | Mar 30-Apr 5 | Polish & Testing | Professional UI, bug fixes, user testing, optimizations |
| **Week 6** | Apr 6-12 | Final Testing & Docs | End-to-end testing, security review, API documentation |
| **Week 7** | Apr 13-17 | Deployment & Presentation | Production deploy, demo video, final presentation |

---

## 📊 Current Progress

**Last Updated:** March 30, 2026, 12:00 AM CST  
**Days Elapsed:** 28 / 49 (57%)  
**Current Week:** Week 4 - COMPLETED ✅  
**Next Week:** Week 5 - Polish & Testing  

### ✅ Week 1 COMPLETED (March 2-8)

**Backend Infrastructure (100% Complete):**
- ✅ Flask API with 3 endpoints working
- ✅ File Processing Engine (PDF, DOCX, images, text) - 250 lines
- ✅ RegEx Pattern Library (URLs, IPs, emails, crypto, hashes) - 200 lines  
- ✅ Malicious Scoring Algorithm (weighted threat detection) - 150 lines
- ✅ Mock AWS S3 client with factory pattern
- ✅ Mock Snowflake client with factory pattern
- ✅ Real Snowflake client implementation
- ✅ Complete test suite (6 test files, 100% pass rate)

**Database Setup (100% Complete):**
- ✅ Snowflake OPULENCE_DB configured
- ✅ 5 production tables created (scan_results, indicators, email_sources, url_sources, file_metadata)
- ✅ Connection factory with mock/real switching
- ✅ Snowflake MFA authentication configured (Microsoft Authenticator)
- 💡 Using MockSnowflakeClient for development (production auth requires 2FA login)

**Code Metrics:**
- Lines of Code: 1,500+
- Test Pass Rate: 100%
- Modules Completed: 8/8 planned for Week 1

**Pending Items:**
- AWS credentials from Dr. Yang (expected Week 3)
- Snowflake production authentication coordination

---

### ✅ Week 2 COMPLETED (March 9-15)

**Focus:** Backend API Development

**Completed Deliverables:**
- ✅ **REST API Endpoints** (Karrington) - 6 endpoints fully functional
  - POST /api/analyze/upload - Full file analysis with Snowflake integration
  - GET /api/results/<scan_id> - Retrieve specific scan results
  - GET /api/results/recent - List recent scans
  - GET /api/health - Health check
  - POST /api/analyze/url - Placeholder (Week 3 implementation)
  - POST /api/analyze/email - Placeholder (Week 3 implementation)
- ✅ **Test Dataset** (LeMikkos) - 46 files (24 malicious, 22 clean)
  - Multiple file types: PDF, DOCX, TXT, PNG
  - Comprehensive threat indicators (crypto addresses, URLs, IPs, hashes)
  - Uploaded to `backend/test_data/malicious/` and `backend/test_data/clean/`
- ✅ **AWS S3 Client** (Brandon) - Production-ready implementation
  - Factory pattern matching Snowflake structure
  - Upload, download, delete methods
  - Ready for production when credentials arrive
  - Code: `backend/services/real_aws_client.py`
- ✅ **UI Wireframes** (Kendall) - 5 complete page designs
  - All wireframes delivered in `docs/wireframes/`
  - Email Instructions, URL Analyzer, File Upload, Results Display, Home page

**Code Metrics:**
- REST API: 350+ lines in `backend/app.py`
- All endpoints tested and verified with test dataset
- Test dataset: 46 files ready for validation
- Backend code: 1,850+ lines total

**Testing Results:**
- Health check endpoint: ✅ Passing
- File upload analysis: ✅ Passing (tested with malicious and clean files)
- Scan results retrieval: ✅ Passing
- Recent scans listing: ✅ Passing
- Scoring accuracy: High-risk files detected correctly

**Status:** Backend MVP 50% complete  
**Pending Items:**
- `docs/SCORING_VALIDATION.md` (LeMikkos documentation)
- `docs/AWS_CONFIGURATION.md` (Brandon documentation)
- AWS credentials from Amazon Liasion

---

### 🔄 Week 3 Tasks (March 16-22) - ✅ COMPLETE

**Focus:** Email Processing & URL Analysis

- [X] Implement URL download and analysis (Karrington)
- [X] Email processing pipeline integration (Karrington)
- [ ] AWS SES configuration for email receiving
- [ ] Lambda function for attachment extraction
- [ ] Complete validation documentation (LeMikkos)
- [ ] Complete AWS configuration documentation (Brandon)
- [X] Begin frontend React app initialization (Kendall)

**Accomplishments:**
- ✅ URL Download & Analysis Implementation (Issue #30)
  - Created `url_downloader.py` (200+ lines) with safe downloading
  - Implemented POST `/api/analyze/url` endpoint
  - URL validation (HTTP/HTTPS only)
  - 10MB file size limit with pre-download checking
  - 30-second timeout protection
  - Automatic file cleanup after analysis
  
- ✅ Email Processing Architecture Design (Issue #31)
  - Complete `EMAIL_ARCHITECTURE.md` (500+ lines)
  - AWS Lambda function `email_processor.py` (400+ lines)
  - HTML email templates with severity badges
  - Deployment guide for Week 4
  - S3 folder structure and lifecycle policies
  - Security & privacy considerations documented

**Testing:**
- All endpoints tested and passing:
  - ✓ Upload endpoint: Clean (0.0) & Malicious (0.3+) files
  - ✓ URL endpoint: Successfully downloads and analyzes files
  - ✓ Error handling: Invalid URLs, oversized files, timeouts

**Code Metrics:**
- Total lines: 2,600+
- New modules: `url_downloader.py`, `email_processor.py`
- Updated: `app.py` (now 450+ lines with URL endpoint)
- Documentation: 1,000+ lines across architecture docs

**Status:** Week 3 COMPLETE - 43% overall (21/49 days)

---

### ✅ Week 4 COMPLETED (March 23-29)

**Focus:** Documentation, API Reference, Lambda Integration & Team Coordination

**Completed Deliverables:**
- ✅ **API Reference Documentation** (Karrington) - `docs/API_REFERENCE.md`
  - Complete endpoint reference for all 5 API routes
  - Request/response examples with Axios code samples
  - Error response formats documented
  - Ready for frontend team to use during Week 5
- ✅ **Backend Improvements Review** (Brandon) - `docs/BACKEND_IMPROVEMENTS.md`
  - File type and size validation recommendations
  - Specific exception handling improvements
  - Temporary directory configuration guidance
  - Email endpoint implementation roadmap
- ✅ **Lambda Deployment Guide Updated** (Brandon) - `lambda/DEPLOYMENT.md`
  - Added Windows PowerShell support for deployment packaging
  - Step-by-step guide for AWS Console setup
  - Environment variable configuration instructions
- ✅ **AWS Configuration Documentation** (Brandon) - `docs/AWS_CONFIGURATION.md`
  - S3 client architecture explained (Mock vs Real)
  - Factory pattern integration guide
  - Credential setup instructions for team members
- ✅ **Snowflake Setup Guide** - `docs/SNOWFLAKE_SETUP_GUIDE.md`
  - Installation and connection steps for team members
  - MFA authentication walkthrough
  - Schema and table reference
- ✅ **Team Onboarding Documentation** - `docs/TEAM_ONBOARDING.md`
  - Standardized setup steps for new team members
  - Development environment checklist
- ✅ **Frontend React Structure Scaffolded** (Kendall)
  - `frontend/src/components/` - component directories ready
  - `frontend/src/pages/` - page directories ready
  - `frontend/src/services/` - API service layer directories ready
  - `frontend/src/assets/` - static assets directory ready
- ✅ **Expanded Test Dataset** (LeMikkos)
  - Added 100 clean test files to `backend/test_data/Clean 1-100/`
  - Added malicious test files to `backend/test_data/Malicious 1-100/`
  - Dataset reorganized for consistency

**Code Metrics:**
- Total lines: 2,800+
- New documentation: 400+ lines across 4 new docs
- Test dataset: 200+ files (clean + malicious)
- Frontend structure: scaffolded and ready for Week 5 implementation

**Status:** Week 4 COMPLETE - 57% overall (28/49 days)

---

## 📁 Project Structure
```
malicious-file-analyzer/
│
├── backend/                      # Python Flask API
│   ├── routes/                   # API endpoints (to be created Week 3)
│   │   ├── email_routes.py       # Email analysis endpoints
│   │   ├── url_routes.py         # URL analysis endpoints
│   │   └── upload_routes.py      # File upload endpoints
│   │
│   ├── services/                 # Business logic
│   │   ├── aws_client.py         # ✅ AWS S3 mock client
│   │   ├── real_aws_client.py    # ✅ AWS S3 production client (Week 2)
│   │   ├── snowflake_client.py   # ✅ Snowflake factory pattern
│   │   ├── real_snowflake_client.py  # ✅ Snowflake production client
│   │   ├── file_processor.py     # ✅ File parsing & analysis
│   │   └── scoring.py            # ✅ Malicious score calculation
│   │
│   ├── utils/                    # Helper functions
│   │   ├── validators.py         # Input validation (to be created)
│   │   └── regex_patterns.py     # ✅ Indicator regex patterns
│   │
│   ├── test_data/                # ✅ Test files (Week 2)
│   │   ├── malicious/            # ✅ 24 malicious samples
│   │   └── clean/                # ✅ 22 clean samples
│   │
│   ├── tests/                    # ✅ Unit & integration tests
│   ├── app.py                    # ✅ Main Flask application (Week 2 complete)
│   ├── requirements.txt          # ✅ Python dependencies
│   └── .env.example              # ✅ Environment variables template
│
├── frontend/                     # React application (Week 4)
│   ├── public/                   # Static files
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── EmailInstructions.js
│   │   │   ├── URLAnalyzer.js
│   │   │   ├── FileUploader.js
│   │   │   ├── ResultsDisplay.js
│   │   │   └── LoadingSpinner.js
│   │   │
│   │   ├── pages/                # Page components
│   │   │   ├── HomePage.js
│   │   │   └── AboutPage.js
│   │   │
│   │   ├── services/             # API integration
│   │   │   └── api.js            # Axios API client
│   │   │
│   │   ├── App.js                # Main React component
│   │   └── App.css               # Global styles
│   │
│   └── package.json              # Node dependencies
│
├── lambda/                       # AWS Lambda functions (Week 3)
│   ├── email_processor.py        # Email attachment extraction
│   └── requirements.txt          # Lambda dependencies
│
├── docs/                         # Documentation
│   ├── wireframes/               # ✅ UI wireframes (Week 2 - Kendall)
│   │   ├── Email_Instructions.pdf
│   │   ├── File_Upload.pdf
│   │   ├── File_Upload_Error.pdf
│   │   ├── File_Upload_Processing.pdf
│   │   ├── Home.pdf
│   │   ├── Results.pdf
│   │   ├── URL_Analyzer.pdf
│   │   ├── URL_Analyzer_Error.pdf
│   │   └── URL_Analyzer_Processing.pdf
│   ├── UI_DESIGN.md              # ✅ Design specifications (Week 2)
│   ├── SETUP.md                  # Setup instructions (to be created)
│   ├── ARCHITECTURE.md           # Architecture details (to be created)
│   ├── API_DOCUMENTATION.md      # API endpoint docs (Week 6)
│   ├── AWS_CONFIGURATION.md      # Pending from Brandon (Week 2)
│   └── SCORING_VALIDATION.md     # Pending from LeMikkos (Week 2)
│
├── scripts/                      # Utility scripts
│   └── setup_snowflake.sql       # ✅ Snowflake schema creation
│
├── config/                       # Configuration files
│
├── .gitignore                    # ✅ Git ignore rules
├── README.md                     # ✅ This file
└── LICENSE                       # MIT License

✅ = Created and working
(to be created) = Planned for upcoming weeks
```
---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Python 3.10+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **AWS Account** - University access required
- **Snowflake Account** - University academic access

### Quick Start (For Team Members)

**Step 1: Clone the Repository**
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

**Step 3: Configure Environment Variables**
```bash
cp .env.example .env
# Edit .env with your AWS/Snowflake credentials
```

**Step 4: Test Backend**
```bash
python app.py
# Visit http://localhost:5000/api/health in your browser
```

### Detailed Setup

See our comprehensive setup guide: [docs/SETUP.md](docs/SETUP.md) *(to be created Week 1)*

---

## 📈 Weekly Goals

### Week 1: Foundation & Setup (March 2-8) - IN PROGRESS

**Goals:**
- ✅ Complete development environment setup for all team members
- ⏳ Obtain AWS credentials from university
- ⏳ Configure AWS S3 buckets with lifecycle policies
- ⏳ Set up Snowflake database with complete schema
- ⏳ All team members can run Flask backend locally
- ⏳ Complete project documentation structure

**Success Criteria:**
- AWS S3 operational with test upload/download
- Snowflake database accessible from Python
- All 4 team members have working dev environments
- GitHub workflow established (everyone can commit/push)

---

### Week 2: Backend Core (March 9-15)

**Goals:**
- Build complete Flask API structure with route blueprints
- Implement file processing engine (PDF, Word, image parsing)
- Create regex library for indicator extraction
- Develop malicious scoring algorithm
- Integrate AWS S3 client for file operations
- Integrate Snowflake client for data persistence

**Success Criteria:**
- Can analyze a PDF and extract URLs, IPs, emails
- Scoring algorithm returns accurate severity levels
- Files upload to S3 and results save to Snowflake
- All API endpoints tested with Postman

---

### Week 3: Email Integration (March 16-22)

**Goals:**
- Configure AWS SES for email receiving
- Verify domain for email forwarding
- Deploy Lambda function for email processing
- Implement automated results email generation
- Test end-to-end email forwarding flow

**Success Criteria:**
- Users can forward emails to analyze@[domain]
- Attachments extracted automatically
- Results emailed back within 3 minutes
- Error handling for invalid emails

---

### Week 4: Frontend Development (March 23-29)

**Goals:**
- Initialize React application
- Build EmailInstructions component (primary method)
- Build URLAnalyzer component (secondary method)
- Build FileUploader component (fallback method)
- Build ResultsDisplay component with indicator lists
- Implement CSV export functionality
- Connect frontend to backend API

**Success Criteria:**
- All 3 analysis methods functional
- Results display correctly with severity indicators
- User can export results as CSV
- Basic styling in place (professional appearance)

---

### Week 5: Polish & Testing (March 30-April 5)

**Goals:**
- Apply professional CSS styling (Tailwind or custom)
- Implement responsive design for mobile
- Conduct user testing with 3-5 test users
- Fix all critical bugs
- Optimize backend performance
- Add loading states and error handling

**Success Criteria:**
- UI looks professional and polished
- Works on mobile devices
- No critical bugs
- User satisfaction rating >4/5 stars
- All features tested end-to-end

---

### Week 6: Final Testing & Documentation (April 6-12)

**Goals:**
- End-to-end integration testing
- Security review and hardening
- Complete API documentation
- Write deployment guide
- Create user manual
- Performance testing and optimization

**Success Criteria:**
- All test scenarios pass
- No security vulnerabilities identified
- Documentation complete and clear
- Ready for production deployment

---

### Week 7: Deployment & Presentation (April 13-17)

**Goals:**
- Deploy backend to AWS EC2
- Deploy frontend to hosting (Netlify/Vercel)
- Create demo video (3-5 minutes)
- Prepare final presentation slides
- Rehearse presentation
- **Final presentation: April 17, 2026**

**Success Criteria:**
- Application live and accessible via HTTPS
- Demo video professional quality
- Presentation ready and practiced
- All deliverables submitted

---

## 📚 Documentation

- **[API Reference](docs/API_REFERENCE.md)** - ✅ REST API endpoint reference with examples *(Week 4)*
- **[AWS Configuration](docs/AWS_CONFIGURATION.md)** - ✅ S3 client setup and integration guide *(Week 4)*
- **[Email Architecture](docs/EMAIL_ARCHITECTURE.md)** - ✅ Email processing pipeline design *(Week 3)*
- **[Backend Improvements](docs/BACKEND_IMPROVEMENTS.md)** - ✅ Code review and improvement notes *(Week 4)*
- **[Snowflake Setup Guide](docs/SNOWFLAKE_SETUP_GUIDE.md)** - ✅ Database setup for team members *(Week 1)*
- **[Team Onboarding](docs/TEAM_ONBOARDING.md)** - ✅ Dev environment setup for new team members *(Week 4)*
- **[UI Design](docs/UI_DESIGN.md)** - ✅ Frontend wireframes and design specs *(Week 2)*
- **[Week 4 Summary](docs/WEEK4_SUMMARY.md)** - ✅ Detailed Week 4 progress report *(Week 4)*
- **[API Documentation](docs/API_DOCUMENTATION.md)** - Full API reference *(Week 6)*

---

## 🤝 Contributing

This is an academic project for Prairie View A&M University's Senior Design course. Contributions are limited to team members during the development phase (March 2 - April 17, 2026).

### For Team Members

**Daily Git Workflow:**
```bash
# Start of day - get latest code
git pull origin main

# Work on your features
# ... make changes ...

# End of day - save and share
git add .
git commit -m "Brief description of changes"
git push origin main
```

**Communication:**
- GitHub Issues for task tracking
- Daily standups (5 minutes, optional)
- AI group chat for technical questions
- Email for urgent blockers

---

## 📄 License

This project is developed under the guidance of Prairie View A&M University and the National Security Agency. All rights reserved.

For academic and educational purposes only.


---

## ⚠️ Disclaimer

This tool provides automated malware analysis for educational and research purposes. Results should not be considered definitive. For critical security decisions, consult with certified cybersecurity professionals and your organization's IT security team.

---

## 🙏 Acknowledgments

- **National Security Agency (NSA)** - Project partnership and technical guidance
- **Dr. Gregory Stevenson** - NSA academic liaison and mentor
- **Mr. Andrew Hutton** - NSA software engineering mentor
- **Dr. Nourshin Ghaffari** - Faculty advisor
- **Prairie View A&M University** - Academic support and resources
- **AWS Educate** - Cloud infrastructure access
- **Snowflake** - Database platform and academic access

---

## 📊 Project Statistics

**Timeline:**
- Start: March 2, 2026
- End: April 17, 2026
- Duration: 7 weeks (49 days)
- Days Elapsed: 28
- Days Remaining: 21
- Progress: 57% complete

**Code Statistics:** *(Updated Week 4)*
- Total Lines of Code: ~2,800
- Python Files: 14
- JavaScript Files: 0 (Week 5 implementation)
- Test Files: 200+ (clean + malicious datasets)
- Documentation Files: 10
- Total Commits: 50+
- Contributors: 4 active

**Latest Update:**
- Date: March 30, 2026, 12:00 AM CST
- Updated by: Karrington Hall
- Changes: Week 4 completed - API reference docs, Lambda deployment guide, backend improvements review, frontend structure scaffolded, expanded test dataset

---

<div align="center">

**Built with 🛡️ by Team Opulence**

*Protecting users from malware, one analysis at a time.*

**Week 4 of 7 | Days 22-28 | March 23-29, 2026**

[View Issues](https://github.com/Karri53/malicious-file-analyzer/issues) • [Project Board](https://github.com/Karri53/malicious-file-analyzer/projects) • [Milestones](https://github.com/Karri53/malicious-file-analyzer/milestones)

</div>
