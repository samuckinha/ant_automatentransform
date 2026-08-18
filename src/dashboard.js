import { supabase } from './lib/supabase.js';

const menuButtons = document.querySelectorAll('.menu-btn[data-tab]');
const tabContents = document.querySelectorAll('.tab-content');
const logoutBtn = document.getElementById('logout-btn');
const perfilEmail = document.getElementById('perfil-email');
const perfilEmpresa = document.getElementById('perfil-empresa');
const adminBtn = document.getElementById('menu-btn-admin');

menuButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    menuButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    tabContents.forEach((tab) => tab.classList.remove('active-tab'));
    document.getElementById('tab-' + btn.dataset.tab)?.classList.add('active-tab');
  });
});

document.querySelectorAll('.btn-config[data-filter]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.btn-config').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    document.body.className = btn.dataset.filter === 'none' ? '' : 'filter-' + btn.dataset.filter;
  });
});

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
});

async function loadProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'index.html';
    return;
  }

  const userId = session.user.id;
  perfilEmail.value = session.user.email || '';

  const { data: perfil, error } = await supabase
    .from('perfis')
    .select('nome_empresa, is_dev')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Erro ao carregar perfil:', error.message);
    return;
  }

  if (perfil) {
    perfilEmpresa.value = perfil.nome_empresa || '';
    if (perfil.is_dev) {
      adminBtn.classList.remove('hidden');
    }
  }
}

loadProfile();
