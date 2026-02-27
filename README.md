# 🛡️ Malicious File Analyzer

> **NSA Senior Design Project | Prairie View A&M University | Spring 2026**  
> A cloud-based security platform for safely analyzing suspicious email attachments without exposing users to malware.

[![Project Status](https://img.shields.io/badge/Status-In%20Development-yellow)](https://github.com/your-username/malicious-file-analyzer)
[![GitHub last commit](https://img.shields.io/github/last-commit/your-username/malicious-file-analyzer)](https://github.com/your-username/malicious-file-analyzer/commits/main)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Team Members](#team-members)
- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Development Status](#development-status)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [License](#license)

---

## 🎯 Overview

This project addresses a critical cybersecurity challenge: **how can users safely analyze potentially malicious files without downloading them to their personal devices?**

Built in partnership with the **National Security Agency (NSA)**, this web-based platform enables users to forward suspicious emails, paste file URLs, or upload documents for automated security analysis. All file processing occurs server-side using AWS infrastructure, ensuring zero risk to end users.

**Project Timeline:** 13 weeks (January 2026 - May 2026)  
**Current Phase:** Week 1 - Foundation & Setup

> ⚠️ **Note:** This repository is actively updated as development progresses. Check commit history for latest changes.

---

## 👥 Team Members

**Team Opulence**

| Role | Name | Responsibilities |
|------|------|-----------------|
| **Project Lead** | Karrington Hall | Architecture design, AWS/Snowflake integration, team coordination |
| **UI Developer** | Kendall Brown | React frontend, user experience, responsive design |
| **RegEx & Data Evaluator** | LeMikkos Starks | Pattern matching, indicator extraction, scoring algorithms |
| **Backend Developer** | Brandon Nobles | Flask API, file processing, database integration |

**Faculty Advisor:** Dr. Nourshin Ghaffari  
**NSA Liaison:** Dr. Gregory Stevenson
**NSA Software Engineer:** Mr. Andrew Hutton

---

## ❓ The Problem

**Current Reality:**
- Users receive emails with potentially malicious attachments (PDFs, Word docs, images)
- Opening these files risks malware infection, data theft, or ransomware
- Traditional antivirus requires downloading files first (too late!)
- Non-technical users can't assess file safety

**Real-World Impact:**
- 94% of malware is delivered via email attachments *(Verizon DBIR 2023)*
- Average ransomware attack costs $4.54M *(IBM Security)*
- Phishing emails increased 61% in 2023 *(Cloudflare)*

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

**All methods use static analysis** (reading files, not executing them) per NSA security guidance.

---

## 🚀 Features

### Current Features (MVP)
- ✅ Multi-method file submission (email/URL/upload)
- ✅ Static file analysis for PDFs, Word docs, PNG/JPG images
- ✅ Automated indicator extraction (URLs, IPs, emails, hashes, crypto addresses)
- ✅ Malicious scoring algorithm (0.0 - 1.0 scale)
- ✅ Severity classification (Low/Moderate/High)
- ✅ CSV export of findings
- ✅ Historical scan tracking

### Planned Features (Future Enhancements)
- 🔄 Machine learning-based threat detection
- 🔄 Custom regex pattern builder
- 🔄 Real-time analysis dashboard
- 🔄 Integration with threat intelligence feeds
- 🔄 Automated email response system
- 🔄 API for third-party integration

---

## 🛠️ Technology Stack

### Frontend
```
React 18          - UI framework
Axios             - HTTP client
React Router      - Navigation
CSS3/Tailwind     - Styling
```

### Backend
```
Python 3.10+      - Core language
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
EC2               - Backend API hosting
IAM               - Security & permissions management
```

### Database
```
Snowflake         - Permanent result storage
                  - Historical analytics
                  - ML model training data
```

### DevOps
```
GitHub            - Version control & collaboration
Git               - Source control
AWS CLI           - Cloud resource management
```

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐│
│  │   Email    │  │    URL     │  │   Direct Upload        ││
│  │ Forwarding │  │  Analysis  │  │   (Fallback)           ││
│  └──────┬─────┘  └──────┬─────┘  └───────────┬────────────┘│
└─────────┼────────────────┼────────────────────┼─────────────┘
          │                │                    │
          ▼                ▼                    ▼
    ┌─────────────────────────────────────────────┐
    │         AWS SES    │  React Frontend        │
    │      (Email In)    │  (Port 3000)           │
    └─────────┬──────────┴──────────┬─────────────┘
              │                     │
              ▼                     ▼
    ┌──────────────────────────────────────────────┐
    │         AWS Lambda          Flask Backend    │
    │      (Email Parser)         (Port 5000)      │
    │                                               │
    │         AWS EC2 (t3.micro)                   │
    └────────────────┬─────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │      AWS S3          │
          │  (Temp Storage)      │
          │  Auto-delete: 24hrs  │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Static Analysis     │
          │  - Extract text      │
          │  - Run regex         │
          │  - Calculate score   │
          └──────────┬───────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
   ┌──────────┐          ┌─────────────┐
   │Snowflake │          │ User Gets   │
   │ Database │          │ Results     │
   │(Permanent│          │(Email/Web)  │
   │ Storage) │          └─────────────┘
   └──────────┘
```

---

## 📁 Project Structure
```
malicious-file-analyzer/
│
├── backend/                      # Python Flask API
│   ├── routes/                   # API endpoints
│   │   ├── email_routes.py       # Email analysis endpoints
│   │   ├── url_routes.py         # URL analysis endpoints
│   │   └── upload_routes.py      # File upload endpoints
│   │
│   ├── services/                 # Business logic
│   │   ├── aws_client.py         # AWS S3/SES interactions
│   │   ├── snowflake_client.py   # Database operations
│   │   ├── file_processor.py     # File parsing & analysis
│   │   └── scoring.py            # Malicious score calculation
│   │
│   ├── utils/                    # Helper functions
│   │   ├── validators.py         # Input validation
│   │   └── regex_patterns.py     # Indicator regex patterns
│   │
│   ├── tests/                    # Unit & integration tests
│   ├── app.py                    # Main Flask application
│   ├── requirements.txt          # Python dependencies
│   └── .env.example              # Environment variables template
│
├── frontend/                     # React application
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
│   │   │   ├── HistoryPage.js
│   │   │   └── AboutPage.js
│   │   │
│   │   ├── services/             # API integration
│   │   │   └── api.js            # Axios API client
│   │   │
│   │   ├── App.js                # Main React component
│   │   ├── App.css               # Global styles
│   │   └── index.js              # React entry point
│   │
│   ├── package.json              # Node dependencies
│   └── .env.example              # Frontend environment variables
│
├── lambda/                       # AWS Lambda functions
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
│   ├── setup_aws.sh              # AWS resource setup
│   ├── setup_snowflake.sql       # Snowflake schema
│   └── deploy.sh                 # Deployment script
│
├── .gitignore                    # Git ignore rules
├── README.md                     # This file
└── LICENSE                       # MIT License
```

---

## 📊 Development Status

**Phase 1: Foundation (Week 1-2)** ⏳ *In Progress*
- [x] Project proposal approved
- [x] GitHub repository initialized
- [x] AWS resource request submitted
- [x] Team structure defined
- [ ] AWS services configured
- [ ] Snowflake database created
- [ ] Development environment setup

**Phase 2: Backend Development (Week 2-4)** 🔜 *Upcoming*
- [ ] Flask API scaffolding
- [ ] AWS S3/SES integration
- [ ] File processing engine
- [ ] Regex pattern library
- [ ] Snowflake data models

**Phase 3: Email Integration (Week 4)** 🔜 *Upcoming*
- [ ] AWS SES configuration
- [ ] Lambda email processor
- [ ] Automated response system

**Phase 4: Frontend Development (Week 5-6)** 🔜 *Upcoming*
- [ ] React app initialization
- [ ] Three-method UI components
- [ ] Results dashboard
- [ ] CSV export functionality

**Phase 5: Styling & UX (Week 7)** 🔜 *Upcoming*
- [ ] CSS/Tailwind implementation
- [ ] Responsive design
- [ ] Accessibility compliance

**Phase 6: Advanced Features (Week 8-9)** 🔜 *Upcoming*
- [ ] Custom regex tester
- [ ] Historical scan viewer
- [ ] Performance optimization

**Phase 7: ML Integration (Week 10-12)** 🔜 *Upcoming*
- [ ] Training data collection
- [ ] Model development
- [ ] Score algorithm enhancement

**Phase 8: Testing & Deployment (Week 13)** 🔜 *Upcoming*
- [ ] Unit testing
- [ ] Integration testing
- [ ] User acceptance testing
- [ ] Production deployment

> 📅 **Last Updated:** [Date] | **Current Sprint:** Week 1

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Python 3.10+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **AWS Account** - [Sign Up](https://aws.amazon.com/)
- **Snowflake Account** - [Academic Access](https://www.snowflake.com/education/)

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/your-username/malicious-file-analyzer.git
cd malicious-file-analyzer

# 2. Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your AWS/Snowflake credentials

# 3. Frontend setup
cd ../frontend
npm install

# 4. Run the application
# Terminal 1 - Backend:
cd backend && python app.py

# Terminal 2 - Frontend:
cd frontend && npm start

# Access at: http://localhost:3000
```

### Detailed Setup

See our comprehensive setup guide: [docs/SETUP.md](docs/SETUP.md)

---

## 📚 Documentation

- **[Setup Guide](docs/SETUP.md)** - Complete installation instructions
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design & data flow
- **[API Documentation](docs/API_DOCUMENTATION.md)** - REST API reference
- **[AWS Configuration](docs/AWS_CONFIGURATION.md)** - Cloud infrastructure setup

---

## 🤝 Contributing

This is an academic project developed as part of Prairie View A&M University's Senior Design course. Contributions are limited to team members during the development phase.

### For Team Members

1. Clone the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with descriptive messages (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request to `dev` branch
8. Request review from team lead

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
- **Dr. Gregory Stevenson** - NSA academic liaison
- **Mr. Andrew Hutton** - NSA software engineering mentor
- **Prairie View A&M University** - Academic support and resources
- **Snowflake** - Database platform and academic access

---

<div align="center">

**Built with 🛡️ by Team Opulence**

*Protecting users from malware, one analysis at a time.*

[![GitHub stars](https://img.shields.io/github/stars/your-username/malicious-file-analyzer?style=social)](https://github.com/your-username/malicious-file-analyzer/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-username/malicious-file-analyzer?style=social)](https://github.com/your-username/malicious-file-analyzer/network/members)

</div>
