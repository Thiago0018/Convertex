# Convertex — Front-End

Interface web para a plataforma Convertex. Suporta upload de imagens por drag-and-drop, seleção de formatos de exportação, histórico de arquivos recentes em memória e edição do texto extraído pelo OCR antes de baixar.

## Tech Stack

* Core: React 19, TypeScript e Vite
* Estilização: Tailwind CSS v4
* Roteamento: React Router DOM v7
* Cliente HTTP: Axios
* Notificações: React Hot Toast

## Estrutura de Arquivos

```text
src/
├── components/         # Layouts, modais e componentes visuais
├── hooks/              # Custom hooks (useOcr, useImageConversion)
├── pages/              # Telas (Home, ConversionPage)
├── routes/             # Definição de rotas da aplicação
└── services/           # Integração com a API REST
```

## Executando o Front-End

1. Instale os pacotes:
```bash
npm install
```

2. Defina a variável de ambiente criando o arquivo `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
Abra `http://localhost:5173` no navegador.