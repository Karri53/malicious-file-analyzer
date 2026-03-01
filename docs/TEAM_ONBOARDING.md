# Team Onboarding Guide

Welcome to the Malicious File Analyzer project!

## Getting Started

### 1. Accept GitHub Invitation
Check your email for GitHub repository invitation and accept it.

### 2. Install Required Software

**macOS:**
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python@3.10

# Install Node.js
brew install node

# Install Git
brew install git
```

**Windows:**
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/
- Git: https://git-scm.com/download/win

### 3. Clone Repository
```bash
git clone https://github.com/[username]/malicious-file-analyzer.git
cd malicious-file-analyzer
```

### 4. Set Up Your Branch

Each team member has their own branch:

**UI Developer:**
```bash
git checkout frontend-dev
```

**Backend Developer:**
```bash
git checkout backend-dev
```

**RegEx & Data Evaluator:**
```bash
git checkout regex-dev
```

### 5. Daily Workflow
```bash
# Start of day
git checkout your-branch
git pull origin dev

# Work on your tasks
# ... make changes ...

# End of day
git add .
git commit -m "Descriptive message about what you did"
git push origin your-branch
```

## Team Roles

### Project Lead (Karrington Hall)
**Responsibilities:**
- Overall architecture
- AWS/Snowflake integration
- Code reviews
- Team coordination

**Focus Areas:**
- Backend integration
- Cloud infrastructure
- Database design

### UI Developer (Kendall Brown)
**Responsibilities:**
- React frontend development
- User experience design
- Responsive layouts
- Component creation

**Focus Areas:**
- EmailInstructions component
- URLAnalyzer component
- FileUploader component
- ResultsDisplay component

**Branch:** `frontend-dev`

### RegEx & Data Evaluator (LeMikkos Starks)
**Responsibilities:**
- Regex pattern development
- Indicator extraction
- Scoring algorithm
- Data validation

**Focus Areas:**
- File processing engine
- Pattern matching
- Malicious score calculation

**Branch:** `regex-dev`

### Backend Developer (Brandon Nobles)
**Responsibilities:**
- Flask API development
- AWS integration
- Database operations
- API endpoints

**Focus Areas:**
- Route creation
- AWS client integration
- Snowflake client
- Email processing

**Branch:** `backend-dev`

## Communication

### Daily Standups (Optional)
Quick 5-minute check-ins:
- What did you do yesterday?
- What will you do today?
- Any blockers?

### Code Reviews
- All code must be reviewed before merging to `dev`
- Create Pull Requests on GitHub
- Tag Project Lead for review

### Questions
- Create GitHub Issue
- Tag team member
- Or ask in group chat

## Resources

- **Project Board:** [Link to GitHub Project]
- **Documentation:** `/docs` folder
- **NSA Contacts:** See README.md
- **AWS Account:** [To be provided]
- **Snowflake Account:** [To be provided]

## First Week Tasks

Check the GitHub Project board for your assigned tasks. Focus on:

Week 1:
- [ ] Accept GitHub invitation
- [ ] Clone repository
- [ ] Install development tools
- [ ] Set up your branch
- [ ] Read all documentation
- [ ] Attend kickoff meeting

## Need Help?

Contact Project Lead: khall46@pvamu.edu
