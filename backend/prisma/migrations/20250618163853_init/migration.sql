-- CreateTable
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "posterUrl" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    CONSTRAINT "Session_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Seat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "seatNumber" TEXT NOT NULL,
    "isReserved" BOOLEAN NOT NULL DEFAULT false,
    "sessionId" INTEGER NOT NULL,
    "name" TEXT,
    "cpf" TEXT,
    CONSTRAINT "Seat_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
