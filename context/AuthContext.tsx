"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authClient } from "@/lib/auth-client";
import type { User } from "@/types/auth";
import { useToast } from "./ToastContext";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;
  register: (
    firstName: string,
    lastName: string,
    studentGroup: string,
    birthDate: string,
    email: string,
    password: string
  ) => Promise<boolean>;
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
    let cancelled = false;

    const loadSession = async () => {
      try {
        const result = await authClient.getSession();

        if (cancelled) return;

        if (result.error || !result.data?.user) {
          setUser(null);
          return;
        }

        const sessionUser = result.data.user;

        setUser((previousUser) => ({
          id: sessionUser.id,
          name: sessionUser.name,
          email: sessionUser.email,

          firstName: sessionUser.firstName || "",
          lastName: sessionUser.lastName || "",
          studentGroup: sessionUser.studentGroup || "",
          birthDate: sessionUser.birthDate || "",

          avatarUrl: sessionUser.image ?? undefined,
          createdAt: previousUser?.createdAt ?? new Date().toISOString(),
          isGitHubConnected: previousUser?.isGitHubConnected ?? false,
          githubUsername: previousUser?.githubUsername,
          preferences: previousUser?.preferences,
        }));
      } catch (error) {
        console.error("Failed to load auth session:", error);

        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    setIsLoading(true);
    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      try {
        const result = await authClient.getSession();

        if (cancelled) return;

        if (result.error || !result.data?.user) {
          setUser(null);
        } else {
          const sessionUser = result.data.user;

          setUser((previousUser) => ({
            id: sessionUser.id,
            name: sessionUser.name,
            email: sessionUser.email,

            firstName: sessionUser.firstName || "",
            lastName: sessionUser.lastName || "",
            studentGroup: sessionUser.studentGroup || "",
            birthDate: sessionUser.birthDate || "",

            avatarUrl: sessionUser.image ?? undefined,
            createdAt: previousUser?.createdAt ?? new Date().toISOString(),
            isGitHubConnected: previousUser?.isGitHubConnected ?? false,
            githubUsername: previousUser?.githubUsername,
            preferences: previousUser?.preferences,
          }));
        }
      } catch (error) {
        console.error("Failed to load auth session:", error);

        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe,
      });

      if (result.error) {
        showToast({
          type: "error",
          title: "Sign in failed",
          message: result.error.message ?? "Please check your credentials.",
        });

        return false;
      }

      const session = await authClient.getSession();

      if (session.error || !session.data?.user) {
        showToast({
          type: "error",
          title: "Sign in failed",
          message: "Could not retrieve the authenticated session.",
        });

        return false;
      }

      const sessionUser = session.data.user;

      setUser((previousUser) => ({
        id: sessionUser.id,
        name: sessionUser.name,
        email: sessionUser.email,
        avatarUrl: sessionUser.image ?? undefined,
        createdAt: previousUser?.createdAt ?? new Date().toISOString(),
        isGitHubConnected: previousUser?.isGitHubConnected ?? false,
        githubUsername: previousUser?.githubUsername,
        preferences: previousUser?.preferences,
        firstName: sessionUser.firstName || "",
        lastName: sessionUser.lastName || "",
        studentGroup: sessionUser.studentGroup || "",
        birthDate: sessionUser.birthDate || "",
      }));

      showToast({
        type: "success",
        title: "Welcome back!",
        message: `Signed in as ${sessionUser.name}`,
      });

      return true;
    } catch (error) {
      console.error("Login failed:", error);

      showToast({
        type: "error",
        title: "Sign in failed",
        message: "An unexpected error occurred.",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    studentGroup: string,
    birthDate: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      const result = await authClient.signUp.email({
        name: fullName,
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        studentGroup: studentGroup.trim(),
        birthDate,
      });

      if (result.error) {
        showToast({
          type: "error",
          title: "Registration failed",
          message: result.error.message ?? "Could not create your account.",
        });

        return false;
      }

      const session = await authClient.getSession();

      if (session.data?.user) {
        const sessionUser = session.data.user;

        setUser({
          id: sessionUser.id,
          name: sessionUser.name,
          email: sessionUser.email,
          firstName: sessionUser.firstName,
          lastName: sessionUser.lastName,
          studentGroup: sessionUser.studentGroup,
          birthDate: sessionUser.birthDate,
          avatarUrl: sessionUser.image ?? undefined,
          createdAt: new Date().toISOString(),
          isGitHubConnected: false,
          preferences: {
            defaultSubject: "Web Development",
            generateReport: true,
            generateArchive: true,
            separateBranch: true,
          },
        });
      } else {
        setUser(null);
      }

      showToast({
        type: "success",
        title: "Account Created",
        message: `Вітаємо, ${firstName.trim()}!`,
      });

      return true;
    } catch (error) {
      console.error("Registration failed:", error);

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
      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(result.error.message);
      }

      setUser(null);

      showToast({
        type: "info",
        title: "Signed Out",
        message: "You have been logged out.",
      });

      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);

      showToast({
        type: "error",
        title: "Sign out failed",
        message: "Could not sign out. Please try again.",
      });
    }
  };

  const updateProfile = async (
    updates: Partial<User>
  ): Promise<boolean> => {
    if (!user) return false;
  
    try {
      const profile = {
        firstName: updates.firstName ?? user.firstName,
        lastName: updates.lastName ?? user.lastName,
        studentGroup: updates.studentGroup ?? user.studentGroup,
        birthDate: updates.birthDate ?? user.birthDate,
      };
    
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });
    
      const data = await response.json();
    
      if (!response.ok) {
        showToast({
          type: "error",
          title: "Помилка збереження",
          message: data.error ?? "Не вдалося зберегти профіль.",
        });
      
        return false;
      }
    
      setUser((currentUser) => {
        if (!currentUser) return currentUser;
      
        return {
          ...currentUser,
          ...data.user,
          preferences: {
            ...currentUser.preferences,
            ...updates.preferences,
          },
        };
      });
    
      showToast({
        type: "success",
        title: "Профіль збережено",
        message: "Зміни успішно збережено.",
      });
    
      return true;
    } catch (error) {
      console.error("Failed to update profile:", error);
    
      showToast({
        type: "error",
        title: "Помилка збереження",
        message: "Не вдалося зв'язатися із сервером.",
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