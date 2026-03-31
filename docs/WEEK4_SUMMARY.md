# Week 4 Summary — Malicious File Analyzer

**Project:** NSA Senior Design — Prairie View A&M University  
**Team:** Team Opulence  
**Week Dates:** March 23–29, 2026  
**Report Date:** March 30, 2026  
**Prepared by:** Karrington Hall

---

## Overview

Week 4 focused on documentation, API integration support, Lambda deployment preparation, and frontend scaffolding. With the backend core and email architecture completed in Weeks 2–3, Week 4 shifted toward ensuring the team had everything needed to begin frontend development in Week 5 and to finalize the AWS Lambda email pipeline.

**Overall project progress: 57% (28 of 49 days)**

---

## Deliverables Completed

### 1. API Reference Documentation (Karrington)
- **File:** `docs/API_REFERENCE.md`
- **Lines:** ~154
- Created a complete reference for all 5 backend API endpoints
- Includes Axios code examples for frontend integration
- Documents full request/response JSON schemas
- Covers error response formats and HTTP status codes
- Purpose: Unblocks frontend team from beginning React implementation in Week 5

### 2. Backend Improvements Review (Brandon)
- **File:** `docs/BACKEND_IMPROVEMENTS.md`
- **Lines:** ~56
- Reviewed `backend/app.py` and documented improvement areas
- Identified missing file type and size validation on the upload endpoint
- Recommended more specific exception handling to replace broad `except Exception` blocks
- Flagged unused `get_s3_client` import for cleanup
- Documented that `/api/analyze/email` currently returns 501 and Lambda should use `/api/analyze/upload` until it is implemented

### 3. Lambda Deployment Guide Update (Brandon)
- **File:** `lambda/DEPLOYMENT.md`
- Added Windows PowerShell activation steps alongside existing Unix instructions
- Ensures all team members (Windows and Mac) can build and deploy the Lambda package
- Covers ZIP packaging, AWS Console setup, environment variable configuration

### 4. AWS Configuration Documentation (Brandon)
- **File:** `docs/AWS_CONFIGURATION.md`
- Explains the Mock vs Real S3 client architecture
- Documents the `get_s3_client()` factory pattern used in the backend
- Provides credential setup instructions for team members who receive AWS access
- Clarifies why development continues without live AWS credentials (MockS3Client fallback)

### 5. Snowflake Setup Guide (Karrington)
- **File:** `docs/SNOWFLAKE_SETUP_GUIDE.md`
- Step-by-step installation and connection instructions for the Snowflake connector
- MFA authentication walkthrough using Microsoft Authenticator
- Lists all five production tables in `OPULENCE_DB`
- Helps team members connect directly to the production database

### 6. Team Onboarding Documentation
- **File:** `docs/TEAM_ONBOARDING.md`
- Standardized setup checklist for new team members or rejoining contributors
- Covers Python virtual environment, Flask backend, and Git workflow

### 7. Frontend React Structure Scaffolded (Kendall)
- Created the `frontend/src/` directory structure:
  - `frontend/src/components/` — for reusable UI components
  - `frontend/src/pages/` — for full page views
  - `frontend/src/services/` — for Axios API integration layer
  - `frontend/src/assets/` — for static images and icons
- Structure mirrors the component plan from the Week 2 wireframes
- Ready for component implementation in Week 5

### 8. Expanded Test Dataset (LeMikkos)
- Added `backend/test_data/Clean 1-100/` — 100 clean text files
- Added `backend/test_data/Malicious 1-100/` — malicious test files
- Reorganized from prior scattered structure into consistent numbered sets
- Enables more thorough scoring validation and regression testing

---

## Week 4 Code Metrics

| Metric | Value |
|--------|-------|
| Total project lines of code | ~2,800 |
| New documentation lines | ~400 |
| New test files added | 100+ |
| New/updated docs files | 6 |
| Commits this week | 15+ |
| Active contributors | 4 |

---

## Challenges & Notes

- **AWS credentials still pending:** The `/api/analyze/url` and file upload endpoints continue to use `MockS3Client` for local development. Production S3 integration will go live once credentials are received.
- **Email endpoint not yet functional:** `/api/analyze/email` returns `501 Not Implemented`. The Lambda function (`lambda/email_processor.py`) is built and the deployment guide is ready; actual deployment requires live AWS SES + Lambda access.
- **Frontend implementation deferred to Week 5:** The directory structure is scaffolded but no React component code was written this week. The API Reference doc ensures Kendall can begin building components immediately in Week 5.

---

## Pending Items Carried Forward

| Item | Owner | Status |
|------|-------|--------|
| `docs/SCORING_VALIDATION.md` | LeMikkos | In progress — deferred from Week 2 |
| AWS SES domain verification | Karrington | Blocked on credentials |
| Lambda deployment to AWS | Karrington/Brandon | Blocked on credentials |
| React component implementation | Kendall | Starts Week 5 |
| Flask file type/size validation improvements | Brandon | Week 5 |

---

## Week 5 Plan (March 30 – April 5)

- **Kendall:** Begin building React components using the API Reference doc
  - `EmailInstructions.js`, `URLAnalyzer.js`, `FileUploader.js`, `ResultsDisplay.js`
  - Connect components to backend API via Axios
- **Karrington:** Apply CSS styling to frontend, implement loading states
- **Brandon:** Implement file type validation and size limits per the improvement review
- **LeMikkos:** Complete `docs/SCORING_VALIDATION.md`
- **All:** Conduct first end-to-end test (UI → Flask API → Snowflake)

---

## Summary

Week 4 successfully bridged the gap between backend completion and frontend development. All documentation needed for Week 5 React implementation is in place, the Lambda deployment guide covers all platforms, and the test dataset has been significantly expanded. The project remains on schedule for a Week 7 production deployment.

**Status: On Track**
