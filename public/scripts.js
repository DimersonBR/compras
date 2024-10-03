// array vazio no inicio
let carrinho = [];

// funções para os  microsserviços
const obterProdutos = async () => {
    const response = await fetch('http://localhost:3001/produtos'); 
    const data = await response.json();
    return data;
};

const obterCarrinho = async () => {
    const response = await fetch('http://localhost:3002/carrinho'); 
    const data = await response.json();
    return data;
};

const adicionarAoCarrinho = async (produtoId) => {
    try {
        // detalhes dos produtos ao adicionar ao carrinho
        const productResponse = await fetch(`http://localhost:3001/produtos/${produtoId}`);
        if (!productResponse.ok) {
            throw new Error('Erro ao buscar detalhes do produto');
        }
        const produto = await productResponse.json();

        const response = await fetch(`http://localhost:3002/carrinho`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: produtoId, nome: produto.nome, quantidade: 1 })
        });

        if (response.ok) {
            carrinho = await obterCarrinho();
            renderizarCarrinho(carrinho);
        } else {
            throw new Error('Erro ao adicionar item ao carrinho');
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao adicionar item ao carrinho. Por favor, tente novamente.");
    }
};

const removerDoCarrinho = async (index) => {
    try {
        const response = await fetch(`http://localhost:3002/carrinho/${index}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // atualiza o carrinho na página após remover o item
            carrinho = await obterCarrinho();
            renderizarCarrinho(carrinho);
        } else {
            throw new Error('Erro ao remover item do carrinho');
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao remover item do carrinho. Por favor, tente novamente.");
    }
};

const finalizarCompra = async () => {
    // const -> let
    let carrinhoAtual = await obterCarrinho();
    if (carrinhoAtual.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    try {
        const response = await fetch('http://localhost:3003/pedidos', { // serviço de pedidos
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itens: carrinhoAtual })
        });

        if (response.ok) {
            const resultado = await response.json();
            alert(resultado.message + '\nValor total: R$ ' + resultado.valorTotal);
            const clearResponse = await fetch('http://localhost:3002/carrinho', {
                method: 'DELETE'
            });

            if (clearResponse.ok) {
                console.log("TESTEE");
            } 

            carrinho = []; // limpa o carrinho após a compra
            renderizarCarrinho(carrinho);
        } else {
            const errorData = await response.json();
            alert(`Erro ao finalizar compra: ${errorData.error}`);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao finalizar compra. Por favor, tente novamente.");
    }
};
     // renderiza catalogo e carrinho
     function renderizarProdutos(produtos) {
        const listaProdutosUl = document.getElementById('listaProdutos');
        listaProdutosUl.innerHTML = produtos.map(produto => `
            <li>
                ${produto.nome} - R$ ${produto.preco.toFixed(2)} 
                <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
            </li>
        `).join('');
    }

    function renderizarCarrinho(itens) {
        const carrinhoComprasUl = document.getElementById('carrinhoCompras');
        if (!carrinhoComprasUl) {
            console.error('Elemento carrinhoCompras não encontrado');
            return;
        }
    
        if (itens.length === 0) {
            carrinhoComprasUl.innerHTML = '<li>Carrinho está vazio !</li>';
        } else {
            carrinhoComprasUl.innerHTML = itens.map((item, index) => `
                <li>
                    ${item.nome} - Quantidade: ${item.quantidade}
                    <button onclick="removerDoCarrinho(${index})">Remover</button>
                </li>
            `).join('');
        }
    }

    // carrega tela inicial e carrinho
    window.onload = async () => {
        try {
            const produtos = await obterProdutos();
            renderizarProdutos(produtos);

            carrinho = await obterCarrinho(); 
            renderizarCarrinho(carrinho);
        } catch (error) {
            console.error(error);
        }
    };

    // evento ao botão
    document.getElementById('finalizarCompraBtn').addEventListener('click', finalizarCompra);