-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "isExternal" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "project_portal_tokens" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "passcodeHash" TEXT,
    "contactEmails" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "accessLog" JSONB,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_portal_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_portal_tokens_token_key" ON "project_portal_tokens"("token");

-- CreateIndex
CREATE INDEX "project_portal_tokens_token_idx" ON "project_portal_tokens"("token");

-- AddForeignKey
ALTER TABLE "project_portal_tokens" ADD CONSTRAINT "project_portal_tokens_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
