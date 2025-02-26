const express = require('express');
const axios = require('axios');
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const app = express();
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Configurações do WooCommerce
const api = new WooCommerceRestApi({
  url: 'https://vovolaurapizzaria.online',
  consumerKey: 'ck_d3ee473b8a1f52a895edb89b1029f2fd3f3a16e5',
  consumerSecret: 'cs_ae74795f6481f7128d13b938166944bc37d5f3f9',
  version: 'wc/v3'
});

// Endpoint para receber notificações de novos pedidos
app.post('/webhook', async (req, res) => {
  const order = req.body;
  console.log('Novo pedido recebido:', order);

  // Adicionando logs adicionais para depuração
  console.log('Detalhes do pedido:', JSON.stringify(order, null, 2));

  // Enviar notificação para o servidor local
  try {
    const response = await axios.post('http://192.168.1.100:3000/webhook', order); // Substitua pelo endereço IP do seu servidor local
    console.log('Resposta do servidor local:', response.data);
    res.sendStatus(200);
  } catch (error) {
    console.error('Erro ao enviar notificação para o servidor local:', error.message);
    res.sendStatus(500);
  }
});

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor na Vercel rodando na porta ${PORT}`);
});