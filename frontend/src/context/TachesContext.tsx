import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface TacheType {
  id: number;
  titre: string;
  statut: string;
}

interface SuiviTachesType {
  taches_en_cours: number;
  taches_terminees: number;
  taches_en_retard: number;
  taches_details: TacheType[];
}

interface TachesContextType {
  tachesAssignees: TacheType[] | null;
  suiviTaches: SuiviTachesType | null;
  refreshTaches: () => void;
}

const TachesContext = createContext<TachesContextType | undefined>(undefined);

export const TachesProvider = ({ children }: { children: React.ReactNode }) => {
  const [tachesAssignees, setTachesAssignees] = useState<TacheType[] | null>(null);
  const [suiviTaches, setSuiviTaches] = useState<SuiviTachesType | null>(null);

  const fetchTaches = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.get("http://127.0.0.1:8000/api/taches/mes-taches/", config)
      .then(response => setTachesAssignees(response.data))
      .catch(error => console.error("Erreur récupération tâches assignées", error));

    axios.get("http://127.0.0.1:8000/api/taches/suivi-taches-projet/", config)
      .then(response => setSuiviTaches(response.data))
      .catch(error => console.error("Erreur récupération suivi des tâches", error));
  };

  useEffect(() => {
    fetchTaches();
  }, []);

  return (
    <TachesContext.Provider value={{ tachesAssignees, suiviTaches, refreshTaches: fetchTaches }}>
      {children}
    </TachesContext.Provider>
  );
};

export const useTaches = () => {
  const context = useContext(TachesContext);
  if (!context) {
    throw new Error("useTaches doit être utilisé dans un TachesProvider");
  }
  return context;
};
