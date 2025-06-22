-- CreateTable
CREATE TABLE "User" (
    "cpf" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sessionId" INTEGER NOT NULL,
    CONSTRAINT "User_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "cpf" TEXT,
    CONSTRAINT "Seat_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Seat_userCpf_fkey" FOREIGN KEY ("userCpf") REFERENCES "User" ("cpf") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Seat" ("cpf", "id", "isReserved", "name", "seatNumber", "sessionId") SELECT "cpf", "id", "isReserved", "name", "seatNumber", "sessionId" FROM "Seat";
DROP TABLE "Seat";
ALTER TABLE "new_Seat" RENAME TO "Seat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
