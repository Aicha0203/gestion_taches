import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TachesProvider } from "./context/TachesContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import DashboardEtudiant from "./pages/DashboardEtudiant";
import DashboardProfesseur from "./pages/DashboardProfesseur";
import ProjectDetails from "./pages/ProjectDetails";
import Projects from "./pages/Projects";
import Chat from "./pages/Chat";
import TaskDetails from "./components/TaskDetails";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <TachesProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/chat" element={<Chat />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard-etudiant" element={<DashboardEtudiant />} />
            <Route path="/dashboard-professeur" element={<DashboardProfesseur />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TachesProvider>
    </AuthProvider>
  );
}
