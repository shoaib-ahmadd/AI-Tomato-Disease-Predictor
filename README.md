# AI Tomato Leaf Disease Detection System

<div align="center">
        
<!-- GitHub Stats -->
<img src="https://img.shields.io/github/stars/shoaib-ahmadd/AI-Tomato-Disease-Predictor?style=for-the-badge&color=yellow" />
<img src="https://img.shields.io/github/forks/shoaib-ahmadd/AI-Tomato-Disease-Predictor?style=for-the-badge&color=blue" />
<img src="https://img.shields.io/github/repo-size/shoaib-ahmadd/AI-Tomato-Disease-Predictor?style=for-the-badge&color=green" />
<img src="https://img.shields.io/github/license/shoaib-ahmadd/AI-Tomato-Disease-Predictor?style=for-the-badge&color=red" />

<br/>
<br/>

<!-- Tech Stack -->
<img src="https://img.shields.io/badge/Python-3.10-3776AB?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/TensorFlow-2.10-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" />
<img src="https://img.shields.io/badge/Keras-Deep%20Learning-D00000?style=for-the-badge&logo=keras&logoColor=white" />
<img src="https://img.shields.io/badge/Flask-REST%20API-000000?style=for-the-badge&logo=flask&logoColor=white" />

<br/>
<br/>

<!-- Deployment -->
<img src="https://img.shields.io/badge/Frontend-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" />
<img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" />
<img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge&logo=circle&logoColor=white" />

<br/>
<br/>

### [View Live Demo](https://ai-tomato-disease-frontend.netlify.app)

</div>

---

## Overview

An end-to-end deep learning web application for tomato leaf disease classification using Convolutional Neural Networks.

The system allows users to upload tomato leaf images and receive instant disease predictions along with confidence scores and treatment advisory suggestions.

The project was trained on more than **7,500 tomato leaf images** across multiple disease categories using transfer learning and CNN-based architectures.

---

## Screenshots

<div align="center">

### Application Interface
<img src="assets/screenshots/UI.png" width="90%" alt="UI Screenshot"/>

<br/><br/>

### Early Blight Detection
<img src="assets/screenshots/Early.png" width="90%" alt="Early Blight"/>

<br/><br/>

### Late Blight Detection
<img src="assets/screenshots/Late.png" width="90%" alt="Late Blight"/>

<br/><br/>

### Healthy Leaf Detection
<img src="assets/screenshots/Healthy.png" width="90%" alt="Healthy Leaf"/>

</div>

---

## Features

| Feature | Description |
|---|---|
| Disease Detection | Classifies Early Blight, Late Blight, Healthy |
| Confidence Score | Visual confidence bar with percentage |
| Treatment Advisory | Spray, remedy, and prevention recommendations |
| Latency Tracking | Real-time inference time displayed |
| Drag & Drop Upload | Easy image upload interface |
| Export Results | Copy or download JSON prediction report |

---

## Deep Learning Models

| Model | Type | Purpose |
|---|---|---|
| ResNet50 | Transfer Learning | Feature Extraction |
| DenseNet121 | Transfer Learning | Feature Extraction |
| MobileNetV3 | Lightweight CNN | Mobile Optimization |
| Custom CNN | Scratch Model | Baseline Comparison |

Final inference pipeline uses MobileNet preprocessing with TensorFlow/Keras.

---

## Model Training

The deep learning model was trained on more than **7,500 tomato leaf images** using transfer learning and CNN architectures.

Training workflow included:

- Image preprocessing
- Data augmentation
- Feature extraction
- Multi-model experimentation
- Accuracy optimization
- Latency optimization

The final trained model was exported as `model.h5` and integrated with the Flask backend inference pipeline.

---

## Project Structure

```bash
AI-Tomato-Disease-Predictor/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── config.js
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── model/
│       └── model.h5
│
├── assets/
│   └── screenshots/
│       ├── UI.png
│       ├── Early.png
│       ├── Late.png
│       └── Healthy.png
│
├── README.md
└── .gitignore
```

---

## System Workflow

```text
User Uploads Leaf Image
        ↓
Frontend Interface
        ↓
Flask REST API
        ↓
TensorFlow Model Inference
        ↓
Disease Classification
        ↓
Confidence Score + Advisory Report
```

---

## Tech Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Netlify

### Backend
- Python 3.10
- Flask
- Flask-CORS
- Gunicorn
- Render

### Machine Learning
- TensorFlow
- Keras
- NumPy
- Pillow

---

## Supported Classes

```text
Early Blight
Healthy
Late Blight
```

---

## Run Locally

### Clone Repository

```bash
git clone https://github.com/shoaib-ahmadd/AI-Tomato-Disease-Predictor.git
cd AI-Tomato-Disease-Predictor
```

### Setup Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs at:

```bash
http://localhost:5000
```

### Setup Frontend

Open `frontend/index.html` using Live Server in VS Code.

For local testing, make sure `config.js` points to:

```bash
http://localhost:5000
```

---

## Deployment Note

The backend is deployed on Render free-tier infrastructure.

Due to TensorFlow model size and memory-intensive inference operations, the backend service may occasionally become unavailable on low-memory cloud environments.

For stable performance and accurate predictions, it is recommended to run the project locally on your system.

This project demonstrates practical experience with:

- Deep learning integration
- TensorFlow deployment
- Flask API development
- Frontend-backend communication
- CORS handling
- Model optimization
- Real-world deployment debugging

---

## Future Improvements

- TensorFlow Lite optimization
- Docker containerization
- GPU cloud inference
- Real-time camera prediction
- Mobile application integration
- Disease severity estimation
- Multi-crop disease support

---

## API Reference

### POST `/predict`

Request:
`multipart/form-data` with `image` field

Response:

```json
{
  "prediction": "Early Blight",
  "confidence": 94.32,
  "latency": "812.5 ms",
  "caused_by": "Alternaria solani fungus",
  "spray": ["Copper Oxychloride", "Mancozeb"],
  "remedy": ["Remove infected leaves", "Avoid overwatering"],
  "prevention": ["Maintain airflow", "Use disease-free seeds"]
}
```

---

### GET `/health`

```json
{
  "status": "ok"
}
```

---

## Challenges & Learnings

| Challenge | Solution |
|---|---|
| CORS blocked requests | Configured Flask-CORS properly |
| Backend port binding issue | Configured Render deployment settings |
| TensorFlow deployment errors | Managed dependency compatibility |
| Free-tier memory limitations | Recommended local execution workflow |
| Frontend-backend integration | Implemented API-based architecture |

---

## Author

<div align="center">

### Shoaib Ahmad

[![GitHub](https://img.shields.io/badge/GitHub-shoaib--ahmadd-181717?style=for-the-badge&logo=github)](https://github.com/shoaib-ahmadd)

[![Repository](https://img.shields.io/badge/Repository-AI--Tomato--Disease--Predictor-green?style=for-the-badge&logo=github)](https://github.com/shoaib-ahmadd/AI-Tomato-Disease-Predictor)

</div>

---

## License

This project is licensed under the MIT License.
