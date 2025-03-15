import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../assets/login.css";

export default function Login() {
  const { login } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/utilisateurs/csrf/");
        const token = response.data.csrfToken;
        axios.defaults.headers.common["X-CSRFToken"] = token;
        console.log("CSRF Token récupéré :", token);
      } catch (error) {
        console.error("Erreur lors de la récupération du token CSRF :", error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
        const userData = await login(usernameOrEmail, password);

        if (userData) {
            console.log("Connexion réussie :", userData);

            localStorage.setItem("role", userData.role.toUpperCase());
            localStorage.setItem("username", userData.username);

            console.log("Rôle sauvegardé :", localStorage.getItem("role"));
            console.log("Username sauvegardé :", localStorage.getItem("username"));
        } else {
            console.warn("Aucune donnée utilisateur reçue après connexion.");
        }

    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        setError("Identifiant ou mot de passe incorrect");
    }
  };

  return (
    <div className="login-container">
      <div className="login-image"></div>
      <div className="login-form">
        <h2>Connexion</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Email ou Nom d'utilisateur"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
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
          <div className="button-container">
            <button type="submit">Se connecter</button>
          </div>
        </form>
        <p className="register-link">
          Pas encore de compte ? <a href="/register">Inscrivez-vous</a>
        </p>
        <p className="forgot-password">
          <a href="/reset-password">Mot de passe oublié ?</a>
        </p>
      </div>
    </div>
  );
}
