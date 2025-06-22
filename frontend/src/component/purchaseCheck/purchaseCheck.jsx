import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './purchaseCheck.scss';

function PurchaseCheck() {
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function checkPurchases() {
    setError('');

    if (!cpf.trim()) {
      setError('Please enter a CPF.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/purchases/${cpf}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError('Nenhuma compra encontrada para este CPF.');
        } else if (res.status === 400) {
          setError('CPF inválido.');
        } else {
          setError('Erro ao buscar dados da compra.');
        }
        return;
      }

      navigate(`/purchase-result/${cpf}`);
    } catch {
      setError('Erro ao conectar com o servidor.');
    }
  }

  return (
    <div className="purchaseCheck">
      <h2>Confira suas compras</h2>
      <div className="purchaseCheck__form">
        <input
          type="text"
          placeholder="Digite seu CPF"
          value={cpf}
          onChange={e => setCpf(e.target.value)}
        />
        <button onClick={checkPurchases}>Conferir</button>
      </div>

      {error && <p className="purchaseCheck__error">{error}</p>}

    </div>
  );
}

export default PurchaseCheck;
