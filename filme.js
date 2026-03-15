const params = new URLSearchParams(window.location.search);
const container = document.getElementById("filme-container");
const hero = document.getElementById("trailer-hero");

const id = parseInt(params.get("id"));
if (isNaN(id)) {
    container.innerHTML = "<p class='error-msg'>ID de filme inválido.</p>";
    throw new Error("ID inválido");
}
container.innerHTML = "<p class='loading-msg'>A carregar...</p>";

carregarDados()
  .then(data => {
      const filme = data.filmes.find(f => f.id === id);

      if (!filme) {
          container.textContent = "Filme não encontrado.";
          return;
      }

      if (hero) {
          hero.style.backgroundImage = `url(${filme.poster})`;
          hero.innerHTML = `
        <div id="trailer-overlay"></div>
        <div id="hero-info">
            <h1>${filme.titulo}</h1>
            <p id="hero-meta">${filme.ano} | ${filme.genero} | ${filme.produtora}</p>
        </div>
        `;
      }

      const searchQuery = encodeURIComponent(filme.titulo + " " + filme.ano + " trailer");
      const trailerURL = `https://www.youtube.com/results?search_query=${searchQuery}`;

      container.innerHTML = `
    <div class="filme-detalhes">

        <div class="poster">
            <img src="${filme.poster}" alt="${filme.titulo}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27450%27%3E%3Crect fill=%27%23ddd%27 width=%27300%27 height=%27450%27/%3E%3Ctext fill=%27%23999%27 font-size=%2720%27 text-anchor=%27middle%27 x=%27150%27 y=%27225%27%3ESem poster%3C/text%3E%3C/svg%3E'">
        </div>

        <div class="info">
            <p><strong>Ano:</strong> ${filme.ano}</p>
            <p><strong>Género:</strong> ${filme.genero}</p>
            <p><strong>Produtora:</strong> ${filme.produtora}</p>
            <p><strong>Rating:</strong> ${filme.rating}</p>
            <p><strong>Sinopse:</strong> ${filme.sinopse}</p>

            <a href="${trailerURL}" target="_blank" class="btn-trailer">🎬 Ver Trailer</a>
            <button id="btn-balde" class="btn-balde">🧺 Adicionar ao Balde</button>
        </div>

    </div>
`;
      document.getElementById("btn-balde").addEventListener("click", () => {
          let balde = JSON.parse(localStorage.getItem("balde")) || [];
          if (!balde.includes(id)) {
              balde.push(id);
              localStorage.setItem("balde", JSON.stringify(balde));
              mostrarMensagem("Filme adicionado ao balde!");
          } else {
              mostrarMensagem("Este filme já está no balde!");
          }
      });
  })
  .catch(err => {
      container.innerHTML = "<p class='error-msg'>Erro ao carregar o filme.</p>";
      console.error("Erro ao carregar detalhes do filme:", err);
  });

function mostrarMensagem(texto) {
    const msg = document.createElement("p");
    msg.textContent = texto;
    msg.className = "balde-msg";
    container.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}
