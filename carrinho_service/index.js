const express = require('express');
const app = express();
const port = 3002; 
const cors = require('cors'); //foi necessario devido a erro

app.use(express.static(__dirname));
app.use(express.json());
app.use(cors()); //foi necessario devido a erro

let carrinho = []; // //como sempre, nosso vetor representando o BD


//rota get
app.get('/carrinho', (req, res) => {
    res.json(carrinho);
});


//rota post
/*app.post('/carrinho', (req, res) => {
    const item = req.body;
    let found = false;

    // Verificar se o item já existe no carrinho
    for (let i = 0; i < carrinho.length; i++) {
        if (carrinho[i].id === item.id) {
            carrinho[i].quantidade += item.quantidade; // Atualizar a quantidade
            found = true;
            break;
        }
    }

    // Se não encontrado, adicionar novo item
    if (!found) {
        carrinho.push(item);
    }

    res.status(201).json(carrinho);
});*/

app.post('/carrinho', (req, res) => {
    const item = req.body;
    // checa se o item está no carrinho
    const itemNoCarrinho = carrinho.find(produto => produto.id === item.id);

    if (itemNoCarrinho) {
        // Se o item já estiver no carrinho, aumenta a quantidade
        itemNoCarrinho.quantidade += 1;
    }
    else{
        // Senão, adiciona ao carrinho
        carrinho.push(item);
    }
    res.status(201).json(item);
});

// Rota DELETE para remover um item do carrinho de um em um
app.delete('/carrinho/:index', (req, res) => {
    const index = parseInt(req.params.index);
 
    // Verifica se o índice está dentro do limite do array
    if (index >= 0 && index < carrinho.length) {
        const item = carrinho[index];
 
        if (item.quantidade === 1) {
            // Se a quantidade for 1, remove o item do carrinho
            carrinho.splice(index, 1);
            res.sendStatus(204);
        } else {
            // Se a quantidade for maior que 1, diminui a quantidade em 1
            item.quantidade -= 1;
            res.status(200).json({ mensagem: 'Quantidade do item reduzida em 1', item });
        }
    } else {
        res.status(404).json({ error: 'Item não encontrado no carrinho' });
    }
    console.log(carrinho);
});

// ???
app.delete('/carrinho', (req, res) =>{
    carrinho.length = 0;
    res.sendStatus(204);
})

//exibe porta que esta rodando
app.listen(port, () => {
    console.log(`Serviço de Carrinho rodando em http://localhost:${port}`);
});