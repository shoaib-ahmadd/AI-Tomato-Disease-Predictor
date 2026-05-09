import time
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True
)

print("Loading AI model...")

MODEL_PATH = "model/model.h5"
model = None

IMG_SIZE = 220

print("MODEL CONFIG READY")


@app.route("/")
def home():
    return jsonify({
        "message": "AI Tomato Disease Backend Running Successfully 🚀"
    })


@app.route("/health")
def health():
    return jsonify({
        "status": "ok"
    })


@app.route("/predict", methods=["POST"])
def predict():

    global model
    start_time = time.time()

    try:

        # Load model only once
        if model is None:
            print("Loading model...")
            model = load_model(MODEL_PATH, compile=False)
            print("Model loaded successfully")

        # Check image exists
        if "image" not in request.files:
            return jsonify({
                "error": "No image uploaded"
            }), 400

        file = request.files["image"]

        # Read image
        image = Image.open(io.BytesIO(file.read())).convert("RGB")
        image = image.resize((IMG_SIZE, IMG_SIZE))

        # Convert image to numpy
        img_array = np.array(image)

        # Preprocess image
        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(
            img_array
        )

        # Expand dimensions
        img_array = np.expand_dims(img_array, axis=0)

        # Predict
        predictions = model.predict(img_array)

        class_names = [
            "Early Blight",
            "Healthy",
            "Late Blight"
        ]

        predicted_index = np.argmax(predictions[0])
        predicted_class = class_names[predicted_index]

        confidence = float(np.max(predictions[0]) * 100)

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

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port
    )