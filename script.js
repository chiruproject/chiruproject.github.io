// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores de Elementos ---
    const form = document.getElementById('add-item-form');
    const produtoInput = document.getElementById('produto-input');
    const categoriaInput = document.getElementById('categoria-input');
    const accordionContainer = document.getElementById('accordionCategorias');
    const listaVaziaMsg = document.getElementById('lista-vazia-msg');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');
    
    const quantidadeUnidadeContainer = document.getElementById('quantidade-container-unidade');
    const quantidadePesoContainer = document.getElementById('quantidade-container-peso');
    const quantidadeInput = document.getElementById('quantidade-input');
    const pesoInput = document.getElementById('peso-input');
    const unidadeInput = document.getElementById('unidade-input');

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

    // MUDANÇA PRINCIPAL: Ativa o modo escuro por padrão
    // Se o usuário nunca escolheu o modo claro, o tema será escuro.
    if (localStorage.getItem('theme') === 'light') {
        disableDarkMode();
    } else {
        enableDarkMode();
    }

    darkModeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
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
            accordionContainer.classList.add('d-none');
            return;
        }
        listaVaziaMsg.classList.add('d-none');
        accordionContainer.classList.remove('d-none');

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
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${index}">
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
    categoriaInput.addEventListener('change', () => {
        if (categoriaInput.value === 'Carnes e Frios') {
            quantidadeUnidadeContainer.classList.add('d-none');
            quantidadePesoContainer.classList.remove('d-none');
        } else {
            quantidadeUnidadeContainer.classList.remove('d-none');
            quantidadePesoContainer.classList.add('d-none');
        }
    });

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
            quantidade: quantidadeFormatada,
            categoria: categoriaInput.value,
            pego: false
        };

        const items = getItems();
        items.push(novoItem);
        saveItems(items);
        renderItems();

        produtoInput.value = '';
        quantidadeInput.value = '1';
        pesoInput.value = '500';
        produtoInput.focus();
    });

    accordionContainer.addEventListener('click', (e) => {
        const itemLi = e.target.closest('.item');
        if (!itemLi) return;

        const itemId = parseInt(itemLi.dataset.id);
        let items = getItems();
        
        if (e.target.classList.contains('toggle-check')) {
            const item = items.find(i => i.id === itemId);
            if (item) {
                item.pego = !item.pego;
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