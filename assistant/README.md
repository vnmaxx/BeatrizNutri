# Bia Assistant + CRM (instância isolada)

Instância **separada** (processo/porta próprios) do responder VNMAX, para a nutricionista **Beatriz Batista**. Reúne:

- **Assistente de IA** (NVIDIA NIM, OpenAI-compatible) que atende no **site** e no **WhatsApp**, tira dúvidas e **agenda consultas**.
- **Captação de leads** → grava no **Firestore** (alimenta o CRM) + backup local em `data/leads.jsonl`.
- **Bot de WhatsApp** (Baileys) com sessão própria, que entrega/agenda no **mesmo CRM**.

> ⚠️ **Instância separada de propósito.** Usa a MESMA chave/endpoint da NVIDIA que o servidor Linux já usa, mas roda como serviço próprio (porta padrão **8788**, vs. 8787 do VNMAX) e sessão de WhatsApp própria — não interfere no serviço de respostas existente.

## Estrutura

```
assistant/
├── src/
│   ├── server.js        # HTTP: /api/chat, /api/contact, /api/health
│   ├── assistant.js     # núcleo: loop NVIDIA + tools (reuso site + WhatsApp)
│   ├── nvidia.js        # cliente NVIDIA NIM
│   ├── prompt.js        # system prompt (nutrição, sem diagnóstico)
│   ├── tools.js         # registrar_contato / agendar_consulta
│   ├── leads.js         # saveLead -> Firestore + backup local
│   ├── whatsapp.js      # bot Baileys (instância isolada)
│   ├── auth.js          # verifica ID token + allowlist (se usar endpoints privados)
│   └── firebase-admin.js
├── deploy/              # systemd units + install.sh
├── .env.example
└── serviceAccount.json  # (você adiciona; gitignorado)
```

## Configuração

1. `cp .env.example .env` e preencha:
   - `NVIDIA_API_KEY` — a MESMA do servidor Linux.
   - `ALLOWED_ORIGINS` — domínios do site (ex.: `https://beatriz-nutri-iota.vercel.app,https://beatrizbatista.com.br`).
   - `PORT` — padrão `8788`.
2. Coloque o `serviceAccount.json` do Firebase em `assistant/` (ou use `FIREBASE_SERVICE_ACCOUNT`).
3. `npm install`

## Rodar

```bash
npm start          # servidor HTTP (site)
npm run whatsapp   # bot de WhatsApp (escaneie o QR uma vez)
```

## Deploy no Linux (ao lado do VNMAX)

```bash
sudo APP_DIR=/opt/bia/assistant bash deploy/install.sh
```

Sobe `bia-assistant` (HTTP) como serviço systemd. Para o WhatsApp, rode uma vez em foreground para escanear o QR e depois habilite `bia-whatsapp`. Coloque um proxy reverso (nginx/caddy) com HTTPS na frente e use essa URL pública em `VITE_CHAT_API_URL` no frontend.

## Endpoints

| Método | Rota           | Uso                                   |
| ------ | -------------- | ------------------------------------- |
| GET    | `/api/health`  | Healthcheck                           |
| POST   | `/api/chat`    | Chat do site (`{ messages: [...] }`)  |
| POST   | `/api/contact` | Formulário (`{ nome, whatsapp/email, objetivo, mensagem }`) |

## Trocar a stack de WhatsApp

`whatsapp.js` usa **Baileys**. Se o seu responder atual usa outra lib (whatsapp-web.js, venom, wppconnect, Meta Cloud API), troque **apenas a camada de conexão** — o miolo é `gerarResposta()` (de `assistant.js`) + `saveLead()` (de `leads.js`), idêntico para qualquer canal. Basta, ao receber uma mensagem, chamar `gerarResposta(history, { origem: 'whatsapp', canal: 'whatsapp', whatsappId: numero })` e enviar `reply`.
