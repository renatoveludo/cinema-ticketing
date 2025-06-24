const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function readCSV(filename) {
  const filePath = path.join(__dirname, filename);
  const fileContent = fs.readFileSync(filePath);
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });
}

async function main() {

  await prisma.seat.deleteMany();
  await prisma.session.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.user.deleteMany();

  // Lê CSVs
  const movies = readCSV('Movies.csv');
  const sessions = readCSV('Sessions.csv');
  const seats = readCSV('Seats.csv');
  const users = readCSV('Users.csv');

  // 1. Insere usuários
  for (const user of users) {
    await prisma.user.create({
      data: {
        cpf: user.cpf,
        name: user.name
      }
    });
  }

  // 2. Insere filmes
  for (const movie of movies) {
    await prisma.movie.create({
      data: {
        id: parseInt(movie.id),
        title: movie.title,
        posterUrl: movie.posterUrl
      }
    });
  }

  // 3. Insere sessões
  for (const session of sessions) {
    await prisma.session.create({
      data: {
        id: parseInt(session.id),
        date: session.date,
        time: session.time,
        movieId: parseInt(session.movieId)
      }
    });
  }

  // 4. Insere assentos
  for (const seat of seats) {
    await prisma.seat.create({
      data: {
        id: parseInt(seat.id),
        seatNumber: seat.seatNumber,
        isReserved: seat.isReserved === 'true',
        sessionId: parseInt(seat.sessionId),
        userCpf: seat.userCpf || null,
        name: seat.name || null,
        cpf: seat.cpf || null
      }
    });
  }

  console.log('Seed completo!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
