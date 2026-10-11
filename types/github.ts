export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  isPrivate: boolean;
  defaultBranch: string;
  language: string;
  stars: number;
  updatedAt: string;
}

export interface GitHubConnection {
  isConnected: boolean;
  username: string | null;
  avatarUrl: string | null;
  scopes: string[];
  connectedAt: string | null;
}
