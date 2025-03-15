import { useState } from "react";
import axiosInstance from "../api/auth";
import "../assets/ResetPassword.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/utilisateurs/password-reset/", {
        email,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setMessage(response.data.message);
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setError(error.response?.data?.error || "Erreur lors de la réinitialisation.");
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-image"></div>
      <div className="reset-password-form">
        <h2>Réinitialisation du Mot de Passe</h2>

        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}

        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe"
              required
            />
          </div>
          <div className="button-container">
            <button type="submit">Réinitialiser</button>
          </div>
        </form>
        <div className="login-link">
          <a href="/login">Retour à la connexion</a>
        </div>
      </div>
    </div>
  );
}