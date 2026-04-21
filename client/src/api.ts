import { api } from "@/lib/api";

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => {
    if (import.meta.env.DEV) {
      console.log(`[API RESPONSE] ${response.config.url}:`, response.data);
    }
    return response;
  },
  error => {
    if (import.meta.env.DEV) {
      console.error(
        `[API ERROR] ${error.config?.url}:`,
        error.response?.data || error.message
      );
    }
    return Promise.reject(error);
  }
);

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

interface UserMeResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post("/api/auth/login", credentials);
    return data;
  },
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post("/api/auth/register", credentials);
    return data;
  },
  logout: async (): Promise<void> => {
    await api.post("/api/auth/logout");
  },
  getMe: async (): Promise<UserMeResponse> => {
    const { data } = await api.get("/api/auth/me");
    return data;
  },
  isAdmin: (): boolean => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;
    try {
      const user = JSON.parse(userStr);
      return user.role === "admin";
    } catch {
      return false;
    }
  },
};

export const productApi = {
  getAll: async () => {
    const { data } = await api.get("/api/products");
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/api/products/${id}`);
    return data;
  },
  getStories: async () => {
    const { data } = await api.get("/api/products/stories");
    return data;
  },
  collectProduct: async (
    id: string,
    ownerData: { ownerName: string; ownerStory: string }
  ) => {
    const { data } = await api.post(`/api/products/${id}/collect`, ownerData);
    return data;
  },
};

export const adminApi = {
  getProducts: async () => {
    const { data } = await api.get("/api/products");
    return data;
  },
  createProduct: async (product: any) => {
    const { data } = await api.post("/api/products", product);
    return data;
  },
  updateProduct: async (id: string, product: any) => {
    const { data } = await api.put(`/api/products/${id}`, product);
    return data;
  },
  deleteProduct: async (id: string) => {
    await api.delete(`/api/products/${id}`);
  },
  getOrders: async () => {
    const { data } = await api.get("/api/orders");
    return data;
  },
  updateOrderStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/api/orders/${id}/status`, { status });
    return data;
  },
  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append("images", file));
    const { data } = await api.post("/api/admin/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await api.post("/api/products/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};

export const paymentApi = {
  createOrder: async (amount: number) => {
    const { data } = await api.post("/api/payments/create-order", { amount });
    return data;
  },
  verify: async (paymentData: any) => {
    const { data } = await api.post("/api/payments/verify", paymentData);
    return data;
  },
};

export const orderApi = {
  create: async (order: any) => {
    const { data } = await api.post("/api/orders", order);
    return data;
  },
  getUserOrders: async () => {
    const { data } = await api.get("/api/orders/user");
    return data;
  },
};

export default api;
