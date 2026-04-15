function starsHtml(rating) {
    if (rating == null || isNaN(rating)) return '';
    const count = Math.round(Math.min(10, Math.max(0, rating)) / 2);
    let html = '<span class="stars">';
    for (let i = 1; i <= 5; i++) {
        html += `<span class="star${i <= count ? ' filled' : ''}">★</span>`;
    }
    html += '</span>';
    return html;
}

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
            <button id="modo-toggle" aria-label="Alternar modo escuro/claro">🌙</button>
            ${authLinksHtml}
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
    if (user) {
        document.getElementById("logout-btn").addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user");
            localStorage.removeItem("balde");
            location.reload();
        });
    }

    const theme = localStorage.getItem("tema") || "claro";
    if (theme === "escuro") {
        document.documentElement.setAttribute("data-theme", "dark");
        const btn = document.getElementById("modo-toggle");
        if (btn) btn.textContent = "☀️";
    }
    document.getElementById("modo-toggle").addEventListener("click", () => {
        const html = document.documentElement;
        const btn = document.getElementById("modo-toggle");
        if (html.getAttribute("data-theme") === "dark") {
            html.removeAttribute("data-theme");
            localStorage.setItem("tema", "claro");
            btn.textContent = "🌙";
        } else {
            html.setAttribute("data-theme", "dark");
            localStorage.setItem("tema", "escuro");
            btn.textContent = "☀️";
        }
    });

    document.body.insertAdjacentHTML("beforeend", '<button id="voltar-topo" aria-label="Voltar ao topo">↑</button>');
    const topBtn = document.getElementById("voltar-topo");
    window.addEventListener("scroll", () => {
        topBtn.style.display = window.scrollY > 400 ? "flex" : "none";
    });
    topBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
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
