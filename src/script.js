import { supabase } from './lib/supabase.js';

const form = document.getElementById('auth-form');
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const nameGroup = document.getElementById('name-group');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');
const submitText = document.getElementById('submit-text');
const feedback = document.getElementById('feedback');
const submitBtn = document.getElementById('submit-btn');
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');

let mode = 'login';

function setMode(next) {
  mode = next;
  const isSignup = next === 'signup';
  nameGroup.hidden = !isSignup;
  formTitle.textContent = isSignup ? 'Crie sua conta' : 'Entre na sua conta';
  formSubtitle.textContent = isSignup ? 'É rápido e gratuito para começar.' : 'Preencha seus dados para continuar.';
  submitText.textContent = isSignup ? 'Criar minha conta' : 'Entrar na conta';
  tabLogin.classList.toggle('active', !isSignup);
  tabSignup.classList.toggle('active', isSignup);
  passwordInput.autocomplete = isSignup ? 'new-password' : 'current-password';
  hideFeedback();
}

tabLogin.addEventListener('click', () => setMode('login'));
tabSignup.addEventListener('click', () => setMode('signup'));

togglePassword.addEventListener('click', () => {
  const isText = passwordInput.type === 'text';
  passwordInput.type = isText ? 'password' : 'text';
  togglePassword.textContent = isText ? '👁️' : '🙈';
  togglePassword.setAttribute('aria-label', isText ? 'Mostrar senha' : 'Ocultar senha');
});

function showFeedback(message, isError = true) {
  feedback.textContent = message;
  feedback.className = 'feedback ' + (isError ? 'error' : 'success');
  feedback.hidden = false;
}

function hideFeedback() {
  feedback.hidden = true;
  feedback.textContent = '';
}

function friendlyError(message) {
  const msg = (message || '').toLowerCase();
  if (msg.includes('invalid login credentials')) return 'Email ou senha incorretos.';
  if (msg.includes('user already registered')) return 'Este email já está cadastrado. Tente entrar.';
  if (msg.includes('password should be at least')) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (msg.includes('unable to validate email')) return 'O email informado não é válido.';
  return 'Não foi possível concluir agora. Verifique os dados e tente novamente.';
}

async function checkExistingSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    window.location.href = 'dashboard.html';
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  hideFeedback();

  const email = document.getElementById('email').value.trim();
  const password = passwordInput.value;
  const nomeEmpresa = document.getElementById('nome_empresa').value.trim();

  if (!email || !password) {
    showFeedback('Preencha email e senha.');
    return;
  }

  if (mode === 'signup' && !nomeEmpresa) {
    showFeedback('Preencha o nome da sua empresa.');
    return;
  }

  submitBtn.disabled = true;
  submitText.textContent = 'Aguarde...';

  try {
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = 'dashboard.html';
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (data.user) {
        const { error: perfilError } = await supabase.from('perfis').insert({
          id: data.user.id,
          email,
          nome_empresa: nomeEmpresa,
          plano_selecionado: 'Free',
          is_dev: false,
        });
        if (perfilError) throw perfilError;
      }

      showFeedback('Conta criada com sucesso! Você já pode entrar.', false);
      setMode('login');
      passwordInput.value = '';
    }
  } catch (error) {
    showFeedback(friendlyError(error.message));
  } finally {
    submitBtn.disabled = false;
    submitText.textContent = mode === 'login' ? 'Entrar na conta' : 'Criar minha conta';
  }
});

checkExistingSession();
