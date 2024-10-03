const view = {
    renderizarProdutos: (produtos) => {
        const listaProdutosUl = document.getElementById('listaProdutos');
        listaProdutosUl.innerHTML = produtos.map(produto => `
            <li>
                ${produto.nome} - R$ ${produto.preco.toFixed(2)} 
                <button onclick="controller.adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
                console.log("Produtos renderizados na página:", produtos);
            </li>
        `).join('');
    },

    renderizarCarrinho: (itens) => {
        const carrinhoComprasUl = document.getElementById('carrinhoCompras');
        carrinhoComprasUl.innerHTML = itens.map((item, index) => `
            <li>
                ${item.nome} - Quantidade: ${item.quantidade}
                <button onclick="controller.removerDoCarrinho(${index})">Remover</button>
            </li>
        `).join('');
    }
};
