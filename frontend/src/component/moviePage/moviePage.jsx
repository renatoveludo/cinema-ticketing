import { useNavigate } from 'react-router-dom';
import PurchaseCheck from '../purchaseCheck/purchaseCheck';

import './moviePage.scss';

function MoviePage( { movies }) {
    const navigate = useNavigate();

  return (
    <div className="moviePage">
      <h2>SELECIONE O FILME</h2>
      <div className="moviePage__list">
        {movies.map(movie => (
          <div 
            key={movie.id} 
            className="moviePage__card"
            onClick={() => navigate(`/sessions/${movie.id}`)} 
          >
            <img src={movie.posterUrl} alt={movie.title} />
            <h3 className="moviePage__title">{movie.title}</h3>
          </div>
        ))}
      </div>
      <PurchaseCheck />

    </div>
  )
}

export default MoviePage;