// ⚠️ En production, remplacez par l'URL réelle de votre API.
const API = "https://restaurant-pro-api.onrender.com";

const loginScreen = document.getElementById("login-screen");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

const menuModal = document.getElementById("menu-modal");
const menuForm = document.getElementById("menu-form");
const modalError = document.getElementById("modal-error");
const modalTitle = document.getElementById("modal-title");

let currentMenus = [];

function getToken() { return localStorage.getItem("token"); }
function setSession(token, username) {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
}
function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
}

function showDashboard() {
  loginScreen.hidden = true;
  dashboard.hidden = false;
  const username = localStorage.getItem("username") || "Admin";
  document.getElementById("user-name").textContent = username;
  document.getElementById("user-initial").textContent = username[0]?.toUpperCase() || "A";
  loadMenus();
}

function showLogin() {
  clearSession();
  dashboard.hidden = true;
  loginScreen.hidden = false;
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// ===== Login =====
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.hidden = true;

  const username = document.getElementById("user").value.trim();
  const password = document.getElementById("pass").value;

  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (!res.ok) {
      loginError.textContent = data.message || "Identifiants incorrects.";
      loginError.hidden = false;
      return;
    }

    setSession(data.token, data.username);
    showDashboard();
  } catch (err) {
    loginError.textContent = "Impossible de contacter le serveur.";
    loginError.hidden = false;
  }
});

document.getElementById("logout").addEventListener("click", showLogin);

// ===== Load & render menus =====
async function loadMenus() {
  const rows = document.getElementById("menu-rows");
  try {
    const res = await fetch(`${API}/api/menus`);
    currentMenus = await res.json();
    renderStats(currentMenus);
    renderRows(currentMenus);
  } catch (err) {
    rows.innerHTML = `<tr><td colspan="6" class="table__empty">Erreur de chargement.</td></tr>`;
  }
}

function renderStats(menus) {
  const total = menus.length;
  const categories = new Set(menus.map(m => m.category)).size;
  const likes = menus.reduce((sum, m) => sum + (m.likes || 0), 0);
  const avg = total ? Math.round(menus.reduce((s, m) => s + Number(m.price || 0), 0) / total) : 0;

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-categories").textContent = categories;
  document.getElementById("stat-likes").textContent = likes;
  document.getElementById("stat-avg").textContent = avg ? avg.toLocaleString("fr-FR") + " Fcfa" : "—";
}

function renderRows(menus) {
  const rows = document.getElementById("menu-rows");

  if (!menus.length) {
    rows.innerHTML = `<tr><td colspan="6" class="table__empty">Aucun plat pour le moment. Ajoutez le premier ci-dessus.</td></tr>`;
    return;
  }

  rows.innerHTML = menus.map((m) => `
    <tr>
      <td>${m.image
          ? `<img class="table__thumb" src="${API}/uploads/${encodeURIComponent(m.image)}" alt="">`
          : `<span class="table__thumb"></span>`}</td>
      <td>${escapeHtml(m.name)}</td>
      <td>${escapeHtml(m.category)}</td>
      <td>${Number(m.price).toLocaleString("fr-FR")} Fcfa</td>
      <td>${m.likes ?? 0}</td>
      <td>
        <div class="row-actions">
          <button data-edit="${m._id}">Modifier</button>
          <button data-delete="${m._id}" class="danger">Supprimer</button>
        </div>
      </td>
    </tr>
  `).join("");

  rows.querySelectorAll("[data-edit]").forEach(btn =>
    btn.addEventListener("click", () => openModal(btn.dataset.edit)));
  rows.querySelectorAll("[data-delete]").forEach(btn =>
    btn.addEventListener("click", () => deleteMenu(btn.dataset.delete)));
}

// ===== Modal (add / edit) =====
function openModal(id) {
  modalError.hidden = true;
  menuForm.reset();
  document.getElementById("menu-id").value = "";

  if (id) {
    const menu = currentMenus.find(m => m._id === id);
    if (!menu) return;
    modalTitle.textContent = "Modifier le plat";
    document.getElementById("menu-id").value = menu._id;
    document.getElementById("name").value = menu.name;
    document.getElementById("price").value = menu.price;
    document.getElementById("cat").value = menu.category;
  } else {
    modalTitle.textContent = "Ajouter un plat";
  }

  menuModal.hidden = false;
}

function closeModal() { menuModal.hidden = true; }

document.getElementById("open-add").addEventListener("click", () => openModal(null));
document.getElementById("close-modal").addEventListener("click", closeModal);

menuForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  modalError.hidden = true;

  const id = document.getElementById("menu-id").value;
  const formData = new FormData();
  formData.append("name", document.getElementById("name").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("category", document.getElementById("cat").value);
  const file = document.getElementById("image").files[0];
  if (file) formData.append("image", file);

  try {
    const res = await fetch(`${API}/api/menus${id ? "/" + id : ""}`, {
      method: id ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData
    });

    if (res.status === 401 || res.status === 403) return showLogin();

    const data = await res.json();
    if (!res.ok) {
      modalError.textContent = data.error || "Une erreur est survenue.";
      modalError.hidden = false;
      return;
    }

    closeModal();
    loadMenus();
  } catch (err) {
    modalError.textContent = "Impossible de contacter le serveur.";
    modalError.hidden = false;
  }
});

async function deleteMenu(id) {
  if (!confirm("Supprimer ce plat ?")) return;

  const res = await fetch(`${API}/api/menus/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  if (res.status === 401 || res.status === 403) return showLogin();

  loadMenus();
}

// ===== Boot =====
if (getToken()) {
  showDashboard();
} else {
  showLogin();
}
