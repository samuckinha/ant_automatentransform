
// Lógica para alternar as abas no Dashboard sem recarregar a página (SPA)
function switchTab(tabId) {
    // Esconde todas as abas
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active-tab'));

    // Remove estado ativo de todos os botões do menu
    const buttons = document.querySelectorAll('.menu-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Mostra a aba selecionada
    document.getElementById(`tab-${tabId}`).classList.add('active-tab');

    // Destaca o botão correto no menu lateral
    const clickedButton = Array.from(buttons).find(btn => btn.textContent.toLowerCase().includes(tabId));
    if (clickedButton) clickedButton.classList.add('active');
}