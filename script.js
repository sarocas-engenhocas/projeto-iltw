let filmesData = [];

const container = document.getElementById("lista-filmes");
if (container) {
    container.innerHTML = "<p class='loading-msg'>A carregar filmes...</p>";
}

function renderFilmes(lista) {
    if (!container) return;
    container.innerHTML = "";
    if (lista.length === 0) {
        container.innerHTML = "<p class='empty-msg'>Nenhum filme encontrado.</p>";
        return;
    }
    lista.forEach(filme => {
        const card = `
    <div class="filme-card">
        <img src="${filme.poster}" alt="${filme.titulo}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27450%27%3E%3Crect fill=%27%23ddd%27 width=%27300%27 height=%27450%27/%3E%3Ctext fill=%27%23999%27 font-size=%2720%27 text-anchor=%27middle%27 x=%27150%27 y=%27225%27%3ESem poster%3C/text%3E%3C/svg%3E'">
        <h3>${filme.titulo}</h3>
        <p><strong>Ano:</strong> ${filme.ano}</p>
        <p><strong>Género:</strong> ${filme.genero}</p>
        <p><strong>Produtora:</strong> ${filme.produtora}</p>
        <p><strong>Rating:</strong> ${filme.rating}</p>

        <button class="ver-mais" onclick="verMais(${filme.id})">
            Ver mais
        </button>
    </div>
`;
        container.insertAdjacentHTML("beforeend", card);
    });
}

carregarDados()
  .then(data => {
      filmesData = data.filmes;
      renderFilmes(filmesData);
  })
  .catch(err => {
      if (container) {
          container.innerHTML = "<p class='error-msg'>Erro ao carregar filmes.</p>";
      }
      console.error("Erro ao carregar filmes:", err);
  });

function verMais(id) {
    window.location.href = `filme.html?id=${id}`;
}

const searchInput = document.getElementById("pesquisa-input");
if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const termo = searchInput.value.toLowerCase().trim();
            if (!termo) {
                renderFilmes(filmesData);
                return;
            }
            const filtrados = filmesData.filter(f =>
                f.titulo.toLowerCase().includes(termo) ||
                f.genero.toLowerCase().includes(termo) ||
                f.produtora.toLowerCase().includes(termo)
            );
            renderFilmes(filtrados);
        }, 300);
    });
}
