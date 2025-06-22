import './footer.scss';

function Footer({ movies, movieId, sessionTime, dateTime }) {
  const movie = movies.find(movie => movie.id === Number(movieId));

  if (!movie) return null;

  return (
    <footer className="footer">
      <div className="footer__content">
        <img src={movie.posterUrl} alt={movie.title} />
        <div>
          <span>{movie.title}</span>
          <p>{sessionTime && `${dateTime} - ${sessionTime}`}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;