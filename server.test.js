// server.test.js — Testes da API (Jest + Supertest). Usa ficheiro users.test.json separado, limpo antes e depois.

// Usa ficheiro de base de dados separado para não poluir dados reais
process.env.DB_PATH = require('path').join(__dirname, 'users.test.json');
process.env.NODE_ENV = 'test';

const fs = require('fs');
try { fs.unlinkSync(process.env.DB_PATH); } catch {}  // Limpa antes dos testes

const request = require("supertest");
const app = require("./server");

// Limpa após todos os testes
afterAll(() => {
    try { fs.unlinkSync(process.env.DB_PATH); } catch {}
});

// Testes de registo
describe("POST /register", () => {
    it("regista um novo utilizador", async () => {
        const res = await request(app)
            .post("/register")
            .send({ nome: "Teste", email: "teste@teste.com", password: "123456" });
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("sucesso");
    });

    it("rejeita registo sem campos obrigatórios", async () => {
        const res = await request(app)
            .post("/register")
            .send({ nome: "", email: "", password: "" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Todos os campos são obrigatórios.");
    });

    it("rejeita email duplicado", async () => {
        await request(app)
            .post("/register")
            .send({ nome: "User1", email: "dup@teste.com", password: "123456" });
        const res = await request(app)
            .post("/register")
            .send({ nome: "User2", email: "dup@teste.com", password: "654321" });
        expect(res.status).toBe(409);
        expect(res.body.message).toBe("Este email já está registado.");
    });
});

// Testes de login
describe("POST /login", () => {
    it("faz login com credenciais corretas", async () => {
        // Primeiro regista, depois faz login
        await request(app)
            .post("/register")
            .send({ nome: "LoginTest", email: "login@teste.com", password: "123456" });
        const res = await request(app)
            .post("/login")
            .send({ email: "login@teste.com", password: "123456" });
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("Bem-vindo");
        expect(res.body.nome).toBe("LoginTest");
    });

    it("rejeita login sem credenciais", async () => {
        const res = await request(app)
            .post("/login")
            .send({ email: "", password: "" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Email e palavra-passe são obrigatórios.");
    });

    it("rejeita login com credenciais erradas", async () => {
        const res = await request(app)
            .post("/login")
            .send({ email: "naoexiste@teste.com", password: "wrong" });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Email ou palavra-passe incorretos.");
    });
});
