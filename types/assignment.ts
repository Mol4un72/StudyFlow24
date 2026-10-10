export type AssignmentStatus =
  | "draft"
  | "queued"
  | "processing"
  | "review"
  | "publishing"
  | "completed"
  | "failed";

export type FileAction = "added" | "modified" | "removed";

export interface AssignmentFile {
  path: string;
  action: FileAction;
  diffPreview?: string;
  originalContent?: string;
  newContent?: string;
  sizeBytes?: number;
}

export interface ValidationCheck {
  id: string;
  title: string;
  description: string;
  status: "passed" | "failed" | "warning" | "running" | "pending";
  output?: string;
}

export interface AssignmentStageInfo {
  id: number;
  key: string;
  title: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  timestamp?: string;
  message?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  customSubject?: string;
  repositoryId: string;
  repositoryName: string;
  instructions: string;
  additionalContext?: string;
  status: AssignmentStatus;
  currentStageIndex: number;
  stages: AssignmentStageInfo[];
  branchName?: string;
  commitMessage?: string;
  commitSha?: string;
  simulatedRepoUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  files: AssignmentFile[];
  validationChecks: ValidationCheck[];
  outputOptions: {
    separateBranch: boolean;
    generateReport: boolean;
    generateArchive: boolean;
  };
  reportStatus: "pending" | "ready" | "failed";
  archiveStatus: "pending" | "ready" | "failed";
  errorDetails?: string;
}
