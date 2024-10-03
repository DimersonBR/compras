const express = require('express');
// const fetch = require('node-fetch'); // Importar node-fetch
const app = express();
const port = 3003;
const cors = require('cors'); //necessario devido a erro
app.use(express.static(__dirname));
app.use(express.json());
app.use(cors()); //necessario devido a erro

// Função para calcular o frete (simplificada)
function calcularFrete(valorTotal) {
    if (valorTotal >= 200) {
        return 0; // Frete grátis acima de R$ 200
    } else {
        return 10; // Frete fixo de R$ 10  abaixo de R$ 200
    }
}

app.post('/pedidos', async (req, res) => {
    const pedido = req.body;
    console.log('Pedido recebido:', pedido);

    // Verificar estoque -> consulta o catalogo
    let estoqueSuficiente = true;
    let valorTotal = 0;
    for (const item of pedido.itens) {
        const produtoId = item.id;
        const quantidade = item.quantidade;

        // requisição get no catalogo
        try {
            const response = await fetch(`http://localhost:3001/produtos/${produtoId}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar produto no catálogo');
            }
            const produto = await response.json();

            if (produto.estoque < quantidade) {
                estoqueSuficiente = false;
                break; 
            }

            valorTotal += produto.preco * quantidade;
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao verificar estoque' });
        }
    }

    if (!estoqueSuficiente) {
        return res.status(400).json({ error: 'Estoque insuficiente para alguns itens' });
    }

    // calcular frete
    const frete = calcularFrete(valorTotal);
    valorTotal += frete;

    // simulando o processamento do pedido 
    console.log('Processando pagamento...'),
    

    // Retornar a confirmação do pedido
    res.json({
        message: 'Pedido processado com sucesso!',
        valorTotal: valorTotal.toFixed(2),
        frete: frete.toFixed(2)
    });
});

//porta que esta rodando
app.listen(port, () => {
    console.log(`Serviço de Pedidos rodando em http://localhost:${port}`);
});