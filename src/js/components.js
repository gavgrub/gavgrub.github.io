async function loadComponents() {
  const elements = document.querySelectorAll("[data-component]");
 
  for (const el of elements) {
    const file = el.dataset.component;
 
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(res.statusText);
 
      el.innerHTML = await res.text();

      if (file.includes("navbar")) {
        highlightActiveNav();

        if (typeof initNavbar === "function") {
          initNavbar();
        }
      }
 
    } catch (err) {
      console.error(`Error loading ${file}:`, err);
    }
  }
 
  document.dispatchEvent(new Event("componentsLoaded"));
}
 
document.addEventListener("DOMContentLoaded", () => {
  loadComponents();
  initRouter();
});
 
function highlightActiveNav() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
 
  const links = navbar.querySelectorAll(".navbar-button");
 
  let currentPath = window.location.pathname.split("/").pop();
 
  if (currentPath === "" || currentPath === "/") {
    currentPath = "index.html";
  }
 
  links.forEach(link => {
    const href = link.getAttribute("href");
    link.classList.toggle("selected", href === currentPath);
  });
}
 
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const visible = document.getElementById("navbarVisible");
  const hidden = document.getElementById("navbarHidden");
  const hamburger = document.getElementById("hamburger");
 
  if (!navbar || !hamburger) return;
 
  const HAMBURGER_WIDTH = 60;

  hamburger.onclick = () => {
    hidden.classList.toggle("show");
  };
 
  function updateNavbar() {
    if (!navbar || !visible || !hidden) return;

    while (hidden.children.length > 0) {
      visible.appendChild(hidden.firstElementChild);
    }
 
    hamburger.style.visibility = "hidden";
    hamburger.style.pointerEvents = "none";
    hidden.classList.remove("show");
 
    const availableWidth = navbar.clientWidth - HAMBURGER_WIDTH;

    while (visible.scrollWidth > availableWidth && visible.children.length > 0) {
      hidden.prepend(visible.lastElementChild);
      hamburger.style.visibility = "visible";
      hamburger.style.pointerEvents = "auto";
    }
  }

  window.addEventListener("resize", updateNavbar);

  updateNavbar();
}
 
function initRouter() {
  document.addEventListener("click", handleLinkClick);
  window.addEventListener("popstate", () => {
    navigateTo(window.location.pathname, false);
  });
}
 
function isRoutable(link) {
  if (!link || !link.href) return false;
  if (link.target && link.target !== "_self") return false;
  if (link.hasAttribute("download")) return false;
 
  let url;
  try {
    url = new URL(link.href, window.location.href);
  } catch {
    return false;
  }
 
  if (url.origin !== window.location.origin) return false;
  if (!url.pathname.endsWith(".html")) return false;
 
  return true;
}
 
function handleLinkClick(e) {
  if (e.defaultPrevented || e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
 
  const link = e.target.closest("a");
  if (!isRoutable(link)) return;
 
  const url = new URL(link.href, window.location.href);
  e.preventDefault();
  navigateTo(url.pathname);
}
 
async function navigateTo(pathname, pushState = true) {
  const content = document.querySelector(".content");
  if (!content) {
    window.location.href = pathname;
    return;
  }
 
  try {
    const res = await fetch(pathname);
    if (!res.ok) throw new Error(res.statusText);
 
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const newContent = doc.querySelector(".content");
 
    if (!newContent) {
      window.location.href = pathname;
      return;
    }

    // Swap the header too (title/subtitle/socials differ per page),
    // not just the content div.
    const header = document.querySelector(".header");
    const newHeader = doc.querySelector(".header");
    if (header && newHeader) {
      header.innerHTML = newHeader.innerHTML;
      header.className = newHeader.className;
    }

    content.innerHTML = newContent.innerHTML;
    document.title = doc.title;
 
    if (pushState) {
      window.history.pushState({}, "", pathname);
    }

    // Close the hamburger dropdown if it was open, since the navbar
    // itself isn't re-fetched on route changes and would otherwise
    // stay expanded after navigating.
    const navbarHidden = document.getElementById("navbarHidden");
    if (navbarHidden) {
      navbarHidden.classList.remove("show");
    }

    // Intentionally not resetting scroll position here: navigation
    // preserves wherever the user currently is on the page. The
    // browser automatically clamps scrollY if the new page is shorter.
    highlightActiveNav();

    document.dispatchEvent(new Event("pageChanged"));
 
  } catch (err) {
    console.error(`Router failed to load ${pathname}:`, err);
    window.location.href = pathname;
  }
}