document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o recarregamento automático da página

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error-message');

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            // Salva o token de sessão localmente no navegador
            localStorage.setItem('token', data.token);
            // Redireciona para o Painel Principal administrativo
            window.location.href = 'dashboard.html';
        } else {
            errorDiv.textContent = data.message;
        }
    } catch (err) {
        errorDiv.textContent = "Erro ao conectar-se com o servidor do sistema.";
    }
});
