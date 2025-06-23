import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import './ticketPage.scss';

function TicketPage() {
  const { cpf, sessionId } = useParams();
  const navigate = useNavigate();

  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!cpf || !sessionId) {
      setError('Parâmetros inválidos');
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/purchase/${cpf}/${sessionId}`) 
      .then(res => {
        if (!res.ok) throw new Error('Compra não encontrada');
        return res.json();
      })
      .then(data => {
        setPurchase(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [cpf, sessionId]);

  if (loading) return <div className="ticketPage">Carregando...</div>;

  if (error) return (
    <div className="ticketPage">
      <p className="error">{error}</p>
      <button 
        className="ticketPage__backButton"
        onClick={() => navigate('/')}
      >
        Voltar para filmes
      </button>
    </div>
  );

  const session = purchase.session;

  function formatDateBR(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="ticketPage">
      <h2>Bilhete Reservado</h2>

      <div className="ticketPage__movieInfo">
        <img src={session.movie.posterUrl} alt={session.movie.title} />
        <h3>{session.movie.title}</h3>
        <p>{formatDateBR(session.date)} - {session.time}</p>
      </div>

      <div className="ticketPage__details">
        <p><strong>Nome:</strong> {purchase.name}</p>
        <p><strong>CPF:</strong> {purchase.cpf}</p>
        <p><strong>Assentos:</strong> {purchase.seats.map(seat => seat.seatNumber).join(', ')}</p>
      </div>

      <button 
        className="ticketPage__backButton"
        onClick={() => navigate('/')}
      >
        Voltar para filmes
      </button>
    </div>
  );
}

export default TicketPage;
