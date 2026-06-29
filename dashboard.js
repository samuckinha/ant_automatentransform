// Exemplo lógico de redirecionamento no arquivo js/auth.js
async function verificarNivelAcesso(user) {
    const { data, error } = await supabase
        .from('perfis')
        .select('regra')
        .eq('id', user.id)
        .single();

    if (data.regra === 'admin') {
        window.location.href = 'admin.html'; // Vai para tela de Admin
    } else {
        window.location.href = 'dashboard.html'; // Vai para tela Comum
    }
}
