# Beatriz Batista · Nutricionista

Site institucional / landing page da nutricionista **Beatriz Batista** (São Paulo e online), com **frontend em React (Vite)** e **backend em Node/Express** para captação de leads do formulário de contato.

## ✨ Recursos

- Landing page responsiva (mobile, tablet e desktop)
- Seções: hero, dores, serviços, como funciona, sobre, depoimentos, contato, FAQ
- Formulário de contato que envia os dados para o backend (`POST /api/leads`)
- Botões e botão flutuante do WhatsApp em todo o site
- API Express que persiste os leads em `server/data/leads.json`

## 📁 Estrutura

```
.
├── client/          # Frontend React + Vite
│   └── src/
│       ├── components/   # Componentes da página
│       ├── config.js     # Dados de contato (edite aqui)
│       └── styles/
├── server/          # Backend Express
│   └── index.js     # API de leads + serve o frontend buildado
└── package.json     # Scripts da raiz
```

## 🚀 Como rodar localmente

Pré-requisitos: **Node.js 18+**.

```bash
# 1. Instalar todas as dependências (raiz, server e client)
npm run install:all

# 2. Rodar frontend + backend juntos (dev)
npm run dev
```

- Frontend (Vite): http://localhost:5173
- Backend (Express): http://localhost:3001
- Em dev o Vite faz proxy de `/api` para o backend automaticamente.

## 🏗️ Build de produção

```bash
npm run build      # gera client/dist
npm start          # Express serve a API + o frontend buildado em http://localhost:3001
```

## ⚙️ Configuração

Edite os dados de contato em [`client/src/config.js`](client/src/config.js):

- `whatsappNumero` — número no formato internacional só com dígitos (ex.: `5511999999999`)
- `crn`, `instagram`, `doctoralia`, `endereco`, etc.

Substitua os textos marcados com `[TROCAR: ...]` (CRN, fotos, depoimentos reais, link do Doctoralia).

### Variáveis de ambiente (backend)

| Variável       | Padrão | Descrição                                            |
| -------------- | ------ | ---------------------------------------------------- |
| `PORT`         | `3001` | Porta do servidor                                    |
| `ADMIN_TOKEN`  | —      | Se definida, protege `GET /api/leads` com `?token=`  |

## 🔌 API

| Método | Rota          | Descrição                            |
| ------ | ------------- | ------------------------------------ |
| GET    | `/api/health` | Healthcheck                          |
| POST   | `/api/leads`  | Recebe um lead (`nome`, `telefone`, `objetivo`, `mensagem`) |
| GET    | `/api/leads`  | Lista os leads (opcionalmente protegido por `ADMIN_TOKEN`) |
