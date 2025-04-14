const titleBackground = document.querySelector(".titleBackground");

// Constants for rendering the squares
const SIZE = 40;
const LIGHTCOLOR = [32, 41, 51];
const DARKCOLOR = [10, 13, 16];

// Time variable for animation
var time = 0;

// Set a random seed for the noise function
noise.seed(Math.random());

// Function which interpolates between two colors
// Based on a faction between 0 and 1
function interpolateColor(color1, color2, factor) {
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
  }

// Function to create the squares
function createSquares() {
    squares = [];

    // Clear any existing squares
    const existingSquares = titleBackground.querySelectorAll('.square');
    existingSquares.forEach(square => square.remove());

    // Add a bunch of new squares
    for (let y = 0; y < titleBackground.clientHeight; y += SIZE) {
        for (let x = 0; x < titleBackground.clientWidth; x += SIZE) {
            const square = document.createElement('div');
            
            // Square attributes
            square.style.width = `${SIZE + 1}px`;
            square.style.height = `${SIZE + 1}px`;
            square.style.backgroundColor = DARKCOLOR;
            square.style.position = "absolute";

            square.style.left = `${x}px`;
            square.style.top = `${y}px`;

            square.style.zIndex = '-1';
            
            // Add square to the screen
            titleBackground.appendChild(square);
            
            // Add square to the squares array for animation
            squares.push({el: square, x: x / SIZE, y: y / SIZE});
        }
    }
}

// Animation loop 
function animate() {
    time += 0.001;
    for (const s of squares) {
        const color = interpolateColor(LIGHTCOLOR, DARKCOLOR, Math.tanh(4 * noise.simplex3(s.x * 0.25, s.y * 0.25, time)) * 0.5 + 0.5);
        s.el.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    }

    requestAnimationFrame(animate);
}

// Initial creation of squares
createSquares();

// Recreate squares on window resize
window.addEventListener('resize', () => {
    createSquares();
});

// Animate
requestAnimationFrame(animate);