import "../assets/hero.css";
import heroImage from "../assets/hero-image.png";

export default function Hero() {
  return (
    <section id = "accueil" className="hero">
      <div className="hero-content">
        <h1>Simplifiez la gestion de vos tâches et projets à l’ESMT !</h1>
        <p>Un outil conçu pour les professeurs et étudiants afin d’optimiser l’organisation, collaborer efficacement et suivre l’avancement des projets en temps réel.</p>
        <a href="/register" className="cta-button">Commencer dès maintenant</a>
      </div>
      <div className="hero-image">
        <img src={heroImage} alt="Aperçu de l'application" />
      </div>
    </section>
  );
}
