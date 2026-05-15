const CACHE_VERSAO = "1";

function carregarDados() {
    const cache = localStorage.getItem("filmesCache_" + CACHE_VERSAO);
    if (cache) {
        try { return Promise.resolve(JSON.parse(cache)); } catch {}
    }
    return fetch("/Dados/filmes.json?" + CACHE_VERSAO)
        .then(res => {
            if (!res.ok) throw new Error("Erro ao carregar dados");
            return res.json();
        })
        .then(data => {
            localStorage.setItem("filmesCache_" + CACHE_VERSAO, JSON.stringify(data));
            return data;
        });
}
