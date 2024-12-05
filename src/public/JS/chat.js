const searchInput = document.getElementById("search-users");
const searchResults = document.getElementById("search-results");

searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim();

    if (!query) {
        searchResults.innerHTML = "";
        searchResults.classList.add("hidden");
        return;
    }

    try {
        const response = await fetch(`/api/usuarios?query=${query}`);
        const usuarios = await response.json();

        if (usuarios.length > 0) {
            searchResults.classList.remove("hidden");
            searchResults.innerHTML = usuarios
                .map(
                    (user) => `
                    <li data-user-id="${user.id_usuario}" class="search-result">
                        ${user.nombre_usuario}
                    </li>
                `
                )
                .join("");
        } else {
            searchResults.innerHTML = "<li>No se encontraron usuarios</li>";
        }
    } catch (error) {
        console.error("Error al buscar usuarios:", error);
    }
});

// Agregar evento para seleccionar un usuario de los resultados
searchResults.addEventListener("click", (e) => {
    if (e.target && e.target.matches("li.search-result")) {
        const userName = e.target.textContent;
        const userId = e.target.dataset.userId;

        activeChat = userName;
        chatTitle.textContent = userName;
        chatControls.classList.remove("hidden");

        searchResults.innerHTML = "";
        searchResults.classList.add("hidden");

        loadMessages(userName); // Cargar mensajes con este usuario
    }
});
