import React, { createContext, useState, useEffect, useCallback } from "react";
import api, { authApi } from "../api";
import { useLocation } from "wouter";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

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
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  getCurrentUser: () => User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      return;
    }

    try {
      const data = await authApi.getMe();
      if (data && data.id) {
        setUser(data);
        setToken(storedToken);
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        throw new Error("Invalid user data");
      }
    } catch (err) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleAuthSuccess = (result: AuthResponse, successMessage: string) => {
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
    setUser(result.user);
    setToken(result.token);
    toast.success(successMessage);
    setLocation("/");
  };

  const login = async (
    credentials: LoginCredentials
  ): Promise<AuthResponse> => {
    try {
      console.log("🔐 FRONTEND: Starting login for:", credentials.email);
      setLoading(true);

      const result = await authApi.login(credentials);
      console.log("🔐 FRONTEND: Login API response:", result);

      if (!result.success || !result.user || !result.token) {
        throw new Error("Invalid login response from server");
      }

      handleAuthSuccess(result, "Logged in successfully!");
      console.log("🔐 FRONTEND: Login successful, redirecting...");
      return result;
    } catch (error: any) {
      console.error("🔐 FRONTEND: Login failed:", error);

      let errorMessage = "Authentication failed";
      if (error.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (error.response?.status === 400) {
        errorMessage =
          error.response.data?.message || "Please check your credentials";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error - please try again later";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    credentials: RegisterCredentials
  ): Promise<AuthResponse> => {
    try {
      console.log("🔐 FRONTEND: Starting registration for:", credentials.email);
      setLoading(true);

      const result = await authApi.register(credentials);
      console.log("🔐 FRONTEND: Registration API response:", result);

      if (!result.success || !result.user || !result.token) {
        throw new Error("Invalid registration response from server");
      }

      handleAuthSuccess(result, "Account created successfully!");
      console.log("🔐 FRONTEND: Registration successful, redirecting...");
      return result;
    } catch (error: any) {
      console.error("🔐 FRONTEND: Registration failed:", error);

      let errorMessage = "Registration failed";
      if (error.response?.status === 400) {
        errorMessage =
          error.response.data?.message || "Please check your information";
      } else if (error.response?.status === 409) {
        errorMessage = "Email already exists";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error - please try again later";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authApi.logout();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setLocation("/login");
      toast.success("Logged out");
      setLoading(false);
    }
  }, [setLocation]);

  // Handle global 401 unauthorized errors
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // If 401, auto-logout cleanly without infinite loops
          setUser(null);
          setToken(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          toast.error("Session expired. Please log in again.");
          setLocation("/login");
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [setLocation]);

  const getCurrentUser = () => user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loadUser,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
