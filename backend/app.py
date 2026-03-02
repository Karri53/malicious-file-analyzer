"""
Malicious File Analyzer - Main Application
Team Opulence - Prairie View A&M University
NSA Senior Design Project - Spring 2026
"""

from flask import Flask, jsonify
from flask_cors import CORS
import logging
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    logger.info("Health check requested")
    return jsonify({
        'status': 'healthy',
        'message': 'Malicious File Analyzer API is running',
        'version': '1.0.0',
        'team': 'Team Opulence',
        'project': 'NSA Senior Design - Spring 2026'
    })

@app.route('/api/test', methods=['GET'])
def test():
    """Test endpoint to verify API is working"""
    logger.info("Test endpoint called")
    return jsonify({
        'message': 'API is working correctly!',
        'available_endpoints': {
            'health': '/api/health',
            'test': '/api/test',
            'url_analysis': '/api/analyze-url (coming soon)',
            'email_analysis': '/api/analyze-email (coming soon)',
            'file_upload': '/api/upload (coming soon)',
            'scan_history': '/api/history (coming soon)'
        },
        'team_members': {
            'project_lead': 'Karrington Hall',
            'ui_developer': 'Kendall Brown',
            'regex_developer': 'LeMikkos Starks',
            'backend_developer': 'Brandon Nobles'
        }
    })

@app.route('/', methods=['GET'])
def home():
    """Root endpoint"""
    return jsonify({
        'project': 'Malicious File Analyzer',
        'team': 'Team Opulence',
        'university': 'Prairie View A&M',
        'partner': 'NSA',
        'api_base': '/api',
        'documentation': '/api/test'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    logger.info(f"Starting Flask app on port {port}")
    app.run(debug=True, host='0.0.0.0', port=port)