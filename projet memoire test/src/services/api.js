const BASE_URL = 'http://127.0.0.1:8000';

// ── Auth helpers ──────────────────────────────────────────────────────────────
export const saveAuth = (token, role, fullName) => {
  localStorage.setItem('agrigov_token', token);
  localStorage.setItem('agrigov_role', role);
  localStorage.setItem('agrigov_name', fullName);
};

export const getToken = () => localStorage.getItem('agrigov_token');
export const getRole  = () => localStorage.getItem('agrigov_role');
export const getName  = () => localStorage.getItem('agrigov_name');
export const clearAuth = () => {
  localStorage.removeItem('agrigov_token');
  localStorage.removeItem('agrigov_role');
  localStorage.removeItem('agrigov_name');
};

// ── Base fetch wrapper ────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Token ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch (networkErr) {
    throw { status: 0, data: { error: 'Cannot connect to the server. Please make sure the backend is running on http://127.0.0.1:8000' } };
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, data };
  return data;
}

// ── Auth Endpoints ────────────────────────────────────────────────────────────
export const login = (email, password) =>
  request('/users/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const signup = (payload) =>
  request('/users/signup/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

// ── Admin — Accounts ──────────────────────────────────────────────────────────
export const getPendingUsers   = ()        => request('/users/admin/pending/');
export const getValidatedUsers = ()        => request('/users/admin/validated/');
export const getAdminStats     = ()        => request('/users/admin/stats/');
export const manageUser        = (id, action, reason) =>
  request(`/users/admin/manage/${id}/`, {
    method: 'POST',
    body: JSON.stringify({ action, reason }),
  });
export const toggleBlock = (id) =>
  request(`/users/admin/toggle-block/${id}/`, { method: 'POST', body: JSON.stringify({}) });
