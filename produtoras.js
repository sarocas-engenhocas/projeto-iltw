let filmes = [];
const listaProdutoras = document.getElementById("produtoras-lista");
listaProdutoras.innerHTML = "<p class='loading-msg'>A carregar...</p>";

carregarDados()
  .then(data => {
    filmes = data.filmes;
    const produtoras = [...new Set(filmes.map(f => f.produtora))];

    produtoras.forEach(produtora => {
      const card = document.createElement("div");
      card.classList.add("produtora-card");
      card.textContent = produtora;
      card.addEventListener("click", () => mostrarFilmesDaProdutora(produtora));
      listaProdutoras.appendChild(card);
    });
  })
  .catch(err => {
      listaProdutoras.innerHTML = "<p class='error-msg'>Erro ao carregar produtoras.</p>";
      console.error("Erro ao carregar produtoras:", err);
  });

function mostrarFilmesDaProdutora(produtora) {
  const container = document.getElementById("filmes-produtora");
  container.innerHTML = "";
  const filtrados = filmes.filter(f => f.produtora === produtora);

  filtrados.forEach(filme => {
    const card = `
      <div class="filme-card">
          <img src="${filme.poster}" alt="${filme.titulo}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27450%27%3E%3Crect fill=%27%23ddd%27 width=%27300%27 height=%27450%27/%3E%3Ctext fill=%27%23999%27 font-size=%2720%27 text-anchor=%27middle%27 x=%27150%27 y=%27225%27%3ESem poster%3C/text%3E%3C/svg%3E'">
          <h3>${filme.titulo}</h3>
          <p><strong>Ano:</strong> ${filme.ano}</p>
          <p><strong>Género:</strong> ${filme.genero}</p>
          <p><strong>Rating:</strong> ${filme.rating}</p>

          <button class="ver-mais" onclick="verMais(${filme.id})">
              Ver mais
          </button>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", card);
  });
}

function verMais(id) {
  window.location.href = `filme.html?id=${id}`;
}
