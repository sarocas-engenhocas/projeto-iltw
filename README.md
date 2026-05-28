# PipocaDigital

Catálogo online de filmes com autenticação, bucket personalizado e carrossel de destaques.

## Funcionalidades

- Catálogo de filmes com pesquisa, paginação (16 por página) e filtros por género/produtora
- Página de detalhes com sinopse, poster e link para trailer no YouTube
- Carrossel na página inicial com os 3 filmes mais bem avaliados, auto-play, navegação por teclado/rato/toque
- Autenticação (registo e login) com palavras-passe hashed (bcryptjs)
- Bucket (balde) por conta — adicionar/remover filmes, sincronizado com o servidor quando logado, com fallback a localStorage
- Modo escuro/claro com preferência guardada no navegador
- Responsivo — adaptado a desktop, tablet e mobile
- Acessibilidade — skip-link, aria-label, aria-roledescription, aria-current, :focus-visible

## Tecnologias

- Frontend: HTML, CSS, JavaScript (vanilla)
- Backend: Node.js + Express
- Base de dados: Ficheiro JSON (users.json) com persistência em /tmp no Vercel
- Testes: Jest + Supertest
- Deploy: Vercel (serverless functions via @vercel/node)

## Estrutura do projeto

```
PipocaDigital/
├── Dados/
│   └── filmes.json       # Catálogo de filmes (100+)
├── public/
│   ├── css/
│   │   └── style.css     # Estilos globais + dark mode + responsivo
│   ├── js/               # Lógica JavaScript
│   │   ├── components.js # Header, footer, funções partilhadas
│   │   ├── dataLoader.js # Carregamento e cache de filmes.json
│   │   ├── script.js     # Lista de filmes com paginação e pesquisa
│   │   ├── index.js      # Carrossel de destaques
│   │   ├── filme.js      # Página de detalhes do filme
│   │   ├── generos.js    # Filtro por género
│   │   ├── produtoras.js # Filtro por produtora
│   │   ├── balde.js      # Bucket pessoal
│   │   ├── login.js      # Login
│   │   └── registar.js   # Registo
│   ├── pics/             # Imagens (logo, setas, banner, background)
│   ├── index.html, filmes.html, filme.html, ...
├── server.js             # API Express (login, register, /api/balde)
├── vercel.json           # Configuração de deploy Vercel
├── package.json
└── server.test.js        # Testes da API
```

### Ficheiros JavaScript

| Ficheiro | Função |
|---|---|
| public/js/components.js | Injeta header (nav + auth + dark mode) e footer em todas as páginas; funções verMais() e showError() |
| public/js/dataLoader.js | Carrega filmes.json com cache em localStorage e controlo de versão |
| public/js/script.js | Lista de filmes com paginação e pesquisa |
| public/js/index.js | Carrossel de destaques na página inicial |
| public/js/filme.js | Página de detalhes de um filme + botão adicionar ao balde |
| public/js/generos.js | Página de géneros com filtro |
| public/js/produtoras.js | Página de produtoras com filtro |
| public/js/balde.js | Bucket pessoal (CRUD + sync servidor/localStorage) |
| public/js/login.js | Formulário de login com validação |
| public/js/registar.js | Formulário de registo com validação |
| server.js | API Express (login, register, balde GET/POST) |

## Como correr localmente

```bash
npm install
node server.js
# Abrir http://localhost:3000
```

## Testes

```bash
npm test
```

Usa Jest + Supertest. Testa registo, login, validação de campos e duplicados. Usa users.test.json separado, limpo antes e depois.

## Deploy no Vercel

```bash
npx vercel --prod
```

Ou via GitHub Actions (push para main faz deploy automático).

Nota: O ficheiro de utilizadores é armazenado em /tmp (única pasta writable no Vercel).
