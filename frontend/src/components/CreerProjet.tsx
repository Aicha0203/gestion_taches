import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaClock, FaRocket, FaBook, FaLightbulb, FaBullseye } from "react-icons/fa";
import "../assets/CreerProjet.css";

export default function CreerProjet({ onClose, rafraichirProjets }: { onClose: () => void, rafraichirProjets: () => void }) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [dateLimite, setDateLimite] = useState("");
  const [statut, setStatut] = useState("En cours");
  const [rappel, setRappel] = useState("aucun");
  const [heureRappel, setHeureRappel] = useState("");
  const [emoji, setEmoji] = useState("rocket");
  const [loading, setLoading] = useState(false);
  const [taches, setTaches] = useState<{ titre: string; description: string }[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (rappel !== "custom") setHeureRappel("");
  }, [rappel]);

  const ajouterTache = () => {
    setTaches([...taches, { titre: "", description: "" }]);
  };

  const supprimerTache = (index: number) => {
    setTaches(taches.filter((_, i) => i !== index));
  };

  const modifierTache = (index: number, champ: "titre" | "description", valeur: string) => {
    const nouvellesTaches = [...taches];
    nouvellesTaches[index][champ] = valeur;
    setTaches(nouvellesTaches);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/api/projets/", {
        titre,
        description,
        date_limite: dateLimite,
        statut,
        rappel,
        heure_rappel: heureRappel || null,
        emoji,
        taches
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
      });

      alert("Projet créé avec succès !");
      rafraichirProjets();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création du projet", error);
    } finally {
      setLoading(false);
    }
  };

  const emojiOptions = [
    { key: "rocket", icon: <FaRocket /> },
    { key: "book", icon: <FaBook /> },
    { key: "lightbulb", icon: <FaLightbulb /> },
    { key: "bullseye", icon: <FaBullseye /> },
  ];

  return (
    <div className="creer-projet">
      <h2>Créer un projet</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Titre du projet" value={titre} onChange={(e) => setTitre(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="date" value={dateLimite} onChange={(e) => setDateLimite(e.target.value)} required />

        <select value={statut} onChange={(e) => setStatut(e.target.value)}>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
          <option value="En attente">En attente</option>
        </select>

        <label><FaClock /> Rappel :</label>
        <select value={rappel} onChange={(e) => setRappel(e.target.value)}>
          <option value="aucun">Aucun rappel</option>
          <option value="matin">Matin (09:00)</option>
          <option value="midi">Midi (12:00)</option>
          <option value="apresmidi">Après-midi (16:00)</option>
          <option value="soir">Soir (19:00)</option>
          <option value="custom">Personnalisé</option>
        </select>

        {rappel === "custom" && (
          <input type="time" value={heureRappel} onChange={(e) => setHeureRappel(e.target.value)} required />
        )}

        <label>Emoji du projet :</label>
        <div className="emoji-picker">
          <button type="button" className="emoji-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            {emojiOptions.find(e => e.key === emoji)?.icon || <FaRocket />}
          </button>
          {showEmojiPicker && (
            <div className="emoji-options">
              {emojiOptions.map(e => (
                <button key={e.key} onClick={() => { setEmoji(e.key); setShowEmojiPicker(false); }}>
                  {e.icon}
                </button>
              ))}
            </div>
          )}
        </div>

        <h3>📝 Ajouter des tâches (optionnel)</h3>
        {taches.map((tache, index) => (
          <div key={index} className="tache">
            <input type="text" placeholder="Titre de la tâche" value={tache.titre} onChange={(e) => modifierTache(index, "titre", e.target.value)} />
            <textarea placeholder="Description" value={tache.description} onChange={(e) => modifierTache(index, "description", e.target.value)} />
            <button type="button" onClick={() => supprimerTache(index)}><FaTrash /></button>
          </div>
        ))}
        <button type="button" onClick={ajouterTache}><FaPlus /> Ajouter une tâche</button>

        <div className="buttons">
          <button type="submit" disabled={loading}>{loading ? "Création..." : "Créer"}</button>
          <button type="button" className="cancel" onClick={onClose}>Annuler</button>
        </div>
      </form>
    </div>
  );
}
