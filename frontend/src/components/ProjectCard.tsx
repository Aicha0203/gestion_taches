import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEdit2, FiArchive } from "react-icons/fi";
import axios from "axios";
import "../assets/ProjectCard.css";

interface ProjectCardProps {
  project: {
    id: number;
    titre: string;
    description: string;
    statut: string;
    date_limite?: string;
    emoji?: string;
    progression?: number;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(project.progression || 0);

  useEffect(() => {
    setProgress(project.progression || 0);
  }, [project.progression]);

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="project-card" onClick={handleViewDetails}>
      <div className="project-header">
        <div className="project-emoji">{project.emoji || "📌"}</div>
        <h3 className="project-title">{project.titre}</h3>
        <div className="project-status">{project.statut}</div>
      </div>

      <p className="project-description">{project.description}</p>

      <div className="project-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="progress-text">{progress}%</span>
      </div>
    </div>
  );
};

export default ProjectCard;
