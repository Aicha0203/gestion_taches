import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEdit2, FiArchive } from "react-icons/fi";
import axios from "axios";
import "../assets/ProjectList.css";

interface ProjectListProps {
  projects: Array<{
    id: number;
    titre: string;
    description: string;
    statut?: string;
    date_limite?: string;
    emoji?: string;
    progression?: number;
    createur: {
      id: number;
      username: string;
      avatar?: string;
    };
    membres?: Array<{
      id: number;
      username: string;
      avatar?: string;
    }>;
    taches: Array<{
      id: number;
      statut: string;
    }>;
  }>;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const navigate = useNavigate();

  const handleDeleteProject = async (id: number, titre: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Voulez-vous vraiment supprimer le projet "${titre}" ?`)) {
      try {
        const token = localStorage.getItem("access_token");
        await axios.delete(`http://127.0.0.1:8000/api/projets/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Projet supprimé avec succès !");
        window.location.reload();
      } catch (error) {
        console.error("Erreur lors de la suppression du projet", error);
        alert("Erreur lors de la suppression du projet.");
      }
    }
  };

  const getProjectStatus = (project: any) => {
    const { taches, date_limite } = project;
    const totalTaches = taches.length;
    const tachesTerminees = taches.filter((t: any) => t.statut === "TERMINE").length;
    const maintenant = new Date().toISOString().split("T")[0];

    if (totalTaches === 0) return "En attente";
    if (totalTaches === tachesTerminees) return "Terminé";
    if (date_limite && date_limite < maintenant) return "En retard";
    return "En cours";
  };

  return (
    <div className="projects-list">
      <div className="list-header">
        <div className="header-cell header-title">Titre</div>
        <div className="header-cell header-progress">Progression</div>
        <div className="header-cell header-status">Statut</div>
        <div className="header-cell header-deadline">Échéance</div>
        <div className="header-cell header-members">Membres</div>
        <div className="header-cell header-actions">Actions</div>
      </div>

      {projects.map((project) => {
        const statut = getProjectStatus(project);
        const statutClass = statut.toLowerCase().replace(" ", "-");

        const dateEcheance = project.date_limite
          ? new Date(project.date_limite).toLocaleDateString("fr-FR")
          : "Non défini";

        const totalMembres = new Set([
          project.createur.id,
          ...(project.membres?.map((m) => m.id) || []),
          ...project.taches.map((t) => t.assigne_a).filter(Boolean)
        ]).size;

        return (
          <div key={project.id} className="list-row" onClick={() => navigate(`/projects/${project.id}`)}>
            <div className="cell cell-title">
              <span className="project-emoji">{project.emoji || "📌"}</span>
              <span className="project-title">{project.titre}</span>
            </div>

            <div className="cell cell-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${project.progression || 0}%` }}></div>
              </div>
              <span className="progress-text">{project.progression || 0}%</span>
            </div>

            <div className="cell cell-status">
              <span className={`status-badge ${statutClass}`}>
                {statut}
              </span>
            </div>

            <div className="cell cell-deadline">{dateEcheance}</div>

            <div className="cell cell-members">
              {totalMembres > 0 ? (
                <span>{totalMembres} membre(s)</span>
              ) : (
                <span className="no-members">Aucun</span>
              )}
            </div>

            <div className="cell cell-actions">
              <button className="action-btn view-btn" onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }}><FiEye /></button>
              <button className="action-btn edit-btn" onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}/edit`); }}><FiEdit2 /></button>
              <button className="action-btn archive-btn" onClick={(e) => handleDeleteProject(project.id, project.titre, e)}><FiArchive /></button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectList;
