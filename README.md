# Instituto Levvai — Plataforma de Gestão

Portal interno de gestão da clínica de estética Instituto Levvai.

> **Para contexto completo do projeto, leia o [CLAUDE.md](./CLAUDE.md)**

## Setup rápido

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build de produção
```

## Deploy

Push para `main` → Vercel auto-deploya em ~1 minuto.

```bash
git add .
git commit -m "descrição"
git push origin main
```

## Variáveis de ambiente

Crie `.env.local` na raiz:
```
VITE_SUPABASE_URL=https://wlkshbycdtgvyabcolmd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsa3NoYnljZHRndnlhYmNvbG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTYzMjQsImV4cCI6MjA4OTQzMjMyNH0.D5yN7ECOmQ5KA9zmuslaJKrW_ODmp-FiGvlx8MnYMRg
```

Variáveis adicionais configuradas no painel da Vercel:
- `SUPABASE_SERVICE_ROLE_KEY`
- `META_ACCESS_TOKEN`
- `INSTAGRAM_USER_ID`

## Stack

- React + Vite
- Supabase (Auth + PostgreSQL)
- Vercel (deploy + serverless functions)

## Estrutura
```
├── api/           ← serverless functions (crm, instagram, admin-users)
├── src/
│   ├── App.jsx    ← portal completo
│   ├── supabase.js
│   └── components/
└── supabase/migrations/   ← SQL das tabelas
```
