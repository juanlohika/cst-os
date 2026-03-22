/*
  Warnings:

  - The `companySize` column on the `clients` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `segment` column on the `clients` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "companySize",
ADD COLUMN     "companySize" TEXT,
DROP COLUMN "segment",
ADD COLUMN     "segment" TEXT;

-- DropEnum
DROP TYPE "ClientSegment";

-- DropEnum
DROP TYPE "CompanySize";
