// dataLoader.js — Carrega filmes.json com cache em localStorage e controlo de versão.
// Basta incrementar CACHE_VERSAO para limpar cache de todos os utilizadores após deploy.
const CACHE_VERSAO = "1";

// Tenta carregar do cache localStorage; se falhar ou não existir, faz fetch com ?version para evitar cache do browser
function carregarDados() {
    const cache = localStorage.getItem("filmesCache_" + CACHE_VERSAO);
    if (cache) {
        try { return Promise.resolve(JSON.parse(cache)); } catch {}  // cache corrompido → ignora
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
