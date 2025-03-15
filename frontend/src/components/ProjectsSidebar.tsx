import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaClock,
  FaCheckCircle,
  FaSignOutAlt,
  FaArrowLeft,
  FaBars,
} from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../assets/ProjectsSidebar.css";

const ProjectsSidebar: React.FC<{ projectId: number }> = ({ projectId }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true); // État pour gérer le sidebar sur mobile
  const [stats, setStats] = useState({
    totalProjects: 0,
    inProgress: 0,
    completed: 0,
    totalTasks: 0,
    tasksInProgress: 0,
    tasksCompleted: 0,
    tasksLate: 0,
  });
  const [etudiants, setEtudiants] = useState<string[]>([]);
  const [professeurs, setProfesseurs] = useState<string[]>([]);

  useEffect(() => {
    const fetchStatsAndUsers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("Aucun token trouvé, redirection vers login...");
          logout();
          return;
        }

        const [projectsResponse, usersResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/projets/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/utilisateurs/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const projets = projectsResponse.data.results || [];
        const utilisateurs = usersResponse.data.results || usersResponse.data;

        let totalTasks = 0;
        let tasksInProgress = 0;
        let tasksCompleted = 0;
        let tasksLate = 0;
        let inProgress = 0;
        let completed = 0;

        projets.forEach((projet) => {
          const total = projet.taches.length;
          const done = projet.taches.filter((t) => t.statut === "TERMINE").length;
          const inProgressTasks = projet.taches.filter((t) => t.statut === "EN_COURS").length;
          const lateTasks = projet.taches.filter((t) => t.statut === "EN_RETARD").length;

          totalTasks += total;
          tasksCompleted += done;
          tasksInProgress += inProgressTasks;
          tasksLate += lateTasks;

          if (total === done && total > 0) {
            completed += 1;
          } else {
            inProgress += 1;
          }
        });

        setStats({
          totalProjects: projets.length,
          inProgress,
          completed,
          totalTasks,
          tasksInProgress,
          tasksCompleted,
          tasksLate,
        });

        const etudiantsList = utilisateurs
          .filter((user) => user.role === "ETUDIANT")
          .map((user) => `${user.first_name} ${user.last_name}`);

        const professeursList = utilisateurs
          .filter((user) => user.role === "PROFESSEUR")
          .map((user) => `${user.first_name} ${user.last_name}`);

        setEtudiants(etudiantsList);
        setProfesseurs(professeursList);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques et utilisateurs", error);
        if (error.response && error.response.status === 401) {
          alert("Votre session a expiré. Veuillez vous reconnecter.");
          logout();
        }
      }
    };

    fetchStatsAndUsers();
  }, [projectId]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </button>

      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Retour
        </button>

        <div className="sidebar-section">
          <h3 className="section-title">
            <FaChartPie /> Statistiques Globales
          </h3>

          <div className="stats">
            <div className="stat-item">
              <FaClock className="stat-icon" />
              <div className="stat-info">
                <div className="stat-value">{stats.inProgress}</div>
                <div className="stat-label">Projets en cours</div>
              </div>
            </div>

            <div className="stat-item">
              <FaCheckCircle className="stat-icon" />
              <div className="stat-info">
                <div className="stat-value">{stats.completed}</div>
                <div className="stat-label">Projets terminés</div>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <h3>📌 Etudiants</h3>
          <ul>{etudiants.map((etudiant, index) => <li key={index}>{etudiant}</li>)}</ul>
        </div>

        <div className="sidebar-section">
          <h3>👨‍🏫 Professeurs</h3>
          <ul>{professeurs.map((professeur, index) => <li key={index}>{professeur}</li>)}</ul>
        </div>

        <div className="sidebar-section">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
};

export default ProjectsSidebar;
