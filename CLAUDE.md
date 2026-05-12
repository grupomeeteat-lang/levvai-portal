# CLAUDE.md — Contexto completo do projeto levvai-portal

Este arquivo existe para que o Claude Code (e qualquer instância do Claude) saiba exatamente onde o projeto está, o que já foi feito, e como continuar sem perder contexto.

---

## 1. VISÃO GERAL DO PROJETO

**Nome:** Instituto Levvai — Plataforma de Gestão Interna  
**Repositório:** github.com/grupomeeteat-lang/levvai-portal  
**Deploy:** Vercel (auto-deploy no push para `main`)  
**URL produção:** levvai-portal.vercel.app  
**Conta Vercel:** grupomeeteat-3433s  
**Dev local:** http://localhost:5173  

**O que é:** Portal web interno de gestão da clínica de estética Instituto Levvai (Vila Olímpia, SP). Usado pela equipe para CRM, agenda, financeiro, estoque, marketing, jurídico e governança.

**Proprietária:** Lara (Diretora Clínica)  
**CEO/admin:** Ike Guimarães (ikeguimaraes@gmail.com)  
**Co-admin:** Ricardo/Rich (grupomeeteat@gmail.com)  

---

## 2. STACK TÉCNICA

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React + Vite |
| Estilo | CSS inline (design system próprio) + `levvai-design-system.css` |
| Auth | Supabase Auth (email + senha) |
| Banco de dados | Supabase (PostgreSQL) |
| Deploy | Vercel (Hobby plan) |
| Serverless | `/api/*.js` (Vercel Functions) |
| Repositório | GitHub (`grupomeeteat-lang/levvai-portal`) |

**Versões:**
- Vite v5.4.21
- React 18
- @supabase/supabase-js

**Dev local:**
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de produção
```

**Deploy:**
```bash
git add .
git commit -m "descrição"
git push origin main   # Vercel auto-deploya em ~1 min
```

**Git identity configurada:** `grupomeeteat@gmail.com` / `Henrique Guimaraes`  
(obrigatório para não bloquear deploys no Vercel Hobby)

---

## 3. VARIÁVEIS DE AMBIENTE

Configuradas no painel da Vercel (Settings → Environment Variables):

| Variável | Descrição |
|----------|-----------|
| `VITE_SUPABASE_URL` | https://wlkshbycdtgvyabcolmd.supabase.co |
| `VITE_SUPABASE_ANON_KEY` | chave pública do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | chave admin do Supabase (sensível) |
| `META_ACCESS_TOKEN` | token da Meta Graph API (Instagram) |
| `INSTAGRAM_USER_ID` | 17841472231421137 (@institutolevvai) |

**Arquivo local:** `.env.local` (não comitar — já no .gitignore)
```
VITE_SUPABASE_URL=https://wlkshbycdtgvyabcolmd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsa3NoYnljZHRndnlhYmNvbG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTYzMjQsImV4cCI6MjA4OTQzMjMyNH0.D5yN7ECOmQ5KA9zmuslaJKrW_ODmp-FiGvlx8MnYMRg
```

---

## 4. ESTRUTURA DE ARQUIVOS
```
levvai-portal/
├── CLAUDE.md                    ← este arquivo
├── README.md                    ← documentação básica
├── index.html                   ← entrada HTML
├── package.json
├── vite.config.js
├── .env.local                   ← variáveis locais (não commitar)
├── api/
│   ├── instagram.js             ← Meta Graph API v25.0
│   ├── admin-users.js           ← gestão de usuários Supabase Auth
│   └── crm.js                   ← CRUD completo do CRM
├── src/
│   ├── main.jsx                 ← bootstrap React
│   ├── supabase.js              ← cliente Supabase (anon key)
│   ├── App.jsx                  ← portal completo (~6000 linhas)
│   ├── levvai-design-system.css ← design tokens
│   └── components/
│       └── layout/
│           ├── AppShell.jsx     ← shell com sidebar
│           ├── Sidebar.jsx      ← navegação lateral
│           └── Topbar.jsx       ← barra superior
├── supabase/
│   └── migrations/
│       ├── crm.sql              ← tabelas CRM v1
│       └── crm_v2.sql           ← colunas de pagamento + tabela produtos
└── public/
```

---

## 5. AUTENTICAÇÃO

- **Provider:** Supabase Auth (email + senha)
- **Sessão:** persistente via `getSession` + `onAuthStateChange`
- **Client:** `src/supabase.js` usa `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- **Admin API:** `/api/admin-users.js` usa `SUPABASE_SERVICE_ROLE_KEY`

