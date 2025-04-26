import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  PaperAirplaneIcon,
  CodeBracketIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";
import "./Dashboard.css";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("chat"); // "chat" or "code"
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! I'm Cleo, your personal finance assistant. How can I help you today?",
      timestamp: "10:00 AM",
    },
  ]);

  const frequentWords = [
    { word: "Budget", count: 45 },
    { word: "Savings", count: 32 },
    { word: "Expenses", count: 28 },
    { word: "Investments", count: 24 },
  ];

  const scheduledTasks = [
    { title: "Review monthly budget", time: "2:00 PM" },
    { title: "Check investment portfolio", time: "4:30 PM" },
    { title: "Pay utility bills", time: "Tomorrow, 10:00 AM" },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      type: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        type: "bot",
        content: "I understand you're asking about " + message.toLowerCase() + ". Let me help you with that.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleSendCode = (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newMessage = {
      type: "user",
      content: code,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isCode: true,
    };

    setMessages([...messages, newMessage]);
    setCode("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        type: "bot",
        content: "I've reviewed your code. Here's my analysis...",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        {/* Sidebar */}
        <motion.div
          className="dashboard-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="sidebar-header">
            <CommandLineIcon className="w-6 h-6" />
            <h2>Cleo AI</h2>
          </div>
          <div className="sidebar-tabs">
            <button
              className={`tab-button ${activeTab === "chat" ? "active" : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span>Chat</span>
            </button>
            <button
              className={`tab-button ${activeTab === "code" ? "active" : ""}`}
              onClick={() => setActiveTab("code")}
            >
              <CodeBracketIcon className="w-5 h-5" />
              <span>Code</span>
            </button>
          </div>
        </motion.div>

        {/* Chat Panel */}
        <motion.div
          className="chat-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="chat-header">
            <ChatBubbleLeftIcon className="w-6 h-6" />
            <h2>{activeTab === "chat" ? "Chat with Cleo" : "Code with Cleo"}</h2>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                className={`message ${msg.type} ${msg.isCode ? "code-message" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="message-content">
                  {msg.isCode ? (
                    <pre className="code-block">
                      <code>{msg.content}</code>
                    </pre>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                  <span className="timestamp">{msg.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <form className="chat-input" onSubmit={activeTab === "chat" ? handleSendMessage : handleSendCode}>
            {activeTab === "chat" ? (
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
              />
            ) : (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your code here..."
                rows={4}
              />
            )}
            <button type="submit">
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </motion.div>

        {/* Insights Panel */}
        <motion.div
          className="insights-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Frequent Words */}
          <div className="insight-card">
            <div className="insight-header">
              <FireIcon className="w-5 h-5" />
              <h3>Frequent Words</h3>
            </div>
            <div className="frequent-words">
              {frequentWords.map((word, index) => (
                <motion.div
                  key={word.word}
                  className="word-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <span className="word">{word.word}</span>
                  <span className="count">{word.count}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scheduled Tasks */}
          <div className="insight-card">
            <div className="insight-header">
              <CalendarIcon className="w-5 h-5" />
              <h3>Scheduled Tasks</h3>
            </div>
            <div className="scheduled-tasks">
              {scheduledTasks.map((task, index) => (
                <motion.div
                  key={task.title}
                  className="task-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="task-info">
                    <h4>{task.title}</h4>
                    <span className="time">
                      <ClockIcon className="w-4 h-4" />
                      {task.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="insight-card">
            <div className="insight-header">
              <ChartBarIcon className="w-5 h-5" />
              <h3>Quick Stats</h3>
            </div>
            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-value">$2,450</span>
                <span className="stat-label">Monthly Savings</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">85%</span>
                <span className="stat-label">Budget Adherence</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">12</span>
                <span className="stat-label">Active Goals</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 