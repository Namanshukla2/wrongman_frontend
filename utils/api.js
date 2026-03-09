const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Request failed");
  }

  return res.json();
}

export const productAPI = {
  list: () => request("/api/products"),
  create: (payload) => request("/api/products", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/products/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/products/${id}`, { method: "DELETE" }),
};

export const orderAPI = {
  list: () => request("/api/orders"),
  create: (payload) => request("/api/orders", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/orders/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
};