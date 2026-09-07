let bobbyInterval = null;

function initBobby() {
    const bobby = document.getElementById("bobby");
    if (!bobby) return;

    if (bobbyInterval) {
        clearInterval(bobbyInterval);
        bobbyInterval = null;
    }

    const frames = [
        { src: "img/graphics/bobby.png", flip: false },
        { src: "img/graphics/bobby_down.png", flip: false },
        { src: "img/graphics/bobby.png", flip: true },
        { src: "img/graphics/bobby_down.png", flip: true }
    ];

    let index = 0;

    bobbyInterval = setInterval(() => {
        const frame = frames[index];
        bobby.src = frame.src;
        bobby.style.transform = frame.flip ? "scaleX(-1)" : "scaleX(1)";
        index = (index + 1) % frames.length;
    }, 800);
}

document.addEventListener("DOMContentLoaded", initBobby);
document.addEventListener("pageChanged", initBobby);
