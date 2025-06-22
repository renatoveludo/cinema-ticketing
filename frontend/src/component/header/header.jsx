import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import './header.scss';

function Header({ setSelectedSessionTime, setSelectedDateTime }) {
  const location = useLocation();
  const navigate = useNavigate();

const isBackButtonVisible = 
  location.pathname.startsWith('/sessions') || location.pathname.startsWith('/seat');

  return (
    <header className="header">
      {isBackButtonVisible && (
        <div 
          onClick={() => {
            navigate(-1);
            setSelectedSessionTime('');
            setSelectedDateTime('');
          }}
          className="header__back" aria-label="Voltar">
          <FaArrowLeft />
        </div>
      )}
      <h1 className="header__title">CINEFLEX</h1>
    </header>
  )
}

export default Header;