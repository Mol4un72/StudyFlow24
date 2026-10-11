export interface User {
  id: string;
  name: string;
  email: string;

  firstName: string;
  lastName: string;
  studentGroup: string;
  birthDate: string;

  avatarUrl?: string;
  createdAt: string;
  isGitHubConnected: boolean;
  githubUsername?: string;

  preferences?: {
    defaultSubject?: string;
    defaultBranchPrefix?: string;
    generateReport?: boolean;
    generateArchive?: boolean;
    separateBranch?: boolean;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}