import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import "../assets/Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/notifications/");

    socket.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]);
    };

    return () => socket.close();
  }, []);

  return (
    <div className="notifications">
      <h3><FaBell /> Notifications</h3>
      {notifications.length === 0 ? <p>Aucune notification</p> : (
        <ul>
          {notifications.map((notif, index) => (
            <li key={index}>{notif.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
