import time
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": [
    "*",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://ai-tomato-disease-frontend.netlify.app"
]}}, supports_credentials=True)

MODEL_PATH = "model/model.h5"
IMG_SIZE = 220
model = None
model_loading = False
model_loaded = False

class_names = ["Early Blight", "Healthy", "Late Blight"]

advice = {
    "Early Blight": {
        "caused_by": "Alternaria solani fungus",
        "spray": ["Copper Oxychloride", "Mancozeb"],
        "remedy": ["Remove infected leaves", "Avoid overwatering"],
        "prevention": ["Maintain airflow", "Use disease-free seeds"]
    },
    "Late Blight": {
        "caused_by": "Phytophthora infestans",
        "spray": ["Metalaxyl", "Chlorothalonil"],
        "remedy": ["Destroy infected plants", "Apply fungicide immediately"],
        "prevention": ["Avoid wet foliage", "Crop rotation"]
    },
    "Healthy": {
        "caused_by": "None",
        "spray": [],
        "remedy": ["Keep monitoring regularly"],
        "prevention": ["Continue good practices", "Regular watering"]
    }
}

def load_model_background():
    global model, model_loading, model_loaded
    try:
        model_loading = True
        print("Loading TensorFlow...")
        import tensorflow as tf
        from tensorflow.keras.models import load_model
        print("Loading model file...")
        model = load_model(MODEL_PATH, compile=False)
        model_loaded = True
        model_loading = False
        print("Model loaded successfully!")
    except Exception as e:
        model_loading = False
        print(f"Model load failed: {str(e)}")

thread = threading.Thread(target=load_model_background)
thread.daemon = True
thread.start()

@app.route("/")
def home():
    return jsonify({
        "message": "AI Tomato Disease Backend Running Successfully!",
        "model_loaded": model_loaded,
        "model_loading": model_loading
    })

@app.route("/health")
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": model_loaded,
        "model_loading": model_loading
    })

@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    if not model_loaded:
        if model_loading:
            return jsonify({
                "error": "Model is still loading, please wait 30 seconds and try again"
            }), 503
        else:
            return jsonify({
                "error": "Model failed to load, check logs"
            }), 500

    start_time = time.time()

    try:
        import tensorflow as tf

        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["image"]
        image = Image.open(io.BytesIO(file.read())).convert("RGB")
        image = image.resize((IMG_SIZE, IMG_SIZE))

        img_array = np.array(image)
        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
        img_array = np.expand_dims(img_array, axis=0)

        predictions = model.predict(img_array)
        predicted_index = np.argmax(predictions[0])
        predicted_class = class_names[predicted_index]
        confidence = float(np.max(predictions[0]) * 100)
        latency = round((time.time() - start_time) * 1000, 2)

        disease_info = advice.get(predicted_class, {})

        return jsonify({
            "prediction": predicted_class,
            "confidence": round(confidence, 2),
            "latency": f"{latency} ms",
            **disease_info
        })

    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)