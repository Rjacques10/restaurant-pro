const API = "http://localhost:5004";

async function loadMenus() {
  const res = await fetch(`${API}/api/menus`);
  const menus = await res.json();

  const container = document.getElementById("menus");
  container.innerHTML = "";

  menus.forEach(menu => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${API}/uploads/${menu.image}" width="200"/>
      
      <h3>${menu.name}</h3>
      <p>${menu.price} Fcfa</p>
      <p>${menu.category}</p>
      <p>❤️ ${menu.likes}</p>
      <button onclick="likeMenu('${menu._id}')">Like</button>
    `;

    container.appendChild(div);
  });
}

async function likeMenu(id) {
  await fetch(`${API}/api/menus/${id}/like`, {
    method: "POST"
  });

  loadMenus();
}

loadMenus();

