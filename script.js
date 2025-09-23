// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos principais do DOM
    const form = document.getElementById('add-item-form');
    const produtoInput = document.getElementById('produto-input');
    const quantidadeInput = document.getElementById('quantidade-input');
    const categoriaInput = document.getElementById('categoria-input');
    const accordionContainer = document.getElementById('accordionCategorias');
    const listaVaziaMsg = document.getElementById('lista-vazia-msg');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');

    // --- Gerenciamento de Dados com localStorage ---

    // Função para buscar os itens do localStorage
    const getItems = () => {
        const items = localStorage.getItem('listaDeCompras');
        return items ? JSON.parse(items) : [];
    };

    // Função para salvar os itens no localStorage
    const saveItems = (items) => {
        localStorage.setItem('listaDeCompras', JSON.stringify(items));
    };

    // --- Lógica de Renderização ---

    // Função principal que desenha a lista na tela
    const renderItems = () => {
        const items = getItems();
        accordionContainer.innerHTML = ''; // Limpa a lista atual

        if (items.length === 0) {
            listaVaziaMsg.classList.remove('d-none'); // Mostra a mensagem de lista vazia
            return;
        }
        listaVaziaMsg.classList.add('d-none'); // Esconde a mensagem

        // Agrupa os itens por categoria (equivalente ao defaultdict do Python)
        const itensAgrupados = items.reduce((acc, item) => {
            (acc[item.categoria] = acc[item.categoria] || []).push(item);
            return acc;
        }, {});

        // Ordena as categorias alfabeticamente
        const categoriasOrdenadas = Object.keys(itensAgrupados).sort();

        // Cria o HTML para cada categoria e seus itens
        categoriasOrdenadas.forEach((categoria, index) => {
            const itensHtml = itensAgrupados[categoria]
                .sort((a, b) => a.pego - b.pego) // Itens não pegos primeiro
                .map(item => `
                    <li class="list-group-item d-flex justify-content-between align-items-center item ${item.pego ? 'item-pego' : ''}" data-id="${item.id}">
                        <div class="form-check">
                            <input class="form-check-input toggle-check" type="checkbox" id="item-${item.id}" ${item.pego ? 'checked' : ''}>
                            <label class="form-check-label" for="item-${item.id}">
                                <span>${item.quantidade}x ${item.produto}</span>
                            </label>
                        </div>
                        <button class="btn btn-sm btn-outline-danger delete-btn">
                            <i class="bi bi-trash"></i>
                        </button>
                    </li>
                `).join('');

            const accordionItemHtml = `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading-${index}">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${index}" aria-expanded="true" aria-controls="collapse-${index}">
                            ${categoria}
                        </button>
                    </h2>
                    <div id="collapse-${index}" class="accordion-collapse collapse show" aria-labelledby="heading-${index}">
                        <div class="accordion-body p-0">
                            <ul class="list-group list-group-flush">${itensHtml}</ul>
                        </div>
                    </div>
                </div>
            `;
            accordionContainer.innerHTML += accordionItemHtml;
        });
    };

    // --- Event Listeners (Interações do Usuário) ---

    // Adicionar um novo item
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        const produto = produtoInput.value.trim();
        if (!produto) return;

        const novoItem = {
            id: Date.now(), // Gera um ID único baseado no tempo
            produto: produto,
            quantidade: parseInt(quantidadeInput.value),
            categoria: categoriaInput.value,
            pego: false
        };

        const items = getItems();
        items.push(novoItem);
        saveItems(items);
        renderItems();

        form.reset(); // Limpa o formulário
        categoriaInput.value = novoItem.categoria; // Mantém a última categoria selecionada
        produtoInput.focus();
    });

    // Marcar/Desmarcar ou Deletar um item (usando delegação de eventos)
    accordionContainer.addEventListener('click', (e) => {
        const target = e.target;
        const itemLi = target.closest('.item');
        if (!itemLi) return;

        const itemId = parseInt(itemLi.dataset.id);
        let items = getItems();

        // Ação: Marcar/Desmarcar
        if (target.classList.contains('toggle-check')) {
            const item = items.find(i => i.id === itemId);
            if (item) {
                item.pego = !item.pego;
                saveItems(items);
                renderItems(); // Re-renderiza para atualizar a classe e a ordem
            }
        }

        // Ação: Deletar
        if (target.closest('.delete-btn')) {
            if (confirm('Tem certeza que deseja remover este item?')) {
                items = items.filter(i => i.id !== itemId);
                saveItems(items);
                renderItems();
            }
        }
    });

    // Limpar itens concluídos
    clearCompletedBtn.addEventListener('click', () => {
        if (confirm('Isso removerá todos os itens marcados. Continuar?')) {
            let items = getItems();
            items = items.filter(item => !item.pego);
            saveItems(items);
            renderItems();
        }
    });

    // --- Inicialização ---
    renderItems(); // Renderiza a lista inicial ao carregar a página
});