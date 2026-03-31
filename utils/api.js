const API_BASE = '';

const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const productAPI = {
  list: () => fetchJSON(`${API_BASE}/api/products`),
  get: (id) => fetchJSON(`${API_BASE}/api/products/${id}`),
  create: (data) => fetchJSON(`${API_BASE}/api/products`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchJSON(`${API_BASE}/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => fetchJSON(`${API_BASE}/api/products/${id}`, { method: 'DELETE' }),
};

export const orderAPI = {
  list: () => fetchJSON(`${API_BASE}/api/orders`),
  get: (id) => fetchJSON(`${API_BASE}/api/orders/${id}`),
  create: (data) => fetchJSON(`${API_BASE}/api/orders`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchJSON(`${API_BASE}/api/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export const authAPI = {
  me: () => fetchJSON(`${API_BASE}/api/auth/me`),
  login: (email, password) => fetchJSON(`${API_BASE}/api/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email, password, name) => fetchJSON(`${API_BASE}/api/auth/register`, { method: 'POST', body: JSON.stringify({ email, password, name }) }),
  logout: () => fetchJSON(`${API_BASE}/api/auth/logout`, { method: 'POST' }),
};