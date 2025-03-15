import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/EvaluationProfesseurs.css";

interface ProfesseurEvaluation {
  total_taches: number;
  taches_terminees: number;
  taux_completion: number;
  taux_delai: number;
  prime: number;
}

export default function EvaluationProfesseur() {
  const [evaluation, setEvaluation] = useState<ProfesseurEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setMessage("Erreur : Aucun token d'accès trouvé. Veuillez vous reconnecter.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/stats/evaluation-professeur/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Données API reçues :", response.data);

        if (response.data && response.data.total_taches !== undefined) {
          setEvaluation(response.data);
        } else {
          setMessage("Aucune tâche assignée pour l'instant.");
        }
      } catch (error: any) {
        console.error("Erreur lors de la récupération de l'évaluation :", error);

        if (error.response) {
          if (error.response.status === 403) {
            setMessage("Accès refusé. Seuls les professeurs peuvent voir leur évaluation.");
          } else if (error.response.status === 404) {
            setMessage("L'API d'évaluation n'existe pas. Vérifiez l'URL.");
          } else {
            setMessage(`Erreur du serveur : ${error.response.status}`);
          }
        } else if (error.request) {
          setMessage("Impossible de contacter le serveur. Vérifiez votre connexion.");
        } else {
          setMessage("Erreur inconnue lors de la récupération des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, []);

  if (loading) return <p>⏳ Chargement de votre évaluation...</p>;
  if (message) return <p className="error-message">{message}</p>;

  return (
    <div className="evaluation-container">
      <div className="evaluation-card">
        <h2>Votre Évaluation</h2>
        <div className="evaluation-details">
          <p><strong>Tâches Assignées :</strong> {evaluation?.total_taches}</p>
          <p><strong>Tâches Terminées :</strong> {evaluation?.taches_terminees}</p>
          <p><strong>% de Tâches Complétées :</strong> {evaluation?.taux_completion}%</p>
          <p><strong>% de Délais Respectés :</strong> {evaluation?.taux_delai}%</p>
          <p className={`prime ${evaluation?.prime > 0 ? "active" : ""}`}>
            <strong>Récompense :</strong> {evaluation?.prime > 0 ? `${evaluation.prime} FCFA` : "Aucune récompense"}
          </p>
        </div>
      </div>
    </div>
  );
}
