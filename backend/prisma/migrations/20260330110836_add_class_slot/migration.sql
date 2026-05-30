/*
  Warnings:

  - A unique constraint covering the columns `[studentId,sessionId]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[department,date,classSlot]` on the table `AttendanceSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classSlot` to the `AttendanceSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Attendance_studentId_date_key";

-- AlterTable
ALTER TABLE "AttendanceSession" ADD COLUMN     "classSlot" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_studentId_sessionId_key" ON "Attendance"("studentId", "sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceSession_department_date_classSlot_key" ON "AttendanceSession"("department", "date", "classSlot");
