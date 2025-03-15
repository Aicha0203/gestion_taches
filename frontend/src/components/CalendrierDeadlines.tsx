import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { FaCalendarAlt } from "react-icons/fa";
import "../assets/CalendrierDeadlines.css";

export default function CalendrierDeadlines() {
  const [deadlines, setDeadlines] = useState<{ date: string; taches: string[] }[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    axios.get("http://127.0.0.1:8000/api/stats/deadlines/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
    }).then(response => {
      if (isMounted) setDeadlines(response.data);
    }).catch(error => console.error("Erreur récupération deadlines", error));

    return () => { isMounted = false };
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split("T")[0];
    const tasksForDate = deadlines.find((d) => d.date === formattedDate);
    setSelectedTasks(tasksForDate ? tasksForDate.taches : []);
  };

  return (
    <div className="calendrier-deadlines">
      <h3><FaCalendarAlt /> Deadlines des tâches</h3>
      <Calendar
        onClickDay={handleDateClick}
        tileClassName={({ date }) =>
          deadlines.some((d) => d.date === date.toISOString().split("T")[0])
            ? "has-deadline"
            : undefined
        }
      />
      {selectedDate && (
        <div className="tasks-for-date">
          <h4>Tâches du {selectedDate.toLocaleDateString()}</h4>
          {selectedTasks.length > 0 ? (
            <ul>
              {selectedTasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          ) : (
            <p>Aucune tâche prévue.</p>
          )}
        </div>
      )}
    </div>
  );
}
