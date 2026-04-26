const BASE_URL = import.meta.env.VITE_API_URL;

export const productApi = {
  getById: async (id: string) => {
    const res = await fetch(`${BASE_URL}/api/products/${id}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  }
};
