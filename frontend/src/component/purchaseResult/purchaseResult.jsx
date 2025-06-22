import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './purchaseResult.scss';

function PurchaseResult({ purchase, onSeatRemoved }) {
  const [removingSeatId, setRemovingSeatId] = useState(null);
  const navigate = useNavigate();

  async function handleRemoveSeat(seatId) {
    setRemovingSeatId(seatId);

    try {
      const res = await fetch(`http://localhost:4000/seats/${seatId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        alert('Erro ao remover assento');
        return;
      }

      onSeatRemoved(seatId);
    } catch {
      alert('Erro ao conectar com o servidor');
    } finally {
      setRemovingSeatId(null);
    }
  }

  async function handleBackToMovies() {
    try {
      await fetch(`http://localhost:4000/cleanup-empty-sessions/${purchase.cpf}`, {
        method: 'DELETE',
      });
    } catch {
      alert('Erro ao limpar sessões vazias. Verifique o servidor.');
    }

    navigate('/');
  }

  function formatDateBR(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="purchaseResult">
      <h2>Lista de Assento(s) Reservado(s)</h2>
      <h2>CPF: {purchase.cpf}</h2>

      {purchase.seats.length === 0 && (
        <p className="purchaseResult__no-seats">
          Olá, {purchase.name}! No momento, você não possui nenhuma reserva ativa.
        </p>
      )}

      {purchase.sessions.map(session => {
        const seatsOfSession = purchase.seats.filter(seat => seat.sessionId === session.id);

        return (
          <div key={session.id} className="purchaseResult__session">
            <p><strong>Filme :</strong> {session.movie.title}</p>
            <p><strong>Data :</strong> {formatDateBR(session.date)}</p>
            <p><strong>Horário :</strong> {session.time}</p>
            <p>
              <strong>Assentos reservados : </strong>{' '}
              {seatsOfSession.length === 0 ? (
                <em>Nenhum assento reservado nesta sessão.</em>
              ) : (
                seatsOfSession.map(seat => (
                  <span key={seat.id} className="purchaseResult__session--seat">
                    {seat.seatNumber}{' '}
                    <button
                      onClick={() => handleRemoveSeat(seat.id)}
                      disabled={removingSeatId === seat.id}
                      className="remove-button"
                      title="Remover assento"
                    >
                      {removingSeatId === seat.id ? (
                        <span className="spinner"></span>
                      ) : (
                        'X'
                      )}
                    </button>
                  </span>
                ))
              )}
            </p>
          </div>
        );
      })}
      <div className="purchaseResult__back">
        <button 
          onClick={handleBackToMovies} 
          className="purchaseResult__back--btn"
        >
          Voltar para filmes
        </button>
      </div>
    </div>
  );
}

export default PurchaseResult;
