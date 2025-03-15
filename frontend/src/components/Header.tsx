import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faList,
  faInfoCircle,
  faSignInAlt,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import "../assets/header.css";

export default function Header() {
  return (
    <header className="header-esmt">
      <div className="logo-container">
        <FontAwesomeIcon icon={faList} className="logo-icon" />
        <span className="logo-text">Gestion Tâches ESMT</span>
      </div>
      <nav className="nav-menu">
        <ul className="nav-links">
          <li>
          <Link
              to="#"
              className="nav-item"
              onClick={() => {
                const section = document.getElementById("accueil");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <FontAwesomeIcon icon={faHome} className="nav-icon" />
              <span>Accueil</span>
            </Link>
          </li>
          <li>
          <Link
              to="#"
              className="nav-item"
              onClick={() => {
                const section = document.getElementById("fonctionnalites");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
            <FontAwesomeIcon icon={faList} className="nav-icon" />
              <span>Fonctionnalités</span>
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="nav-item"
              onClick={() => {
                const section = document.getElementById("about");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} className="nav-icon" />
              <span>À propos</span>
            </Link>
          </li>
        </ul>
        <div className="auth-buttons">
          <Link to="/login" className="nav-item login">
            <FontAwesomeIcon icon={faSignInAlt} className="auth-icon" />
            <span>Se connecter</span>
          </Link>
          <Link to="/register" className="nav-item register">
            <FontAwesomeIcon icon={faUserPlus} className="auth-icon" />
            <span>S'inscrire</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}