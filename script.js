const container = document.querySelector(".container");

const sizeEl = document.querySelector(".grid-count");
const size = sizeEl.value;

const color = document.querySelector(".color-picker");
const reset = document.querySelector(".reset");

let draw = false;

function populate(size) {
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  for (let i = 0; i < size * size; i++) {
    const div = document.createElement("div");
    div.classList.add("pixel");
    container.appendChild(div);

    div.addEventListener("mouseover", function () {
      if (draw) {
        div.style.backgroundColor = color.value;
      } else {
        return;
      }
    });
    div.addEventListener("mousedown", function () {
      div.style.backgroundColor = color.value;
    });
  }
}
window.addEventListener("mousedown", function () {
  draw = true;
});

window.addEventListener("mouseup", function () {
  draw = false;
});

sizeEl.addEventListener("keyup", function() {
  container.innerHTML = "";
  populate(sizeEl.value);
});

reset.addEventListener("click", function () {
  container.innerHTML = "";
  populate(sizeEl.value);
});
