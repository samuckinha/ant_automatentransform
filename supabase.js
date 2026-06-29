const SUPABASE_URL = "https://yphzwcwhnugpxgpkxawc.supabase.co/rest/v1/";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwaHp3Y3dobnVncHhncGt4YXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzUxMDUsImV4cCI6MjA5ODMxMTEwNX0.GXGs43O0w5YmiOKv7Es1OErheJCKdOTzXv_m-cKTQUA";

const supabaseClient =window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.supabaseClient = supabaseClient;

console.log("supa carregado");

// Função para lidar com o login integrado ao Supabase e checagem de privilégios dev
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    try {
        // 1. Realiza a autenticação padrão do usuário no Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) throw authError;

        const user = authData.user;

        // 2. Busca os privilégios do usuário logado na tabela de perfis
        const { data: perfil, error: perfilError } = await supabase
            .from('perfis')
            .select('is_dev')
            .eq('id', user.id)
            .single();

        // 3. Verifica se o usuário logado é um Desenvolvedor/Admin
        if (perfil && perfil.is_dev === true) {
            // Exibe o botão do painel secreto na sidebar apenas para desenvolvedores
            document.getElementById('menu-btn-admin').classList.remove('hidden');
            console.log("⚡ Modo Desenvolvedor Ativado.");
        } else {
            // Garante que o botão fique oculto para usuários comuns
            document.getElementById('menu-btn-admin').classList.add('hidden');
        }

        // 4. Libera o acesso para a dashboard
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('dashboard-screen').classList.remove('hidden');
        errorMessage.innerText = "";

    } catch (error) {
        console.error("Erro na autenticação:", error.message);
        errorMessage.innerText = "Usuário ou senha inválidos ou sem permissão.";
    }
}

// Garante o bloqueio completo ao deslogar
function handleLogout() {
    document.getElementById('dashboard-screen').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
    
    // Esconde e limpa o botão dev no logout por segurança
    document.getElementById('menu-btn-admin').classList.add('hidden');
    
    // Desloga a sessão ativa do Supabase
    supabase.auth.signOut();
}

// --- FUNÇÕES AUXILIARES DO CONSOLE DEV (Exemplos de Ações) ---
function clearSystemCache() {
    alert("Cache de IA e vetores limpo com sucesso em todo o cluster!");
}

function triggerDatabaseSync() {
    alert("Sincronização forçada com o banco concluída. Nenhuma anomalia encontrada.");
}

function toggleMaintenanceMode() {
    alert("Atenção: Modo manutenção alternado. Usuários sem tag dev receberão aviso de indisponibilidade no próximo refresh.");
}
