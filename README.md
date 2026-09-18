# Convertex

O Convertex é uma aplicação web para conversão de formatos de imagens e extração de texto via OCR (Optical Character Recognition) em memória. O sistema permite processar arquivos rapidamente sem persistência de dados em disco.

<h2 align="center">🎥 Demonstração da Aplicação</h2>

<div align="center">
  <video src="https://convertex-api-one.vercel.app/assets/Convertex-demo.mp4" controls="controls" style="max-width: 100%; border-radius: 12px;">
    Seu navegador não suporta a reprodução deste vídeo.
  </video>
</div>

## Estrutura do Repositório

* `Convertex-API/`: API RESTful em .NET 10.
* `Convertex-API.Tests/`: Testes automatizados de unidade e integração.
* `Convertex-Front-End/`: Interface de usuário em React 19, TypeScript e Vite.

## Pré-requisitos Nativos

* .NET 10 SDK
* Node.js 18+

## Como Executar o Projeto

### 1. API (.NET)

```bash
cd Convertex-API
dotnet run
```
A API será iniciada em `http://localhost:5000`. A documentação interativa estará disponível em `http://localhost:5000/scalar/v1`.

### 2. Testes da API

```bash
cd Convertex-API.Tests
dotnet test
```

### 3. Front-End (React)

```bash
cd Convertex-Front-End
npm install
npm run dev
```
A aplicação web estará acessível em `http://localhost:5173`.

### Minhas Redes
LinkedIn: `https://www.linkedin.com/in/thiago-souza0018/`\
Site: `https://shre.ink/Tz-web-Site`