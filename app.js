function statusClass(status) {
  if (status === "supporte") return "yes";
  if (status === "partiel") return "warn";
  return "no";
}

function statusLabel(status) {
  if (status === "supporte") return "Statut: supporté";
  if (status === "partiel") return "Statut: support partiel";
  return "Statut: non supporté";
}

function buildBrandCard(item) {
  const card = document.createElement("article");
  card.className = item.featured ? "card brand-card featured" : "card brand-card";

  const title = document.createElement("h3");
  title.textContent = item.nom;

  const status = document.createElement("p");
  status.className = `status ${statusClass(item.statut)}`;
  status.textContent = statusLabel(item.statut);

  const note = document.createElement("p");
  note.textContent = item.note;

  card.append(title, status, note);

  if (item.programmable) {
    const programmable = document.createElement("span");
    programmable.className = "tag-programmable";
    programmable.textContent = "Clavier programmable";
    card.appendChild(programmable);
  }

  if (Array.isArray(item.liens) && item.liens.length > 0) {
    const links = document.createElement("p");
    links.className = "brand-links";

    item.liens.forEach((entry) => {
      const anchor = document.createElement("a");
      anchor.href = entry.url;
      anchor.textContent = entry.label;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      links.appendChild(anchor);
    });

    card.appendChild(links);
  }

  return card;
}

function renderList(containerId, list) {
  const container = document.getElementById(containerId);
  container.textContent = "";
  list.forEach((item) => container.appendChild(buildBrandCard(item)));
}

async function loadHardware() {
  try {
    const response = await fetch("data/claviers.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    renderList("hardware-laptops", data.laptops);
    renderList("hardware-desktops", data.desktops);

    const updatedAt = document.getElementById("hardware-updated-at");
    updatedAt.textContent = data.mise_a_jour || "non renseignée";
  } catch (error) {
    const laptops = document.getElementById("hardware-laptops");
    const desktops = document.getElementById("hardware-desktops");
    const message =
      "Impossible de charger data/claviers.json. Vérifiez le fichier ou relancez le serveur local.";

    laptops.innerHTML = `<article class="card brand-card"><p class="status no">${message}</p></article>`;
    desktops.innerHTML = `<article class="card brand-card"><p class="status no">${message}</p></article>`;

    const updatedAt = document.getElementById("hardware-updated-at");
    updatedAt.textContent = "erreur de chargement";
    console.error(error);
  }
}

loadHardware();
