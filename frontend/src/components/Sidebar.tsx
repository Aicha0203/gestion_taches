import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartPie, FaFolderOpen, FaTasks, FaUsers, FaCalendarAlt,
  FaChartBar, FaComments, FaCog, FaPlus
} from "react-icons/fa";
import "../assets/Sidebar.css";
import CreerProjet from "./CreerProjet";

export default function Sidebar({ setSection }: { setSection: (section: string) => void }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [afficherFormulaireProjet, setAfficherFormulaireProjet] = useState(false);
  const navigate = useNavigate();

  const handleClick = (section: string) => {
      setActiveSection(section);
      setSection(section);

      console.log(`🔗 Navigation vers ${section}`); // ✅ Ajout du log pour tester

      if (section === "projets") {
        navigate("/projects");
      } else if (section === "discussions") {
        console.log("✅ Chat sélectionné, mise à jour de l'état !");
        navigate("/chat");
      }
  };


  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li className={activeSection === "dashboard" ? "active" : ""} onClick={() => handleClick("dashboard")}>
            <FaChartPie /> Tableau de bord
          </li>
          <li className={activeSection === "projets" ? "active" : ""} onClick={() => handleClick("projets")}>
            <FaFolderOpen /> Projets
          </li>
          <li className={activeSection === "taches" ? "active" : ""} onClick={() => handleClick("taches")}>
            <FaTasks /> Tâches
          </li>
          <li className={activeSection === "equipe" ? "active" : ""} onClick={() => handleClick("equipe")}>
            <FaUsers /> Équipe
          </li>
          <li className={activeSection === "calendrier" ? "active" : ""} onClick={() => handleClick("calendrier")}>
            <FaCalendarAlt /> Calendrier
          </li>
          <li className={activeSection === "statistiques" ? "active" : ""} onClick={() => handleClick("statistiques")}>
            <FaChartBar /> Statistiques
          </li>
          <li className={activeSection === "discussions" ? "active" : ""} onClick={() => handleClick("discussions")}>
            <FaComments /> Chat
          </li>
        </ul>
      </nav>

      <div className="quick-create">
        <button className="btn-create" onClick={() => setMenuOuvert(!menuOuvert)}>
          <FaPlus /> Créer
        </button>
        {menuOuvert && (
          <div className="quick-menu">
            <button onClick={() => setAfficherFormulaireProjet(true)}>📁 Nouveau projet</button>
          </div>
        )}
      </div>

      {afficherFormulaireProjet && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setAfficherFormulaireProjet(false)}>✖</button>
            <CreerProjet onClose={() => setAfficherFormulaireProjet(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
