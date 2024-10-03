const express = require('express');
const app = express();
const port = 3001; 
const cors = require('cors'); //importação necessaria devido a erro

app.use(express.static(__dirname));
app.use(express.json());
app.use(cors()); //importação necessaria devido a erro

//como sempre, nosso vetor representando o BD
const produtos = [
    { id: 1, nome: 'Camiseta', preco: 29.90, estoque: 10 },
    { id: 2, nome: 'Calça Jeans', preco: 79.90, estoque: 5 },
    { id: 3, nome: 'Tênis', preco: 129.90, estoque: 3 },
    { id: 4, nome: 'Sapato', preco: 89.90, estoque: 15},
    { id: 5, nome: 'Chapéu', preco: 40.50, estoque: 25}
];

//rota get
app.get('/produtos', (req, res) => {
    res.json(produtos);
});

//rota get com id
app.get('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produto = produtos.find(p => p.id === id);
    if (produto) {
        res.json(produto);
    } else {
        res.status(404).json({ error: 'Produto não encontrado' });
    }
});

//exibe no console a porta
app.listen(port, () => {
    console.log(`Serviço de Catálogo rodando em http://localhost:${port}`);
});