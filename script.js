const container = document.querySelector(".container");
const sizeEl = document.querySelector(".grid-count");
const color = document.querySelector(".color-picker");
const reset = document.querySelector(".reset");
const undoBtn = document.querySelector(".undo");
const redoBtn = document.querySelector(".redo");

let draw = false;
const history = [];
const redoStack = [];

function populate(size) {
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  for (let i = 0; i < size * size; i++) {
    const div = document.createElement("div");
    div.classList.add("pixel");
    container.appendChild(div);

    div.addEventListener("mouseover", function () {
      if (draw) {
        history.push({ div, previousColor: div.style.backgroundColor });
        redoStack.length = 0; // clear redo whenever new action happens
        div.style.backgroundColor = color.value;
      }
    });

    div.addEventListener("mousedown", function () {
      history.push({ div, previousColor: div.style.backgroundColor });
      redoStack.length = 0;
      div.style.backgroundColor = color.value;
    });
  }
}

window.addEventListener("mousedown", () => (draw = true));
window.addEventListener("mouseup", () => (draw = false));

undoBtn.addEventListener("click", function () {
  if (history.length === 0) return;
  const last = history.pop();
  redoStack.push({
    div: last.div,
    previousColor: last.div.style.backgroundColor,
  });
  last.div.style.backgroundColor = last.previousColor;
});

redoBtn.addEventListener("click", function () {
  if (redoStack.length === 0) return;
  const last = redoStack.pop();
  history.push({
    div: last.div,
    previousColor: last.div.style.backgroundColor,
  });
  last.div.style.backgroundColor = last.previousColor;
});

window.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.shiftKey && e.key === "Z") {
    redoBtn.click();
  } else if (e.ctrlKey && e.key === "z") {
    undoBtn.click();
  }
});

sizeEl.addEventListener("keyup", function () {
  container.innerHTML = "";
  history.length = 0;
  redoStack.length = 0;
  populate(sizeEl.value);
});

reset.addEventListener("click", function () {
  container.innerHTML = "";
  history.length = 0;
  redoStack.length = 0;
  populate(sizeEl.value);
});

const imageUpload = document.querySelector(".image-upload");

let lastImage = null;

imageUpload.addEventListener("change", function () {
  const file = imageUpload.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      lastImage = img; // store it
      applyImage(img);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

function applyImage(img) {
  const gridSize = parseInt(sizeEl.value);
  const canvas = document.createElement("canvas");
  canvas.width = gridSize;
  canvas.height = gridSize;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, gridSize, gridSize);

  container.innerHTML = "";
  history.length = 0;
  redoStack.length = 0;
  populate(gridSize);

  const pixels = container.querySelectorAll(".pixel");
  pixels.forEach((pixel, i) => {
    const x = i % gridSize;
    const y = Math.floor(i / gridSize);
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    pixel.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  });
}

// update keyup to re-apply image if one exists
sizeEl.addEventListener("keyup", function () {
  if (lastImage) {
    applyImage(lastImage);
  } else {
    container.innerHTML = "";
    history.length = 0;
    redoStack.length = 0;
    populate(sizeEl.value);
  }
});

const cameraBtn = document.querySelector(".camera-btn");
const cameraModal = document.querySelector(".camera-modal");
const cameraFeed = document.querySelector(".camera-feed");
const captureBtn = document.querySelector(".capture-btn");
const closeCameraBtn = document.querySelector(".close-camera-btn");

let stream = null;

cameraBtn.addEventListener("click", async function () {
  cameraModal.style.display = "flex";
  stream = await navigator.mediaDevices.getUserMedia({ video: true });
  cameraFeed.srcObject = stream;
});

captureBtn.addEventListener("click", function () {
  const canvas = document.createElement("canvas");
  canvas.width = cameraFeed.videoWidth;
  canvas.height = cameraFeed.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(cameraFeed, 0, 0);

  const img = new Image();
  img.onload = function () {
    lastImage = img;
    applyImage(img);
  };
  img.src = canvas.toDataURL();

  // close modal and stop camera
  stream.getTracks().forEach((t) => t.stop());
  cameraModal.style.display = "none";
});

closeCameraBtn.addEventListener("click", function () {
  if (stream) stream.getTracks().forEach((t) => t.stop());
  cameraModal.style.display = "none";
});

const downloadBtn = document.querySelector(".download-btn");

downloadBtn.addEventListener("click", function () {
  const gridSize = parseInt(sizeEl.value);
  const blockSize = 20; // each pixel = 20x20 in the downloaded image

  const canvas = document.createElement("canvas");
  canvas.width = gridSize * blockSize;
  canvas.height = gridSize * blockSize;
  const ctx = canvas.getContext("2d");

  const pixels = container.querySelectorAll(".pixel");
  pixels.forEach((pixel, i) => {
    const x = i % gridSize;
    const y = Math.floor(i / gridSize);
    ctx.fillStyle = pixel.style.backgroundColor || "rgb(61, 61, 61)";
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
  });

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "pixel-art.png";
  a.click();
});

populate(sizeEl.value);
