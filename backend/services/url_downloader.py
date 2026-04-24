"""
URL Downloader Service
Downloads files from URLs with validation, size limits, and timeout controls.
"""

import os
import requests
import uuid
import logging
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

class URLDownloader:
    """
    Service for downloading files from URLs safely with size and timeout limits.
    """
    
    def __init__(self, max_size_mb=10, timeout_seconds=30):
        """
        Initialize URL downloader with limits.
        
        Args:
            max_size_mb (int): Maximum file size in megabytes (default: 10MB)
            timeout_seconds (int): Download timeout in seconds (default: 30s)
        """
        self.max_size_bytes = max_size_mb * 1024 * 1024
        self.timeout = timeout_seconds
        self.download_dir = "/tmp/url-downloads"
        os.makedirs(self.download_dir, exist_ok=True)
        logger.info(f"URLDownloader initialized (max: {max_size_mb}MB, timeout: {timeout_seconds}s)")
    
    def validate_url(self, url):
        """
        Validate URL format and scheme.
        
        Args:
            url (str): URL to validate
            
        Returns:
            tuple: (bool, str) - (is_valid, error_message)
        """
        try:
            parsed = urlparse(url)
            
            # Check scheme
            if parsed.scheme not in ['http', 'https']:
                return False, f"Invalid URL scheme: {parsed.scheme}. Only HTTP/HTTPS allowed."
            
            # Check domain exists
            if not parsed.netloc:
                return False, "URL must include a domain name."
            
            return True, None
            
        except Exception as e:
            return False, f"Invalid URL format: {str(e)}"
    
    def download_file(self, url):
        """
        Download file from URL with size and timeout limits.
        
        Args:
            url (str): URL to download from
            
        Returns:
            dict: Download result with success status, file path, and metadata
                {
                    'success': bool,
                    'file_path': str,
                    'filename': str,
                    'size': int,
                    'content_type': str,
                    'url': str,
                    'error': str (if failed)
                }
        """
        # Validate URL
        is_valid, error_msg = self.validate_url(url)
        if not is_valid:
            return {'success': False, 'error': error_msg}
        
        try:
            # Send HEAD request first to check size
            logger.info(f"Checking file size for URL: {url}")
            head_response = requests.head(url, timeout=self.timeout, allow_redirects=True)
            
            # Check if we can get content length
            content_length = head_response.headers.get('content-length')
            if content_length:
                file_size = int(content_length)
                if file_size > self.max_size_bytes:
                    return {
                        'success': False,
                        'error': f'File too large: {file_size / (1024*1024):.2f}MB (max: {self.max_size_bytes / (1024*1024)}MB)'
                    }
            
            # Download the file
            logger.info(f"Downloading file from URL: {url}")
            response = requests.get(url, timeout=self.timeout, stream=True)
            response.raise_for_status()  # Raise exception for bad status codes
            
            # Generate unique filename
            original_filename = os.path.basename(urlparse(url).path)
            if not original_filename or '.' not in original_filename:
                # Guess extension from content-type
                content_type = response.headers.get('content-type', '')
                ext = self._guess_extension(content_type)
                original_filename = os.path.basename(urlparse(url).path)
                if not original_filename or '.' not in original_filename:
                    # Use domain name as filename instead of generic "download"
                    content_type = response.headers.get('content-type', '')
                    ext = self._guess_extension(content_type)
                    domain = urlparse(url).netloc.replace('www.', '')
                    original_filename = f"{domain}{ext}"
            
            unique_filename = f"{uuid.uuid4()}_{original_filename}"
            file_path = os.path.join(self.download_dir, unique_filename)
            
            # Download with size limit check
            downloaded_size = 0
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        downloaded_size += len(chunk)
                        if downloaded_size > self.max_size_bytes:
                            f.close()
                            os.remove(file_path)
                            return {
                                'success': False,
                                'error': f'File exceeded size limit during download (max: {self.max_size_bytes / (1024*1024)}MB)'
                            }
                        f.write(chunk)
            
            logger.info(f"Downloaded {downloaded_size} bytes to {file_path}")
            
            return {
                'success': True,
                'file_path': file_path,
                'filename': original_filename,
                'size': downloaded_size,
                'content_type': response.headers.get('content-type', 'unknown'),
                'url': url
            }
            
        except requests.exceptions.Timeout:
            return {'success': False, 'error': f'Download timeout after {self.timeout} seconds'}
        
        except requests.exceptions.RequestException as e:
            return {'success': False, 'error': f'Download failed: {str(e)}'}
        
        except Exception as e:
            logger.error(f"Unexpected error downloading URL: {str(e)}")
            return {'success': False, 'error': f'Unexpected error: {str(e)}'}
    
    def cleanup_file(self, file_path):
        """
        Delete a downloaded file.
        
        Args:
            file_path (str): Path to file to delete
        """
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Cleaned up file: {file_path}")
        except Exception as e:
            logger.error(f"Failed to cleanup file {file_path}: {str(e)}")
    
    def _guess_extension(self, content_type):
        """
        Guess file extension from content-type header.
        
        Args:
            content_type (str): HTTP content-type header value
            
        Returns:
            str: File extension with dot (e.g., '.pdf')
        """
        type_map = {
            'application/pdf': '.pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
            'application/msword': '.doc',
            'text/plain': '.txt',
            'text/html': '.html',
            'image/png': '.png',
            'image/jpeg': '.jpg',
        }
        return type_map.get(content_type.split(';')[0].strip(), '.bin')