**Admin Masters** (podem resetar senhas, editar e-mails, gerenciar usuários):
- `ikeguimaraes@gmail.com` — Ike (CEO)
- `grupomeeteat@gmail.com` — Ricardo (Conselheiro)

**Outros usuários:** lara@, sirlandia@, sylmara@, gi@, admin@ (todos @institutolevvai.com.br)

**`userProfiles`** no App.jsx mapeia email → { name, role, color }. Admin Masters têm cargo fixo "CEO — Admin Master" que não pode ser alterado pela UI.

---

## 6. BANCO DE DADOS SUPABASE

**Projeto:** wlkshbycdtgvyabcolmd.supabase.co  
**Todas as tabelas têm RLS habilitado com policy `allow all` (auth feita no portal).**

### Tabelas existentes:

#### `pacientes`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid PK | auto gerado |
| created_at | timestamptz | |
| nome | text NOT NULL | |
| email | text | |
| telefone | text | |
| cpf | text | |
| data_nascimento | text | |
| sexo | text | |
| indicado_por | text | |
| origem | text | default 'Instagram' |
| status | text | lead/contato/agendado/atendido/retorno/fidelizado/perdido |
| foto_url | text | |
| observacoes_gerais | text | |
| updated_at | timestamptz | atualizado no PATCH |

#### `tratamentos`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid PK | |
| paciente_id | uuid FK → pacientes | cascade delete |
| data | date NOT NULL | |
| procedimento | text NOT NULL | |
| produto | text | |
| regiao | text | |
| sessao | int | default 1 |
| total_sessoes | int | default 1 |
| inicio_execucao | text | |
| fim_execucao | text | |
| status | text | pendente/em_andamento/finalizado/cancelado |
| profissional | text | |
| valor | numeric | |
| observacoes | text | |
| forma_pagamento | text | pix/dinheiro/débito/crédito Nx/transferência/cortesia |
| status_pagamento | text | pendente/pago/parcial/isento |
| data_pagamento | date | |
| parcelas | int | default 1 |

#### `prontuarios`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid PK | |
| paciente_id | uuid FK → pacientes | |
| data | date NOT NULL | |
| titulo | text NOT NULL | |
| conteudo | text | |
| profissional | text | |
| arquivos | text[] | |

#### `propostas`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid PK | |
| paciente_id | uuid FK → pacientes | |
| data | date NOT NULL | |
| titulo | text | |
| itens | jsonb | array de { id, nome, preco, custo, qty } |
| valor_total | numeric | |
| desconto | numeric | default 0 |
| parcelas | int | default 1 |
| status | text | rascunho/enviada/aprovada/recusada |
| observacoes | text | |

#### `observacoes`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid PK | |
| paciente_id | uuid FK → pacientes | |
| data | date NOT NULL | |
| conteudo | text NOT NULL | |
| autor | text | |
| tipo | text | geral/clínico/comercial/financeiro/alerta |

#### `produtos`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid PK | |
| tipo | text | Protocolo/Produto |
| cat | text | Toxina/Preenchedor/Bioestimulador/etc |
| nome | text NOT NULL | |
| protocolo | text | nome do protocolo proprietário |
| regiao | text | |
| custo_un | numeric | custo unitário |
| preco_sugerido | numeric | preço de venda |
| estoque | int | |
| estoque_min | int | default 3 |
| obs | text | |
| ativo | boolean | default true (soft delete) |

**14 produtos inseridos:** Botox, Evo H, Evo S, Radiesse, Biogelis, Juvederm Volbella, Restylane Kysse, Profhilo, Mesohyal Redenx, Bioflash NCTC-109, Fios de PDO, Kit Exomine, Kit PRP, Tirzepatida.

---

## 7. SERVERLESS APIs (`/api/`)

