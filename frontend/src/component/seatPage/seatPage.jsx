import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import './seatPage.scss';

import ReservationPopup from '../reservationPopup/reservationPopup';

function SeatPage() {
  const { sessionId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:4000/seats/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Assentos recebidos:', data);
        setSeats(data);
      });
  }, [sessionId]);

  function toggleSeat(seatId) {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
    } else {
      setSelectedSeats(prev => [...prev, seatId]);
    }
  }

  function handleReserve() {
    if (!name || !cpf || selectedSeats.length === 0) {
      setErrorMessage('Preencha todos os campos e selecione pelo menos um assento.');
      return;
    }

    fetch('http://localhost:4000/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, cpf, sessionId: Number(sessionId), seatIds: selectedSeats }),
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(data => {
          throw new Error(data.error || 'Erro ao reservar assento');
        });
      }
      return res.json();
    })
    .then(() => {
      setShowPopup(true);
    })
    .catch(err => {
      setErrorMessage(err.message); 
    });
  }

  function handleClosePopup() {
    setShowPopup(false);
    setTimeout(() => {
      navigate(`/ticket/${cpf}/${sessionId}`);
    }, 0);
  }

  return (
    <div className="seatPage">
      <h2>Selecione o(s) assento(s) :</h2>

      <div className="seatPage__grid">
        {seats.map(seat => (
          <div
            key={seat.id}
            className={`
              seat 
              ${seat.isReserved ? 'unavailable' : ''}
              ${selectedSeats.includes(seat.id) ? 'selected' : ''}
            `}
            onClick={() => !seat.isReserved && toggleSeat(seat.id)}
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>

      <div className="seatPage__legend">
        <div><span className="legend selected"></span> Selecionado</div>
        <div><span className="legend available"></span> Disponível</div>
        <div><span className="legend unavailable"></span> Indisponível</div>
      </div>

      <div className="seatPage__form">
        <label>
          Nome do comprador:
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label>
          CPF do comprador:
          <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} />
        </label>
      </div>

      <button 
        className="seatPage__reserveButton"
        onClick={handleReserve}
      > 
        Reservar Assento(s)
      </button>

      {errorMessage && (
        <div className="seatPage__error">
          {errorMessage}
        </div>
      )}
      <ReservationPopup show={showPopup} onClose={handleClosePopup} />
    </div>
  );
}

export default SeatPage;
