let filmes = [];

const listaProdutoras = document.getElementById("produtoras-lista");
listaProdutoras.innerHTML = "<p style='text-align:center;font-size:20px;'>A carregar...</p>";

fetch("Dados/filmes.json")               // Faz o pedido ao ficheiro filmes.json
  .then(res => res.json())               // Converte a resposta para JSON
  .then(data => {
    filmes = data.filmes;                // Guarda o array de filmes na variável global

    // Obter produtoras únicas
    // Faz um map para obter apenas o nome da produtora de cada filme
    // Usa Set para remover duplicados
    // Converte novamente para array com [...]
    const produtoras = [...new Set(filmes.map(f => f.produtora))];

    // Criar quadrados das produtoras
    produtoras.forEach(produtora => {
      const card = document.createElement("div");  // Cria um quadrado
      card.classList.add("genero-card");           // Usa a mesma classe visual dos géneros
      card.textContent = produtora;                // Mostra o nome da produtora

      // Quando o quadrado é clicado, mostra os filmes dessa produtora
      card.addEventListener("click", () => mostrarFilmesDaProdutora(produtora));

      listaProdutoras.appendChild(card);           // Adiciona o quadrado ao HTML
    });
  })
  .catch(err => {
      listaProdutoras.innerHTML = "<p style='text-align:center;font-size:20px;color:red;'>Erro ao carregar produtoras.</p>";
      console.error("Erro ao carregar produtoras:", err);
  });



// Função para mostrar filmes da produtora clicada
function mostrarFilmesDaProdutora(produtora) {
  const container = document.getElementById("filmes-produtora");
  container.innerHTML = ""; // Limpa o conteúdo anterior

  // Filtra os filmes que pertencem à produtora clicada
  const filtrados = filmes.filter(f => f.produtora === produtora);

  // Para cada filme filtrado, cria um card HTML
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

    // Insere o card no container dos filmes filtrados
    container.insertAdjacentHTML("beforeend", card);
  });
}



// Função que redireciona para a página de detalhes do filme
function verMais(id) {
  // Envia o utilizador para filme.html com o ID do filme na URL
  window.location.href = `filme.html?id=${id}`;
}
