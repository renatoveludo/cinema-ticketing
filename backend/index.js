const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const isValidCPF = require('./utils/isvalidcpf');

app.use(cors());
app.use(express.json());

app.get('/movies', async (req, res) => {
  const movies = await prisma.movie.findMany();
  res.json(movies);
});

app.get('/sessions/:movieId', async (req, res) => {
  const movieId = parseInt(req.params.movieId);

  try {
    const sessions = await prisma.session.findMany({
      where: { movieId },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    });

    res.json(sessions);
  } catch (error) {
    console.error('Erro ao buscar sessões:', error);
    res.status(500).json({ error: 'Erro ao buscar sessões' });
  }
});

app.get('/seats/:sessionId', async (req, res) => {
  const sessionId = parseInt(req.params.sessionId);

  try {
    const seats = await prisma.seat.findMany({
      where: { sessionId },
      orderBy: {
        seatNumber: 'asc',
      }
    });

    res.json(seats);
  } catch (error) {
    console.error('Erro ao buscar assentos:', error);
    res.status(500).json({ error: 'Erro ao buscar assentos' });
  }
});

app.get('/user/:cpf', async (req, res) => {
  const cpf = req.params.cpf;

  if (!cpf) {
    return res.status(400).json({ message: 'CPF não informado.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { cpf },
      include: {
        sessions: {
          include: { movie: true }
        },
        seats: true
      }
    });

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

app.get('/purchases/:cpf', async (req, res) => {
  const { cpf } = req.params;

  if (!cpf) {
    return res.status(400).json({ message: 'CPF não informado.' });
  }

  if (!isValidCPF(cpf)) {
    return res.status(400).json({ message: 'CPF inválido.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { cpf },
      include: {
        sessions: {
          include: {
            movie: true
          }
        },
        seats: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Nenhuma compra encontrada para este CPF.' });
    }

    console.log('DADOS DO USUÁRIO:', user);

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar compras:', error);
    res.status(500).json({ error: 'Erro interno ao buscar compras.' });
  }
});

app.get('/purchase/:cpf/:sessionId', async (req, res) => {
  const { cpf, sessionId } = req.params;
  const sessionIdNum = Number(sessionId);

  if (!cpf || isNaN(sessionIdNum)) {
    return res.status(400).json({ error: 'CPF ou sessionId inválidos.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { cpf },
      include: {
        sessions: {
          where: { id: sessionIdNum },
          include: { movie: true }
        },
        seats: true
      }
    });

    if (!user || user.sessions.length === 0) {
      return res.status(404).json({ error: 'Compra não encontrada para este CPF e sessão.' });
    }

    const seats = user.seats.filter(seat => seat.sessionId === sessionIdNum);

    res.json({
      cpf: user.cpf,
      name: user.name,
      session: user.sessions[0],
      seats
    });
  } catch (error) {
    console.error('Erro ao buscar compra:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.post('/reserve', async (req, res) => {
  let { name, cpf, sessionId, seatIds } = req.body;

  sessionId = Number(sessionId);

  if (!name || !cpf || !sessionId || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({ error: 'Dados incompletos.' });
  }

  if (!isValidCPF(cpf)) {
    return res.status(400).json({ error: 'CPF inválido.' });
  }

  try {
    const seats = await prisma.seat.findMany({
      where: {
        id: { in: seatIds },
        sessionId: sessionId,
        isReserved: false
      }
    });

    console.log('Assentos disponíveis para reserva:', seats.map(s => s.id));

    if (seats.length !== seatIds.length) {
      return res.status(409).json({ error: 'Alguns assentos já foram reservados.' });
    }

    let user = await prisma.user.findUnique({ where: { cpf } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          cpf,
          name,
          sessions: {
            connect: [{ id: sessionId }]
          }
        }
      });
    } else {
      await prisma.user.update({
        where: { cpf },
        data: {
          name,
          sessions: {
            connect: { id: sessionId }
          }
        }
      });
    }

    await Promise.all(seatIds.map(id =>
      prisma.seat.update({
        where: { id },
        data: {
          isReserved: true,
          name,
          cpf,
          userCpf: cpf
        }
      })
    ));

    res.status(200).json({ message: 'Reserva realizada com sucesso', userCpf: cpf });
  } catch (error) {
    console.error('Erro ao reservar assentos:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.delete('/seats/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const seat = await prisma.seat.update({
      where: { id },
      data: {
        isReserved: false,
        name: null,
        cpf: null,
        userCpf: null,
      },
    });

    res.json({ message: 'Assento removido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover assento' });
  }
});

app.delete('/cleanup-empty-sessions/:cpf', async (req, res) => {
  const { cpf } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { cpf },
      include: {
        sessions: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const sessionsToClean = [];

    for (const session of user.sessions) {
      const seats = await prisma.seat.findMany({
        where: {
          sessionId: session.id,
          cpf,
        },
      });

      if (seats.length === 0) {
        sessionsToClean.push(session.id);
      }
    }

    if (sessionsToClean.length > 0) {
      await prisma.user.update({
        where: { cpf },
        data: {
          sessions: {
            disconnect: sessionsToClean.map(id => ({ id })),
          },
        },
      });
    }

    res.status(200).json({
      message: 'Sessões limpas com sucesso.',
      sessionsLimpa: sessionsToClean.length,
    });

  } catch (error) {
    console.error('Erro ao limpar sessões vazias:', error);
    res.status(500).json({ error: 'Erro ao limpar sessões vazias.' });
  }
});


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

