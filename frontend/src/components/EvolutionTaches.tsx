import { useState, useEffect } from "react";
import axios from "axios";
import { FaChartLine } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "../assets/EvolutionTaches.css";

export default function EvolutionTaches() {
  const [data, setData] = useState<{ date: string; taches_terminees: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const response = await axios.get("http://127.0.0.1:8000/api/stats/evolution-taches/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Données reçues :", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Erreur récupération évolution des tâches", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const maxTaches = Math.max(...data.map((d) => d.taches_terminees), 5);

  const maxY = Math.ceil(maxTaches / 5) * 5;

  return (
    <div className="evolution-taches">
      <h3><FaChartLine /> Évolution des tâches complétées</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
          <XAxis dataKey="date" stroke="#FFC107" />
          <YAxis
            stroke="#FFC107"
            domain={[0, maxY]}
            tickCount={Math.min(maxY / 5 + 1, 10)}
            interval={0}
          />
          <Tooltip />
          <Line type="monotone" dataKey="taches_terminees" stroke="#FFD700" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
