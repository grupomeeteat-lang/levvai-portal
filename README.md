# Instituto Levvai — Plataforma de Gestão

## Deploy na Vercel

### Opção 1: Via GitHub (recomendado)
1. Crie um repositório no GitHub
2. Suba os arquivos deste projeto
3. Acesse [vercel.com](https://vercel.com) e faça login
4. Clique "Add New Project"
5. Importe o repositório do GitHub
6. Framework: **Vite** (detecta automaticamente)
7. Clique "Deploy"
8. Pronto! URL gerada automaticamente

### Opção 2: Via CLI
```bash
npm install -g vercel
cd levvai-vercel
npm install
vercel
```

### Desenvolvimento local
```bash
npm install
npm run dev
```
Acesse http://localhost:5173

## Estrutura
```
levvai-vercel/
├── index.html          ← entrada HTML
├── package.json        ← dependências
├── vite.config.js      ← config do Vite
├── public/             ← arquivos estáticos
└── src/
    ├── main.jsx        ← bootstrap React
    └── App.jsx         ← Portal Levvai (15 abas)
```
