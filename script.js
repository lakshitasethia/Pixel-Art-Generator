const container = document.querySelector(".container");

const sizeEl = document.querySelector(".grid-count");
const size = sizeEl.value;

function populate(size) {
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  for (let i = 0; i < size * size; i++) {
    const div = document.createElement("div");
    div.classList.add("pixel");
    container.appendChild(div);
  }
}

populate(size);
