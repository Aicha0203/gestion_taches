import { useState, useEffect } from "react";
import axios from "axios";
import Profil from "./Profil";
import { FaBell, FaUserCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import "../assets/HeaderEtudiant.css";

interface Notification {
  id: number;
  message: string;
  lu: boolean;
}

interface Utilisateur {
  nom: string;
  avatar: string;
  role: string;
}

export default function HeaderEtudiant() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [afficherNotifications, setAfficherNotifications] = useState(false);
  const [afficherMenuProfil, setAfficherMenuProfil] = useState(false);
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [afficherProfil, setAfficherProfil] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [notificationsRes, utilisateurRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/notifications/", config),
          axios.get("http://127.0.0.1:8000/api/utilisateurs/me/", config),
        ]);

        setNotifications(notificationsRes.data);
        setUtilisateur({
          nom: `${utilisateurRes.data.first_name} ${utilisateurRes.data.last_name}`,
          avatar: utilisateurRes.data.avatar || "/default-avatar.png",
          role: utilisateurRes.data.role,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };

    fetchData();
  }, []);

  const marquerCommeLue = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem("access_token");

    try {
      await axios.post(`http://127.0.0.1:8000/api/notifications/${id}/lire/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, lu: true } : n)));
    } catch (error) {
      console.error("Erreur mise à jour notification", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    window.location.reload();
  };

  const nonLues = notifications.filter((n) => !n.lu).length;

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <FaBars />
        </div>

        <div className="logo-container">
          <h1>Tableau de Bord</h1>
        </div>

        <nav className={`main-nav ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="nav-right">
            <div className="notification-wrapper">
              <div
                className="notification-icon"
                onClick={() => {
                  setAfficherNotifications(!afficherNotifications);
                  setAfficherMenuProfil(false);
                }}
              >
                <FaBell />
                {nonLues > 0 && <span className="notification-count">{nonLues}</span>}
              </div>

              {afficherNotifications && (
                <div className="notifications-panel">
                  <h3>Notifications</h3>
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className={`notification-item ${n.lu ? "read" : "unread"}`}>
                        <p className="notification-message">{n.message}</p>
                        {!n.lu && (
                          <button className="mark-read" onClick={(e) => marquerCommeLue(n.id, e)}>
                            Marquer comme lue
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-notifications">Aucune notification</div>
                  )}
                </div>
              )}
            </div>

            {utilisateur && (
              <div className="profile-container">
                <div
                  className="profile-info"
                  onClick={() => {
                    setAfficherMenuProfil(!afficherMenuProfil);
                    setAfficherNotifications(false);
                  }}
                >
                  <img src={utilisateur.avatar} alt="Avatar" className="profile-avatar" />
                  <div className="user-details">
                    <span className="user-name">{utilisateur.nom}</span>
                    <span className="user-role">{utilisateur.role}</span>
                  </div>
                </div>

                {afficherMenuProfil && (
                  <div className="profile-menu">
                    <div className="menu-item" onClick={() => setAfficherProfil(true)}>
                      <FaUserCog /> <span>Modifier Profil</span>
                    </div>
                    <div className="menu-item logout" onClick={handleLogout}>
                      <FaSignOutAlt /> <span>Déconnexion</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>

      {afficherProfil && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setAfficherProfil(false)}>✖</button>
            <Profil onClose={() => setAfficherProfil(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
