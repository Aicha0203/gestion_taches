import { useTaches } from "../context/TachesContext";
import axios from "axios";
import "../assets/KanbanBoard.css";

export default function KanbanBoard() {
  const { tachesAssignees, tachesProjetsCreees, refreshTaches } = useTaches();

  // ✅ Fonction pour mettre à jour le statut de la tâche
  const handleStatusChange = async (tacheId, newStatus) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(`http://127.0.0.1:8000/api/taches/${tacheId}/update/`,
        { statut: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(`✅ Tâche ${tacheId} mise à jour avec le statut : ${newStatus}`);
      refreshTaches(); // Met à jour l'affichage après modification
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour de la tâche :", error);
    }
  };

  return (
    <div className="kanban-board">
      <h2>📌 Mes Tâches Assignées</h2>
      <div className="kanban-columns">
        {["A_FAIRE", "EN_COURS", "TERMINE"].map((statut) => (
          <div key={statut} className="kanban-column">
            <h3>
              {statut === "A_FAIRE" ? "📌 À Faire" :
              statut === "EN_COURS" ? "⏳ En Cours" :
              "✅ Terminées"}
            </h3>
            {tachesAssignees?.filter(t => t.statut === statut).length ? (
              tachesAssignees
                .filter(t => t.statut === statut)
                .map(tache => (
                  <div key={tache.id} className="kanban-card">
                    <strong>{tache.titre}</strong>
                    <p>{tache.description}</p>

                    {/* ✅ Sélecteur pour modifier le statut */}
                    <select
                      value={tache.statut}
                      onChange={(e) => handleStatusChange(tache.id, e.target.value)}
                    >
                      <option value="A_FAIRE">📌 À Faire</option>
                      <option value="EN_COURS">⏳ En Cours</option>
                      <option value="TERMINE">✅ Terminée</option>
                    </select>
                  </div>
                ))
            ) : (
              <p>Aucune tâche.</p>
            )}
          </div>
        ))}
      </div>

      <h2>📊 Suivi des Tâches de mes Projets</h2>
      <div className="kanban-columns">
        {["A_FAIRE", "EN_COURS", "TERMINE"].map((statut) => (
          <div key={statut} className="kanban-column">
            <h3>
              {statut === "A_FAIRE" ? "📌 À Faire" :
              statut === "EN_COURS" ? "⏳ En Cours" :
              "✅ Terminées"}
            </h3>
            {tachesProjetsCreees?.filter(t => t.statut === statut).length ? (
              tachesProjetsCreees
                .filter(t => t.statut === statut)
                .map(tache => (
                  <div key={tache.id} className="kanban-card">
                    <strong>{tache.titre}</strong>
                    <p>{tache.description}</p>

                    {/* ✅ Sélecteur pour modifier le statut */}
                    <select
                      value={tache.statut}
                      onChange={(e) => handleStatusChange(tache.id, e.target.value)}
                    >
                      <option value="A_FAIRE">📌 À Faire</option>
                      <option value="EN_COURS">⏳ En Cours</option>
                      <option value="TERMINE">✅ Terminée</option>
                    </select>
                  </div>
                ))
            ) : (
              <p>Aucune tâche.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
