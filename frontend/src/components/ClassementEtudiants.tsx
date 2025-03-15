import { useState, useEffect } from "react";
import axios from "axios";
import { FaMedal, FaTrophy, FaUserGraduate } from "react-icons/fa";
import "../assets/ClassementEtudiants.css";

export default function ClassementEtudiants() {
  const [classement, setClassement] = useState<
    { nom: string; taches_terminees: number; avatar: string | null }[]
  >([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/stats/etudiants-actifs/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      })
      .then((response) => {
        setClassement(response.data);
      })
      .catch((error) => console.error("Erreur récupération classement", error));
  }, []);

  return (
    <div className="classement-etudiants">
      <h3><FaTrophy /> Étudiants les plus actifs</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Tâches terminées</th>
          </tr>
        </thead>
        <tbody>
          {classement.length > 0 ? (
            classement.map((etudiant, index) => (
              <tr key={index} className={index < 3 ? "top3" : ""}>
                <td>
                  {index === 0 ? <FaMedal style={{ color: "#FFD700" }} /> :
                  index === 1 ? <FaMedal style={{ color: "#C0C0C0" }} /> :
                  index === 2 ? <FaMedal style={{ color: "#CD7F32" }} /> :
                  index + 1}
                </td>
                <td className="etudiant-info">
                  <img src={etudiant.avatar || "/default-avatar.png"} alt={etudiant.nom} className="avatar"/>
                  {etudiant.nom}
                </td>
                <td>{etudiant.taches_terminees}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={3}>Aucun étudiant actif pour le moment.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
