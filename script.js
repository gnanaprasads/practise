const cameraFeed = document.getElementById('cameraFeed');
const captureButton = document.getElementById('captureButton');
const analysisResult = document.getElementById('analysisResult');

let model;

// Load the COCO-SSD model from TensorFlow.js
async function loadModel() {
    model = await cocoSsd.load();
    console.log('Model loaded');
}

// Initialize the camera feed
async function initCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraFeed.srcObject = stream;
    await cameraFeed.play();
}

// Capture an image from the camera feed
async function captureImage() {
    const canvas = document.createElement('canvas');
    canvas.width = cameraFeed.videoWidth;
    canvas.height = cameraFeed.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);

    return new Promise(resolve => {
        canvas.toBlob(blob => {
            resolve(blob);
        }, 'image/jpeg');
    });
}

// Analyze the captured image
async function analyzeImage() {
    const capturedBlob = await captureImage();

    // Use the COCO-SSD model to analyze the image
    const predictions = await model.detect(capturedBlob);

    // Display the analysis results
    analysisResult.innerHTML = '';
    for (const prediction of predictions) {
        analysisResult.innerHTML += `<p>${prediction.class} (confidence: ${Math.round(prediction.score * 100)}%)</p>`;
    }
}

captureButton.addEventListener('click', async () => {
    await initCamera();
    await loadModel();
    await analyzeImage();
});
