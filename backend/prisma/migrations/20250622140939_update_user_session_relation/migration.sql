/*
  Warnings:

  - You are about to drop the column `sessionId` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_UserSessions" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserSessions_A_fkey" FOREIGN KEY ("A") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserSessions_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("cpf") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "cpf" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_User" ("cpf", "name") SELECT "cpf", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_UserSessions_AB_unique" ON "_UserSessions"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSessions_B_index" ON "_UserSessions"("B");
