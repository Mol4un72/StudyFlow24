"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User } from "@/types/auth";
import { mockAuthService } from "@/services/mockAuthService";
import { useToast } from "./ToastContext";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const router = useRouter();

  const refreshUser = useCallback(() => {
    try {
      const u = mockAuthService.getCurrentUser();
      setUser(u);
    } catch (e) {
      console.error(e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, pass: string, rememberMe = false): Promise<boolean> => {
    try {
      setIsLoading(true);
      const u = await mockAuthService.login(email, pass, rememberMe);
      setUser(u);
      showToast({
        type: "success",
        title: "Welcome back!",
        message: `Signed in as ${u.name}`,
      });
      return true;
    } catch (e) {
      showToast({
        type: "error",
        title: "Sign in failed",
        message: "Please check your credentials and try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const u = await mockAuthService.register(name, email, pass);
      setUser(u);
      showToast({
        type: "success",
        title: "Account Created",
        message: `Welcome to StudyFlow, ${u.name}!`,
      });
      return true;
    } catch (e) {
      showToast({
        type: "error",
        title: "Registration failed",
        message: "Could not complete account creation.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await mockAuthService.logout();
      setUser(null);
      showToast({
        type: "info",
        title: "Signed Out",
        message: "You have been logged out of the session.",
      });
      router.push("/login");
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    try {
      const updated = await mockAuthService.updateProfile(updates);
      if (updated) {
        setUser(updated);
        showToast({
          type: "success",
          title: "Profile Updated",
          message: "Your preferences have been saved.",
        });
        return true;
      }
      return false;
    } catch (e) {
      showToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update profile settings.",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
