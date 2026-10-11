-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "repositoryFullName" TEXT NOT NULL,
    "assignmentText" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "branchName" TEXT,
    "commitSha" TEXT,
    "zipPath" TEXT,
    "reportPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
