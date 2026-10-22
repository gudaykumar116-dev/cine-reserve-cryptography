/* =====================================================================
   CineReserve: Authentication & Modal Controller
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderNavbarAuth();
  setupAuthModals();
  checkPageAuthGuard();
});

function checkPageAuthGuard() {
  const path = window.location.pathname.toLowerCase();
  const protectedPages = ['movies.html', 'movie-details.html', 'seat-booking.html', 'checkout.html', 'history.html'];
  const isProtected = protectedPages.some(page => path.endsWith(page));

  if (isProtected && !API.isLoggedIn()) {
    // Open login modal and notify user
    setTimeout(() => {
      openModal('login-modal');
      showToast('🔒 Please Sign In or Sign Up to browse movies and book tickets!', 'info');
    }, 300);
  }
}

function renderNavbarAuth() {
  const authContainer = document.getElementById('navbar-auth-section');
  if (!authContainer) return;

  const user = API.getUser();

  if (user) {
    const isAdmin = user.role === 'ROLE_ADMIN';
    authContainer.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <span class="coupon-badge" title="Use coupon WELCOME150 at checkout">🎁 ₹150 OFF</span>
        <a href="history.html" class="nav-link">🎟️ My Tickets</a>
        ${isAdmin ? '<a href="admin.html" class="btn btn-sm btn-outline" style="border-color: var(--accent-purple); color: #c4b5fd;">⚙️ Admin Panel</a>' : ''}
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #fff;">
          <span style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: #000; font-weight: 700; display: inline-flex; align-items: center; justify-content: center;">
            ${user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </span>
          <span>${user.fullName.split(' ')[0]}</span>
        </div>
        <button id="logout-btn" class="btn btn-sm btn-outline">Logout</button>
      </div>
    `;

    document.getElementById('logout-btn')?.addEventListener('click', () => {
      const email = user.email;
      API.clearSession();
      if (email) {
        localStorage.setItem('cinereserve_last_email', email);
      }
      showToast('Logged out successfully. You can sign in anytime without signing up again!');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    });
  } else {
    authContainer.innerHTML = `
      <button id="nav-login-btn" class="btn btn-outline btn-sm">Sign In</button>
      <button id="nav-register-btn" class="btn btn-primary btn-sm">Sign Up (Get ₹150 OFF)</button>
    `;

    document.getElementById('nav-login-btn')?.addEventListener('click', () => openModal('login-modal'));
    document.getElementById('nav-register-btn')?.addEventListener('click', () => openModal('register-modal'));
  }
}

function setupAuthModals() {
  // Pre-fill remembered email if present
  const lastEmail = localStorage.getItem('cinereserve_last_email');
  if (lastEmail) {
    const loginEmailInput = document.getElementById('login-email');
    if (loginEmailInput && !loginEmailInput.value) {
      loginEmailInput.value = lastEmail;
    }
  }

  // Login Form Submit
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      try {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Signing In...';

        const res = await API.login(email, password);
        API.setSession(res.data.token, res.data);
        localStorage.setItem('cinereserve_last_email', email);
        showToast(`Welcome back, ${res.data.fullName}!`);
        closeModal('login-modal');
        renderNavbarAuth();

        if (window.onAuthSuccess) {
          window.onAuthSuccess();
        } else {
          // If on index.html and logging in, redirect to movies.html
          if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
            window.location.href = 'movies.html';
          }
        }
      } catch (err) {
        showToast(err.message || 'Invalid email or password. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Sign In';
      }
    });
  }

  // Register Form Submit
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;
      const phone = document.getElementById('reg-phone').value;
      const submitBtn = registerForm.querySelector('button[type="submit"]');

      try {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Creating Account...';

        const res = await API.register(fullName, email, password, phone);
        API.setSession(res.data.token, res.data);
        localStorage.setItem('cinereserve_last_email', email);
        showToast('🎉 Registration successful! ₹150 OFF coupon WELCOME150 has been activated for your account.');
        closeModal('register-modal');
        renderNavbarAuth();

        if (window.onAuthSuccess) {
          window.onAuthSuccess();
        } else {
          window.location.href = 'movies.html';
        }
      } catch (err) {
        showToast(err.message || 'Registration failed. Email may already be registered.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Create Account';
      }
    });
  }

  // Switch between modals
  document.getElementById('to-register-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('login-modal');
    openModal('register-modal');
  });

  document.getElementById('to-login-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('register-modal');
    openModal('login-modal');
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}
