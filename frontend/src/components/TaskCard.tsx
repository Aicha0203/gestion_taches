import React from "react";
import "../assets/TaskCard.css";

const TaskCard = ({ task, innerRef, draggableProps, dragHandleProps }) => {
  return (
    <div
      className="task-card"
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
    >
      <h4>{task.titre}</h4>
      <p>{task.description}</p>
      <p>Statut: {task.statut}</p>
    </div>
  );
};

export default TaskCard;
