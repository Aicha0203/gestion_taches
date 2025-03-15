import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditTaskModal from "./EditTaskModal";
import "../assets/TaskDetails.css";

export default function TaskDetails({ taskId }) {
  const [task, setTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`http://127.0.0.1:8000/api/taches/${taskId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📡 Données de la tâche récupérées :", response.data);
      setTask(response.data);
      setError(null);
    } catch (error) {
      console.error("Erreur lors de la récupération de la tâche", error);
      setError("Tâche non trouvée !");
    }
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!task) {
    return <p className="loading">⏳ Chargement...</p>;
  }

  const assigne_a = task.assigne_a
    ? `${task.assigne_a.first_name || ""} ${task.assigne_a.last_name || ""}`.trim() || task.assigne_a.username
    : "Non assigné";

  const projet_nom = task.projet?.titre || "Projet non défini";

  return (
    <div className="task-details">
      <h2>{task.titre || "Tâche sans titre"}</h2>
      <p>{task.description || "Aucune description fournie."}</p>

      <div className="task-info">
        <p><strong>📅 Date Limite :</strong> {task.date_limite || "Non définie"}</p>
        <p><strong>👤 Assigné à :</strong> {assigne_a}</p>
        <p><strong>📌 Projet :</strong> {projet_nom}</p>
        <p><strong>🚦 Statut :</strong> {task.statut || "Non défini"}</p>
      </div>

      <div className="task-actions">
        <button className="action-btn edit" onClick={() => setShowEditModal(true)}>
          <FaEdit /> Modifier
        </button>
        <button className="action-btn delete" onClick={() => {
          if (window.confirm("Voulez-vous supprimer cette tâche ?")) {
            handleDeleteTask();
          }
        }}>
          <FaTrash /> Supprimer
        </button>
      </div>

      {showEditModal && (
        <EditTaskModal
          taskId={task.id}
          projectId={task.projet?.id}
          onClose={() => setShowEditModal(false)}
          refreshTasks={fetchTask}
          existingTask={task}
        />
      )}
    </div>
  );
}
