import { useState, useEffect } from "react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import "../assets/CreateTaskModal.css";

const CreateTaskModal = ({ projectId, onClose, refreshTasks }) => {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [dateLimite, setDateLimite] = useState("");
  const [assigneA, setAssigneA] = useState("");
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [selectedEmoji, setSelectedEmoji] = useState("➕");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const token = localStorage.getItem("access_token");
        let role = localStorage.getItem("role");

        if (!role) return;
        role = role.toUpperCase();

        const response = await axios.get("http://127.0.0.1:8000/api/utilisateurs/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const usersData = response.data.results ? response.data.results : response.data;
        let filteredUsers = [];

        if (role === "ETUDIANT") {
          filteredUsers = usersData.filter(user => user.role === "ETUDIANT" && user.username !== localStorage.getItem("username"));
        } else if (role === "PROFESSEUR") {
          filteredUsers = usersData.filter(user => user.role !== "ADMIN");
        }

        setUtilisateurs(filteredUsers);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUtilisateurs();
  }, []);

  const handleEmojiClick = (emojiObject) => {
    setSelectedEmoji(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titre.trim()) return;

    try {
        const token = localStorage.getItem("access_token");
        const data = {
            titre: `${selectedEmoji} ${titre}`,
            description,
            date_limite: dateLimite || null,
            projet: projectId, // Vérification importante ✅
            assigne_a: assigneA || null,
        };

        console.log("📡 Données envoyées pour la création de la tâche :", data); // ✅ Debug
        const response = await axios.post("http://127.0.0.1:8000/api/taches/create/", data, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Réponse reçue :", response.data);
        refreshTasks();
        onClose();
    } catch (error) {
        console.error("❌ Erreur lors de la création de la tâche", error);
        if (error.response) {
            console.error("🔴 Réponse du serveur :", error.response.data);
        }
    }
  };



  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Ajouter une tâche</h2>
        <button className="close-btn" onClick={onClose}>✖</button>
        <form onSubmit={handleSubmit}>
          <div className="emoji-selector">
            <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              {selectedEmoji}
            </button>
            {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
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
          <button type="submit" className="submit-btn">Ajouter</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
