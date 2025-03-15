import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface StatsType {
  total_projets: number;
  projets_en_cours: number;
  projets_termines: number;
  projets_retard: number;
  total_taches: number;
  taches_en_attente: number;
  taches_terminees: number;
  taches_retard: number;
}

interface StatsContextType {
  stats: StatsType | null;
  loading: boolean;
  refreshStats: () => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider = ({ children }: { children: React.ReactNode }) => {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Aucun token trouvé. Veuillez vous reconnecter.");
        return;
      }

      const response = await axios.get("http://127.0.0.1:8000/api/stats/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Données statistiques reçues :", response.data);
      setStats(response.data);
    } catch (error) {
      console.error("Erreur récupération statistiques :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StatsContext.Provider value={{ stats, loading, refreshStats: fetchStats }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStats doit être utilisé dans un StatsProvider");
  }
  return context;
};
