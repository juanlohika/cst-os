-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('project_manager', 'project_support', 'consultant', 'observer');

-- CreateEnum
CREATE TYPE "RaciRole" AS ENUM ('responsible', 'accountable', 'consulted', 'informed');

-- CreateEnum
CREATE TYPE "PlanningStatus" AS ENUM ('official', 'projected');

-- CreateEnum
CREATE TYPE "TemplateStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "AccountablePartyType" AS ENUM ('internal', 'external');

-- DropIndex
DROP INDEX "project_templates_code_key";

-- AlterTable
ALTER TABLE "default_tasks" DROP COLUMN "assignedRoleDefault",
ADD COLUMN     "assignedToProjectRole" "ProjectRole";

-- AlterTable
ALTER TABLE "project_team_members" DROP COLUMN "role",
ADD COLUMN     "projectRole" "ProjectRole" NOT NULL DEFAULT 'project_support',
ADD COLUMN     "raciRole" "RaciRole" NOT NULL DEFAULT 'responsible';

-- AlterTable
ALTER TABLE "project_template_phases" ADD COLUMN     "maxDays" INTEGER,
ADD COLUMN     "minDays" INTEGER,
ADD COLUMN     "normDays" INTEGER;

-- AlterTable
ALTER TABLE "project_templates" ADD COLUMN     "parentTemplateId" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "publishedById" TEXT,
ADD COLUMN     "status" "TemplateStatus" NOT NULL DEFAULT 'draft',
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "planningStatus" "PlanningStatus" NOT NULL DEFAULT 'official',
ADD COLUMN     "projectedVisibility" JSONB,
ADD COLUMN     "templateVersionId" TEXT;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "accountablePartyId" TEXT,
ADD COLUMN     "accountablePartyType" "AccountablePartyType",
ADD COLUMN     "depth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "requiresApproval" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "project_external_contacts" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "raciRole" "RaciRole" NOT NULL DEFAULT 'informed',
    "notes" TEXT,
    "addedById" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_external_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_external_contacts_projectId_contactId_key" ON "project_external_contacts"("projectId", "contactId");

-- CreateIndex
CREATE UNIQUE INDEX "project_templates_code_version_key" ON "project_templates"("code", "version");

-- AddForeignKey
ALTER TABLE "project_external_contacts" ADD CONSTRAINT "project_external_contacts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_external_contacts" ADD CONSTRAINT "project_external_contacts_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "client_contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_templates" ADD CONSTRAINT "project_templates_parentTemplateId_fkey" FOREIGN KEY ("parentTemplateId") REFERENCES "project_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

