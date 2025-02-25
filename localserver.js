const express = require('express');
const { print } = require('pdf-to-printer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Função para criar PDF com os detalhes do pedido
const createOrderPdf = (order) => {
  const orderDetails = `
    Pedido #${order.id}
    Cliente: ${order.billing.first_name} ${order.billing.last_name}
    Produtos:
    ${order.line_items.map(item => `- ${item.name} x ${item.quantity}`).join('\n')}
    Total: ${order.total}
  `;

  const filePath = path.join(__dirname, `pedido-${order.id}.pdf`);
  fs.writeFileSync(filePath, orderDetails);
  return filePath;
};

// Função para imprimir pedido
const printOrder = async (order) => {
  try {
    const pdfPath = createOrderPdf(order);
    await print(pdfPath);
    fs.unlinkSync(pdfPath); // Remove o arquivo PDF temporário
    console.log(`Pedido #${order.id} enviado para impressão com sucesso.`);
  } catch (error) {
    console.error(`Erro ao processar pedido #${order.id}:`, error);
  }
};

// Endpoint para receber notificações de novos pedidos
app.post('/webhook', async (req, res) => {
  const order = req.body;
  console.log('Novo pedido recebido:', order);
  await printOrder(order);
  res.sendStatus(200);
});

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor local rodando na porta ${PORT}`);
});