import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Header from './component/header/header';
import MoviePage from './component/moviePage/moviePage';
import SessionPage from './component/sessionPage/sessionPage';
import Footer from './component/footer/footer';
import SeatPage from './component/seatPage/seatPage';
import TicketPage from './component/ticketPage/ticketPage';
import PurchaseResultPage from './purchaseResultPage/purchaseResultPage';

import './App.scss';

function App() {
  const [movies, setMovies] = useState([]);
  const location = useLocation();
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedSessionTime, setSelectedSessionTime] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState('');

  const showFooter = 
    location.pathname.startsWith('/sessions') || location.pathname.startsWith('/seat');

  useEffect(() => {
    fetch('http://localhost:4000/movies')
      .then(res => res.json())
      .then(data => setMovies(data));
  }, []);

  return (
      <div className="App">
        <Header 
          setSelectedSessionTime={setSelectedSessionTime}
          setSelectedDateTime={setSelectedDateTime}
        />
        <Routes>
          <Route path="/" element={<MoviePage movies={movies} />} />
          <Route 
            path="/sessions/:movieId" 
            element={
              <SessionPage 
                setSelectedMovieId={setSelectedMovieId}
                setSelectedSessionTime={setSelectedSessionTime}
                setSelectedDateTime={setSelectedDateTime}
              />
            } 
          />
          <Route path="/seat/:sessionId" element={<SeatPage />} />
          <Route path="/ticket/:cpf/:sessionId" element={<TicketPage />} />
          <Route path="/purchase-result/:cpf" element={<PurchaseResultPage />} />
        </Routes>
        {showFooter && selectedMovieId && (
          <Footer 
            movies={movies} 
            movieId={selectedMovieId}
            sessionTime={selectedSessionTime}
            dateTime={selectedDateTime} />
        )}
      </div>   
  );
}

export default App;
