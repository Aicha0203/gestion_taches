import "../assets/about.css";
import aboutImage from "../assets/about.png";

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-text">
          <h2>À propos de la Plateforme</h2>
          <p>
            Notre plateforme a été conçue spécialement pour les étudiants et professeurs de l'ESMT afin de simplifier la gestion des tâches et projets académiques.
            Grâce à une interface intuitive, vous pouvez organiser votre travail, collaborer efficacement et suivre vos progrès en temps réel.
          </p>
          <p>
            Profitez d'un système de gestion des tâches avancé avec suivi des performances, notifications intelligentes et outils de collaboration intégrés.
          </p>
          <a href="/register" className="about-btn">Rejoignez-nous maintenant</a>
        </div>
        <div className="about-image">
          <img src={aboutImage} alt="À propos de la plateforme" />
        </div>
      </div>
    </section>
  );
}
