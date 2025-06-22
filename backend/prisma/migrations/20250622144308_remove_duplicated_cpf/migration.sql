/*
  Warnings:

  - You are about to drop the column `cpf` on the `Seat` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Seat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "seatNumber" TEXT NOT NULL,
    "isReserved" BOOLEAN NOT NULL DEFAULT false,
    "sessionId" INTEGER NOT NULL,
    "userCpf" TEXT,
    "name" TEXT,
    CONSTRAINT "Seat_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Seat_userCpf_fkey" FOREIGN KEY ("userCpf") REFERENCES "User" ("cpf") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Seat" ("id", "isReserved", "name", "seatNumber", "sessionId", "userCpf") SELECT "id", "isReserved", "name", "seatNumber", "sessionId", "userCpf" FROM "Seat";
DROP TABLE "Seat";
ALTER TABLE "new_Seat" RENAME TO "Seat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
