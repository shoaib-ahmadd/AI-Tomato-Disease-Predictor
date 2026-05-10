const fileInput = document.getElementById("fileInput");
const dropzone = document.getElementById("dropzone");
const previewImg = document.getElementById("previewImg");
const previewEmpty = document.getElementById("previewEmpty");
const predictBtn = document.getElementById("predictBtn");
const resetBtn = document.getElementById("resetBtn");
const stateIdle = document.getElementById("stateIdle");
const stateLoading = document.getElementById("stateLoading");
const stateError = document.getElementById("stateError");
const resultPanel = document.getElementById("resultPanel");
const predClass = document.getElementById("predClass");
const latency = document.getElementById("latency");
const pathogen = document.getElementById("pathogen");
const spray = document.getElementById("spray");
const remedy = document.getElementById("remedy");
const prevention = document.getElementById("prevention");
const errMsg = document.getElementById("errMsg");
const confidenceBar = document.getElementById("confidenceBar");
const confidenceText = document.getElementById("confidenceText");

let selectedFile = null;

// OPEN FILE PICKER
dropzone.addEventListener("click", () => {
    fileInput.click();
});

// DRAG AND DROP
dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("drag-over");
});

dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("drag-over");
});

dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
});

// FILE SELECT
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
});

// HANDLE FILE
function handleFile(file) {
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (event) => {
        previewImg.src = event.target.result;
        previewImg.style.display = "block";
        previewEmpty.style.display = "none";
        predictBtn.disabled = false;
        resetBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

// RESET
resetBtn.addEventListener("click", () => {
    selectedFile = null;
    previewImg.src = "";
    previewImg.style.display = "none";
    previewEmpty.style.display = "grid";
    fileInput.value = "";
    predictBtn.disabled = true;
    resetBtn.disabled = true;
    resultPanel.classList.add("hidden");
    stateError.classList.add("hidden");
    stateIdle.classList.remove("hidden");
    confidenceBar.style.width = "0%";
    confidenceText.textContent = "0% Confidence";
});

// PREDICT WITH AUTO RETRY
predictBtn.addEventListener("click", async () => {
    if (!selectedFile) return;
    await runPrediction();
});

async function runPrediction(retryCount = 0) {

    const MAX_RETRIES = 5;
    const RETRY_DELAY = 5000; // 5 seconds

    stateIdle.classList.add("hidden");
    stateError.classList.add("hidden");
    resultPanel.classList.add("hidden");
    stateLoading.classList.remove("hidden");

    // Loading message update karo retry pe
    const loadingTitle = document.querySelector(".loading-title");
    const loadingSub = document.querySelector(".loading-sub");

    if (retryCount === 0) {
        loadingTitle.textContent = "Running inference…";
        loadingSub.textContent = "Please wait. This may take a moment on CPU.";
    } else {
        loadingTitle.textContent = `Model load ho raha hai… (${retryCount}/${MAX_RETRIES})`;
        loadingSub.textContent = "Backend warm up ho raha hai, 5 seconds mein retry…";
    }

    try {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const response = await fetch(
            `${window.APP_CONFIG.API_BASE_URL}/predict`,
            {
                method: "POST",
                body: formData
            }
        );

        // 503 = Model abhi load ho raha hai — retry karo
        if (response.status === 503) {
            if (retryCount < MAX_RETRIES) {
                await sleep(RETRY_DELAY);
                return runPrediction(retryCount + 1);
            } else {
                throw new Error("Backend warm up nahi hua. Please 1 minute baad try karo.");
            }
        }

        // 502 = Server crash
        if (response.status === 502) {
            throw new Error("Backend crash ho gaya (502). Render logs check karo.");
        }

        // Other errors
        if (!response.ok) {
            throw new Error(`Server error (${response.status}). Please try again.`);
        }

        const data = await response.json();

        stateLoading.classList.add("hidden");

        if (data.error) {
            throw new Error(data.error);
        }

        // SHOW RESULT
        resultPanel.classList.remove("hidden");

        // PREDICTION
        predClass.textContent = data.prediction || "Unknown";

        // CONFIDENCE
        const confidenceValue = Number(data.confidence || 0);
        confidenceBar.style.width = `${confidenceValue}%`;
        confidenceText.textContent = `${confidenceValue.toFixed(2)}% Confidence`;

        // LATENCY
        latency.textContent = data.latency || "—";

        // PATHOGEN
        pathogen.textContent = data.caused_by || "Not available";

        // CLEAR OLD
        spray.innerHTML = "";
        remedy.innerHTML = "";
        prevention.innerHTML = "";

        // SPRAY
        (data.spray || []).forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            spray.appendChild(li);
        });

        // REMEDY
        (data.remedy || []).forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            remedy.appendChild(li);
        });

        // PREVENTION
        (data.prevention || []).forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            prevention.appendChild(li);
        });

    } catch (error) {
        stateLoading.classList.add("hidden");
        stateError.classList.remove("hidden");
        errMsg.textContent = error.message;
    }
}

// SLEEP HELPER
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}