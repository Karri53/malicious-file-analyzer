# 🛡️ Malicious File Analyzer

> **NSA Senior Design Project | Prairie View A&M University | Spring 2026**  
> A cloud-based security platform for safely analyzing suspicious email attachments without exposing users to malware.

[![Project Status](https://img.shields.io/badge/Status-Week%201%20In%20Progress-yellow)](https://github.com/Karri53/malicious-file-analyzer)
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

**Last Updated:** March 8, 2026, 10:30 PM CST  
**Days Elapsed:** 7 / 49 (14%)  
**Current Week:** Week 1 - COMPLETED ✅  
**Next Week:** Week 2 - Backend API Development  

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
- AWS credentials from Dr. Yang (expected this week)
- Snowflake MFA setup with Mr. Jonathan

### 🔄 Week 2 Tasks (March 9-15)

**Focus:** Backend API Development

- [ ] Complete REST API endpoints (POST/GET for all methods)
- [ ] Email processing pipeline (AWS SES integration)
- [ ] URL download and analysis
- [ ] AWS S3 real client (when credentials arrive)
- [ ] UI wireframes (Kendall)
- [ ] RegEx validation & test dataset (LeMikkos)

---

## 📁 Project Structure
```
malicious-file-analyzer/
│
├── backend/                      # Python Flask API
│   ├── routes/                   # API endpoints (to be created)
│   │   ├── email_routes.py       # Email analysis endpoints
│   │   ├── url_routes.py         # URL analysis endpoints
│   │   └── upload_routes.py      # File upload endpoints
│   │
│   ├── services/                 # Business logic (to be created)
│   │   ├── aws_client.py         # AWS S3/SES interactions
│   │   ├── snowflake_client.py   # Database operations
│   │   ├── file_processor.py     # File parsing & analysis
│   │   └── scoring.py            # Malicious score calculation
│   │
│   ├── utils/                    # Helper functions (to be created)
│   │   ├── validators.py         # Input validation
│   │   └── regex_patterns.py     # Indicator regex patterns
│   │
│   ├── tests/                    # Unit & integration tests
│   ├── app.py                    # ✅ Main Flask application
│   ├── requirements.txt          # ✅ Python dependencies
│   └── .env.example              # ✅ Environment variables template
│
├── frontend/                     # React application (to be created)
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
├── lambda/                       # AWS Lambda functions (to be created)
│   ├── email_processor.py        # Email attachment extraction
│   └── requirements.txt          # Lambda dependencies
│
├── docs/                         # Documentation
│   ├── SETUP.md                  # Setup instructions
│   ├── ARCHITECTURE.md           # Architecture details
│   ├── API_DOCUMENTATION.md      # API endpoint docs
│   └── AWS_CONFIGURATION.md      # AWS setup guide
│
├── scripts/                      # Utility scripts
│   └── setup_snowflake.sql       # Snowflake schema creation
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

- **[Setup Guide](docs/SETUP.md)** - Complete installation instructions *(Week 1)*
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design & data flow *(Week 1)*
- **[API Documentation](docs/API_DOCUMENTATION.md)** - REST API reference *(Week 6)*
- **[AWS Configuration](docs/AWS_CONFIGURATION.md)** - Cloud infrastructure setup *(Week 1)*

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
- Days Elapsed: 1
- Days Remaining: 48
- Progress: 2% complete

**Code Statistics:** *(Updated Weekly)*
- Total Lines of Code: ~150 (Week 1, Day 1)
- Python Files: 3
- JavaScript Files: 0 (Week 4)
- Total Commits: 5
- Contributors: 1 (growing to 4)

**Latest Update:**
- Date: March 1, 2026, 9:00 PM CST
- Updated by: Karrington Hall
- Changes: Initial backend created, development environment ready

---

<div align="center">

**Built with 🛡️ by Team Opulence**

*Protecting users from malware, one analysis at a time.*

**Week 1 of 7 | Days 1-7 | March 2-8, 2026**

[View Issues](https://github.com/Karri53/malicious-file-analyzer/issues) • [Project Board](https://github.com/Karri53/malicious-file-analyzer/projects) • [Milestones](https://github.com/Karri53/malicious-file-analyzer/milestones)

</div>
