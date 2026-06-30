#!/usr/bin/env bash
# Instalação da instância da Bia no servidor Linux, AO LADO do responder VNMAX,
# como serviços systemd próprios (processos/portas separados).
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/bia/assistant}"
SERVICE_USER="${SERVICE_USER:-bia}"

echo ">> Instância da Bia em: $APP_DIR (usuário: $SERVICE_USER)"

# 1) Usuário de serviço (sem login)
if ! id "$SERVICE_USER" >/dev/null 2>&1; then
  sudo useradd --system --create-home --shell /usr/sbin/nologin "$SERVICE_USER"
fi

# 2) Dependências
cd "$APP_DIR"
echo ">> npm ci (ou npm install)"
if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# 3) .env e serviceAccount.json devem existir
[ -f .env ] || { echo "!! Falta $APP_DIR/.env (copie de .env.example e preencha NVIDIA_API_KEY etc)."; exit 1; }
[ -f serviceAccount.json ] || echo "!! Aviso: serviceAccount.json ausente — CRM/WhatsApp gravam só no backup local até você adicioná-lo."

sudo chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_DIR"

# 4) systemd units
sudo cp deploy/bia-assistant.service /etc/systemd/system/bia-assistant.service
sudo cp deploy/bia-whatsapp.service /etc/systemd/system/bia-whatsapp.service
sudo sed -i "s#/opt/bia/assistant#${APP_DIR}#g; s#User=bia#User=${SERVICE_USER}#g; s#Group=bia#Group=${SERVICE_USER}#g" \
  /etc/systemd/system/bia-assistant.service /etc/systemd/system/bia-whatsapp.service

sudo systemctl daemon-reload
sudo systemctl enable --now bia-assistant
echo ">> bia-assistant ativo na porta definida no .env (padrão 8788)."

echo ">> Para ativar o WhatsApp (precisa escanear o QR uma vez):"
echo "   sudo -u ${SERVICE_USER} node src/whatsapp.js   # escaneie o QR, Ctrl+C, depois:"
echo "   sudo systemctl enable --now bia-whatsapp && journalctl -u bia-whatsapp -f"

echo ">> Healthcheck: curl -s http://127.0.0.1:\${PORT:-8788}/api/health"
