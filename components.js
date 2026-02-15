function injectHeader() {
    document.body.insertAdjacentHTML('afterbegin', `
    <header>
        <a href="index.html"> <img src="Static/pics/PipocaDigitalLogo.png" alt="Logo da PipocaDigital" class="logo" style="height: 100px;"> </a>

        <div class="botoes">
        <div class="botoes-cima">
            <a href="login.html" style="font-size: 15px;">Login</a>
            <a href="criarconta.html" style="font-size: 15px;">Criar Conta</a>
        </div>

        <div class="botoes-baixo">
        <a href="filmes.html">Filmes</a>
        <a href="produtoras.html">Produtoras</a>
        <a href="generos.html">Géneros</a>
        <a href="balde.html">Balde</a>
        <a href="sobre.html" class="btn-sobre">Sobre</a>
        <a href="filmes.html"> <img src="Static/pics/search.png" style="height: 25px;"> </a>
        </div>
        </div>
    </header>
    `);
}

function injectFooter() {
    document.body.insertAdjacentHTML('beforeend', `
    <footer>
         <div class="footer-top">
        <a href="index.html">
            <img src="Static/pics/PipocaDigitalLogo.png" class="logo" style="height: 80px;">
        </a>

        <div class="footer-buttons">
            <a href="filmes.html">Filmes</a>
            <a href="produtoras.html">Produtoras</a>
            <a href="generos.html">Géneros</a>
            <a href="balde.html">Balde</a>
        </div>
    </div>
        <p>© 2026 Pipoca Digital. Todos os direitos reservados.</p>
    </footer>
    `);
}
