async function seedSeats() {
  const sessions = await prisma.session.findMany();

  for (const session of sessions) {
    const seats = [];

    for (let i = 1; i <= 50; i++) {
      seats.push({
        seatNumber: i.toString().padStart(2, '0'),
        sessionId: session.id,
      });
    }

    await prisma.seat.createMany({
      data: seats,
    });

    console.log(`Assentos criados para sessão ${session.id}`);
  }
}