/* página detalhes filme */

// 1. Ler o ID da URL
const params = new URLSearchParams(window.location.search); 
// Cria um objeto que permite ler parâmetros da URL, ex: filme.html?id=3

const container = document.getElementById("filme-container");

const id = parseInt(params.get("id"));
if (isNaN(id)) {
    container.innerHTML = "<p style='text-align:center;font-size:20px;color:red;'>ID de filme inválido.</p>";
    throw new Error("ID inválido");
}
container.innerHTML = "<p style='text-align:center;font-size:20px;'>A carregar...</p>";

carregarDados()
  .then(data => {
      // Aqui já temos acesso ao conteúdo do JSON carregado


      // 3. Encontrar o filme certo
      const filme = data.filmes.find(f => f.id === id);
      // Procura no array "filmes" o objeto cujo id corresponde ao ID da URL


      if (!filme) {
          container.textContent = "Filme não encontrado.";
          return;
      }
      // Caso o ID não exista no JSON, mostra mensagem de erro e interrompe o código


      // 4. Criar link do trailer
      const trailerURL = `https://www.youtube.com/results?search_query=${encodeURIComponent(filme.titulo + " " + filme.ano + " trailer")}`;
      // Gera automaticamente uma pesquisa no YouTube pelo trailer do filme
      // encodeURIComponent evita erros com espaços e acentos


      // 5. Criar o HTML
      container.innerHTML = `
    <div class="filme-detalhes">
        
        <div class="poster">
            <img src="${filme.poster}" alt="${filme.titulo}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27450%27%3E%3Crect fill=%27%23ddd%27 width=%27300%27 height=%27450%27/%3E%3Ctext fill=%27%23999%27 font-size=%2720%27 text-anchor=%27middle%27 x=%27150%27 y=%27225%27%3ESem poster%3C/text%3E%3C/svg%3E'">
        </div>

        <div class="info">
            <h1>${filme.titulo}</h1>

            <p><strong>Ano:</strong> ${filme.ano}</p>
            <p><strong>Género:</strong> ${filme.genero}</p>
            <p><strong>Produtora:</strong> ${filme.produtora}</p>
            <p><strong>Rating:</strong> ${filme.rating}</p>

            <p class="sinopse"><strong>Sinopse:</strong> ${filme.sinopse}</p>

            <a href="${trailerURL}" target="_blank" class="btn-trailer">🎬 Ver Trailer</a>
            <button id="btn-balde" class="btn-balde">🧺 Adicionar ao Balde</button>
        </div>

    </div>
`;
      // Insere dinamicamente o HTML com todos os dados do filme
      // Usa template literals para inserir valores do JSON
      // Inclui botão para trailer e botão para adicionar ao balde


      // 6. Lógica do botão "Adicionar ao Balde"
      document.getElementById("btn-balde").addEventListener("click", () => {
          // Adiciona evento de clique ao botão

          let balde = JSON.parse(localStorage.getItem("balde")) || [];
          // Lê o array "balde" do localStorage
          // Se não existir, cria um array vazio

          if (!balde.includes(id)) {
              balde.push(id);
              localStorage.setItem("balde", JSON.stringify(balde));
              mostrarMensagem("Filme adicionado ao balde!");
          } else {
              mostrarMensagem("Este filme já está no balde!");
          }
          // Se o ID ainda não estiver no balde, adiciona
          // Caso contrário, avisa que já existe
      });
  })
  .catch(err => {
      container.innerHTML = "<p style='text-align:center;font-size:20px;color:red;'>Erro ao carregar o filme.</p>";
      console.error("Erro ao carregar detalhes do filme:", err);
  });

function mostrarMensagem(texto) {
    const msg = document.createElement("p");
    msg.textContent = texto;
    msg.style.cssText = "text-align:center;font-size:18px;color:green;font-weight:bold;margin-top:10px;";
    container.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}
