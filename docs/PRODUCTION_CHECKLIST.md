# Production Deployment Checklist

**Project:** Malicious File Analyzer  
**Target Date:** Week 7 (April 13-17, 2026)  
**Prepared by:** Karrington Hall  
**Last Updated:** April 12, 2026

---

## Pre-Deployment Requirements

### Environment Variables

**Backend (.env file on EC2):**
- [ ] `FLASK_ENV=production`
- [ ] `SNOWFLAKE_ACCOUNT=<production>`
- [ ] `SNOWFLAKE_USER=<production>`
- [ ] `SNOWFLAKE_PASSWORD=<production>`
- [ ] `SNOWFLAKE_WAREHOUSE=COMPUTE_WH`
- [ ] `SNOWFLAKE_DATABASE=OPULENCE_DB`
- [ ] `SNOWFLAKE_SCHEMA=ANALYSIS_DATA`
- [ ] `AWS_ACCESS_KEY_ID=<production>`
- [ ] `AWS_SECRET_ACCESS_KEY=<production>`
- [ ] `AWS_REGION=us-east-1`
- [ ] `S3_BUCKET_NAME=malicious-file-analyzer-prod`

**Lambda (.env for email processor):**
- [ ] `SNOWFLAKE_*` variables (same as backend)
- [ ] `SES_EMAIL_ADDRESS=analyze@malicious-file-analyzer.com`

---

## AWS Infrastructure Setup

### S3 Buckets
- [ ] Create production S3 bucket
- [ ] Configure bucket policies (private access)
- [ ] Enable versioning
- [ ] Set up lifecycle rules (auto-delete temp files after 24 hours)

### Lambda Function
- [ ] Deploy email processor (`lambda/email_processor.py`)
- [ ] Configure SES trigger
- [ ] Set environment variables
- [ ] Test email forwarding workflow
- [ ] Configure CloudWatch logging

### EC2 Instance (Backend)
- [ ] Launch EC2 instance (t2.medium or t3.medium recommended)
- [ ] Install Python 3.9+
- [ ] Install pip and virtualenv
- [ ] Clone repository
- [ ] Install dependencies (`pip install -r requirements.txt`)
- [ ] Configure security groups:
  - Port 80 (HTTP) - optional
  - Port 443 (HTTPS) - optional
  - Port 5000 (Flask API)
- [ ] Set up SSL/TLS certificate (optional for demo)
- [ ] Configure auto-start on reboot

### SES Configuration
- [ ] Verify domain (if using custom domain)
- [ ] Configure receiving rules
- [ ] Set up email routing to Lambda
- [ ] Test email delivery
- [ ] Move out of SES sandbox (if needed for production)

---

## Database Setup

### Snowflake Production
- [ ] Install `snowflake-connector-python` on EC2
```bash
  pip install snowflake-connector-python
```
- [ ] Verify production credentials
- [ ] Test MFA authentication
- [ ] Confirm schema and tables exist:
  - `FILE_ANALYSES` table
  - `INDICATORS` table
  - `URL_SOURCES` table
- [ ] Test data persistence with sample upload
- [ ] Set up monitoring/alerts (optional)

---

## Application Testing (Pre-Deployment)

### Backend (Local)
- [ ] All API endpoints working
- [ ] CORS configured correctly
- [ ] Error handling tested
- [ ] Logging configured (INFO level)
- [ ] Performance acceptable (sub-second analysis)

### Frontend (Local Build)
- [ ] Production build completes successfully (`npm run build`)
- [ ] API_URL points to production backend
- [ ] All pages render correctly
- [ ] No console errors
- [ ] Mobile responsive

---

## Deployment Steps

### Backend Deployment to EC2
- [ ] SSH into EC2 instance
- [ ] Clone repository
- [ ] Create virtual environment
- [ ] Install dependencies
- [ ] Configure `.env` file with production credentials
- [ ] Test locally on EC2 (`python3 app.py`)
- [ ] Configure to run as systemd service (persistent)
- [ ] Start service
- [ ] Verify endpoints accessible from public IP

