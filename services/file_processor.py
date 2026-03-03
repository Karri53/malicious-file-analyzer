"""
File Processing Engine
Extracts text and metadata from PDF, Word, and image files.
Uses static analysis only - never executes file contents.
"""

import os
import hashlib
import logging
from typing import Dict, Optional
from datetime import datetime

# Import file processing libraries
try:
    import pdfplumber
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False
    logging.warning("pdfplumber not available")

try:
    from docx import Document
    DOCX_AVAILABLE = True
except ImportError:
    DOCX_AVAILABLE = False
    logging.warning("python-docx not available")

try:
    from PIL import Image
    from PIL.ExifTags import TAGS
    IMAGE_AVAILABLE = True
except ImportError:
    IMAGE_AVAILABLE = False
    logging.warning("Pillow not available")

logger = logging.getLogger(__name__)


class FileProcessor:
    """
    Processes files to extract text and metadata using static analysis.
    Supports PDF, DOCX, PNG, JPG, TXT file types.
    """
    
    SUPPORTED_TYPES = ['.pdf', '.docx', '.png', '.jpg', '.jpeg', '.txt']
    MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
    
    def __init__(self):
        """Initialize file processor"""
        logger.info("FileProcessor initialized")
    
    def validate_file(self, file_path: str) -> Dict:
        """
        Validate file before processing
        
        WHY: Reject files that are too large, wrong type, or don't exist
        
        Args:
            file_path (str): Path to file
            
        Returns:
            dict: Validation result with success status and errors
        """
        errors = []
        
        # Check file exists
        if not os.path.exists(file_path):
            errors.append("File does not exist")
            return {'valid': False, 'errors': errors}
        
        # Check file size
        file_size = os.path.getsize(file_path)
        if file_size > self.MAX_FILE_SIZE:
            errors.append(f"File too large ({file_size} bytes, max {self.MAX_FILE_SIZE})")
        
        # Check file extension
        _, ext = os.path.splitext(file_path)
        ext = ext.lower()
        if ext not in self.SUPPORTED_TYPES:
            errors.append(f"Unsupported file type: {ext}")
        
        valid = len(errors) == 0
        return {
            'valid': valid,
            'errors': errors,
            'file_size': file_size,
            'file_type': ext
        }
    
    def calculate_file_hash(self, file_path: str) -> str:
        """
        Calculate SHA256 hash of file
        
        WHY: Unique fingerprint for file - helps detect duplicates
        
        Args:
            file_path (str): Path to file
            
        Returns:
            str: SHA256 hash (64 character hex string)
        """
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            # Read in chunks for large files
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    
    def extract_text_from_pdf(self, file_path: str) -> str:
        """
        Extract text from PDF file
        
        WHY: PDFs may contain malicious URLs, IPs, emails hidden in text
        
        Args:
            file_path (str): Path to PDF file
            
        Returns:
            str: Extracted text (all pages combined)
        """
        if not PDF_AVAILABLE:
            logger.error("pdfplumber not available")
            return ""
        
        text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            
            logger.info(f"Extracted {len(text)} characters from PDF ({len(pdf.pages)} pages)")
        except Exception as e:
            logger.error(f"Error extracting PDF text: {e}")
        
        return text
    
    def extract_text_from_docx(self, file_path: str) -> str:
        """
        Extract text from Word document
        
        WHY: Word docs are common phishing vehicles
        
        Args:
            file_path (str): Path to DOCX file
            
        Returns:
            str: Extracted text (all paragraphs)
        """
        if not DOCX_AVAILABLE:
            logger.error("python-docx not available")
            return ""
        
        text = ""
        try:
            doc = Document(file_path)
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            
            logger.info(f"Extracted {len(text)} characters from Word doc")
        except Exception as e:
            logger.error(f"Error extracting Word text: {e}")
        
        return text
    
    def extract_metadata_from_image(self, file_path: str) -> Dict:
        """
        Extract EXIF metadata from image
        
        WHY: Images can contain GPS coordinates, camera info, timestamps
        
        Args:
            file_path (str): Path to image file
            
        Returns:
            dict: EXIF metadata key-value pairs
        """
        if not IMAGE_AVAILABLE:
            logger.error("Pillow not available")
            return {}
        
        metadata = {}
        try:
            image = Image.open(file_path)
            exif_data = image.getexif()
            
            if exif_data:
                for tag_id, value in exif_data.items():
                    tag = TAGS.get(tag_id, tag_id)
                    metadata[str(tag)] = str(value)
            
            logger.info(f"Extracted {len(metadata)} metadata fields from image")
        except Exception as e:
            logger.error(f"Error extracting image metadata: {e}")
        
        return metadata
    
    def process_file(self, file_path: str) -> Dict:
        """
        Process file and extract all text/metadata
        
        WHY: Main entry point - analyzes any supported file type
        
        Args:
            file_path (str): Path to file
            
        Returns:
            dict: Processing result with extracted text and metadata
        """
        # Validate file
        validation = self.validate_file(file_path)
        if not validation['valid']:
            return {
                'success': False,
                'errors': validation['errors']
            }
        
        file_type = validation['file_type']
        filename = os.path.basename(file_path)
        
        # Calculate hash
        file_hash = self.calculate_file_hash(file_path)
        
        # Extract text based on file type
        extracted_text = ""
        metadata = {}
        
        if file_type == '.pdf':
            extracted_text = self.extract_text_from_pdf(file_path)
        elif file_type == '.docx':
            extracted_text = self.extract_text_from_docx(file_path)
        elif file_type in ['.png', '.jpg', '.jpeg']:
            metadata = self.extract_metadata_from_image(file_path)
        elif file_type == '.txt':
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                extracted_text = f.read()
        
        result = {
            'success': True,
            'filename': filename,
            'file_type': file_type,
            'file_size': validation['file_size'],
            'file_hash': file_hash,
            'extracted_text': extracted_text,
            'text_length': len(extracted_text),
            'metadata': metadata,
            'processed_at': datetime.now().isoformat()
        }
        
        logger.info(f"Successfully processed {filename}: {len(extracted_text)} chars extracted")
        return result