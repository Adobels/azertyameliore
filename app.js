const pageLang = document.documentElement.lang || "fr";

const translations = {
  fr: {
    status: {
      supporte: "Statut: supporté",
      partiel: "Statut: support partiel",
      non_supporte: "Statut: non supporté",
    },
    programmable: "Clavier programmable",
    missingDate: "non renseignée",
    loadError:
      "Impossible de charger data/claviers.json. Vérifiez le fichier ou relancez le serveur local.",
    loadErrorDate: "erreur de chargement",
    notes: {
      laptop:
        "Pas d'option pour choisir un marquage AZERTY Amélioré au moment de la configuration d'un laptop sur le site du constructeur.",
      inovu: "INOVU propose un clavier avec marquage de touches AZERTY Amélioré.",
    },
    links: {
      "Site du clavier": "Site du clavier",
      "Magasin Amazon": "Magasin Amazon",
    },
  },
  en: {
    status: {
      supporte: "Status: supported",
      partiel: "Status: partial support",
      non_supporte: "Status: not supported",
    },
    programmable: "Programmable keyboard",
    missingDate: "not specified",
    loadError:
      "Unable to load data/claviers.json. Check the file or restart the local server.",
    loadErrorDate: "loading error",
    notes: {
      laptop:
        "No option to choose AZERTY Improved key markings when configuring a laptop on the manufacturer's website.",
      inovu: "INOVU offers a keyboard with AZERTY Improved key markings.",
    },
    links: {
      "Site du clavier": "Keyboard page",
      "Magasin Amazon": "Amazon store",
    },
  },
  pl: {
    status: {
      supporte: "Status: obsługiwane",
      partiel: "Status: częściowe wsparcie",
      non_supporte: "Status: brak wsparcia",
    },
    programmable: "Klawiatura programowalna",
    missingDate: "brak informacji",
    loadError:
      "Nie można wczytać data/claviers.json. Sprawdź plik albo uruchom ponownie lokalny serwer.",
    loadErrorDate: "błąd wczytywania",
    notes: {
      laptop:
        "Brak opcji wyboru oznaczeń klawiszy AZERTY Ulepszony podczas konfiguracji laptopa na stronie producenta.",
      inovu: "INOVU oferuje klawiaturę z oznaczeniami klawiszy AZERTY Ulepszony.",
    },
    links: {
      "Site du clavier": "Strona klawiatury",
      "Magasin Amazon": "Sklep Amazon",
    },
  },
};

const copy = translations[pageLang] || translations.fr;

function statusClass(status) {
  if (status === "supporte") return "yes";
  if (status === "partiel") return "warn";
  return "no";
}

function statusLabel(status) {
  return copy.status[status] || copy.status.non_supporte;
}

function noteLabel(item) {
  if (["Microsoft Surface", "MacBook", "Chromebook"].includes(item.nom)) {
    return copy.notes.laptop;
  }
  if (item.nom === "INOVU") {
    return copy.notes.inovu;
  }
  return item.note;
}

function linkLabel(label) {
  return copy.links[label] || label;
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
  note.textContent = noteLabel(item);

  card.append(title, status, note);

  if (item.programmable) {
    const programmable = document.createElement("span");
    programmable.className = "tag-programmable";
    programmable.textContent = copy.programmable;
    card.appendChild(programmable);
  }

  if (Array.isArray(item.liens) && item.liens.length > 0) {
    const links = document.createElement("p");
    links.className = "brand-links";

    item.liens.forEach((entry) => {
      const anchor = document.createElement("a");
      anchor.href = entry.url;
      anchor.textContent = linkLabel(entry.label);
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
  if (!container) return;
  container.textContent = "";
  list.forEach((item) => container.appendChild(buildBrandCard(item)));
}

async function loadHardware() {
  const laptops = document.getElementById("hardware-laptops");
  const desktops = document.getElementById("hardware-desktops");
  const updatedAt = document.getElementById("hardware-updated-at");

  if (!laptops && !desktops && !updatedAt) return;

  try {
    const dataPath = pageLang === "fr" ? "data/claviers.json" : "../data/claviers.json";
    const response = await fetch(dataPath, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    renderList("hardware-laptops", data.laptops);
    renderList("hardware-desktops", data.desktops);

    if (updatedAt) updatedAt.textContent = data.mise_a_jour || copy.missingDate;
  } catch (error) {
    const message = copy.loadError;

    if (laptops) {
      laptops.innerHTML = `<article class="card brand-card"><p class="status no">${message}</p></article>`;
    }
    if (desktops) {
      desktops.innerHTML = `<article class="card brand-card"><p class="status no">${message}</p></article>`;
    }

    if (updatedAt) updatedAt.textContent = copy.loadErrorDate;
    console.error(error);
  }
}

loadHardware();
