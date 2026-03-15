"""
Flask Backend API - Malicious File Analyzer
Main application file with all API endpoints.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
import time
import uuid
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Import services
from services.file_processor import FileProcessor
from utils.regex_patterns import IndicatorExtractor
from services.scoring import MaliciousScorer
from services.snowflake_client import get_snowflake_client
from services.aws_client import get_s3_client


# ============================================================================
# HEALTH CHECK ENDPOINT
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint to verify API is running.
    
    Returns:
        JSON response with status
    """
    return jsonify({
        'status': 'healthy',
        'service': 'Malicious File Analyzer API',
        'version': '1.0.0'
    }), 200


# ============================================================================
# FILE UPLOAD ANALYSIS ENDPOINT
# ============================================================================

@app.route('/api/analyze/upload', methods=['POST'])
def analyze_upload():
    """
    Analyze a file uploaded directly by user.
    
    Process:
    1. Receive file from user
    2. Process file (extract text)
    3. Extract indicators (URLs, IPs, etc.)
    4. Calculate malicious score
    5. Store results in Snowflake
    6. Return analysis results
    
    Returns:
        JSON response with analysis results
    """
    start_time = time.time()
    
    # Validate request has file
    if 'file' not in request.files:
        return jsonify({
            'success': False,
            'error': 'No file provided. Please upload a file.'
        }), 400
    
    file = request.files['file']
    
    # Validate filename exists
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No file selected'
        }), 400
    
    try:
        # Create temp directory for uploaded files
        temp_dir = '/tmp/malware-uploads'
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save uploaded file temporarily with unique ID
        temp_filename = f"{uuid.uuid4()}_{file.filename}"
        temp_path = os.path.join(temp_dir, temp_filename)
        file.save(temp_path)
        
        logger.info(f"Processing uploaded file: {file.filename}")
        
        # Step 1: Process file to extract text
        processor = FileProcessor()
        file_data = processor.process_file(temp_path)
        
        # Step 2: Extract malicious indicators from text
        extractor = IndicatorExtractor()
        indicators = extractor.extract_all_indicators(file_data['text'])
        
        # Step 3: Calculate malicious score
        scorer = MaliciousScorer()
        score_result = scorer.calculate_score(indicators)
        
        # Step 4: Store results in Snowflake
        with get_snowflake_client() as sf:
            # Prepare scan data
            scan_data = {
                'filename': file.filename,
                'file_type': file_data['file_type'],
                'file_size_bytes': file_data['size'],
                'malicious_score': score_result['score'],
                'severity': score_result['severity'],
                'analysis_duration_seconds': time.time() - start_time,
                'source_method': 'upload',
                'user_ip': request.remote_addr,
                'processing_status': 'completed'
            }
            
            # Insert scan result and get scan ID
            scan_id = sf.insert_scan_result(scan_data)
            logger.info(f"Stored scan result with ID: {scan_id}")
            
            # Store individual indicators
            indicator_list = []
            for ind_type, values in indicators.items():
                for value in values:
                    indicator_list.append({
                        'indicator_type': ind_type,
                        'indicator_value': value,
                        'confidence': 1.0
                    })
            
            if indicator_list:
                sf.insert_indicators(scan_id, indicator_list)
                logger.info(f"Stored {len(indicator_list)} indicators")
        
        # Step 5: Clean up temp file
        os.remove(temp_path)
        
        # Step 6: Return results to user
        return jsonify({
            'success': True,
            'scan_id': scan_id,
            'filename': file.filename,
            'score': score_result['score'],
            'severity': score_result['severity'],
            'indicators': indicators,
            'explanation': score_result['explanation'],
            'analysis_time_seconds': round(time.time() - start_time, 2)
        }), 200
        
    except Exception as e:
        logger.error(f"Upload analysis failed: {str(e)}")
        
        # Clean up temp file if it exists
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        
        return jsonify({
            'success': False,
            'error': f'Analysis failed: {str(e)}'
        }), 500


# ============================================================================
# URL ANALYSIS ENDPOINT
# ============================================================================

@app.route('/api/analyze/url', methods=['POST'])
def analyze_url():
    """
    Download and analyze a file from a URL.
    
    Process:
    1. Receive URL from user
    2. Validate URL
    3. Download file from URL
    4. Process and analyze file
    5. Store results in Snowflake
    6. Return analysis results
    
    Returns:
        JSON response with analysis results
    """
    start_time = time.time()
    
    # Get URL from request
    data = request.get_json()
    
    if not data or 'url' not in data:
        return jsonify({
            'success': False,
            'error': 'No URL provided'
        }), 400
    
    url = data['url']
    
    # TODO: Implement URL validation and download
    # TODO: This is a placeholder - will be completed in Week 2
    
    return jsonify({
        'success': False,
        'error': 'URL analysis not yet implemented. Coming in Week 2!'
    }), 501  # 501 = Not Implemented


# ============================================================================
# EMAIL ANALYSIS ENDPOINT
# ============================================================================

@app.route('/api/analyze/email', methods=['POST'])
def analyze_email():
    """
    Process an email forwarded for analysis.
    
    Process:
    1. Receive email data
    2. Extract attachments
    3. Process and analyze attachments
    4. Store results in Snowflake
    5. Return or email results
    
    Returns:
        JSON response with analysis results
    
    Note: This endpoint will be called by AWS Lambda/SES
    """
    # TODO: Implement email processing
    # TODO: This requires AWS SES setup - Week 3
    
    return jsonify({
        'success': False,
        'error': 'Email analysis not yet implemented. Coming in Week 3!'
    }), 501  # 501 = Not Implemented


# ============================================================================
# RESULTS RETRIEVAL ENDPOINTS
# ============================================================================

@app.route('/api/results/<scan_id>', methods=['GET'])
def get_scan_result(scan_id):
    """
    Retrieve analysis results for a specific scan.
    
    Args:
        scan_id: Unique scan identifier
    
    Returns:
        JSON response with scan results and indicators
    """
    try:
        with get_snowflake_client() as sf:
            # Get scan result
            scan = sf.get_scan_by_id(scan_id)
            
            if not scan:
                return jsonify({
                    'success': False,
                    'error': f'Scan not found: {scan_id}'
                }), 404
            
            # Get associated indicators
            indicators = sf.get_indicators_for_scan(scan_id)
            
            return jsonify({
                'success': True,
                'scan': scan,
                'indicators': indicators
            }), 200
            
    except Exception as e:
        logger.error(f"Failed to retrieve scan {scan_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/results/recent', methods=['GET'])
def get_recent_scans():
    """
    Retrieve the most recent scans.
    
    Query Parameters:
        limit (int): Number of scans to return (default: 10, max: 50)
    
    Returns:
        JSON response with list of recent scans
    """
    # Get limit from query parameters
    limit = request.args.get('limit', 10, type=int)
    
    # Cap limit at 50 to prevent excessive data transfer
    limit = min(limit, 50)
    
    try:
        with get_snowflake_client() as sf:
            scans = sf.get_recent_scans(limit=limit)
            
            return jsonify({
                'success': True,
                'scans': scans,
                'count': len(scans)
            }), 200
            
    except Exception as e:
        logger.error(f"Failed to retrieve recent scans: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    # Run Flask development server
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True') == 'True'
    
    logger.info(f"Starting Flask server on port {port}")
    logger.info(f"Debug mode: {debug}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )
