import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FiSend, FiUsers, FiSearch, FiArrowLeft } from "react-icons/fi";
import { format } from "date-fns";
import "../assets/Chat.css";

interface Message {
  id: number;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
}

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
}

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://127.0.0.1:8000/api/utilisateurs/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.results) {
        const filteredUsers = response.data.results.filter((user: User) => user.role !== "ADMIN");
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`http://127.0.0.1:8000/api/chat/messages/${selectedUser}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(response.data);
      setNotifications((prev) => ({
        ...prev,
        [selectedUser]: 0,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des messages", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        "http://127.0.0.1:8000/api/chat/messages/send/",
        { receiver: selectedUser, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message", error);
    }
  };

  const handleUserClick = (username: string) => {
    setSelectedUser(username);
    setNotifications((prev) => ({
      ...prev,
      [username]: 0,
    }));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const username = localStorage.getItem("username");
  return (
    <div className="chat-app">
      <div className="chat-container">
        <div className="sidebar">
          <div className="sidebar-header">
            <h2><FiUsers size={20} /> Conversations</h2>
          </div>

          <div className="search-container">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Rechercher un utilisateur..." />
          </div>

          <div className="users-list">
            {users.map((user) => (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                key={user.id}
                className={`user-item ${selectedUser === user.username ? "active" : ""}`}
                onClick={() => handleUserClick(user.username)}
              >
                <div className="user-info">
                  <div className="user-name">{user.first_name} {user.last_name}</div>
                  {notifications[user.username] > 0 && (
                    <span className="notification">{notifications[user.username]}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="sidebar-footer">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <FiArrowLeft size={20} /> Retour
            </button>
          </div>
        </div>

        <div className="chat-area">
          {selectedUser ? (
            <>
              <div className="messages-container">
                {messages.map((msg) => {
                   const isSender = msg.sender === username;
                   return (
                    <motion.div
                      key={msg.id}
                      className={`message-wrapper ${isSender ? "sender" : "receiver"}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`message ${isSender ? "sent" : "received"}`}>
                        <div className="message-content">{msg.content}</div>
                        <div className="message-meta">
                          <span className="timestamp">{format(new Date(msg.timestamp), 'HH:mm')}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="message-input-container">
                <input
                  type="text"
                  placeholder="Tapez un message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>
                  <FiSend size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">Sélectionnez un utilisateur pour commencer une conversation</div>
          )}
        </div>
      </div>
    </div>
  );
}
