/**
 * Authentication module
 */

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem('sms_user') || 'null');
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
    return null;
  }
  const display = document.getElementById('userDisplay');
  if (display) display.textContent = '👤 ' + user.name + ' (' + user.role + ')';
  return user;
}

function logout() {
  sessionStorage.removeItem('sms_user');
  const isInPages = window.location.pathname.includes('/pages/');
  window.location.href = isInPages ? '../index.html' : 'index.html';
}

function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('collapsed');
}

// Login form handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  // If already logged in, redirect
  if (getCurrentUser()) {
    window.location.href = 'pages/dashboard.html';
  }

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value;
    const role     = document.getElementById('loginRole').value;

    const users = DB.getAll('users');
    const user  = users.find(u => u.username === username && u.password === password && u.role === role);

    if (user) {
      sessionStorage.setItem('sms_user', JSON.stringify(user));
      window.location.href = 'pages/dashboard.html';
    } else {
      document.getElementById('loginError').textContent = 'Invalid credentials. Please try again.';
    }
  });
}

// Auto-require auth on inner pages
if (window.location.pathname.includes('/pages/')) {
  requireAuth();
}

// Set today's date in topbar
const dateBadge = document.getElementById('dateBadge');
if (dateBadge) {
  dateBadge.textContent = new Date().toLocaleDateString('en-IN', { weekday:'short', year:'numeric', month:'short', day:'numeric' });
}
