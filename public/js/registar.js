// registar.js — Formulário de registo com validação (nome, email, password, confirmação).

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const msg = document.getElementById("message");
    let valid = true;

    // Limpa erros anteriores
    document.querySelectorAll("#registerForm input").forEach(inp => inp.classList.remove("input-error"));
    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");

    // Valida nome (obrigatório)
    if (!nome.value.trim()) {
        nome.classList.add("input-error");
        showError("nome-error", "O nome é obrigatório.");
        valid = false;
    }

    // Valida email (obrigatório + formato)
    if (!email.value.trim()) {
        email.classList.add("input-error");
        showError("email-error", "O email é obrigatório.");
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        email.classList.add("input-error");
        showError("email-error", "Formato de email inválido.");
        valid = false;
    }

    // Valida password (obrigatória + mínimo 6 caracteres)
    if (!password.value) {
        password.classList.add("input-error");
        showError("password-error", "A palavra-passe é obrigatória.");
        valid = false;
    } else if (password.value.length < 6) {
        password.classList.add("input-error");
        showError("password-error", "A palavra-passe deve ter pelo menos 6 caracteres.");
        valid = false;
    }

    // Valida confirmação (obrigatória + coincidir com password)
    if (!confirmPassword.value) {
        confirmPassword.classList.add("input-error");
        showError("confirm-password-error", "Confirme a palavra-passe.");
        valid = false;
    } else if (confirmPassword.value !== password.value) {
        confirmPassword.classList.add("input-error");
        showError("confirm-password-error", "As palavras-passe não coincidem.");
        valid = false;
    }

    if (!valid) return;

    msg.textContent = "A registar...";
    msg.style.color = "";  // cor herdada do tema
    try {
        const res = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome: nome.value.trim(), email: email.value.trim(), password: password.value })
        });
        const data = await res.json();
        if (res.ok) {
            window.location.href = "login.html";  // redireciona para login após registo bem-sucedido
        } else {
            msg.textContent = data.message;
            msg.style.color = "red";
        }
    } catch {
        msg.textContent = "Erro de ligação ao servidor.";
        msg.style.color = "red";
    }
});

