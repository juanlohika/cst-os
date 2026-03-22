-- AlterTable
ALTER TABLE "ai_apps" ADD COLUMN     "costThisMonth" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "disabledAt" TIMESTAMP(3),
ADD COLUMN     "disabledReason" TEXT,
ADD COLUMN     "lastUsedAt" TIMESTAMP(3),
ADD COLUMN     "maxContextTokens" INTEGER NOT NULL DEFAULT 8000,
ADD COLUMN     "sharedWith" TEXT NOT NULL DEFAULT 'all';

-- CreateTable
CREATE TABLE "app_share_grants" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" TEXT NOT NULL DEFAULT 'view_only',
    "grantedById" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_share_grants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_share_grants_appId_userId_key" ON "app_share_grants"("appId", "userId");

-- AddForeignKey
ALTER TABLE "ai_apps" ADD CONSTRAINT "ai_apps_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_share_grants" ADD CONSTRAINT "app_share_grants_appId_fkey" FOREIGN KEY ("appId") REFERENCES "ai_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_share_grants" ADD CONSTRAINT "app_share_grants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_share_grants" ADD CONSTRAINT "app_share_grants_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
