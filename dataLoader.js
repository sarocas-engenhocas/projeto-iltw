const CACHE_VERSAO = "3";

function carregarDados() {
    try {
        const cache = localStorage.getItem("filmesCache");
        const versao = localStorage.getItem("filmesCacheVersao");
        if (cache && versao === CACHE_VERSAO) {
            return Promise.resolve(JSON.parse(cache));
        }
    } catch (e) {
        // cache corrompido, ignorar
    }
    return fetch("/Dados/filmes.json?" + CACHE_VERSAO)
        .then(res => {
            if (!res.ok) throw new Error("Erro ao carregar dados");
            return res.json();
        })
        .then(data => {
            localStorage.setItem("filmesCache", JSON.stringify(data));
            localStorage.setItem("filmesCacheVersao", CACHE_VERSAO);
            return data;
        });
}
