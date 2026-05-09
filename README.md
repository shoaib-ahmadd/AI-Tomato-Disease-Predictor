# 🍅 AI Tomato Leaf Disease Predictor

## 📌 Overview

This project is an **AI-powered Tomato Leaf Disease Prediction system** that detects and classifies diseases in tomato leaves using deep learning techniques.

The system consists of a responsive frontend interface integrated with a backend model API. Users can upload an image of a tomato leaf and receive predictions along with confidence scores.

The model is built using a **Hybrid CNN architecture** combining:

* ResNet
* DenseNet
* MobileNet
* Custom CNN

---

## 🚀 Features

* 📤 Upload tomato leaf images
* 🖼️ Image preview before prediction
* ⚡ Real-time prediction using API
* 📊 Disease classification with confidence score
* 💻 Clean and responsive user interface
* 🔗 Easy integration with Flask / FastAPI backend

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript
* **Backend:** Flask / FastAPI
* **Model:** Hybrid CNN (Deep Learning)
* **Libraries:** TensorFlow / Keras, OpenCV, NumPy

---

## 📂 Project Structure

```bash
ai-tomato-disease-predictor/
│
├── index.html
├── style.css
├── config.js
├── 4CNN_Architecture.ipynb
├── tomato_leaf_disease_hybrid_cnn_v1.keras
├── temp.jpg
└── README.md
```

---

## ▶️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/ai-tomato-disease-predictor.git
cd ai-tomato-disease-predictor
```

### 2️⃣ Run the frontend

* Open `index.html` in your browser
  **OR**
* Use VS Code Live Server

---

## 📡 API Integration

Update API URL inside your JavaScript file:

```javascript
const apiUrl = "http://127.0.0.1:5000/predict";
```

For deployed backend:

```javascript
const apiUrl = "https://your-backend-url.com/predict";
```

---

## 🧪 Expected Output

After uploading an image:

* ✅ Predicted Disease Name
* 📊 Confidence Score
* 🖼️ Image Preview

**Example:**

```
Prediction: Early Blight  
Confidence: 96.42%
```

---

## 🎯 Use Cases

* 🌱 Smart agriculture solutions
* 🤖 AI-based plant disease detection
* 🎓 Final year / academic projects
* 📊 ML model deployment demos

---

## 🔮 Future Improvements

* Drag & drop image upload
* Disease remedies suggestions
* Loading animation
* Better error handling
* Mobile-first UI
* Dark mode

---

## 👨‍💻 Contributors

* **Shoaib Ahmad**
* **Rafiq**

> Contributions, suggestions, and improvements are welcome.
Feel free to fork the repository and submit a pull request.

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author
Shoaib Ahmad

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
