let balde = JSON.parse(localStorage.getItem("balde")) || [];
const container = document.getElementById("balde-container");
container.innerHTML = "<p class='loading-msg'>A carregar...</p>";

carregarDados()
  .then(data => {
    const filmes = data.filmes;
    const filmesNoBalde = filmes.filter(filme => balde.includes(filme.id));

    if (filmesNoBalde.length === 0) {
      container.innerHTML = "<p>O balde está vazio.</p>";
      return;
    }

    filmesNoBalde.forEach(filme => {
      const card = `
        <div class="filme-card">
            <img src="${filme.poster}" alt="${filme.titulo}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27450%27%3E%3Crect fill=%27%23ddd%27 width=%27300%27 height=%27450%27/%3E%3Ctext fill=%27%23999%27 font-size=%2720%27 text-anchor=%27middle%27 x=%27150%27 y=%27225%27%3ESem poster%3C/text%3E%3C/svg%3E'">
            <h3>${filme.titulo}</h3>
            <p><strong>Ano:</strong> ${filme.ano}</p>
            <p><strong>Género:</strong> ${filme.genero}</p>
            <p><strong>Produtora:</strong> ${filme.produtora}</p>
            <p><strong>Rating:</strong> ${filme.rating}</p>

            <button class="btn-balde" onclick="removerDoBalde(${filme.id})">
                Remover
            </button>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", card);
    });
  })
  .catch(err => {
      container.innerHTML = "<p class='error-msg'>Erro ao carregar o balde.</p>";
      console.error("Erro ao carregar balde:", err);
  });

function removerDoBalde(id) {
  balde = balde.filter(filmeId => filmeId !== id);
  localStorage.setItem("balde", JSON.stringify(balde));
  const card = document.querySelector(`.filme-card .btn-balde[onclick*="(${id})"]`);
  if (card) card.closest(".filme-card").remove();
  if (container.children.length === 0) {
    container.innerHTML = "<p>O balde está vazio.</p>";
  }
}
