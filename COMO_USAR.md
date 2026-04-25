# Como usar o WhatsApp Sender

## Requisitos

- [Node.js](https://nodejs.org/) instalado (versão 18 ou superior)
- WhatsApp Business no celular
- Google Chrome ou Chromium instalado

---

## Instalação (só na primeira vez)

```bash
cd ~/Documentos/whatsapp-sender
npm install
```

---

## Passo a passo

### 1. Preencher o arquivo `contatos.csv`

Abra o arquivo `contatos.csv` e adicione seus clientes, um por linha:

```
numero,nome,mensagem_extra
5511999990001,João,Sua fatura vence dia 05.
5511999990002,Maria,Sua fatura vence dia 10.
5511999990003,Carlos,Sua fatura vence dia 15.
```

> **Importante:** o número deve conter DDD + número, sem espaços ou caracteres especiais.

---

### 2. Personalizar a mensagem (opcional)

Abra o `index.js` e edite a variável `MENSAGEM_BASE` no topo do arquivo:

```js
const MENSAGEM_BASE = `Olá {{nome}}! 👋

Passando para avisar: {{mensagem_extra}}

Qualquer dúvida, é só responder aqui. 😊`;
```

Variáveis disponíveis:
- `{{nome}}` — substituído pelo nome do contato
- `{{mensagem_extra}}` — substituído pela coluna `mensagem_extra` do CSV

---

### 3. Rodar o script

```bash
npm start
```

**Na primeira vez:**
- Um QR Code aparecerá no terminal
- Abra o WhatsApp Business no celular
- Vá em **Configurações → Aparelhos conectados → Conectar aparelho**
- Escaneie o QR Code

**Nas próximas vezes:**
- A sessão já fica salva automaticamente
- Não precisa escanear o QR Code novamente

---

## O que esperar durante o envio

```
✅ WhatsApp conectado e pronto!
📋 Total de contatos: 100
⏱  Tempo estimado: ~12 minutos

✅ [1/100] Enviado para João (5511999990001)
✅ [2/100] Enviado para Maria (5511999990002)
...
🎉 Concluído! Enviados: 100 | Falhas: 0
```

---

## Configurações avançadas

No topo do `index.js` você pode ajustar:

```js
const DELAY_ENTRE_ENVIOS_MS = 7000; // tempo em ms entre cada mensagem (padrão: 7 segundos)
```

---

## Dicas para evitar bloqueios

- Use o WhatsApp Business (não o pessoal)
- Envie apenas para contatos que já interagiram com você
- Mantenha o delay de pelo menos 5 segundos entre mensagens
- Evite mensagens idênticas para todos — use as variáveis do CSV
- Não envie mais de 200-300 mensagens por dia

---

## Solução de problemas

**QR Code não aparece ou expira:**
```bash
# Delete a pasta de sessão e tente novamente
rm -rf .wwebjs_auth
npm start
```

**Erro ao instalar dependências:**
```bash
npm install --legacy-peer-deps
```

**Número não encontrado:**
- Confirme que o número está correto com DDD
- O contato precisa ter WhatsApp ativo
