import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/Profil.css";

export default function Profil({ onClose }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    axios
      .get("http://127.0.0.1:8000/api/utilisateurs/me/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setNom(`${response.data.first_name} ${response.data.last_name}`);
        setEmail(response.data.email);
      })
      .catch((error) => console.error("Erreur récupération utilisateur", error));
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    const formData = new FormData();
    if (nom) {
      const [firstName, ...lastName] = nom.split(" ");
      formData.append("first_name", firstName);
      formData.append("last_name", lastName.join(" ") || "");
    }
    if (email) formData.append("email", email);
    if (avatar) formData.append("avatar", avatar);

    try {
      const response = await axios.patch(
        "http://127.0.0.1:8000/api/utilisateurs/me/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Profil mis à jour !");
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error("Erreur mise à jour :", error);
      setMessage("Erreur lors de la mise à jour du profil.");
    }
  };

  return (
    <div className="profil-container">
      <h2>Modifier le Profil</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleUpdateProfile}>
        <div className="form-group">
          <label>Nom complet</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Avatar</label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>
        <div className="button-container">
          <button type="submit">Mettre à Jour</button>
          <button type="button" className="retour" onClick={onClose}>Annuler</button>
        </div>
      </form>
    </div>
  );
}
