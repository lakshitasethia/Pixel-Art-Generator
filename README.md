# Pixel Art Generator

A lightweight, browser-based pixel art tool built with vanilla HTML, CSS, and JavaScript. No dependencies, no build steps — just open and draw.

---

## Features

- Configurable grid size — set any dimension and the canvas updates instantly
- Freehand drawing with click and drag support
- Live colour picker for seamless colour switching mid-draw
- One-click reset that preserves your current grid size

---

## Getting Started

Clone the repository and open `index.html` in your browser.

```bash
git clone https://github.com/your-username/pixel-art-generator.git
cd pixel-art-generator
open index.html
```

No installation or setup required.

---

## Usage

| Action | How |
|---|---|
| Draw | Click and drag across the grid |
| Change colour | Use the colour picker in the header |
| Resize grid | Enter a number in the grid input and press Enter |
| Reset canvas | Click the Reset button |

---

## Project Structure

```
pixel-art-generator/
├── index.html
├── style.css
└── script.js
```

---

## Technical Details

- Grid is generated dynamically using CSS Grid with `repeat(n, 1fr)` columns and rows
- Drawing state is tracked via `mousedown` and `mouseup` events on the `window` object, enabling smooth drag-to-paint behaviour
- Colour is read live from the input on every `mouseover` event, ensuring the selected colour is always current

---

## License

MIT
