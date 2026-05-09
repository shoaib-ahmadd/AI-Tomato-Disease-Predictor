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


// CONFIDENCE
const confidenceBar = document.getElementById("confidenceBar");
const confidenceText = document.getElementById("confidenceText");


let selectedFile = null;



// OPEN FILE PICKER
dropzone.addEventListener("click", () => {
    fileInput.click();
});



// FILE SELECT
fileInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

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
});



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



// PREDICT
predictBtn.addEventListener("click", async () => {

    if (!selectedFile) return;

    stateIdle.classList.add("hidden");

    stateError.classList.add("hidden");

    resultPanel.classList.add("hidden");

    stateLoading.classList.remove("hidden");

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

        if (!response.ok) {
            throw new Error("Server error");
            }

        
        const data = await response.json();

        stateLoading.classList.add("hidden");

        if (data.error) {
            throw new Error(data.error);
        }

        resultPanel.classList.remove("hidden");



        // PREDICTION
        predClass.textContent = data.prediction || "Unknown";



        // CONFIDENCE
        const confidenceValue = Number(data.confidence || 0);

        confidenceBar.style.width = `${confidenceValue}%`;

        confidenceText.textContent =
            `${confidenceValue.toFixed(2)}% Confidence`;



        // LATENCY
        latency.textContent = data.latency || "—";



        // PATHOGEN
        pathogen.textContent =
            data.caused_by || "Not available";



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

    }

    catch (error) {

        stateLoading.classList.add("hidden");

        stateError.classList.remove("hidden");

        errMsg.textContent = error.message;
    }
});

