import { useLocation } from "wouter";
import { useAuth } from "../_core/hooks/useAuth";
import React, { useEffect } from 'react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setLocation("/login");
      } else if (user.role !== "admin") {
        setLocation("/");
      }
    }
  }, [loading, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3" />
        <span className="text-sm uppercase tracking-widest">Verifying Access...</span>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null; // This won't be reached due to useEffect redirect, but for safety
  }

  return <>{children}</>;
};

export default AdminRoute;
