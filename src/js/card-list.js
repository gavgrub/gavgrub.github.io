const techIcons = {
    html: "devicon-html5-plain",
    css: "devicon-css3-plain",
    js: "devicon-javascript-plain",
    python: "devicon-python-plain",
    java: "devicon-java-plain",
    jupyter: "devicon-jupyter-plain",
    seawa: "../../img/graphics/seawa.svg",
};

const linkIcons = {
    youtube: "fa-brands fa-youtube",
    github: "fa-brands fa-github",
    devpost: "fa-solid fa-code",
    itch: "fa-brands fa-itch-io",
    website: "fa-solid fa-globe",
    gitlab: "fa-brands fa-gitlab",
    pdf: "fa-solid fa-file-pdf",
};

// How many cards to reveal per scroll-triggered batch.
const BATCH_SIZE = 4;

// How far before the sentinel enters the viewport we start loading
// the next batch, so new cards are ready before you actually reach them.
const PREFETCH_MARGIN = "600px";

// Cache of in-flight/resolved data fetches, keyed by source URL, so
// the same JSON is never requested twice and can be warmed ahead of
// navigation (see warmDataCache below).
const dataCache = {};

function fetchData(source) {
    if (!dataCache[source]) {
        dataCache[source] = fetch(source).then(res => {
            if (!res.ok) throw new Error(`Failed to load ${source}: ${res.status}`);
            return res.json();
        });
    }
    return dataCache[source];
}

// Kick off requests for known data sources immediately, regardless of
// which page we're on. By the time the user actually navigates to a
// page containing that list, the fetch has likely already resolved,
// so initCardList can render synchronously instead of waiting on the
// network.
const KNOWN_SOURCES = [
    "src/data/projects.json",
    "src/data/publications.json",
];

function warmDataCache() {
    KNOWN_SOURCES.forEach(src => {
        fetchData(src).catch(() => {
            // Expected for sources that don't exist yet (e.g.
            // publications.json before that page goes live). Swallow
            // here; a real consumer of this source will surface the
            // error itself if it's still missing when needed.
        });
    });
}

function renderCard(item) {
    const card = document.createElement("div");
    card.className = "card-item" + (item.image ? "" : " no-image");

    const techBadges = (item.tech || [])
        .map(t => {
            const icon = techIcons[t] || "";
            const isImage = /\.(svg|png|webp|jpe?g)$/i.test(icon);
            const inner = isImage
                ? `<img src="${icon}" alt="${t}" class="tech-icon-img">`
                : `<i class="${icon}"></i>`;
            return `<span class="badge ${t}">${inner}</span>`;
        }).join("");

    const linkBadges = Object.entries(item.links || {})
        .map(([type, url]) => `
            <a class="badge ${type}" href="${url}" target="_blank">
                <i class="${linkIcons[type] || ""}"></i>
            </a>
        `).join("");

    // Only render the image column if an image was actually provided.
    // With no image, .card-info (flex: 1) is the row's only child and
    // fills the full width on its own -- no extra CSS needed.
    const imageMarkup = item.image
        ? `
            <div class="card-item-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
        `
        : "";

    card.innerHTML = `
        <div class="top-row">
            <div class="card-info">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
            ${imageMarkup}
        </div>
        <div class="bottom-row">
            <div class="tech-badges">${techBadges}</div>
            <div class="card-links">${linkBadges}</div>
        </div>
    `;

    return card;
}

async function initCardList(container) {
    const source = container.dataset.source;
    if (!source) return;

    container.innerHTML = "";

    let items;
    try {
        items = await fetchData(source);
    } catch (err) {
        console.error("Error loading card list:", err);
        return;
    }

    let loadedCount = 0;

    // Sentinel element the IntersectionObserver watches to know when
    // to reveal the next batch. It's kept as the last child of the
    // container; new cards are always inserted before it.
    const sentinel = document.createElement("div");
    sentinel.className = "card-list-sentinel";
    container.appendChild(sentinel);

    function appendDivider() {
        const divider = document.createElement("div");
        divider.className = "divider";
        container.insertBefore(divider, sentinel);
    }

    function loadNextBatch() {
        const nextItems = items.slice(loadedCount, loadedCount + BATCH_SIZE);

        nextItems.forEach(item => {
            if (loadedCount > 0) appendDivider();
            container.insertBefore(renderCard(item), sentinel);
            loadedCount++;
        });

        if (loadedCount >= items.length) {
            observer.disconnect();
            sentinel.remove();
        }
    }

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) loadNextBatch();
    }, { rootMargin: PREFETCH_MARGIN });

    // Render the first batch immediately (data is likely already
    // cached from warmDataCache, so this is effectively instant) so
    // there's no blank flash before the observer has anything to do.
    loadNextBatch();

    if (loadedCount < items.length) {
        observer.observe(sentinel);
    }
}

function initAllCardLists() {
    document.querySelectorAll(".card-list[data-source]").forEach(initCardList);
}

warmDataCache();
document.addEventListener("DOMContentLoaded", initAllCardLists);
document.addEventListener("pageChanged", initAllCardLists);
