export const productApi = {
  getById: async (id: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
    return res.json();
  }
};
