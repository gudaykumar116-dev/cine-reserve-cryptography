/* =====================================================================
   cinereserve: Centralized REST API Client & Helper Utilities
   ===================================================================== */

const API_BASE_URL = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
  ? `${window.location.origin}/api`
  : 'http://localhost:8080/api';

const API = {
  // Storage keys
  TOKEN_KEY: 'cinereserve_token',
  USER_KEY: 'cinereserve_user',

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  getUser() {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  setSession(token, user) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  },

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  },

  // Auth endpoints
  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register(fullName, email, password, phone) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password, phone }),
    });
  },

  // Movies endpoints
  getNowShowing() {
    return this.request('/movies/now-showing');
  },

  getComingSoon() {
    return this.request('/movies/coming-soon');
  },

  getMovieById(id) {
    return this.request(`/movies/${id}`);
  },

  searchMovies(query, status = 'NOW_SHOWING') {
    return this.request(`/movies/search?query=${encodeURIComponent(query)}&status=${status}`);
  },

  getGenres() {
    return this.request('/movies/genres');
  },

  getLanguages() {
    return this.request('/movies/languages');
  },

  // Shows & Seats
  getShowsForMovie(movieId, dateStr) {
    const dateParam = dateStr ? `&date=${dateStr}` : '';
    return this.request(`/shows?movieId=${movieId}${dateParam}`);
  },

  getShowDetails(showId) {
    return this.request(`/shows/${showId}`);
  },

  getSeatMatrix(showId) {
    return this.request(`/shows/${showId}/seats`);
  },

  // Bookings
  createBooking(showId, showSeatIds, paymentMethod, dateOfBirth, ageProofType, couponCode, paymentAddress, paymentPin) {
    const payload = { showId, showSeatIds, paymentMethod };
    if (dateOfBirth) payload.dateOfBirth = dateOfBirth;
    if (ageProofType) payload.ageProofType = ageProofType;
    if (couponCode) payload.couponCode = couponCode;
    if (paymentAddress) payload.paymentAddress = paymentAddress;
    if (paymentPin) payload.paymentPin = paymentPin;
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getMyBookings() {
    return this.request('/bookings/my-bookings');
  },

  getBookingByNumber(bookingNumber) {
    return this.request(`/bookings/${bookingNumber}`);
  },

  cancelBooking(bookingId) {
    return this.request(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
    });
  },

  // Admin
  getAdminMetrics() {
    return this.request('/admin/metrics');
  },

  addMovie(movieData) {
    return this.request('/admin/movies', {
      method: 'POST',
      body: JSON.stringify(movieData),
    });
  },

  scheduleShow(showData) {
    return this.request('/admin/shows', {
      method: 'POST',
      body: JSON.stringify(showData),
    });
  },

  getAllBookings() {
    return this.request('/admin/bookings');
  },

  getTheatres() {
    return this.request('/admin/theatres');
  },

  getScreensByTheatre(theatreId) {
    return this.request(`/admin/theatres/${theatreId}/screens`);
  },
};

// UI Toast Notification Helper
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : '⚠'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
