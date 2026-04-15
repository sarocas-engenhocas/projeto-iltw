let filmesData = [];
let filmesFiltrados = [];
let paginaAtual = 1;
const POR_PAGINA = 16;

const container = document.getElementById("lista-filmes");
const paginacaoEl = document.getElementById("paginacao");

if (container) {
    container.innerHTML = "<p class='loading-msg'>A carregar filmes...</p>";
}

function renderFilmes(lista) {
    filmesFiltrados = lista;
    paginaAtual = 1;
    mostrarPagina();
}

function mostrarPagina() {
    if (!container) return;
    container.innerHTML = "";

    const totalPaginas = Math.max(1, Math.ceil(filmesFiltrados.length / POR_PAGINA));
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    const inicio = (paginaAtual - 1) * POR_PAGINA;
    const pagina = filmesFiltrados.slice(inicio, inicio + POR_PAGINA);

    if (pagina.length === 0) {
        container.innerHTML = "<p class='empty-msg'>Nenhum filme encontrado.</p>";
    } else {
        pagina.forEach(filme => {
            const card = `
    <div class="filme-card">
        <img src="${filme.poster}" alt="${filme.titulo}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27450%27%3E%3Crect fill=%27%23ddd%27 width=%27300%27 height=%27450%27/%3E%3Ctext fill=%27%23999%27 font-size=%2720%27 text-anchor=%27middle%27 x=%27150%27 y=%27225%27%3ESem poster%3C/text%3E%3Csvg%3E'">
        <h3>${filme.titulo}</h3>
        <p><strong>Ano:</strong> ${filme.ano}</p>
        <p><strong>Género:</strong> ${filme.genero}</p>
        <p><strong>Produtora:</strong> ${filme.produtora}</p>
        <p><strong>Rating:</strong> ${filme.rating} ${starsHtml(filme.rating)}</p>

        <button class="ver-mais" onclick="verMais(${filme.id})">
            Ver mais
        </button>
    </div>
`;
            container.insertAdjacentHTML("beforeend", card);
        });
    }

    renderizarPaginacao(totalPaginas);
}

function renderizarPaginacao(totalPaginas) {
    if (!paginacaoEl) return;
    if (totalPaginas <= 1) {
        paginacaoEl.innerHTML = "";
        return;
    }

    let html = "";
    if (paginaAtual > 1) {
        html += `<button class="pag-btn" data-pagina="${paginaAtual - 1}">Anterior</button>`;
    }
    for (let i = 1; i <= totalPaginas; i++) {
        const ativo = i === paginaAtual ? ' class="pag-btn pag-ativo"' : ' class="pag-btn"';
        html += `<button${ativo} data-pagina="${i}">${i}</button>`;
    }
    if (paginaAtual < totalPaginas) {
        html += `<button class="pag-btn" data-pagina="${paginaAtual + 1}">Seguinte</button>`;
    }
    paginacaoEl.innerHTML = html;

    paginacaoEl.querySelectorAll(".pag-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            paginaAtual = parseInt(btn.dataset.pagina);
            mostrarPagina();
            window.scrollTo({ top: container.offsetTop - 20, behavior: "smooth" });
        });
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
                filmesFiltrados = [...filmesData];
            } else {
                filmesFiltrados = filmesData.filter(f =>
                    f.titulo.toLowerCase().includes(termo) ||
                    f.genero.toLowerCase().includes(termo) ||
                    f.produtora.toLowerCase().includes(termo)
                );
            }
            paginaAtual = 1;
            mostrarPagina();
        }, 300);
    });
}
