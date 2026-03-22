"""
AWS Lambda Function: Email Processor
Triggered by SES emails stored in S3, extracts attachments, analyzes them, and sends results.
"""

import json
import boto3
import os
import email
from email import policy
from email.parser import BytesParser
import requests
from datetime import datetime
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
s3_client = boto3.client('s3')
ses_client = boto3.client('ses')

# Environment variables
BACKEND_API_URL = os.environ.get('BACKEND_API_URL', 'http://localhost:5000')
ALLOWED_FILE_TYPES = os.environ.get('ALLOWED_FILE_TYPES', '.pdf,.docx,.txt,.png').split(',')
MAX_ATTACHMENT_SIZE_MB = int(os.environ.get('MAX_ATTACHMENT_SIZE_MB', '10'))
MAX_ATTACHMENTS = int(os.environ.get('MAX_ATTACHMENTS_PER_EMAIL', '5'))
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'analyze@malware-analyzer.com')

# Constants
MAX_ATTACHMENT_BYTES = MAX_ATTACHMENT_SIZE_MB * 1024 * 1024


def lambda_handler(event, context):
    """
    Main Lambda handler triggered by S3 PUT events from SES.
    
    Args:
        event: S3 event data containing bucket and key
        context: Lambda context object
        
    Returns:
        dict: Response with status and message
    """
    try:
        # Extract S3 bucket and key from event
        record = event['Records'][0]
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        
        logger.info(f"Processing email from s3://{bucket}/{key}")
        
        # Download email from S3
        email_obj = s3_client.get_object(Bucket=bucket, Key=key)
        email_content = email_obj['Body'].read()
        
        # Parse email
        msg = BytesParser(policy=policy.default).parsebytes(email_content)
        
        # Extract metadata
        sender = msg['From']
        subject = msg['Subject'] or "No Subject"
        
        logger.info(f"Email from: {sender}, Subject: {subject}")
        
        # Extract and process attachments
        attachments = extract_attachments(msg)
        
        if not attachments:
            logger.warning("No attachments found in email")
            send_results_email(sender, subject, [], "No attachments found to analyze.")
            move_to_processed(bucket, key)
            return {'statusCode': 200, 'body': 'No attachments'}
        
        logger.info(f"Found {len(attachments)} attachment(s)")
        
        # Analyze each attachment
        results = []
        for attachment in attachments[:MAX_ATTACHMENTS]:
            result = analyze_attachment(attachment)
            results.append(result)
        
        # Send results email
        send_results_email(sender, subject, results)
        
        # Move email to processed folder
        move_to_processed(bucket, key)
        
        logger.info(f"Successfully processed email with {len(results)} results")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Email processed successfully',
                'attachments_analyzed': len(results)
            })
        }
        
    except Exception as e:
        logger.error(f"Error processing email: {str(e)}", exc_info=True)
        
        # Move to failed folder
        try:
            if 'bucket' in locals() and 'key' in locals():
                move_to_failed(bucket, key)
        except:
            pass
        
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


def extract_attachments(msg):
    """
    Extract attachments from email message.
    
    Args:
        msg: Parsed email message object
        
    Returns:
        list: List of attachment dictionaries
    """
    attachments = []
    
    for part in msg.walk():
        # Skip non-attachment parts
        if part.get_content_maintype() == 'multipart':
            continue
        if part.get('Content-Disposition') is None:
            continue
        
        filename = part.get_filename()
        if not filename:
            continue
        
        # Get file extension
        file_ext = os.path.splitext(filename)[1].lower()
        
        # Check if allowed type
        if file_ext not in ALLOWED_FILE_TYPES:
            logger.warning(f"Skipping {filename}: File type {file_ext} not allowed")
            attachments.append({
                'filename': filename,
                'skipped': True,
                'reason': f'File type {file_ext} not allowed'
            })
            continue
        
        # Get file content
        file_data = part.get_payload(decode=True)
        file_size = len(file_data)
        
        # Check size limit
        if file_size > MAX_ATTACHMENT_BYTES:
            logger.warning(f"Skipping {filename}: File too large ({file_size} bytes)")
            attachments.append({
                'filename': filename,
                'skipped': True,
                'reason': f'File too large ({file_size / (1024*1024):.2f}MB, max {MAX_ATTACHMENT_SIZE_MB}MB)'
            })
            continue
        
        attachments.append({
            'filename': filename,
            'content': file_data,
            'size': file_size,
            'type': file_ext,
            'skipped': False
        })
        
        logger.info(f"Extracted attachment: {filename} ({file_size} bytes)")
    
    return attachments


