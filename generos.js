let filmes = [];

const listaGeneros = document.getElementById("generos-lista");
listaGeneros.innerHTML = "<p style='text-align:center;font-size:20px;'>A carregar...</p>";

fetch("Dados/filmes.json")  
  .then(res => res.json()) // Converte a resposta do fetch para JSON
  .then(data => {
    filmes = data.filmes; // Guarda o array de filmes na variável global

    // Obter géneros únicos
    // Faz um map para obter apenas o género de cada filme
    // Depois usa Set para remover duplicados
    // E transforma novamente em array com [...]
    const generos = [...new Set(filmes.map(f => f.genero))];

    // Criar quadrados dos géneros
    generos.forEach(genero => {
      const card = document.createElement("div"); // Cria um quadrado
      card.classList.add("genero-card"); // Adiciona a classe de estilo
      card.textContent = genero; // Mostra o nome do género no quadrado

      // Quando o quadrado é clicado, chama a função que mostra os filmes desse género
      card.addEventListener("click", () => mostrarFilmesDoGenero(genero));

      listaGeneros.appendChild(card); // Adiciona o quadrado ao HTML
    });
  })
  .catch(err => {
      listaGeneros.innerHTML = "<p style='text-align:center;font-size:20px;color:red;'>Erro ao carregar géneros.</p>";
      console.error("Erro ao carregar géneros:", err);
  });



// Função para mostrar filmes do género clicado
function mostrarFilmesDoGenero(genero) {
  const container = document.getElementById("filmes-genero");  
  container.innerHTML = ""; // limpar o conteúdo anterior

  // Filtra os filmes que pertencem ao género clicado
  const filtrados = filmes.filter(f => f.genero === genero);

  // Para cada filme filtrado, cria um card HTML
  filtrados.forEach(filme => {
    const card = `
      <div class="filme-card">
          <img src="${filme.poster}" alt="${filme.titulo}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27450%27%3E%3Crect fill=%27%23ddd%27 width=%27300%27 height=%27450%27/%3E%3Ctext fill=%27%23999%27 font-size=%2720%27 text-anchor=%27middle%27 x=%27150%27 y=%27225%27%3ESem poster%3C/text%3E%3C/svg%3E'">
          <h3>${filme.titulo}</h3>
          <p><strong>Ano:</strong> ${filme.ano}</p>
          <p><strong>Produtora:</strong> ${filme.produtora}</p>
          <p><strong>Rating:</strong> ${filme.rating}</p>

          <button class="ver-mais" onclick="verMais(${filme.id})">
              Ver mais
          </button>
      </div>
    `;

    // Insere o card no container dos filmes
    container.insertAdjacentHTML("beforeend", card);
  });
}



// Função que redireciona para a página de detalhes do filme
function verMais(id) {
  // Envia o utilizador para filme.html com o ID do filme na URL
  window.location.href = `filme.html?id=${id}`;
}
