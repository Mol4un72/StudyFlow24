import { User } from "@/types/auth";
import { mockGitHubService } from "./mockGitHubService";

const STORAGE_KEY_USER = "studyflow_mock_user";

export const DEFAULT_DEMO_USER: User = {
  id: "usr-demo-01",
  name: "Alex Developer",
  email: "alex.student@university.edu",
  firstName: "Test",
  lastName: "Student",
  studentGroup: "КН-21",
  birthDate: "2005-01-15",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  createdAt: "2026-01-15T09:00:00Z",
  isGitHubConnected: true,
  githubUsername: "student-alex",
  preferences: {
    defaultSubject: "Python",
    defaultBranchPrefix: "practice-",
    generateReport: true,
    generateArchive: true,
    separateBranch: true,
  },
};

export const mockAuthService = {
  getCurrentUser(): User | null {
    if (typeof window === "undefined") {
      return DEFAULT_DEMO_USER;
    }
    const stored = localStorage.getItem(STORAGE_KEY_USER);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          // Sync with GitHub connection
          const ghConn = mockGitHubService.getConnection();
          parsed.isGitHubConnected = ghConn.isConnected;
          parsed.githubUsername = ghConn.username || undefined;
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse stored user:", e);
      }
    }
    // Default demo user for smooth prototype preview
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEFAULT_DEMO_USER));
    return DEFAULT_DEMO_USER;
  },

  async login(email: string, _password: string, _rememberMe = false): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    // Check if user already in storage or create from email
    const currentUser = this.getCurrentUser() || DEFAULT_DEMO_USER;
    const user: User = {
      ...currentUser,
      email: email.trim(),
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Student User",
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }
    return user;
  },

  async register(name: string, email: string, _password: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 700));
    
    const user: User = {
      id: `usr-${Date.now().toString(36)}`,
      name: name.trim(),
      email: email.trim(),
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      createdAt: new Date().toISOString(),
      isGitHubConnected: false,
      githubUsername: undefined,
      firstName: name.split(" ")[0] || "Test",
      lastName: name.split(" ").slice(1).join(" ") || "Student",
      studentGroup: "КН-21",
      birthDate: "2005-01-15",
      preferences: {
        defaultSubject: "Web Development",
        generateReport: true,
        generateArchive: true,
        separateBranch: true,
      },
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }
    return user;
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  },

  async updateProfile(updates: Partial<User>): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const user = this.getCurrentUser();
    if (!user) return null;

    const updatedUser: User = {
      ...user,
      ...updates,
      preferences: {
        ...user.preferences,
        ...(updates.preferences || {}),
      },
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
    }
    return updatedUser;
  },
};
