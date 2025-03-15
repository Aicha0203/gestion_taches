import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/auth";
import "../assets/register.css";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ETUDIANT");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
        await axiosInstance.post("/api/utilisateurs/", {
            first_name: firstName,
            last_name: lastName,
            username,
            email,
            password,
            role
        });
      navigate("/login");
    } catch (err) {
      setError("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="register-container">
      <div className="register-image"></div>
      <div className="register-form">
        <h2>Inscription</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ETUDIANT">Étudiant</option>
              <option value="PROFESSEUR">Professeur</option>
            </select>
          </div>
          <div className="button-container">
            <button type="submit">S'inscrire</button>
          </div>
        </form>
        <p className="login-link">Déjà inscrit ? <a href="/login">Connectez-vous</a></p>
      </div>
    </div>
  );
}
