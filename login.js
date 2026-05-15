document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const msg = document.getElementById("message");
    let valid = true;

    email.classList.remove("input-error");
    password.classList.remove("input-error");

    const emailErr = document.getElementById("email-error");
    const passErr = document.getElementById("password-error");
    if (emailErr) emailErr.textContent = "";
    if (passErr) passErr.textContent = "";

    if (!email.value.trim()) {
        email.classList.add("input-error");
        showError("email-error", "O email é obrigatório.");
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        email.classList.add("input-error");
        showError("email-error", "Formato de email inválido.");
        valid = false;
    }

    if (!password.value) {
        password.classList.add("input-error");
        showError("password-error", "A palavra-passe é obrigatória.");
        valid = false;
    } else if (password.value.length < 6) {
        password.classList.add("input-error");
        showError("password-error", "A palavra-passe deve ter pelo menos 6 caracteres.");
        valid = false;
    }

    if (!valid) return;

    msg.textContent = "A autenticar...";
    msg.style.color = "";
    try {
        const res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.value.trim(), password: password.value })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("user", JSON.stringify({ nome: data.nome, email: email.value.trim() }));
            const localBalde = JSON.parse(localStorage.getItem("balde"));
            if (localBalde && localBalde.length > 0) {
                await fetch("/api/balde", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email.value.trim(), balde: localBalde })
                }).catch(() => {});
            }
            window.location.href = "index.html";
        } else {
            msg.textContent = data.message;
            msg.style.color = "red";
        }
    } catch {
        msg.textContent = "Erro de ligação ao servidor.";
        msg.style.color = "red";
    }
});

