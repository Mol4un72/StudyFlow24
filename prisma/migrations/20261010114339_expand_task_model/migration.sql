-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "additionalContext" TEXT,
ADD COLUMN     "archiveStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "commitMessage" TEXT,
ADD COLUMN     "currentStageIndex" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "customSubject" TEXT,
ADD COLUMN     "errorDetails" TEXT,
ADD COLUMN     "files" JSONB,
ADD COLUMN     "outputOptions" JSONB,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "reportStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "repositoryId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "simulatedRepoUrl" TEXT,
ADD COLUMN     "stages" JSONB,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Untitled assignment',
ADD COLUMN     "validationChecks" JSONB,
ALTER COLUMN "status" SET DEFAULT 'queued';

-- CreateIndex
CREATE INDEX "Task_userId_updatedAt_idx" ON "Task"("userId", "updatedAt");
