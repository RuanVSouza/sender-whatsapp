const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { parse } = require('csv-parse/sync');

// ─────────────────────────────────────────
//  CONFIGURAÇÕES
// ─────────────────────────────────────────
const ARQUIVO_CSV = './contatos.csv';

// Mensagem base — use {{nome}} e {{mensagem_extra}} como variáveis
const MENSAGEM_BASE = `Olá {{nome}}! 👋

Passando para avisar: {{mensagem_extra}}

Qualquer dúvida, é só responder aqui. 😊`;

const DELAY_ENTRE_ENVIOS_MS = 7000; // 7 segundos entre cada mensagem
// ─────────────────────────────────────────

function lerContatos() {
  const conteudo = fs.readFileSync(ARQUIVO_CSV, 'utf-8');
  return parse(conteudo, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

function formatarMensagem(contato) {
  return MENSAGEM_BASE
    .replace(/{{nome}}/g, contato.nome)
    .replace(/{{mensagem_extra}}/g, contato.mensagem_extra || '');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function enviarMensagens(client, contatos) {
  console.log(`\n📋 Total de contatos: ${contatos.length}`);
  console.log(`⏱  Tempo estimado: ~${Math.ceil((contatos.length * DELAY_ENTRE_ENVIOS_MS) / 60000)} minutos\n`);

  let enviados = 0;
  let falhas = 0;

  for (const contato of contatos) {
    const numero = `${contato.numero}@c.us`;
    const mensagem = formatarMensagem(contato);

    try {
      await client.sendMessage(numero, mensagem);
      enviados++;
      console.log(`✅ [${enviados}/${contatos.length}] Enviado para ${contato.nome} (${contato.numero})`);
    } catch (err) {
      falhas++;
      console.error(`❌ Falha ao enviar para ${contato.nome} (${contato.numero}): ${err.message}`);
    }

    if (contatos.indexOf(contato) < contatos.length - 1) {
      await delay(DELAY_ENTRE_ENVIOS_MS);
    }
  }

  console.log(`\n🎉 Concluído! Enviados: ${enviados} | Falhas: ${falhas}`);
}

// ─────────────────────────────────────────
//  INICIALIZAÇÃO
// ─────────────────────────────────────────
const client = new Client({
  authStrategy: new LocalAuth(), // salva a sessão localmente, não precisa escanear QR todo mês
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('qr', (qr) => {
  console.log('\n📱 Escaneie o QR Code abaixo com o WhatsApp Business:\n');
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
  console.log('🔐 Autenticado com sucesso!');
});

client.on('ready', async () => {
  console.log('✅ WhatsApp conectado e pronto!');

  const contatos = lerContatos();

  if (contatos.length === 0) {
    console.log('⚠️  Nenhum contato encontrado no CSV.');
    process.exit(0);
  }

  await enviarMensagens(client, contatos);
  process.exit(0);
});

client.on('auth_failure', () => {
  console.error('❌ Falha na autenticação. Delete a pasta .wwebjs_auth e tente novamente.');
  process.exit(1);
});

client.initialize();
