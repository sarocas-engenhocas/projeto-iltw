// server.js — Backend Express (login, register, balde API). Persistência em users.json com cache em memória.
const express = require('express');
const bcrypt = require('bcryptjs');  // hashing de passwords
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Caminho do ficheiro de utilizadores: /tmp em produção (Vercel, única pasta writable), dir local em dev
const DB_PATH = process.env.DB_PATH || path.join(process.env.NODE_ENV === 'production' ? '/tmp' : __dirname, 'users.json');

let usersCache = null;  // cache em memória para evitar ler disco em cada pedido

// Lê utilizadores do disco (apenas se cache vazia)
function lerUsers() {
    if (usersCache) return usersCache;
    try {
        if (!fs.existsSync(DB_PATH)) return [];
        usersCache = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        return usersCache;
    } catch { return []; }
}

// Guarda utilizadores: atualiza cache e escreve no disco
function guardarUsers(users) {
    usersCache = users;
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf-8');
    } catch {}
}

// Middlewares
app.use(express.json());  // parse JSON do body
app.use(express.static('public'));  // ficheiros estáticos (HTML, CSS, JS, imagens)
app.use('/Dados', express.static('Dados'));  // filmes.json

// Rota de registo: valida campos, verifica duplicados, hasha password, guarda
app.post('/register', async (req, res) => {
    try {
        const { nome, email, password } = req.body;
        if (!nome || !email || !password) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }
        const users = lerUsers();
        if (users.find(u => u.email === email)) {
            return res.status(409).json({ message: 'Este email já está registado.' });
        }
        const hash = await bcrypt.hash(password, 10);
        users.push({ nome, email, password: hash, balde: [] });  // balde vazio ao registar
        guardarUsers(users);
        res.json({ message: `Conta criada com sucesso, ${nome}!` });
    } catch {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Rota GET /api/balde: devolve array de IDs de filmes do utilizador logado
app.get('/api/balde', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email é obrigatório.' });
    const users = lerUsers();
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });
    res.json({ balde: user.balde || [] });
});

// Rota POST /api/balde: substitui array de IDs do utilizador
app.post('/api/balde', (req, res) => {
    const { email, balde } = req.body;
    if (!email || !Array.isArray(balde)) {
        return res.status(400).json({ message: 'Email e balde são obrigatórios.' });
    }
    const users = lerUsers();
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });
    user.balde = balde;
    guardarUsers(users);
    res.json({ message: 'Balde atualizado.' });
});

// Rota de login: verifica credenciais e devolve mensagem personalizada
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email e palavra-passe são obrigatórios.' });
        }
        const users = lerUsers();
        const user = users.find(u => u.email === email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Email ou palavra-passe incorretos.' });
        }
        // Mensagem personalizada com o nome do utilizador
        res.json({ message: `Bem-vindo de volta, ${user.nome}!`, nome: user.nome });
    } catch {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Só inicia servidor em dev (não em produção/test)
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Servidor a correr em http://localhost:${port}`);
    });
}

module.exports = app;  // exporta para testes (supertest)
