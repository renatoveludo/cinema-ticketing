import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './sessionPage.scss';

function SessionPage({ setSelectedMovieId, setSelectedSessionTime, setSelectedDateTime}) {
  const { movieId } = useParams();
  const [sessions, setSessions] = useState([]);
  const sessionsByDate = groupSessionsByDate(sessions);
  const navigate = useNavigate();
  
  useEffect(() => {
    setSelectedMovieId(movieId);
    fetch(`http://localhost:4000/sessions/${movieId}`)
      .then(res => res.json())
      .then(data => setSessions(data));
  }, [movieId, setSelectedMovieId]);


  function groupSessionsByDate(sessions) {
    return sessions.reduce((acc, session) => {
      const date = session.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(session);
      return acc;
    }, {});
  }

  function parseDateToLocal(dateStr) {
    if (!dateStr) return null;

    if (dateStr.includes('/')) {
      const parts = dateStr.trim().split('/');
      if (parts.length !== 3) return null;
      const [day, month, year] = parts.map(Number);
      if ([year, month, day].some(isNaN)) return null;
      return new Date(year, month - 1, day);
    } else if (dateStr.includes('-')) {
      const parts = dateStr.trim().split('-');
      if (parts.length !== 3) return null;
      const [year, month, day] = parts.map(Number);
      if ([year, month, day].some(isNaN)) return null;
      return new Date(year, month - 1, day);
    }

    return null;
  }

  function getDayOfWeek(dateStr) {
    const date = parseDateToLocal(dateStr);
    if (!date) return '';
    return date.toLocaleDateString('pt-BR', { weekday: 'long' });
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatDateBR(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="sessionPage">
      <h2>SELECIONE O HORÁRIO</h2>      
        {Object.entries(sessionsByDate).map(([date, sessions]) => (          
          <div key={date}>
            <h3>{capitalize(getDayOfWeek(date))} - {formatDateBR(date)}</h3>
            <div className='sessionPage__hours'>
              {sessions.map(session => (
                console.log(date),
                <div 
                  className='sessionPage__box'
                  key={session.id}
                  onClick={() => {
                    setSelectedSessionTime(session.time);
                    setSelectedDateTime(capitalize(getDayOfWeek(date)));
                    navigate(`/seat/${session.id}`);
                  }}
                >
                  {session.time}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

export default SessionPage;