const controller = {
    adicionarAoCarrinho: async (produtoId) => {
        await model.adicionarAoCarrinho(produtoId);
        view.renderizarCarrinho(model.carrinho); 
    },

    removerDoCarrinho: async (index) => {
        await model.removerDoCarrinho(index);
        view.renderizarCarrinho(model.carrinho);
    },

    finalizarCompra: async () => {
        await model.finalizarCompra();
    }
};