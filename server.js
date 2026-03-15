const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'users.json');

function lerUsers() {
    try {
        if (!fs.existsSync(DB_PATH)) return [];
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    } catch { return []; }
}

function guardarUsers(users) {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf-8');
}

app.use(express.json());
app.use(express.static('Static'));
app.use(express.static('.'));

app.post('/register', async (req, res) => {
    const { nome, email, password } = req.body;
    if (!nome || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    const users = lerUsers();
    if (users.find(u => u.email === email)) {
        return res.status(409).json({ message: 'Este email já está registado.' });
    }
    const hash = await bcrypt.hash(password, 10);
    users.push({ nome, email, password: hash });
    guardarUsers(users);
    res.json({ message: `Conta criada com sucesso, ${nome}!` });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email e palavra-passe são obrigatórios.' });
    }
    const users = lerUsers();
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Email ou palavra-passe incorretos.' });
    }
    res.json({ message: `Bem-vindo de volta, ${user.nome}!`, nome: user.nome });
});

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Servidor a correr em http://localhost:${port}`);
    });
}

module.exports = app;
