const API = "http://localhost:5004";

// LOGIN
async function login() {
  const username = document.getElementById("user").value;
  const password = document.getElementById("pass").value;

  console.log("username:", username);
  console.log("password:", password);

  const res = await fetch("http://localhost:5004/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  console.log("Response:", data);

  if (res.ok) {
    alert("Login successful ✅");
    loadMenus();
  } else {
    alert("Login failed ❌");
  }
}

// add menu
async function addMenu() {
  
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("cat").value;
  const image = document.getElementById("image").files[0];

  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  formData.append("category", category);
  formData.append("image", image);

  const res = await fetch("http://localhost:5004/api/menus", {
    method: "POST",
    body: formData
  });

  if (res.ok) {
    alert("Menu + image ajouté ✅");
  } else {
    alert("Erreur ❌");
  }
}