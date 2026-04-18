/**
 * Shared types for the backend
 */

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export type UserRole = "user" | "admin" | "seller";
