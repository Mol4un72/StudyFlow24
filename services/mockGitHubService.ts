import { GitHubConnection, Repository } from "@/types/github";

const STORAGE_KEY_GITHUB = "studyflow_mock_github";

export const mockGitHubService = {
  getConnection(): GitHubConnection {
    if (typeof window === "undefined") {
      return {
        isConnected: true,
        username: "student-alex",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        scopes: ["repo", "read:user"],
        connectedAt: "2026-03-01T12:00:00Z",
      };
    }

    const saved = localStorage.getItem(STORAGE_KEY_GITHUB);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse GitHub connection state", e);
      }
    }

    // Default to connected for seamless initial prototype exploration
    const defaultConn: GitHubConnection = {
      isConnected: true,
      username: "student-alex",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      scopes: ["repo", "read:user"],
      connectedAt: "2026-03-01T12:00:00Z",
    };
    localStorage.setItem(STORAGE_KEY_GITHUB, JSON.stringify(defaultConn));
    return defaultConn;
  },

  async connect(username: string = "student-alex"): Promise<GitHubConnection> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const conn: GitHubConnection = {
      isConnected: true,
      username,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      scopes: ["repo", "read:user"],
      connectedAt: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_GITHUB, JSON.stringify(conn));
    }
    return conn;
  },

  async disconnect(): Promise<GitHubConnection> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const conn: GitHubConnection = {
      isConnected: false,
      username: null,
      avatarUrl: null,
      scopes: [],
      connectedAt: null,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_GITHUB, JSON.stringify(conn));
    }
    return conn;
  },
};
