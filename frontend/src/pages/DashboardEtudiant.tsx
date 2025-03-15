import { useState } from "react";
import Sidebar from "../components/Sidebar";
import HeaderEtudiant from "../components/HeaderEtudiant";
import KanbanBoard from "../components/KanbanBoard";
import StatsWidget from "../components/StatsWidget";
import EvolutionTaches from "../components/EvolutionTaches";
import CalendrierDeadlines from "../components/CalendrierDeadlines";
import ClassementEtudiants from "../components/ClassementEtudiants";
import Dash from "../assets/dash.png";
import { StatsProvider } from "../context/StatsContext";
import Profil from "../components/Profil";
import Chat from "../pages/Chat";
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

export default function DashboardEtudiant() {
  const [section, setSection] = useState("dashboard");
  const [afficherProfil, setAfficherProfil] = useState(false);

  return (
    <StatsProvider>
      <div className="dashboard-etudiant">
        <Sidebar setSection={setSection} />
        <div className="main-content">
          <HeaderEtudiant onEditProfile={() => setAfficherProfil(true)} />

          <div className="dashboard-content">
            {afficherProfil ? (
              <Profil onClose={() => setAfficherProfil(false)} />
            ) : (
              <>
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

                {section === "chat" && (
                  <div key="chat-section">
                    <h2 className="section-title"><FaComments /> Discussions en temps réel</h2>
                    <Chat />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </StatsProvider>
  );
}
