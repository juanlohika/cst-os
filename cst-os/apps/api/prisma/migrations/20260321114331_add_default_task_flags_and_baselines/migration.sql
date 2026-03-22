-- AlterTable
ALTER TABLE "default_tasks" ADD COLUMN     "isExternal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMilestone" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "timeline_baseline_versions" (
    "id" TEXT NOT NULL,
    "projectType" "ProjectType" NOT NULL,
    "versionLabel" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "totalWorkingDays" INTEGER NOT NULL,
    "minDays" INTEGER NOT NULL,
    "maxDays" INTEGER NOT NULL,
    "phaseNorms" JSONB NOT NULL,
    "notes" TEXT,
    "activatedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timeline_baseline_versions_pkey" PRIMARY KEY ("id")
);
