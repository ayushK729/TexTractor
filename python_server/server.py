from flask import Flask, request, jsonify
from PIL import Image
import easyocr
import io
import numpy as np

app = Flask(__name__)

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

@app.route('/ocr', methods=['POST'])
def ocr():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    file = request.files['image']
    img = Image.open(io.BytesIO(file.read()))
    
    # Convert the image to a numpy array for EasyOCR
    img_array = np.array(img)

    # Perform OCR with EasyOCR
    result = reader.readtext(img_array)
    
    # Extract and concatenate the text from the result
    text = " ".join([item[1] for item in result])
    
    return jsonify({"text": text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
