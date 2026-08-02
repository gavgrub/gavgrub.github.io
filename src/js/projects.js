const techIcons = {
    html: "devicon-html5-plain",
    css: "devicon-css3-plain",
    js: "devicon-javascript-plain",
    python: "devicon-python-plain",
    java: "devicon-java-plain",
    jupyter: "devicon-jupyter-plain",
};

const linkIcons = {
    youtube: "fa-brands fa-youtube",
    github: "fa-brands fa-github",
    devpost: "fa-solid fa-code",
    itch: "fa-brands fa-itch-io",
    website: "fa-solid fa-globe",
    gitlab: "fa-brands fa-gitlab",
};

function renderProject(project) {
    const card = document.createElement("div");
    card.className = "project-small";

    const techBadges = (project.tech || [])
        .map(t => `
            <span class="badge ${t}">
                <i class="${techIcons[t] || ""}"></i>
            </span>
        `).join("");

    const linkBadges = Object.entries(project.links || {})
        .map(([type, url]) => `
            <a class="badge ${type}" href="${url}" target="_blank">
                <i class="${linkIcons[type] || ""}"></i>
            </a>
        `).join("");

    card.innerHTML = `
        <div class="top-row">
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
            </div>
            <div class="project-small-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
        </div>
        <div class="bottom-row">
            <div class="tech-badges">${techBadges}</div>
            <div class="project-links">${linkBadges}</div>
        </div>
    `;

    return card;
}

async function loadProjects() {
    const container = document.querySelector(".project-list-small");
    if (!container) return;

    try {
        const response = await fetch("src/data/projects.json");
        if (!response.ok) throw new Error(`Failed to load projects.json: ${response.status}`);
        const projects = await response.json();

        projects.forEach((project, i) => {
            container.appendChild(renderProject(project));

            if (i < projects.length - 1) {
                const divider = document.createElement("div");
                divider.className = "divider";
                container.appendChild(divider);
            }
        });
    } catch (err) {
        console.error("Error loading projects:", err);
    }
}

document.addEventListener("DOMContentLoaded", loadProjects);