import "../assets/footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="/conditions">Conditions d'utilisation</a>
        <a href="/confidentialite">Politique de confidentialité</a>
        <a href="mailto:support@gestiontaches.com">Contact</a>
      </div>
      <div className="footer-socials">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faGithub} className="social-icon" />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faLinkedin} className="social-icon" />
        </a>
      </div>
      <p>© 2025 Gestion Tâches ESMT. Tous droits réservés.</p>
    </footer>
  );
}
