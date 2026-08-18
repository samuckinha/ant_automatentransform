import { supabase } from './lib/supabase.js';

const menuButtons = document.querySelectorAll('.menu-btn[data-tab]');
const tabContents = document.querySelectorAll('.tab-content');
const logoutBtn = document.getElementById('logout-btn');
const perfilEmail = document.getElementById('perfil-email');
const perfilEmpresa = document.getElementById('perfil-empresa');
const adminBtn = document.getElementById('menu-btn-admin');

const adminUserCount = document.getElementById('admin-user-count');
const adminCompanyCount = document.getElementById('admin-company-count');
const adminDevCount = document.getElementById('admin-dev-count');
const adminTableBody = document.getElementById('admin-users-table-body');
const adminFeedback = document.getElementById('admin-action-feedback');

let currentUserId = null;

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
    document.querySelectorAll('.btn-config[data-filter]').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    document.body.className = btn.dataset.filter === 'none' ? '' : 'filter-' + btn.dataset.filter;
  });
});

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
});

function showAdminFeedback(message, isError = true) {
  if (!adminFeedback) return;
  adminFeedback.textContent = message;
  adminFeedback.className = 'feedback ' + (isError ? 'error' : 'success');
  adminFeedback.hidden = false;
  setTimeout(() => { adminFeedback.hidden = true; }, 4000);
}

async function loadAdminData() {
  const { data: allUsers, error } = await supabase
    .from('perfis')
    .select('id, email, nome_empresa, plano_selecionado, is_dev')
    .order('created_at', { ascending: false });

  if (error) {
    showAdminFeedback('Erro ao carregar usuários: ' + error.message);
    return;
  }

  if (!allUsers) return;

  adminUserCount.textContent = allUsers.length;
  adminCompanyCount.textContent = new Set(allUsers.map(u => u.nome_empresa)).size;
  adminDevCount.textContent = allUsers.filter(u => u.is_dev).length;

  if (adminTableBody) {
    adminTableBody.innerHTML = allUsers.map(u => `
      <tr>
        <td>${u.nome_empresa || '—'}</td>
        <td>${u.email || '—'}</td>
        <td>${u.plano_selecionado || 'Free'}</td>
        <td>${u.is_dev ? '<span class="badge badge-in">SIM</span>' : '<span class="badge badge-out">NÃO</span>'}</td>
      </tr>
    `).join('');
  }
}

async function toggleDevStatus(promote) {
  const email = prompt(promote
    ? 'Digite o email do usuário que deseja promover a desenvolvedor:'
    : 'Digite o email do usuário que deseja remover privilégios de dev:'
  );
  if (!email) return;

  const { data: users, error: findError } = await supabase
    .from('perfis')
    .select('id, email, is_dev')
    .eq('email', email.trim().toLowerCase());

  if (findError || !users || users.length === 0) {
    showAdminFeedback('Usuário não encontrado com esse email.');
    return;
  }

  const target = users[0];

  if (promote && target.is_dev) {
    showAdminFeedback('Este usuário já é desenvolvedor.', false);
    return;
  }
  if (!promote && !target.is_dev) {
    showAdminFeedback('Este usuário não é desenvolvedor.', false);
    return;
  }

  const { error: updateError } = await supabase
    .from('perfis')
    .update({ is_dev: promote })
    .eq('id', target.id);

  if (updateError) {
    showAdminFeedback('Erro ao atualizar: ' + updateError.message);
  } else {
    showAdminFeedback(promote
      ? 'Usuário promovido a desenvolvedor com sucesso.'
      : 'Privilégios de dev removidos com sucesso.', false
    );
    loadAdminData();
  }
}

document.getElementById('admin-refresh-btn')?.addEventListener('click', () => {
  loadAdminData();
  showAdminFeedback('Dados atualizados.', false);
});

document.getElementById('admin-promote-btn')?.addEventListener('click', () => toggleDevStatus(true));
document.getElementById('admin-demote-btn')?.addEventListener('click', () => toggleDevStatus(false));

async function loadProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'index.html';
    return;
  }

  currentUserId = session.user.id;
  perfilEmail.value = session.user.email || '';

  const { data: perfil, error } = await supabase
    .from('perfis')
    .select('nome_empresa, is_dev')
    .eq('id', currentUserId)
    .maybeSingle();

  if (error) {
    console.error('Erro ao carregar perfil:', error.message);
    return;
  }

  if (perfil) {
    perfilEmpresa.value = perfil.nome_empresa || '';
    if (perfil.is_dev) {
      adminBtn.classList.remove('hidden');
      loadAdminData();
    }
  }
}

loadProfile();
