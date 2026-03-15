function carregarDados() {
    const cache = localStorage.getItem("filmesCache");
    if (cache) {
        return Promise.resolve(JSON.parse(cache));
    }
    return fetch("Dados/filmes.json")
        .then(res => {
            if (!res.ok) throw new Error("Erro ao carregar dados");
            return res.json();
        })
        .then(data => {
            localStorage.setItem("filmesCache", JSON.stringify(data));
            return data;
        });
}
