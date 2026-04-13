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

populate(sizeEl.value);