### Frontend Deployment to Hosting
- [ ] Choose hosting platform (Vercel/Netlify/AWS S3)
- [ ] Connect GitHub repository
- [ ] Configure build settings:
  - Build command: `npm run build`
  - Output directory: `dist` or `build`
- [ ] Set environment variable: `VITE_API_URL=<EC2_public_URL>`
- [ ] Deploy
- [ ] Verify deployment successful
- [ ] Test public URL

---

## Integration Testing (Production)

### Backend Tests
- [ ] Health check: `GET /api/health`
- [ ] File upload: `POST /api/analyze/upload`
- [ ] URL download: `POST /api/analyze/url`
- [ ] Email forwarding (if Lambda deployed)
- [ ] Database persistence verified
- [ ] CORS working for frontend domain

### Frontend Tests
- [ ] All pages load correctly
- [ ] File upload workflow works
- [ ] URL submission workflow works
- [ ] Results display correctly
- [ ] Mobile responsive
- [ ] Cross-browser (Chrome, Firefox, Safari)

### End-to-End
- [ ] Upload file from frontend → See results
- [ ] Submit URL from frontend → See results
- [ ] Verify data in Snowflake
- [ ] Test error scenarios (invalid file, bad URL)

---

## Security Review

- [ ] No credentials committed to repository
- [ ] Environment variables secured on EC2
- [ ] HTTPS enforced (if SSL configured)
- [ ] File size limits enforced (10MB max)
- [ ] Input validation working
- [ ] CORS properly configured (not open to all origins)
- [ ] SQL injection not possible (parameterized queries)
- [ ] File upload directory permissions correct

---

## Documentation

- [ ] README.md updated with production URLs
- [ ] API_REFERENCE.md complete
- [ ] DEPLOYMENT_GUIDE.md created (Brandon)
- [ ] INTEGRATION_TEST_REPORT.md complete (Karrington)
- [ ] PRODUCTION_TEST_REPORT.md created (LeMikkos - Week 7)
- [ ] Production URLs documented and shared with team

---

## Monitoring & Logging

- [ ] CloudWatch logs configured for Lambda
- [ ] Backend logging enabled (app.log)
- [ ] Error tracking set up
- [ ] Performance monitoring enabled
- [ ] Log rotation configured

---

## Rollback Plan

**If deployment fails:**
1. Stop new traffic to production
2. Keep local development environment running
3. Use local environment for demo/presentation
4. Investigate logs for root cause
5. Document blockers
6. Retry deployment after fix

**Critical Issues to Watch:**
- Snowflake connection failures (MFA issues)
- CORS errors (frontend can't reach backend)
- Lambda not receiving emails
- File upload failures
- Database insert failures

---

## Post-Deployment Verification

- [ ] Backend URL accessible from any browser
- [ ] Frontend URL accessible from any browser
- [ ] Both URLs tested from multiple networks (not just school WiFi)
- [ ] Mobile testing complete
- [ ] LeMikkos QA sign-off received
- [ ] Production URLs shared with team
- [ ] System ready for April 28 presentation

---

## Team Sign-Off

- [ ] **Karrington (Backend/Lambda)** - Deployed and tested ✅
- [ ] **Kendall (Frontend)** - Deployed and tested ✅
- [ ] **Brandon (Infrastructure)** - AWS setup complete ✅
- [ ] **LeMikkos (Testing)** - QA passed ✅

---

## Production URLs (To Be Filled)

**Backend API:**
- URL: `http://<EC2_IP>:5000` or `https://<domain>`
- Status: [ ] Deployed [ ] Tested

**Frontend:**
- URL: `https://<hosting_platform_url>`
- Status: [ ] Deployed [ ] Tested

**Lambda Email:**
- Email: `analyze@<domain>` or SES-provided
- Status: [ ] Deployed [ ] Tested

---

**Status:** In Progress (Week 6 Complete, Week 7 Deployment Scheduled)  
**Target Completion:** Friday, April 17, 2026  
**Deployment Date:** April 13-17, 2026  
**Presentation:** Tuesday, April 28, 2026 at 11:00 AM
