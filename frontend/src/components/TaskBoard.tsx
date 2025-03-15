import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { FaTasks, FaUsers, FaCheckCircle } from "react-icons/fa";
import TaskCard from "./TaskCard";
import TaskDetails from "./TaskDetails";
import "../assets/TaskBoard.css";

export default function TaskBoard({ projectId, refreshProject }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    console.log("📡 projectId reçu dans TaskBoard :", projectId);
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `http://127.0.0.1:8000/api/taches/projet/${projectId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches", error);
      }
    };

    fetchTasks();
  }, [projectId]);

  const groupedTasks = {
    A_FAIRE: tasks.filter((t) => t.statut === "A_FAIRE"),
    EN_COURS: tasks.filter((t) => t.statut === "EN_COURS"),
    TERMINE: tasks.filter((t) => t.statut === "TERMINE"),
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const draggedTask = groupedTasks[source.droppableId][source.index];
    const newStatus = destination.droppableId;

    const updatedTasks = tasks.map((task) =>
      task.id === draggedTask.id ? { ...task, statut: newStatus } : task
    );

    setTasks(updatedTasks);

    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `http://127.0.0.1:8000/api/taches/${draggedTask.id}/update/`,
        { statut: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      refreshProject();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut", error);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="task-board">
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="droppable-wrapper">
              <Droppable droppableId={status}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="task-column">
                    <h3>
                      {status === "A_FAIRE" && <FaTasks />}
                      {status === "EN_COURS" && <FaUsers />}
                      {status === "TERMINE" && <FaCheckCircle />}
                      {status.replace("_", " ")}
                    </h3>
                    {tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="task-item"
                            onClick={() => setSelectedTaskId(task.id)}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {selectedTaskId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelectedTaskId(null)}>✖</button>
            <TaskDetails taskId={selectedTaskId} />
          </div>
        </div>
      )}
    </>
  );
}
