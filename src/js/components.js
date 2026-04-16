async function loadComponents() {
  const elements = document.querySelectorAll("[data-component]");

  for (const el of elements) {
    const file = el.dataset.component;

    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(res.statusText);

      el.innerHTML = await res.text();

      // Do extra stuff if it is the navbar
      if (file.includes("navbar")) {
        highlightActiveNav(el); //
          
        // Trigger the sizing and click logic now that the HTML exists
        if (typeof initNavbar === "function") {
            initNavbar();
        }
      }

    } catch (err) {
      console.error(`Error loading ${file}:`, err);
    }
  }
}

document.addEventListener("DOMContentLoaded", loadComponents);

function highlightActiveNav(container) {
  const links = container.querySelectorAll(".navbar-button");

  let currentPath = window.location.pathname.split("/").pop();

  // Fix homepage case
  if (currentPath === "" || currentPath === "/") {
    currentPath = "index.html";
  }

  links.forEach(link => {
    const href = link.getAttribute("href");

    if (href === currentPath) {
      link.classList.add("selected");
    }
  });
}

function initNavbar() {
    const navbar = document.getElementById("navbar");
    const visible = document.getElementById("navbarVisible");
    const hidden = document.getElementById("navbarHidden");
    const hamburger = document.getElementById("hamburger");

    if (!navbar || !hamburger) return; // Exit if navbar isn't loaded yet

    const HAMBURGER_WIDTH = 60;

    // Remove old listener if any to prevent double-firing
    hamburger.onclick = () => {
        hidden.classList.toggle("show");
    };

    function updateNavbar() {
        if (!navbar || !visible || !hidden) return;

        // Move everything back first
        while (hidden.children.length > 0) {
            visible.appendChild(hidden.firstElementChild);
        }

        hamburger.style.visibility = "hidden";
        hamburger.style.pointerEvents = "none";
        hidden.classList.remove("show");

        const availableWidth = navbar.clientWidth - HAMBURGER_WIDTH;

        // Move items progressively
        while (visible.scrollWidth > availableWidth && visible.children.length > 0) {
            hidden.prepend(visible.lastElementChild);
            hamburger.style.visibility = "visible";
            hamburger.style.pointerEvents = "auto";
        }
    }

    // Attach resize listener
    window.addEventListener("resize", updateNavbar);
    
    // Initial run for this specific injection
    updateNavbar();
}

// Call it on DOMContentLoaded for safety, but components.js will be the main trigger
document.addEventListener("DOMContentLoaded", initNavbar);