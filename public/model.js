const model = {
    produtos: [],
    carrinho: [],

    obterProdutos: async function() {
        try {
            const response = await fetch('http://localhost:3001/produtos');
            if (!response.ok) {
                throw new Error('Erro ao obter produtos do servidor');
            }
            const data = await response.json();
            this.produtos = data;
            console.log("Produtos obtidos do servidor:", data); //testando pq não carregou
            return data;
        } catch (error) {
            console.error(error);
            alert("Erro ao obter produtos. Por favor, tente novamente.");
            return []; 
        }
    },

    obterCarrinho: async () => {
        const response = await fetch('http://localhost:3002/carrinho');
        if (!response.ok) {
            throw new Error('Erro ao obter o carrinho do servidor');
        }
        const data = await response.json();
        this.carrinho = data;
        return data;
    },

    adicionarAoCarrinho: async function(produtoId) {
        try {
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
                this.carrinho = await this.obterCarrinho();
            } else {
                throw new Error('Erro ao adicionar item ao carrinho');
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao adicionar item ao carrinho. Por favor, tente novamente.");
        }
    },

    removerDoCarrinho: async function(index) {
        try {
            const response = await fetch(`http://localhost:3002/carrinho/${index}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.carrinho = await this.obterCarrinho();
            } else {
                throw new Error('Erro ao remover item do carrinho');
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao remover item do carrinho. Por favor, tente novamente.");
        }
    },

    finalizarCompra: async function() {
        if (this.carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        try {
            const response = await fetch('http://localhost:3003/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itens: this.carrinho })
            });

            if (response.ok) {
                const resultado = await response.json();
                alert(resultado.message + '\nValor total: R$ ' + resultado.valorTotal);
                this.carrinho = []; 
                view.renderizarCarrinho(this.carrinho);
            } else {
                const errorData = await response.json();
                alert(`Erro ao finalizar compra: ${errorData.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao finalizar compra. Por favor, tente novamente.");
        } 
    }
};