### `api/crm.js`
**CRUD completo via query params:**
- `GET /api/crm?resource=pacientes` — lista todos
- `GET /api/crm?resource=pacientes&id=UUID` — busca um
- `POST /api/crm?resource=pacientes` — cria
- `PATCH /api/crm?resource=pacientes&id=UUID` — atualiza
- `DELETE /api/crm?resource=pacientes&id=UUID` — deleta
- `GET /api/crm?resource=produtos` — lista produtos ativos
- `GET /api/crm?resource=tratamentos&paciente_id=UUID` — sub-recursos por paciente
- Mesma lógica para: `prontuarios`, `propostas`, `observacoes`

### `api/admin-users.js`
Usa `SUPABASE_SERVICE_ROLE_KEY`:
- `GET` — lista todos os usuários Auth
- `POST { email, password, nome, cargo }` — cria usuário
- `PATCH { userId, nome, cargo, password?, email?, foto? }` — atualiza
- `DELETE { userId }` — remove

### `api/instagram.js`
- `GET` — busca dados do @institutolevvai via Meta Graph API v25.0
- Token expira a cada 60 dias — renovar no Meta Graph API Explorer

---

## 8. DESIGN SYSTEM

**Paleta:**
```js
const GOLD = "#C8A96E"      // dourado — cor principal de destaque
const DARK = "#1A1A1A"      // fundo dark, headers
const LIGHT = "#F5F0E8"     // fundo claro, cards secundários
const BG = "#FAFAF8"        // fundo geral da página
```

**Fontes:** Instrument Serif (display), DM Sans (body), DM Mono (técnico)  
**Border radius padrão:** 8-12px  
**Sombra cards:** `0 1px 3px rgba(0,0,0,0.04)`

**Componentes base no App.jsx:**
- `<Card>` — container padrão com título
- `<Metric>` — KPI display
- `<Badge>` — pill colorido
- `<TableRow>` — linha de tabela
- `<PersonCard>` — card de pessoa da equipe

---

## 9. NAVEGAÇÃO / TABS

O portal usa sidebar vertical com 29 abas em 9 setores:

| Setor | Abas |
|-------|------|
| Estratégia | Visão Geral, Planejamento, Dashboard CEO |
| Cultura & Governança | Cultura, Atas & Ações |
| Financeiro | DRE & Catálogo, Fluxo de Caixa, Orçamento |
| Comercial | CRM & Leads, Comunicação, Jornada Paciente, NPS |
| Marketing | Marca, ICP, Editorial, Dashboard Mkt, Concorrentes |
| Pessoas | Equipe, Associados, 1:1s, Avaliação |
| Operação | Agenda, Estoque, Rotinas, Fornecedores |
| Jurídico | Compliance, Contratos |
| Docs | Documentos, Usuários |

**Mapeamento IDs:** `NEW_TO_OLD_ID` (novo ID sidebar → ID componente)  
**Mapeamento inverso:** `OLD_TO_NEW_ID` (usado no `navigateTo`)  
**Breadcrumb:** `TAB_TO_SECTOR` (ID → { sector, label })

---

## 10. CRM — FUNCIONAMENTO

### CRMTab
- Lista pacientes do Supabase (`/api/crm?resource=pacientes`)
- Funil de filtros por status (lead/contato/agendado/atendido/retorno/fidelizado/perdido)
- Busca por nome, telefone, e-mail
- Clique abre `FichaPaciente` (modal fullscreen)

### FichaPaciente (modal)
5 abas internas:
1. **Sobre** — dados cadastrais, edição inline
2. **Tratamentos** — lista com status de tratamento + status de pagamento inline editável, totais financeiros, botão 📅 Google Calendar
3. **Prontuário** — registros clínicos por data
4. **Propostas** — orçamentos com itens do catálogo (produtos do Supabase), cálculo de desconto/parcelas, botão imprimir/PDF
5. **Observações** — anotações por tipo (geral/clínico/comercial/financeiro/alerta)

### Google Calendar (Opção B — link direto)
Botão 📅 em cada tratamento gera link `calendar.google.com/calendar/render?action=TEMPLATE&...` com nome do paciente, procedimento, data, hora e localização preenchidos.

---

## 11. AGENDA