def analyze_attachment(attachment):
    """
    Send attachment to backend API for analysis.
    
    Args:
        attachment: Attachment dictionary with filename and content
        
    Returns:
        dict: Analysis results
    """
    # If attachment was skipped, return skip info
    if attachment.get('skipped'):
        return {
            'filename': attachment['filename'],
            'status': 'skipped',
            'reason': attachment['reason']
        }
    
    try:
        # Prepare file for upload
        files = {
            'file': (attachment['filename'], attachment['content'])
        }
        
        # Call backend API
        logger.info(f"Analyzing {attachment['filename']} via backend API")
        
        response = requests.post(
            f"{BACKEND_API_URL}/api/analyze/upload",
            files=files,
            timeout=60
        )
        
        response.raise_for_status()
        result = response.json()
        
        logger.info(f"Analysis complete for {attachment['filename']}: Score {result.get('score', 'N/A')}")
        
        return {
            'filename': attachment['filename'],
            'status': 'analyzed',
            'score': result.get('score', 0),
            'severity': result.get('severity', 'Unknown'),
            'indicators': result.get('indicators', {}),
            'explanation': result.get('explanation', [])
        }
        
    except requests.exceptions.Timeout:
        logger.error(f"Timeout analyzing {attachment['filename']}")
        return {
            'filename': attachment['filename'],
            'status': 'error',
            'reason': 'Analysis timeout (60 seconds)'
        }
    
    except Exception as e:
        logger.error(f"Error analyzing {attachment['filename']}: {str(e)}")
        return {
            'filename': attachment['filename'],
            'status': 'error',
            'reason': f'Analysis failed: {str(e)}'
        }


def send_results_email(recipient, original_subject, results, error_message=None):
    """
    Send analysis results via SES.
    
    Args:
        recipient: Email address to send results to
        original_subject: Subject of original email
        results: List of analysis results
        error_message: Optional error message
    """
    try:
        # Generate email body
        if error_message:
            html_body = generate_error_email(error_message)
            subject = f"Analysis Error - Re: {original_subject}"
        else:
            html_body = generate_results_email(results)
            subject = f"Analysis Complete - Re: {original_subject}"
        
        # Send email via SES
        response = ses_client.send_email(
            Source=SENDER_EMAIL,
            Destination={'ToAddresses': [recipient]},
            Message={
                'Subject': {'Data': subject},
                'Body': {
                    'Html': {'Data': html_body}
                }
            }
        )
        
        logger.info(f"Results email sent to {recipient}, MessageId: {response['MessageId']}")
        
    except Exception as e:
        logger.error(f"Failed to send results email: {str(e)}", exc_info=True)


