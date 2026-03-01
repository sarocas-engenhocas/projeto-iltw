const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('Static'));
app.use(express.static('.'));

const users = [];

app.post('/register', (req, res) => {
  const { nome, email, password } = req.body;
  if (!nome || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Este email já está registado.' });
  }
  users.push({ nome, email, password });
  res.json({ message: `Conta criada com sucesso, ${nome}!` });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e palavra-passe são obrigatórios.' });
  }
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
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
