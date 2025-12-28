const apiBase = '/api';

const $ = sel => document.querySelector(sel);

const loginForm = $('#loginForm');
const msg = $('#msg');
const dashboard = $('#dashboard');
const welcome = $('#welcome');
const tokenBox = $('#tokenBox');

function showMessage(text, ok = true) {
  msg.textContent = text;
  msg.style.color = ok ? 'green' : 'crimson';
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('#email').value.trim();
  const password = $('#password').value;

  try {
    const res = await fetch(apiBase + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      showMessage(data.message || 'Error al iniciar sesión', false);
      return;
    }

    const { token, user } = data.data || {};
    if (!token) {
      showMessage('Respuesta inválida del servidor', false);
      return;
    }

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    showDashboard(user, token);
    showMessage('Inicio de sesión exitoso');
  } catch (err) {
    showMessage('Error de conexión', false);
  }
});

function showDashboard(user, token) {
  loginForm.hidden = true;
  dashboard.hidden = false;
  welcome.textContent = `Bienvenido ${user?.email || ''}`;
  tokenBox.textContent = token;
}

document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  location.reload();
});

// Auto-login if token present
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (token && user) showDashboard(user, token);
});
