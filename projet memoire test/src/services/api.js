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
export async function request(path, options = {}) {
  const token = getToken();
  const headers = { 
    'Content-Type': 'application/json', 
    ...(options.headers || {}) 
  };
  
  if (token) headers['Authorization'] = `Token ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch (networkErr) {
    throw { status: 0, data: { error: 'Cannot connect to the server. Check if backend is running.' } };
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
export const getPendingUsers   = () => request('/users/admin/pending/');
export const getValidatedUsers = () => request('/users/admin/validated/');
export const getAdminStats     = () => request('/users/admin/stats/');
export const manageUser         = (id, action, reason) =>
  request(`/users/admin/manage/${id}/`, {
    method: 'POST',
    body: JSON.stringify({ action, reason }),
  });
export const toggleBlock = (id) =>
  request(`/users/admin/toggle-block/${id}/`, { method: 'POST', body: JSON.stringify({}) });

// ── Products & Categories ─────────────────────────────────────────────────────
export const getCategories = () => request('/api/products/categories/');

export const getCategoryDetail = (id) => 
  request(`/api/products/categories/${id}/`);

export const getProductsByCategory = (categoryId) => 
  request(`/api/products/search/?category=${categoryId}`);

// ── Orders & Payments (Chargily) ──────────────────────────────────────────────
export const createOrder = (orderData) => 
  request('/api/orders/place/', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });

// ── Farmer Dashboard & Orders (New) ──────────────────────────────────────────
export const getFarmerStats = () => request('/api/orders/farmer-stats/');

export const getFarmerOrders = () => request('/api/orders/farmer/orders/');

export const getBuyerStats = () => request('/api/orders/buyer-stats/');

export const getBuyerOrders = () => request('/api/orders/buyer/orders/');

// ── Admin — Categories (CRUD) ─────────────────────────────────────────────────
export const addCategory = (formData) => {
  const token = getToken();
  return fetch(`${BASE_URL}/api/products/categories/add/`, {
    method: 'POST',
    headers: { 'Authorization': `Token ${token}` },
    body: formData,
  }).then(async res => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw { status: res.status, data };
    return data;
  });
};

export const updateCategory = (id, formData) => {
  const token = getToken();
  return fetch(`${BASE_URL}/api/products/categories/${id}/update/`, {
    method: 'PATCH',
    headers: { 'Authorization': `Token ${token}` },
    body: formData,
  }).then(async res => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw { status: res.status, data };
    return data;
  });
};

export const deleteCategory = (id) => 
  request(`/api/products/categories/${id}/delete/`, { method: 'DELETE' });

// ── Farmer Profile ────────────────────────────────────────────────────────────
export const getFarmerProfile = () => request('/users/profile/manage/');

export const updateFarmerProfile = (formData) => {
  const token = getToken();
  return fetch(`${BASE_URL}/users/profile/manage/`, {
    method: 'PATCH', 
    headers: { 'Authorization': `Token ${token}` },
    body: formData,
  }).then(async res => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw { status: res.status, data };
    return data;
  });
};

// ── Farmer Products ───────────────────────────────────────────────────────────
export const getFarmerProducts = () => request('/api/products/farmer/products/');

export const addFarmerProduct = (formData) => {
    const token = getToken();
    return fetch(`${BASE_URL}/api/products/farmer/products/add/`, {
      method: 'POST',
      headers: { 'Authorization': `Token ${token}` },
      body: formData,
    }).then(async res => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw { status: res.status, data };
      return data;
    });
};

export const updateFarmerProduct = (id, formData) => {
    const token = getToken();
    return fetch(`${BASE_URL}/api/products/${id}/update/`, {
      method: 'PATCH',
      headers: { 'Authorization': `Token ${token}` },
      body: formData,
    }).then(async res => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw { status: res.status, data };
      return data;
    });
};

export const deleteFarmerProduct = (id) => 
  request(`/api/products/farmer/products/${id}/delete/`, { method: 'DELETE' });


// ── Transporter Endpoints ─────────────────────────────────────────────────────
export const getAvailableMissions = () => 
  request('/api/orders/transporter/available-missions/');

export const acceptMission = (id) => 
  request(`/api/orders/transporter/accept-mission/${id}/`, { method: 'POST' });

export const markOrderAsDelivered = (id) => 
  request(`/api/orders/transporter/mark-delivered/${id}/`, { method: 'POST' });

export const rejectMission = (id) => 
  request(`/api/orders/transporter/reject-mission/${id}/`, { method: 'POST' });

export const getTransporterStats = () => 
  request('/api/orders/transporter/stats/');

export const getTransporterMissions = () => 
  request('/api/orders/transporter/missions/');

// ── IoT & Livestock Oversight ────────────────────────────────────────────────
export const getNationalSummary = () => 
  request('/api/iot/animals/national-summary/');

export const getAllAnimals = () => 
  request('/api/iot/animals/');

export const verifyAnimal = (id) => 
  request(`/api/iot/animals/${id}/verify/`, { method: 'POST' });

export const getFarmerInventory = () =>
  request('/api/iot/animals/farmer-inventory/'); // I might need to implement this in the backend