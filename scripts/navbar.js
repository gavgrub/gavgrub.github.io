const navbar = document.getElementById("navbar");
const visible = document.getElementById("navbarVisible");
const hidden = document.getElementById("navbarHidden");
const hamburger = document.getElementById("hamburger");

const HAMBURGER_WIDTH = 60;

hamburger.addEventListener("click", () => {
    hidden.classList.toggle("show");
});

function updateNavbar() {
    // Move everything back first
    while (hidden.children.length > 0) {
        visible.appendChild(hidden.firstElementChild);
    }

    // Hamburger exists but inactive
    hamburger.style.visibility = "hidden";
    hamburger.style.pointerEvents = "none";
    hidden.classList.remove("show");

    const availableWidth = navbar.clientWidth - HAMBURGER_WIDTH;

    // Move items progressively
    while (visible.scrollWidth > availableWidth && visible.children.length > 0) {
        hidden.prepend(visible.lastElementChild);

        // Activate hamburger
        hamburger.style.visibility = "visible";
        hamburger.style.pointerEvents = "auto";
    }
}

window.addEventListener("resize", updateNavbar);
window.addEventListener("DOMContentLoaded", updateNavbar);