def generate_results_email(results):
    """
    Generate HTML email body with analysis results.
    
    Args:
        results: List of analysis results
        
    Returns:
        str: HTML email content
    """
    # Count results by severity
    high_risk = sum(1 for r in results if r.get('status') == 'analyzed' and r.get('score', 0) >= 0.7)
    moderate = sum(1 for r in results if r.get('status') == 'analyzed' and 0.4 <= r.get('score', 0) < 0.7)
    safe = sum(1 for r in results if r.get('status') == 'analyzed' and r.get('score', 0) < 0.4)
    skipped = sum(1 for r in results if r.get('status') == 'skipped')
    errors = sum(1 for r in results if r.get('status') == 'error')
    
    # Determine overall threat level
    if high_risk > 0:
        threat_level = "🔴 HIGH RISK"
        threat_color = "#dc3545"
    elif moderate > 0:
        threat_level = "🟡 MODERATE RISK"
        threat_color = "#ffc107"
    else:
        threat_level = "🟢 SAFE"
        threat_color = "#28a745"
    
    # Build HTML
    html = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: #2c3e50; color: white; padding: 20px; text-align: center; }}
            .summary {{ background: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid {threat_color}; }}
            .file-result {{ background: white; border: 1px solid #ddd; padding: 15px; margin: 10px 0; }}
            .severity-badge {{ display: inline-block; padding: 5px 10px; border-radius: 3px; font-weight: bold; }}
            .high {{ background: #dc3545; color: white; }}
            .moderate {{ background: #ffc107; color: #333; }}
            .safe {{ background: #28a745; color: white; }}
            .skipped {{ background: #6c757d; color: white; }}
            .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🛡️ MALICIOUS FILE ANALYSIS RESULTS</h1>
            </div>
            
            <div class="summary">
                <h2>Summary</h2>
                <p><strong>Files analyzed:</strong> {len(results)}</p>
                <p><strong>Threat level:</strong> <span style="color: {threat_color}; font-weight: bold;">{threat_level}</span></p>
                <p><strong>Results:</strong> {safe} safe, {moderate} moderate, {high_risk} high risk, {skipped} skipped, {errors} errors</p>
            </div>
            
            <h2>Detailed Results</h2>
    """
    
    # Add individual file results
    for result in results:
        filename = result['filename']
        status = result['status']
        
        if status == 'analyzed':
            score = result['score']
            severity = result['severity']
            explanation = result.get('explanation', [])
            
            # Determine badge class
            if score >= 0.7:
                badge_class = "high"
            elif score >= 0.4:
                badge_class = "moderate"
            else:
                badge_class = "safe"
            
            html += f"""
            <div class="file-result">
                <h3>📄 {filename}</h3>
                <p><span class="severity-badge {badge_class}">{severity}</span> (Score: {score:.2f})</p>
            """
            
            if explanation:
                html += "<p><strong>Findings:</strong></p><ul>"
                for reason in explanation:
                    html += f"<li>{reason}</li>"
                html += "</ul>"
            else:
                html += "<p>No malicious indicators detected.</p>"
            
            html += "</div>"
        
        elif status == 'skipped':
            html += f"""
            <div class="file-result">
                <h3>📄 {filename}</h3>
                <p><span class="severity-badge skipped">SKIPPED</span></p>
                <p>Reason: {result['reason']}</p>
            </div>
            """
        
        elif status == 'error':
            html += f"""
            <div class="file-result">
                <h3>📄 {filename}</h3>
                <p><span class="severity-badge skipped">ERROR</span></p>
                <p>Reason: {result['reason']}</p>
            </div>
            """
    
    html += """
            <div class="footer">
                <p><strong>⚠️ DISCLAIMER:</strong> This is an automated analysis tool. Always exercise caution with suspicious files and emails.</p>
                <p>Powered by Team Opulence | NSA Senior Design Project | Prairie View A&M University</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return html


def generate_error_email(error_message):
    """
    Generate HTML email for errors.
    
    Args:
        error_message: Error description
        
    Returns:
        str: HTML email content
    """
    return f"""
    <html>
    <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #dc3545; color: white; padding: 20px; text-align: center;">
                <h1>⚠️ Analysis Error</h1>
            </div>
            <div style="padding: 20px; background: #f8f9fa; margin: 20px 0;">
                <p>{error_message}</p>
                <p>Please try again or contact support if the problem persists.</p>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                <p>Powered by Team Opulence | NSA Senior Design Project</p>
            </div>
        </div>
    </body>
    </html>
    """


def move_to_processed(bucket, key):
    """Move email from /incoming/ to /processed/ folder."""
    new_key = key.replace('/incoming/', '/processed/')
    s3_client.copy_object(Bucket=bucket, CopySource={'Bucket': bucket, 'Key': key}, Key=new_key)
    s3_client.delete_object(Bucket=bucket, Key=key)
    logger.info(f"Moved email to {new_key}")


def move_to_failed(bucket, key):
    """Move email from /incoming/ to /failed/ folder."""
    new_key = key.replace('/incoming/', '/failed/')
    s3_client.copy_object(Bucket=bucket, CopySource={'Bucket': bucket, 'Key': key}, Key=new_key)
    s3_client.delete_object(Bucket=bucket, Key=key)
    logger.info(f"Moved email to {new_key}")