// 1. Ler o balde do localStorage
// Tenta obter o array "balde" guardado no navegador.
// Se não existir nada guardado, usa um array vazio [].
let balde = JSON.parse(localStorage.getItem("balde")) || [];


// 2. Carregar os filmes do JSON
const container = document.getElementById("balde-container");
container.innerHTML = "<p style='text-align:center;font-size:20px;'>A carregar...</p>";

fetch("Dados/filmes.json")
  .then(res => res.json()) // Converte a resposta para JSON
  .then(data => {
    const filmes = data.filmes; // Guarda o array de filmes do JSON

    // 3. Filtrar apenas os filmes que estão no balde
    // Compara cada filme do JSON com os IDs guardados no localStorage.
    const filmesNoBalde = filmes.filter(filme => balde.includes(filme.id));

    // 4. Mostrar no HTML

    // Se o balde estiver vazio, mostra uma mensagem e termina.
    if (filmesNoBalde.length === 0) {
      container.innerHTML = "<p>O balde está vazio.</p>";
      return;
    }

    // Para cada filme encontrado no balde, cria um card HTML
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

      // Insere o card no container da página
      container.insertAdjacentHTML("beforeend", card);
    });
  })
  .catch(err => {
      container.innerHTML = "<p style='text-align:center;font-size:20px;color:red;'>Erro ao carregar o balde.</p>";
      console.error("Erro ao carregar balde:", err);
  });


// 5. Função para remover filmes do balde
// Remove o ID do filme do array "balde" e atualiza o localStorage.
function removerDoBalde(id) {
  balde = balde.filter(filmeId => filmeId !== id); // Remove o ID selecionado
  localStorage.setItem("balde", JSON.stringify(balde)); // Atualiza o localStorage
  location.reload(); // Recarrega a página para atualizar a lista
}
