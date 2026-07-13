// ⚠️ En production, remplacez par l'URL réelle de votre API.
const API = "http://localhost:5004";

const container = document.getElementById("menus");

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function formatPrice(price) {
  const n = Number(price);
  if (Number.isNaN(n)) return escapeHtml(price);
  return n.toLocaleString("fr-FR") + " Fcfa";
}

function groupByCategory(menus) {
  const groups = new Map();
  menus.forEach((menu) => {
    const key = menu.category || "Autres";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(menu);
  });
  return groups;
}

function renderDish(menu) {
  const thumb = menu.image
    ? `<img class="dish__thumb" src="${API}/uploads/${encodeURIComponent(menu.image)}" alt="${escapeHtml(menu.name)}">`
    : `<span class="dish__thumb--empty"></span>`;

  return `
    <li class="dish">
      ${thumb}
      <div class="dish__body">
        <h4>${escapeHtml(menu.name)}</h4>
        <div class="dish__meta">
          <button class="like-btn" data-id="${menu._id}" aria-label="Aimer ce plat">
            ♥ <span>${menu.likes ?? 0}</span>
          </button>
        </div>
      </div>
      <span class="dish__price">${formatPrice(menu.price)}</span>
    </li>
  `;
}

function render(menus) {
  if (!menus.length) {
    container.innerHTML = `<p class="menus__empty">La carte est en cours de préparation. Revenez bientôt.</p>`;
    return;
  }

  const groups = groupByCategory(menus);
  container.innerHTML = [...groups.entries()].map(([category, dishes]) => `
    <section class="category">
      <div class="category__title"><h3>${escapeHtml(category)}</h3></div>
      <ol class="menu-list">
        ${dishes.map(renderDish).join("")}
      </ol>
    </section>
  `).join("");

  container.querySelectorAll(".like-btn").forEach((btn) => {
    btn.addEventListener("click", () => likeMenu(btn.dataset.id));
  });
}

async function loadMenus() {
  try {
    const res = await fetch(`${API}/api/menus`);
    if (!res.ok) throw new Error("Réponse serveur invalide");
    const menus = await res.json();
    render(menus);
  } catch (err) {
    container.innerHTML = `<p class="menus__empty">Impossible de charger la carte pour le moment.</p>`;
    console.error(err);
  }
}

async function likeMenu(id) {
  try {
    await fetch(`${API}/api/menus/${id}/like`, { method: "POST" });
    loadMenus();
  } catch (err) {
    console.error(err);
  }
}

loadMenus();
