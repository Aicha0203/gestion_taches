import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaPlus, FaTh, FaList } from "react-icons/fa";
import ProjectsSidebar from "../components/ProjectsSidebar";
import ProjectCard from "../components/ProjectCard";
import ProjectList from "../components/ProjectList";
import "../assets/Projects.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
      const fetchProjects = async () => {
        try {
          const token = localStorage.getItem("access_token");
          const response = await axios.get("http://127.0.0.1:8000/api/projets/", {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log("Données reçues :", response.data);

          if (Array.isArray(response.data.results)) {
            setProjects(response.data.results);
          } else {
            console.error("L'API ne retourne pas un tableau :", response.data);
            setProjects([]);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des projets", error);
        }
      };

      fetchProjects();
  }, []);


  const filteredProjects = projects.filter(project =>
    project.titre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="projects-container">
      <ProjectsSidebar />

      <div className="main-content">
        <div className="projects-header">
          <h2 className="title">Mes Projets</h2>

          <div className="actions">
            <div className="search-bar">
              <FaSearch className="icon" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="view-toggle">
              <button
                className={viewMode === "grid" ? "active" : ""}
                onClick={() => setViewMode("grid")}
              >
                <FaTh />
              </button>
              <button
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
              >
                <FaList />
              </button>
            </div>

            <button className="add-project">
              <FaPlus />
              Nouveau Projet
            </button>
          </div>
        </div>

        <div className={viewMode === "grid" ? "projects-grid" : "projects-list"}>
          {filteredProjects.length > 0 ? (
            viewMode === "grid" ? (
              filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)
            ) : (
              <ProjectList projects={filteredProjects} />
            )
          ) : (
            <p className="no-projects">Aucun projet trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
}
