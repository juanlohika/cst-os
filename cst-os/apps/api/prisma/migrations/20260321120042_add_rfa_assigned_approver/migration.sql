-- AlterTable
ALTER TABLE "rfas" ADD COLUMN     "assignedApproverId" TEXT;

-- AddForeignKey
ALTER TABLE "rfas" ADD CONSTRAINT "rfas_assignedApproverId_fkey" FOREIGN KEY ("assignedApproverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
