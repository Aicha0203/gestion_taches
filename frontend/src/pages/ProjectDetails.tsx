import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TaskBoard from "../components/TaskBoard";
import ProjectsSidebar from "../components/ProjectsSidebar";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskDetails from "../components/TaskDetails";
import "../assets/ProjectDetails.css";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const fetchProjectDetails = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`http://127.0.0.1:8000/api/projets/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération du projet", error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  if (!project) {
    return <p className="loading">Chargement du projet...</p>;
  }

  return (
    <div className="project-details-container">
      <ProjectsSidebar project={project} />
      <div className="main-content">
        <h2 className="project-title">{project.emoji} {project.titre}</h2>

        <button className="action-btn faplus" onClick={() => setShowTaskModal(true)}>
          ➕ Nouvelle Tâche
        </button>

        {showTaskModal && (
          <CreateTaskModal projectId={id} onClose={() => setShowTaskModal(false)} refreshTasks={fetchProjectDetails} />
        )}

        {selectedTaskId && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={() => setSelectedTaskId(null)}>✖</button>
              <TaskDetails taskId={selectedTaskId} />
            </div>
          </div>
        )}

        <div className="content-layout">
          <TaskBoard projectId={id} refreshProject={fetchProjectDetails} onTaskClick={setSelectedTaskId} />
        </div>
      </div>
    </div>
  );
}
