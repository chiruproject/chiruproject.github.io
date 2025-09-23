// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores de Elementos ---
    const form = document.getElementById('add-item-form');
    const produtoInput = document.getElementById('produto-input');
    const categoriaInput = document.getElementById('categoria-input');
    const accordionContainer = document.getElementById('accordionCategorias');
    const listaVaziaMsg = document.getElementById('lista-vazia-msg');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');
    
    // Seletores para os campos de quantidade
    const quantidadeUnidadeContainer = document.getElementById('quantidade-container-unidade');
    const quantidadePesoContainer = document.getElementById('quantidade-container-peso');
    const quantidadeInput = document.getElementById('quantidade-input');
    const pesoInput = document.getElementById('peso-input');
    const unidadeInput = document.getElementById('unidade-input');

    // Seletor para o Dark Mode
    const darkModeToggle = document.getElementById('darkModeToggle');

    // --- Lógica do Dark Mode ---
    const enableDarkMode = () => {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        darkModeToggle.checked = true;
    };

    const disableDarkMode = () => {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        darkModeToggle.checked = false;
    };

    // Verifica a preferência do usuário ao carregar a página
    if (localStorage.getItem('theme') === 'dark') {
        enableDarkMode();
    }

    darkModeToggle.addEventListener('click', () => {
        if (localStorage.getItem('theme') !== 'dark') {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });

    // --- Gerenciamento de Dados com localStorage ---
    const getItems = () => JSON.parse(localStorage.getItem('listaDeCompras')) || [];
    const saveItems = (items) => localStorage.setItem('listaDeCompras', JSON.stringify(items));

    // --- Lógica de Renderização ---
    const renderItems = () => {
        const items = getItems();
        accordionContainer.innerHTML = '';

        if (items.length === 0) {
            listaVaziaMsg.classList.remove('d-none');
            return;
        }
        listaVaziaMsg.classList.add('d-none');

        const itensAgrupados = items.reduce((acc, item) => {
            (acc[item.categoria] = acc[item.categoria] || []).push(item);
            return acc;
        }, {});

        const categoriasOrdenadas = Object.keys(itensAgrupados).sort();

        categoriasOrdenadas.forEach((categoria, index) => {
            const itensHtml = itensAgrupados[categoria]
                .sort((a, b) => a.pego - b.pego)
                .map(item => `
                    <li class="list-group-item d-flex justify-content-between align-items-center item ${item.pego ? 'item-pego' : ''}" data-id="${item.id}">
                        <div class="form-check">
                            <input class="form-check-input toggle-check" type="checkbox" id="item-${item.id}" ${item.pego ? 'checked' : ''}>
                            <label class="form-check-label" for="item-${item.id}">
                                <!-- A quantidade agora é uma string formatada -->
                                <span>${item.quantidade} ${item.produto}</span>
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
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${index}" aria-expanded="true">
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

    // --- Event Listeners ---

    // Lógica para alternar o campo de quantidade
    categoriaInput.addEventListener('change', () => {
        if (categoriaInput.value === 'Carnes e Frios') {
            quantidadeUnidadeContainer.classList.add('d-none');
            quantidadePesoContainer.classList.remove('d-none');
        } else {
            quantidadeUnidadeContainer.classList.remove('d-none');
            quantidadePesoContainer.classList.add('d-none');
        }
    });

    // Adicionar um novo item
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const produto = produtoInput.value.trim();
        if (!produto) return;

        let quantidadeFormatada;
        if (categoriaInput.value === 'Carnes e Frios') {
            const peso = parseFloat(pesoInput.value);
            const unidade = unidadeInput.value;
            quantidadeFormatada = `${peso}${unidade}`;
        } else {
            const quantidade = parseInt(quantidadeInput.value);
            quantidadeFormatada = `${quantidade}x`;
        }

        const novoItem = {
            id: Date.now(),
            produto: produto,
            quantidade: quantidadeFormatada, // Salva a string já formatada
            categoria: categoriaInput.value,
            pego: false
        };

        const items = getItems();
        items.push(novoItem);
        saveItems(items);
        renderItems();

        form.reset();
        categoriaInput.value = novoItem.categoria; // Mantém a categoria
        produtoInput.focus();
    });

    // Marcar/Desmarcar ou Deletar um item
    accordionContainer.addEventListener('click', (e) => {
        const itemLi = e.target.closest('.item');
        if (!itemLi) return;

        const itemId = parseInt(itemLi.dataset.id);
        let items = getItems();
        const itemIndex = items.findIndex(i => i.id === itemId);

        if (e.target.classList.contains('toggle-check')) {
            if (itemIndex > -1) {
                items[itemIndex].pego = !items[itemIndex].pego;
                saveItems(items);
                renderItems();
            }
        }

        if (e.target.closest('.delete-btn')) {
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
    renderItems();
});