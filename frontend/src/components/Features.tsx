import "../assets/features.css";
import tableauKanbanImage from "../assets/kanban.png";
import chatImage from "../assets/chat.png";
import statsImage from "../assets/stats.png";
import professeurImage from "../assets/professeur.png";
import etudiantImage from "../assets/etudiant.png";

export default function Features() {
  return (
    <section id ="fonctionnalites" className="features-esmt">
      <div className="features-header">
        <h2>Fonctionnalités de la Plateforme ESMT</h2>
        <p>Une solution complète pour la gestion de projets académiques</p>
      </div>

      <div className="features-grid">

        <div className="feature-card">
          <div className="feature-icon">
            <img src={tableauKanbanImage} alt="Tableau Kanban" />
          </div>
          <div className="feature-content">
            <h3>Gestion des Tâches</h3>
            <p>Tableau Kanban interactif pour organiser et suivre vos projets académiques.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <img src={chatImage} alt="Collaboration" />
          </div>
          <div className="feature-content">
            <h3>Collaboration en Temps Réel</h3>
            <p>Communiquez instantanément et annotez les tâches avec vos collègues.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <img src={statsImage} alt="Statistiques" />
          </div>
          <div className="feature-content">
            <h3>Suivi de Progression</h3>
            <p>Suivez les performances et l’avancement des projets avec des graphiques détaillés.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <img src={professeurImage} alt="Espace Professeur" />
          </div>
          <div className="feature-content">
            <h3>Espace Professeur</h3>
            <p>Supervision des projets, système de primes et outils d'évaluation performants.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <img src={etudiantImage} alt="Collaboration Étudiante" />
          </div>
          <div className="feature-content">
            <h3>Collaboration Étudiante</h3>
            <p>Gestion collaborative des projets avec répartition dynamique des tâches.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
