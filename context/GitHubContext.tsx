"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { GitHubConnection, Repository } from "@/types/github";
import { mockGitHubService } from "@/services/mockGitHubService";
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

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

export function GitHubProvider({ children }: { children: ReactNode }) {
  const [connection, setConnection] = useState<GitHubConnection>({
    isConnected: false,
    username: null,
    avatarUrl: null,
    scopes: [],
    connectedAt: null,
  });
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const conn = mockGitHubService.getConnection();
      setConnection(conn);
      if (conn.isConnected) {
        const repos = await mockGitHubService.getRepositories();
        setRepositories(repos);
      } else {
        setRepositories([]);
      }
    } catch (e) {
      console.error("Failed loading GitHub data", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const connectGitHub = async (username: string = "student-alex"): Promise<boolean> => {
    setIsConnecting(true);
    try {
      const conn = await mockGitHubService.connect(username);
      setConnection(conn);
      const repos = await mockGitHubService.getRepositories();
      setRepositories(repos);
      showToast({
        type: "success",
        title: "GitHub Connected",
        message: `Simulated connection established with @${conn.username}`,
      });
      return true;
    } catch (e) {
      showToast({
        type: "error",
        title: "Connection Failed",
        message: "Failed to simulate GitHub connection.",
      });
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectGitHub = async (): Promise<boolean> => {
    setIsConnecting(true);
    try {
      const conn = await mockGitHubService.disconnect();
      setConnection(conn);
      setRepositories([]);
      showToast({
        type: "info",
        title: "GitHub Disconnected",
        message: "Your mock GitHub connection has been disconnected.",
      });
      return true;
    } catch (e) {
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to disconnect GitHub.",
      });
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const refreshRepositories = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const repos = await mockGitHubService.getRepositories();
      setRepositories(repos);
      showToast({
        type: "info",
        title: "Repositories Refreshed",
        message: `Found ${repos.length} accessible repositories.`,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
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
    throw new Error("useGitHub must be used within a GitHubProvider");
  }
  return context;
}
