from PIL import Image, ImageDraw, ImageFont
import os

# Create test images directory
os.makedirs('test_data/test_images', exist_ok=True)

def create_text_image(filename, text, size=(800, 400)):
    """Create an image with text on it."""
    img = Image.new('RGB', size, color='white')
    draw = ImageDraw.Draw(img)
    
    # Use default font
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
    except:
        font = ImageFont.load_default()
    
    # Draw text
    draw.text((50, 50), text, fill='black', font=font)
    
    # Save
    img.save(f'test_data/test_images/{filename}')
    print(f"✅ Created: {filename}")

# Clean image
create_text_image(
    'clean_image_001.png',
    'This is a clean document.\n\nContact us at: support@company.com\n\nThank you!'
)

# Malicious image - suspicious URL
create_text_image(
    'malicious_image_001.png',
    'URGENT: Your account will be suspended!\n\nVerify now at: http://paypa1-login.cc:8443/verify\n\nContact: admin@paypa1-secure.ru'
)

# Malicious image - Bitcoin address
create_text_image(
    'malicious_image_002.png',
    'Payment Instructions:\n\nSend Bitcoin to:\n1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa\n\nAmount: 0.5 BTC'
)

# Malicious image - IP addresses
create_text_image(
    'malicious_image_003.png',
    'Connect to server:\n192.168.1.100:8080\n\nBackup server:\n203.0.113.45:9443'
)

print("\n✅ All test images created in test_data/test_images/")
print("Brandon can use these to test Tesseract OCR!")
