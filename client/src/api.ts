import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    // Let the calling function (like AuthContext) handle 401 unauthorized errors
    // so we don't trigger hard page reloads and duplicate state logic.
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
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/register", credentials);
    return data;
  },
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
  getMe: async (): Promise<UserMeResponse> => {
    const { data } = await api.get("/auth/me");
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
    const { data } = await api.get("/products");
    return data?.data || data;
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },
  getStories: async () => {
    const { data } = await api.get("/products/stories");
    return data?.data || data;
  },
};

export const adminApi = {
  getProducts: async () => {
    const { data } = await api.get("/products");
    return data?.data || data;
  },
  createProduct: async (product: any) => {
    const { data } = await api.post("/products", product);
    return data;
  },
  updateProduct: async (id: string, product: any) => {
    const { data } = await api.put(`/products/${id}`, product);
    return data;
  },
  deleteProduct: async (id: string) => {
    await api.delete(`/products/${id}`);
  },
  getOrders: async () => {
    const { data } = await api.get("/orders");
    return data?.data || data;
  },
  updateOrderStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    return data;
  },
  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append("images", file));
    const { data } = await api.post("/admin/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};

export const paymentApi = {
  createOrder: async (amount: number) => {
    const { data } = await api.post("/payments/create-order", { amount });
    return data;
  },
  verify: async (paymentData: any) => {
    const { data } = await api.post("/payments/verify", paymentData);
    return data;
  },
};

export const orderApi = {
  create: async (order: any) => {
    const { data } = await api.post("/orders", order);
    return data;
  },
};

export default api;
