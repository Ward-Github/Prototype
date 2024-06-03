import easyocr
import re
import sys

def read_text_from_image(image_path):
    reader = easyocr.Reader(['nl'], verbose=False)
    results = reader.readtext(image_path)
    license_plate = None
    for result in results:
        text = result[1]
        # formats can be 99-xxx-9, x-999-xx, xx-999-x or 9-xxx-99
        if re.match(r'^\d{2}-\w{3}-\d$', text) or re.match(r'^\w-\d{3}-\w{2}$', text) or re.match(r'^\w{2}-\d{3}-\w$', text) or re.match(r'^\d-\w{3}-\d{2}$', text):
            license_plate = text
            break
    return license_plate

if len(sys.argv) != 2:
    print("Usage: python ImageToText.py <image_path>")
    sys.exit(1)

IMAGE_PATH = sys.argv[1]
text = read_text_from_image(IMAGE_PATH)
print(text)