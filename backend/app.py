import time
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)
@app.route("/")
def home():
    return "AI Tomato Disease Backend Running Successfully 🚀"

print("Loading AI model...")
from tensorflow.keras.models import load_model
MODEL_PATH = "model/model.h5"
model = None

print("MODEL LOADED SUCCESSFULLY")

IMG_SIZE = 220
print("CURRENT IMG_SIZE:", IMG_SIZE)


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/predict", methods=["POST"])
def predict():
    start_time = time.time()
    global model
    
    if model is None:
        print("Loading model...")
        model = load_model(MODEL_PATH, compile=False)
        print("Model loaded")

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"})

    file = request.files["image"]

    image = Image.open(io.BytesIO(file.read())).convert("RGB")
    image = image.resize((IMG_SIZE, IMG_SIZE))

    img_array = np.array(image)

    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(
        img_array
    )

    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)
    end_time = time.time()
    latency = round((end_time - start_time) * 1000, 2)

    class_names = ["Early Blight", "Healthy", "Late Blight"]
    predicted_index = np.argmax(predictions[0])
    predicted_class = class_names[predicted_index]
    
    confidence = float(np.max(predictions[0])*100)
    latency = round((time.time() - start_time) * 1000, 2)
    result = {
        "prediction": predicted_class,
        "confidence": round(confidence, 2),
        "latency": f"{latency} ms",
        "caused_by": "fungal infection",
        
        "spray": [
            "Copper Oxychloride",
            "Mancozeb"
        ],
        
        "remedy": [
            "Remove infected leaves",
            "Avoid overwatering"
        ],
        
        "prevention": [
            "Maintain airflow",
            "Use disease-free seeds"
        ]
    }

    return jsonify(result)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)