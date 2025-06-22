import { useEffect, useState } from 'react';

import './reservationPopup.scss';

function ReservationPopup({ show, onClose }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!show) return;

    setProgress(100);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="popup">
      <div className="popup__container">
        <div className="checkmark">&#10003;</div>
        <h2>BILHETE RESERVADO</h2>
        <div className="progressBar">
          <div className="progressBar__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

export default ReservationPopup;
