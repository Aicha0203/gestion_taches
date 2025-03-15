import { FaFolderOpen, FaTasks } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useStats } from "../context/StatsContext";
import "../assets/StatsWidget.css";

export default function StatsWidget() {
  const { stats } = useStats();

  if (!stats) {
    return <div className="stats-loading">Chargement des statistiques...</div>;
  }

  console.log("Données statistiques reçues :", stats);

  const barData = [
    { name: "En cours", projets: stats.projets_en_cours || 0, taches: stats.taches_en_attente || 0 },
    { name: "Terminés", projets: stats.projets_termines || 0, taches: stats.taches_terminees || 0 },
    { name: "En retard", projets: stats.projets_retard || 0, taches: stats.taches_retard || 0 },
  ];

  const pieData = [
    { name: "Projets en cours", value: stats.projets_en_cours || 0, color: "#FFD700" },
    { name: "Projets terminés", value: stats.projets_termines || 0, color: "#4CAF50" },
    { name: "Projets en retard", value: stats.projets_retard || 0, color: "#F44336" },
  ];

  return (
    <div className="stats-widget">
      <div className="stats-cards">
        <div className="stat-card">
          <FaFolderOpen className="stat-icon" />
          <div>
            <h3>{stats.total_projets || 0}</h3>
            <p>Total Projets</p>
          </div>
        </div>

        <div className="stat-card">
          <FaTasks className="stat-icon" />
          <div>
            <h3>{stats.total_taches || 0}</h3>
            <p>Total Tâches</p>
          </div>
        </div>
      </div>

      <div className="stats-chart">
        <h3>Répartition des Projets et Tâches</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
            <XAxis dataKey="name" stroke="#FFFFFF" />
            <YAxis stroke="#FFFFFF" tickCount={6} domain={[0, 'dataMax']} />
            <Tooltip />
            <Legend />
            <Bar dataKey="projets" fill="#FFD700" name="Projets" />
            <Bar dataKey="taches" fill="#4CAF50" name="Tâches" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="stats-chart">
        <h3>Répartition des Projets</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
              {pieData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
