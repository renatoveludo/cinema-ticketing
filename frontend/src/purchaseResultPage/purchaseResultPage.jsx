import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PurchaseResult from '../component/purchaseResult/purchaseResult';

function PurchaseResultPage() {
  const { cpf } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/purchases/${cpf}`)
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
  }, [cpf]);

  function handleSeatRemoved(seatId) {
    setPurchase(prev => ({
      ...prev,
      seats: prev.seats.filter(seat => seat.id !== seatId)
    }));
  }

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <PurchaseResult purchase={purchase} onSeatRemoved={handleSeatRemoved} />
  );
}

export default PurchaseResultPage;
