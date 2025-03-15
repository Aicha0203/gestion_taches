import { useState, useEffect } from "react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import "../assets/EditTaskModal.css";

const EditTaskModal = ({ taskId, onClose, refreshTasks }) => {
  const [task, setTask] = useState(null);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [dateLimite, setDateLimite] = useState("");
  const [assigneA, setAssigneA] = useState("");
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [selectedEmoji, setSelectedEmoji] = useState("➕");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loadingTask, setLoadingTask] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  if (!taskId) {
    console.error("ERREUR : `taskId` est undefined. Vérifiez que `EditTaskModal` reçoit bien `taskId`.");
    return <p className="error-message">Erreur : tâche introuvable.</p>;
  }

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        console.log("Récupération des détails de la tâche...");
        const token = localStorage.getItem("access_token");

        const response = await axios.get(`http://127.0.0.1:8000/api/taches/${taskId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedTask = response.data;
        console.log("Tâche récupérée :", fetchedTask);

        setTask(fetchedTask);
        setTitre(fetchedTask.titre.replace(/^\S+\s/, ""));
        setDescription(fetchedTask.description);
        setDateLimite(fetchedTask.date_limite || "");
        setAssigneA(fetchedTask.assigne_a?.id || "");
        setSelectedEmoji(fetchedTask.titre.split(" ")[0]);

        setLoadingTask(false);
      } catch (error) {
        console.error("Erreur lors du chargement de la tâche :", error);
        setLoadingTask(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        console.log("Récupération des utilisateurs...");
        const token = localStorage.getItem("access_token");

        const response = await axios.get("http://127.0.0.1:8000/api/utilisateurs/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const usersData = response.data.results ? response.data.results : response.data;
        console.log("Utilisateurs récupérés :", usersData);
        setUtilisateurs(usersData);
        setLoadingUsers(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
        setLoadingUsers(false);
      }
    };

    fetchUtilisateurs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titre.trim()) return;

    try {
      const token = localStorage.getItem("access_token");
      const data = {
        titre: `${selectedEmoji} ${titre}`,
        description,
        date_limite: dateLimite || null,
        assigne_a: assigneA ? parseInt(assigneA, 10) : null,
      };

      console.log("Modification de la tâche avec les données :", data);

      const response = await axios.patch(
        `http://127.0.0.1:8000/api/taches/${taskId}/update/`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Réponse de l'API :", response.data);
      refreshTasks();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la modification de la tâche", error);
    }
  };

  if (loadingTask) {
    return <p className="loading">⏳ Chargement de la tâche...</p>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Modifier la tâche</h2>
        <button className="close-btn" onClick={onClose}>✖</button>
        <form onSubmit={handleSubmit}>
          <div className="emoji-selector">
            <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              {selectedEmoji}
            </button>
            {showEmojiPicker && <EmojiPicker onEmojiClick={(emojiObject) => setSelectedEmoji(emojiObject.emoji)} />}
          </div>

          <input type="text" placeholder="Titre de la tâche..." value={titre} onChange={(e) => setTitre(e.target.value)} required />
          <textarea placeholder="Description de la tâche..." value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="date" value={dateLimite} onChange={(e) => setDateLimite(e.target.value)} />

          {loadingUsers ? (
            <p>Chargement des utilisateurs...</p>
          ) : (
            <select value={assigneA} onChange={(e) => setAssigneA(e.target.value)}>
              <option value="">Assigner à...</option>
              {utilisateurs.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.username}
                </option>
              ))}
            </select>
          )}

          <button type="submit" className="submit-btn">Modifier</button>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
