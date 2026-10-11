"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

import { GitHubConnection, Repository } from "@/types/github";
import { useToast } from "./ToastContext";

interface GitHubContextType {
  connection: GitHubConnection;
  repositories: Repository[];
  isLoading: boolean;
  isConnecting: boolean;
  connectGitHub: (username?: string) => Promise<boolean>;
  disconnectGitHub: () => Promise<boolean>;
  refreshRepositories: () => Promise<void>;
}

const GitHubContext = createContext<GitHubContextType | undefined>(
  undefined
);

const initialConnection: GitHubConnection = {
  isConnected: false,
  username: null,
  avatarUrl: null,
  scopes: [],
  connectedAt: null,
};

export function GitHubProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [connection, setConnection] =
    useState<GitHubConnection>(initialConnection);

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const { showToast } = useToast();

  const refreshRepositories = useCallback(async () => {
    try {
      const response = await fetch("/api/github/repositories");

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.error || "Не вдалося завантажити репозиторії"
        );
      }

      const data: { repositories: Repository[] } =
        await response.json();

      setRepositories(data.repositories);
    } catch (error) {
      console.error("Failed to fetch GitHub repositories:", error);

      showToast({
        type: "error",
        title: "Помилка GitHub",
        message:
          error instanceof Error
            ? error.message
            : "Не вдалося завантажити репозиторії",
      });
    }
  }, [showToast]);

  const loadConnection = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/github/connection");

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.error || "Не вдалося перевірити підключення GitHub"
        );
      }

      const data: GitHubConnection = await response.json();

      setConnection(data);

      if (data.isConnected) {
        await refreshRepositories();
      } else {
        setRepositories([]);
      }
    } catch (error) {
      console.error("Failed to load GitHub connection:", error);

      setConnection(initialConnection);
      setRepositories([]);

      showToast({
        type: "error",
        title: "Помилка GitHub",
        message:
          error instanceof Error
            ? error.message
            : "Не вдалося перевірити підключення GitHub",
      });
    } finally {
      setIsLoading(false);
    }
  }, [refreshRepositories, showToast]);

  useEffect(() => {
    loadConnection();
  }, [loadConnection]);

  const connectGitHub = async (): Promise<boolean> => {
    setIsConnecting(true);

    window.location.assign("/api/github/connect");

    return true;
  };

  const disconnectGitHub = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/github/disconnect", {
        method: "DELETE",
      });
    
      const data = await response.json();
    
      if (!response.ok) {
        throw new Error(
          data.error || "Не вдалося відключити GitHub"
        );
      }
    
      setConnection(initialConnection);
      setRepositories([]);
    
      showToast({
        type: "success",
        title: "GitHub відключено",
        message: "Твій GitHub-акаунт від'єднано від StudyFlow.",
      });
    
      return true;
    } catch (error) {
      console.error("Failed to disconnect GitHub:", error);
    
      showToast({
        type: "error",
        title: "Помилка GitHub",
        message:
          error instanceof Error
            ? error.message
            : "Не вдалося відключити GitHub",
      });
    
      return false;
    }
  };

  return (
    <GitHubContext.Provider
      value={{
        connection,
        repositories,
        isLoading,
        isConnecting,
        connectGitHub,
        disconnectGitHub,
        refreshRepositories,
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
}

export function useGitHub() {
  const context = useContext(GitHubContext);

  if (!context) {
    throw new Error(
      "useGitHub must be used within a GitHubProvider"
    );
  }

  return context;
}