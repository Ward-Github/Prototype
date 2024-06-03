import easyocr
import re
import sys
import cv2
from PIL import Image

def read_text_from_image(image_path):
    # Open the image file
    img = Image.open(image_path)
    # Check for EXIF data (i.e., metadata)
    if hasattr(img, '_getexif'): 
        exif_data = img._getexif()
        # Check if orientation info is present
        if 274 in exif_data: 
            # Handle the orientation
            if exif_data[274] == 3:
                img = img.rotate(180, expand=True)
            elif exif_data[274] == 6:
                img = img.rotate(270, expand=True)
            elif exif_data[274] == 8:
                img = img.rotate(90, expand=True)
    # Save the rotated image to a temp file
    temp_path = "temp.jpg"
    img.save(temp_path)

    reader = easyocr.Reader(['nl'], verbose=False)
    results = reader.readtext(temp_path)
    license_plate = None
    for result in results:
        text = result[1]
        # formats can be 99-xxx-9, x-999-xx, xx-999-x or 9-xxx-99
        if re.match(r'^\d{2}-\w{3}-\d$', text) or re.match(r'^\w-\d{3}-\w{2}$', text) or re.match(r'^\w{2}-\d{3}-\w$', text) or re.match(r'^\d-\w{3}-\d{2}$', text):
            license_plate = text
            break
    return license_plate

def rotate_image(image_path):
    image = cv2.imread(image_path)
    rotated_image = cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
    cv2.imwrite(image_path, rotated_image)

if len(sys.argv) != 2:
    print("Usage: python ImageToText.py <image_path>")
    sys.exit(1)

IMAGE_PATH = sys.argv[1]
text = read_text_from_image(f'images/{IMAGE_PATH}')
print(text)