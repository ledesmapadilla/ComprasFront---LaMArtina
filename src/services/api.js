const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const headers = () => ({
  "Content-Type": "application/json",
  ...(localStorage.getItem("token") && {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }),
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error en la solicitud");
  return data;
};

export const api = {
  get: (path) => fetch(`${BASE}${path}`, { headers: headers() }).then(handle),
  post: (path, body) => fetch(`${BASE}${path}`, { method: "POST", headers: headers(), body: JSON.stringify(body) }).then(handle),
  put: (path, body) => fetch(`${BASE}${path}`, { method: "PUT", headers: headers(), body: JSON.stringify(body) }).then(handle),
  delete: (path) => fetch(`${BASE}${path}`, { method: "DELETE", headers: headers() }).then(handle),
};
