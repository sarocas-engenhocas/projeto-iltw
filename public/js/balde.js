// balde.js — Bucket pessoal: adicionar/remover filmes, sincronizado com servidor (se logado) ou localStorage (fallback).

let balde = [];  // array de IDs dos filmes no balde
const container = document.getElementById("balde-container");
let user;
try { user = JSON.parse(localStorage.getItem("user")); } catch { user = null; }

// Devolve email do utilizador logado, ou null se anónimo
function getUserEmail() {
    return user ? user.email : null;
}

// Carrega o balde: do servidor se logado, com fallback a localStorage
function carregarBalde() {
    const email = getUserEmail();
    if (email) {
        return fetch(`/api/balde?email=${encodeURIComponent(email)}`)
            .then(res => {
                if (!res.ok) throw new Error("Servidor indisponivel");
                return res.json();
            })
            .then(data => {
                balde = data.balde || [];
                localStorage.setItem("balde", JSON.stringify(balde));
                return balde;
            })
            .catch(() => {
                // Fallback: se servidor falhar, usa localStorage
                balde = JSON.parse(localStorage.getItem("balde")) || [];
                return balde;
            });
    }
    // Anónimo: usa apenas localStorage
    balde = JSON.parse(localStorage.getItem("balde")) || [];
    return Promise.resolve(balde);
}

// Guarda o balde: sempre em localStorage; também no servidor se logado
function guardarBalde() {
    localStorage.setItem("balde", JSON.stringify(balde));
    const email = getUserEmail();
    if (email) {
        fetch("/api/balde", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, balde })
        }).catch(() => {});  // falha silenciosa (offline, etc.)
    }
}

container.innerHTML = "<div class='skeleton-grid'><div class='skeleton-card'><div class='skeleton-img'></div><div class='skeleton-line'></div><div class='skeleton-line'></div><div class='skeleton-line'></div><div class='skeleton-line'></div></div></div>";

// No load da página: carrega balde e filmes, depois renderiza os cards
carregarBalde().then(() => {
    carregarDados()
      .then(data => {
        const filmes = data.filmes;
        const filmesNoBalde = filmes.filter(filme => balde.includes(filme.id));

        if (filmesNoBalde.length === 0) {
          container.innerHTML = "<p>O balde está vazio.</p>";
          return;
        }

        container.innerHTML = "";

        filmesNoBalde.forEach(filme => {
          const card = `
            <div class="filme-card">
                <img src="${filme.poster}" alt="${filme.titulo}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27450%27%3E%3Crect fill=%27%23ddd%27 width=%27300%27 height=%27450%27/%3E%3Ctext fill=%27%23999%27 font-size=%2720%27 text-anchor=%27middle%27 x=%27150%27 y=%27225%27%3ESem poster%3C/text%3E%3C/svg%3E'">
                <h3>${filme.titulo}</h3>
                <p><strong>Ano:</strong> ${filme.ano}</p>
                <p><strong>Género:</strong> ${filme.genero}</p>
                <p><strong>Produtora:</strong> ${filme.produtora}</p>
                <p><strong>Rating:</strong> ${filme.rating}</p>

                <button class="btn-balde" data-id="${filme.id}" onclick="removerDoBalde(${filme.id})">
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
});

// Remove um filme do balde pelo ID: atualiza array, guarda, remove DOM, mostra mensagem se vazio
function removerDoBalde(id) {
  balde = balde.filter(filmeId => filmeId !== id);
  guardarBalde();
  // Seleciona o card pelo onclick que contém o ID
  const card = document.querySelector(`.filme-card .btn-balde[data-id="${id}"]`);
  if (card) card.closest(".filme-card").remove();
  if (container.children.length === 0) {
    container.innerHTML = "<p>O balde está vazio.</p>";
  }
}
