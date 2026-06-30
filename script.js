// 1. Importação modular estável (Independe de escopo global de janela ou CDN clássica)
import { createClient } from 'https://jsdelivr.net';

// 2. Credenciais de Conexão (Substitua pelos dados do seu painel do Supabase)
const SUPABASE_URL = "https://SEU_PROJETO.supabase.co";
const SUPABASE_ANON_KEY = "SUA_CHAVE_ANON_PUBLICA_AQUI";

// 3. Inicialização e blindagem do cliente interno
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================================================
// SEU CÓDIGO ATUAL DA DASHBOARD COMEÇA AQUI DEBAIXO
// ==========================================================================
let currentAuthMode = 'login';

function goToAuth(mode, selectedPlan = 'Pro') {

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
    // ... dentro do seu arquivo script.js, localize a função handleAuthSubmit e adicione esta checagem no início:
async function handleAuthSubmit(event) {
    event.preventDefault();
    const errorMessage = document.getElementById('error-message');
    
    // Recupera a instância global caso ela tenha atrasado para inicializar
    if (!window.supabase && typeof supabase === 'undefined') {
        if (errorMessage) errorMessage.innerText = "Erro de conexão: O banco de dados ainda não respondeu. Tente novamente em 2 segundos.";
        console.error("Variável 'supabase' não encontrada no escopo global.");
        return;
    }
    
    // Cria um atalho seguro para a variável
    const client = window.supabase || supabase;
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        if (currentAuthMode === 'login') {
            // Usa o cliente seguro que validamos acima
            const { data: authData, error: authError } = await client.auth.signInWithPassword({
                email, password
            });
            if (authError) throw authError;

            const { data: perfil } = await client.from('perfis').select('is_dev').eq('id', authData.user.id).single();
            if (perfil && perfil.is_dev === true) {
                document.getElementById('menu-btn-admin').classList.remove('hidden');
            } else {
                document.getElementById('menu-btn-admin').classList.add('hidden');
            }

        } else {
            // Cadastro de nova conta usando o cliente validado
            const name = document.getElementById('register-name').value;
            const plan = document.getElementById('register-plan').value;
            
            if (!name) { alert("Por favor, preencha o nome da sua empresa."); return; }

            const { data: regData, error: regError } = await client.auth.signUp({
                email, password
            });
            if (regError) throw regError;

            const { error: perfilError } = await client.from('perfis').insert({
                id: regData.user.id,
                email: email,
                nome_empresa: name,
                plano_selecionado: plan,
                is_dev: false
            });
            if (perfilError) throw perfilError;

            alert(`Sua empresa "${name}" foi cadastrada com sucesso no plano ${plan}!`);
        }

        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('dashboard-screen').classList.remove('hidden');
        if (errorMessage) errorMessage.innerText = "";

    } catch (error) {
        if (errorMessage) errorMessage.innerText = error.message || "Erro na autenticação.";
    }
}

// Credenciais cadastradas diretamente em código  
const CREDENCIAIS\_AUTORIZADAS = {  
email: "schamnesamuel@gmail.com",  
password: "27032009sn"  
}; 

document.getElementById('loginForm')?.addEventListener('submit', function(e) {  
e.preventDefault(); 

const emailInput = document.getElementById('email').value;  
const passwordInput = document.getElementById('password').value;  
const errorDiv = document.getElementById('loginError'); 

// Validação comparativa estática  
if (emailInput === CREDENCIAIS\_AUTORIZADAS.email && passwordInput === CREDENCIAIS\_AUTORIZADAS.password) {  
errorDiv.style.display = 'none'; 

// Define que o usuário está autenticado na sessão do navegador  
sessionStorage.setItem('isAdminAuthenticated', 'true'); 

// Redireciona para a página de administração  
window.location.href = 'dashboard.html';  
} else {  
// Exibe erro caso os dados estejam incorretos  
errorDiv.style.display = 'block';  
}  
});

}