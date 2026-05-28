// script.js — Lista de filmes com paginação (16 por página), pesquisa por título/género/produtora com debounce, ordenação.

let filmesData = [];       // array completo de filmes
let filmesFiltrados = [];  // array após filtro de pesquisa
let paginaAtual = 1;
const POR_PAGINA = 16;

const container = document.getElementById("lista-filmes");
const paginacaoEl = document.getElementById("paginacao");

if (container) {
    container.innerHTML = gerarSkeletons(8);
}

function gerarSkeletons(n) {
    let html = '<div class="skeleton-grid">';
    for (let i = 0; i < n; i++) {
        html += `
            <div class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line"></div>
            </div>
        `;
    }
    html += '</div>';
    return html;
}

function ordenarFilmes(lista, criterio) {
    const c = criterio || (document.getElementById("sort-select")?.value || "rating-desc");
    const sorted = [...lista];
    switch (c) {
        case "rating-desc": sorted.sort((a, b) => b.rating - a.rating); break;
        case "rating-asc": sorted.sort((a, b) => a.rating - b.rating); break;
        case "ano-desc": sorted.sort((a, b) => b.ano - a.ano); break;
        case "ano-asc": sorted.sort((a, b) => a.ano - b.ano); break;
        case "titulo-asc": sorted.sort((a, b) => a.titulo.localeCompare(b.titulo)); break;
        case "titulo-desc": sorted.sort((a, b) => b.titulo.localeCompare(a.titulo)); break;
    }
    return sorted;
}

// Define a lista filtrada, ordena e volta à página 1
function renderFilmes(lista) {
    filmesFiltrados = ordenarFilmes(lista);
    paginaAtual = 1;
    mostrarPagina();
}

// Renderiza a página atual com base em paginaAtual
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
        pagina.forEach((filme, i) => {
            const card = `
    <div class="filme-card" style="animation-delay:${i * 0.05}s">
        <img src="${filme.poster}" alt="${filme.titulo}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27450%27%3E%3Crect fill=%27%23ddd%27 width=%27300%27 height=%27450%27/%3E%3Ctext fill=%27%23999%27 font-size=%2720%27 text-anchor=%27middle%27 x=%27150%27 y=%27225%27%3ESem poster%3C/text%3E%3Csvg%3E'">
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

    renderizarPaginacao(totalPaginas);
}

// Renderiza botões de paginação (Anterior, números, Seguinte)
function renderizarPaginacao(totalPaginas) {
    if (!paginacaoEl) return;
    if (totalPaginas <= 1) {
        paginacaoEl.innerHTML = "";
        return;
    }

    let html = "";
    // Botão "Anterior" (exceto na primeira página)
    if (paginaAtual > 1) {
        html += `<button class="pag-btn" data-pagina="${paginaAtual - 1}">Anterior</button>`;
    }
    // Botões numerados
    for (let i = 1; i <= totalPaginas; i++) {
        const ativo = i === paginaAtual ? ' class="pag-btn pag-ativo"' : ' class="pag-btn"';
        html += `<button${ativo} data-pagina="${i}">${i}</button>`;
    }
    // Botão "Seguinte" (exceto na última página)
    if (paginaAtual < totalPaginas) {
        html += `<button class="pag-btn" data-pagina="${paginaAtual + 1}">Seguinte</button>`;
    }
    paginacaoEl.innerHTML = html;

    // Adiciona event listeners a cada botão
    paginacaoEl.querySelectorAll(".pag-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            paginaAtual = parseInt(btn.dataset.pagina);
            mostrarPagina();
            window.scrollTo({ top: container.offsetTop - 20, behavior: "smooth" });
        });
    });
}

// Carrega dados e renderiza lista completa
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

// Redundante com components.js, mas mantido para compatibilidade com inline onclick
function verMais(id) {
    window.location.href = `filme.html?id=${id}`;
}

// Pesquisa com debounce (300ms) — filtra por título, género ou produtora
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
            filmesFiltrados = ordenarFilmes(filmesFiltrados);
            paginaAtual = 1;
            mostrarPagina();
        }, 300);
    });
}

// Ordenação: reordena a lista atual e re-renderiza
const sortSelect = document.getElementById("sort-select");
if (sortSelect) {
    sortSelect.addEventListener("change", () => {
        filmesFiltrados = ordenarFilmes(filmesFiltrados);
        paginaAtual = 1;
        mostrarPagina();
    });
}
