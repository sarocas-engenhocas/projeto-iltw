function injectHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    let authLinksHtml;
    if (user) {
        authLinksHtml = `<span style="color:white;font-size:15px;margin-right:20px;">Olá, ${user.nome}!</span>
            <a href="javascript:void(0)" id="logout-btn" style="font-size:15px;color:white;text-decoration:none;">Logout</a>`;
    } else {
        authLinksHtml = `<a href="login.html" style="font-size:15px;margin-right:10px;">Login</a>
            <a href="criarconta.html" style="font-size:15px;">Criar Conta</a>`;
    }
    document.body.insertAdjacentHTML("afterbegin", `
    <a href="#main-content" class="skip-link">Saltar para conteúdo</a>
    <header>
        <a href="index.html"><img src="Static/pics/PipocaDigitalLogo.png" alt="Logo da PipocaDigital" class="logo" style="height:100px;"></a>
        <div class="botoes">
        <div class="botoes-cima">
            ${authLinksHtml}
            <button id="tema-btn" style="background:none;border:none;cursor:pointer;font-size:18px;padding:0 4px;" aria-label="Alternar modo escuro/claro"></button>
        </div>
        <div class="botoes-baixo">
        <a href="filmes.html">Filmes</a>
        <a href="produtoras.html">Produtoras</a>
        <a href="generos.html">Géneros</a>
        <a href="balde.html">Balde</a>
        <a href="sobre.html" class="btn-sobre">Sobre</a>
        <a href="filmes.html"><img src="Static/pics/search.png" style="height:25px;" alt="Ver lista de filmes"></a>
        </div>
        </div>
    </header>
    `);
    const tema = localStorage.getItem("tema") || "claro";
    const btn = document.getElementById("tema-btn");
    btn.textContent = tema === "escuro" ? "☀️" : "🌙";
    if (tema === "escuro") document.documentElement.setAttribute("data-theme", "escuro");
    btn.addEventListener("click", () => {
        const atual = document.documentElement.getAttribute("data-theme");
        if (atual === "escuro") {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("tema", "claro");
            btn.textContent = "🌙";
        } else {
            document.documentElement.setAttribute("data-theme", "escuro");
            localStorage.setItem("tema", "escuro");
            btn.textContent = "☀️";
        }
    });
    if (user) {
        document.getElementById("logout-btn").addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user");
            localStorage.removeItem("balde");
            location.reload();
        });
    }
}

function verMais(id) {
    window.location.href = `filme.html?id=${id}`;
}

function showError(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function injectFooter() {
    document.body.insertAdjacentHTML("beforeend", `
    <footer>
         <div class="footer-top">
        <a href="index.html">
            <img src="Static/pics/PipocaDigitalLogo.png" class="logo" style="height:80px;" alt="PipocaDigital">
        </a>
        <div class="footer-buttons">
            <a href="filmes.html">Filmes</a>
            <a href="produtoras.html">Produtoras</a>
            <a href="generos.html">Géneros</a>
            <a href="balde.html">Balde</a>
        </div>
    </div>
        <p>© ${new Date().getFullYear()} Pipoca Digital. Todos os direitos reservados.</p>
    </footer>
    `);
}
