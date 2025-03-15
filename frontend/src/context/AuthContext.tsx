import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface AuthContextType {
  user: any;
  fetchUser: () => void;
  updateProfile: (formData: FormData) => Promise<void>;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/utilisateurs/csrf/");
        const token = response.data.csrfToken;
        setCsrfToken(token);
        axios.defaults.headers.common["X-CSRFToken"] = token;
      } catch (error) {
        console.error("Erreur lors de la récupération du token CSRF :", error);
      }
    };

    fetchCsrfToken();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await axios.get("http://127.0.0.1:8000/api/utilisateurs/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
    }
  };

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      if (!csrfToken) {
        throw new Error("Token CSRF non disponible. Veuillez réessayer.");
      }

      const response = await axios.post("http://127.0.0.1:8000/api/token/",
        { username: usernameOrEmail, password },
        { headers: { "X-CSRFToken": csrfToken } }
      );

      if (response.status !== 200) {
        throw new Error("Échec de la connexion.");
      }

      const data = response.data;
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      const userResponse = await axios.get("http://127.0.0.1:8000/api/utilisateurs/me/", {
        headers: { Authorization: `Bearer ${data.access}` },
      });

      if (userResponse.status !== 200) {
        throw new Error("Erreur lors de la récupération du profil utilisateur.");
      }

      const userData = userResponse.data;
      localStorage.setItem("user_role", userData.role);
      localStorage.setItem("username", userData.username);
      setUser(userData);

      const redirections: Record<string, string> = {
        "ETUDIANT": "/dashboard-etudiant",
        "PROFESSEUR": "/dashboard-professeur",
      };
      navigate(redirections[userData.role] || "/");

      return userData;
    } catch (error: any) {
      console.error("Erreur de connexion :", error);
      throw new Error(error.response?.data?.detail || "Échec de la connexion.");
    }
  };

  const updateProfile = async (formData: FormData) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      await axios.patch("http://127.0.0.1:8000/api/utilisateurs/me/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchUser();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, fetchUser, updateProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
