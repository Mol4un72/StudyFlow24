import { GitHubConnection, Repository } from "@/types/github";

const STORAGE_KEY_GITHUB = "studyflow_mock_github";

export const DEFAULT_MOCK_REPOSITORIES: Repository[] = [
  {
    id: "repo-1",
    name: "web-development",
    fullName: "student/web-development",
    description: "Coursework and laboratory assignments for Web Programming (HTML, CSS, Next.js)",
    isPrivate: true,
    defaultBranch: "main",
    language: "TypeScript",
    stars: 2,
    updatedAt: "2026-03-28T14:20:00Z",
  },
  {
    id: "repo-2",
    name: "python-course",
    fullName: "student/python-course",
    description: "Python programming practices, algorithms, file processing, and data structures",
    isPrivate: true,
    defaultBranch: "main",
    language: "Python",
    stars: 1,
    updatedAt: "2026-04-01T10:15:00Z",
  },
  {
    id: "repo-3",
    name: "database-course",
    fullName: "student/database-course",
    description: "Relational database management, PostgreSQL schema design, and query optimization",
    isPrivate: false,
    defaultBranch: "main",
    language: "SQL",
    stars: 0,
    updatedAt: "2026-03-15T09:30:00Z",
  },
  {
    id: "repo-4",
    name: "os-labs",
    fullName: "student/os-labs",
    description: "Operating systems laboratories: process synchronization, memory management in C",
    isPrivate: true,
    defaultBranch: "master",
    language: "C",
    stars: 3,
    updatedAt: "2026-02-20T16:45:00Z",
  },
  {
    id: "repo-5",
    name: "computer-networks",
    fullName: "student/computer-networks",
    description: "Socket programming, TCP/UDP client-server implementations and packet analysis",
    isPrivate: true,
    defaultBranch: "main",
    language: "Python",
    stars: 0,
    updatedAt: "2026-01-10T11:00:00Z",
  },
];

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

  async getRepositories(): Promise<Repository[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const conn = this.getConnection();
    if (!conn.isConnected) {
      return [];
    }
    return DEFAULT_MOCK_REPOSITORIES;
  },

  async getRepositoryById(id: string): Promise<Repository | null> {
    const repos = await this.getRepositories();
    return repos.find((r) => r.id === id || r.fullName === id) || null;
  },
};