- Grade visual semana × salas (Sala da Lara, Sala Associados, Consultório, Soroterapia)
- Navegação por semana com datas reais
- Agendamento inline clicando no slot
- Botão 📅 Google Calendar em cada slot agendado
- Slots sincronizados com CRM via `shared.slots`

---

## 12. INSTAGRAM INTEGRATION

- App Meta: `LEVVAI_PORTAL` no Business Manager Meet & Eat
- Facebook Page ID: `818979271308603`
- Instagram ID: `17841472231421137` (@institutolevvai)
- Serverless: `/api/instagram.js`
- Auto-refresh a cada 5 min no Dashboard Marketing
- **Token expira a cada 60 dias** — renovar no Meta Graph API Explorer com o app LEVVAI_PORTAL

---

## 13. GESTÃO DE USUÁRIOS

Aba **Docs → Usuários** no portal:
- Lista todos os usuários Supabase Auth com nome, e-mail, cargo, status
- Clique abre painel lateral com edição de nome, cargo, e-mail (admin master), senha (admin master), foto
- Admin Masters têm cargo fixo "CEO — Admin Master" (não editável pela UI)
- Apenas Admin Masters veem campo de senha e e-mail editáveis
- Apenas Admin Masters veem botão "Adicionar usuário"
- Non-admin masters veem aviso de bloqueio no campo senha

**Cargos disponíveis:** CEO — Admin Master, Dir. Clínica, Ger. Operacional, Administradora, Social Media, Conselheiro, Associado, Visualizador

---

## 14. PADRÕES DE CÓDIGO IMPORTANTES

### Nunca fazer:
- Não usar `localStorage` ou `sessionStorage` (não funciona no ambiente)
- Não mudar o git identity (deve ser `grupomeeteat@gmail.com`)
- Não fazer deploy manual via `vercel --prod` — sempre via git push
- Não modificar outros arquivos além dos especificados nas tarefas

### SVG / gráficos:
- SVG line charts precisam de `style={{ background: 'transparent' }}` no elemento SVG
- `<path>` de área deve usar `fill={\`url(#${gradientId})\`}` — não `fill="black"`

### Ao entregar código:
- Sempre usar marcadores `===== INICIO ARQUIVO =====` / `===== FIM ARQUIVO =====` para arquivos completos
- Nunca adaptar, nunca reinterpretar — copiar literalmente quando instruído

### Build:
- Warning de chunk size (>500KB) é normal — não é erro, pode ignorar
- `npm run build` deve terminar com `✓ built in Xs`

---

## 15. HISTÓRICO DE DECISÕES

| Data | Decisão |
|------|---------|
| Abr/2026 | Auth migrado de hardcoded → Supabase Auth com sessão persistente |
| Abr/2026 | Sidebar vertical substituiu tabs horizontais (29 abas inutilizáveis) |
| Abr/2026 | CRM migrado de estado local → Supabase (5 tabelas) |
| Abr/2026 | Google Calendar: Opção B (link direto) em vez de API completa |
| Abr/2026 | Produtos do catálogo salvos no Supabase (tabela `produtos`) |
| Abr/2026 | Admin Masters definidos por array de e-mails hardcoded (não por role no DB) |

---

## 16. PRÓXIMOS PASSOS CONHECIDOS

- [ ] Botão 📅 da AgendaTab ainda não visível — verificar posicionamento no slot
- [ ] Sincronização bidirecional com Google Calendar (Opção C futura)
- [ ] Token Instagram expira periodicamente — criar lembrete de renovação
- [ ] Estoque do portal ainda usa estado local — migrar para Supabase (`produtos`)
- [ ] DRE e financeiro ainda usam dados mockados — conectar ao Supabase

---

## 17. CONTATOS E ACESSOS

| Recurso | Info |
|---------|------|
| GitHub org | grupomeeteat-lang |
| Vercel account | grupomeeteat-3433s |
| Supabase project | wlkshbycdtgvyabcolmd |
| Instagram | @institutolevvai (ID: 17841472231421137) |
| Facebook Page | ID: 818979271308603 |
| Endereço clínica | Rua do Rocio, 288, cj 93 — Vila Olímpia, SP |
| WhatsApp clínica | (11) 97821-2800 |
