import { apiRequest } from "./queryClient";

export interface AuthState {
  isAuthenticated: boolean;
  user: { id: number; username: string } | null;
}

export const authService = {
  async login(username: string, password: string): Promise<AuthState> {
    const response = await apiRequest("POST", "/api/auth/login", { username, password });
    const data = await response.json();
    return {
      isAuthenticated: true,
      user: data.user,
    };
  },

  async logout(): Promise<void> {
    await apiRequest("POST", "/api/auth/logout");
  },

  async getStatus(): Promise<AuthState> {
    const response = await apiRequest("GET", "/api/auth/status");
    const data = await response.json();
    return {
      isAuthenticated: data.isAuthenticated,
      user: data.user || null,
    };
  },
};
