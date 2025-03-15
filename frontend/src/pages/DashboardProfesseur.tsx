import { useState } from "react";
import Sidebar from "../components/Sidebar";
import HeaderEtudiant from "../components/HeaderEtudiant";
import KanbanBoard from "../components/KanbanBoard";
import StatsWidget from "../components/StatsWidget";
import EvolutionTaches from "../components/EvolutionTaches";
import CalendrierDeadlines from "../components/CalendrierDeadlines";
import ClassementEtudiants from "../components/ClassementEtudiants";
import EvaluationProfesseurs from "../components/EvaluationProfesseurs";
import Chat from "../pages/Chat";
import Dash from "../assets/dash.png";
import { StatsProvider } from "../context/StatsContext";
import {
  FaChartBar,
  FaFolderOpen,
  FaTasks,
  FaUsers,
  FaCalendarAlt,
  FaChartPie,
  FaComments,
  FaCog,
} from "react-icons/fa";
import "../assets/DashboardEtudiant.css";

export default function DashboardProfesseur() {
  const [section, setSection] = useState("dashboard");

  return (
    <StatsProvider>
      <div className="dashboard-etudiant">
        <Sidebar setSection={setSection} />
        <div className="main-content">
          <HeaderEtudiant />

          <div className="evaluation-professeurs-section">
            <EvaluationProfesseurs />
          </div>

          <div className="dashboard-content">
            {section === "dashboard" && (
              <div key="dashboard-section" className="dashboard-layout">
                <div className="top-row">
                  <div className="image-container">
                    <img src={Dash} alt="Tableau de bord" className="dashboard-image" />
                  </div>
                  <div className="stats-container">
                    <StatsWidget />
                  </div>
                </div>

                <div className="middle-row">
                  <div className="chart-section">
                    <div className="card">
                      <h3>Progression et Évolution des Tâches Complètes</h3>
                      <div className="card-content">
                        <EvolutionTaches />
                      </div>
                    </div>
                  </div>

                  <div className="tasks-section">
                    <div className="card">
                      <h3>Tâches Actives</h3>
                      <div className="card-content">
                        <KanbanBoard simplified={true} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bottom-row">
                  <div className="calendar-section">
                    <div className="card">
                      <h3>Deadline</h3>
                      <div className="card-content">
                        <CalendrierDeadlines />
                      </div>
                    </div>
                  </div>

                  <div className="classement-section">
                    <div className="card">
                      <h3>Étudiants les Plus Actifs</h3>
                      <div className="card-content">
                        <ClassementEtudiants />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {section === "taches" && (
              <div key="tasks-section">
                <h2 className="section-title"><FaTasks /> Gestion de mes tâches</h2>
                <KanbanBoard />
              </div>
            )}

            {section === "equipe" && (
              <div key="team-section">
                <h2 className="section-title"><FaUsers /> Collaboration avec l'équipe</h2>
              </div>
            )}

            {section === "calendrier" && (
              <div key="calendar-section">
                <h2 className="section-title"><FaCalendarAlt /> Planification & Échéances</h2>
                <CalendrierDeadlines fullView={true} />
              </div>
            )}

            {section === "statistiques" && (
              <div key="stats-section">
                <h2 className="section-title"><FaChartPie /> Suivi des performances</h2>
                <div className="stats-layout">
                  <div className="card">
                    <h3>Statistiques Détaillées</h3>
                    <div className="card-content">
                      <StatsWidget detailed={true} />
                    </div>
                  </div>
                  <div className="card">
                    <h3>Évolution des Tâches</h3>
                    <div className="card-content">
                      <EvolutionTaches fullView={true} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {section === "chat" && (
              <div key="chat-section">
                <h2 className="section-title"><FaComments /> Discussions en temps réel</h2>
                <Chat />
              </div>
            )}
          </div>
        </div>
      </div>
    </StatsProvider>
  );
}
