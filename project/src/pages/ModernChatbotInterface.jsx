import React, { useState,useEffect } from 'react';
import './ModernChatbotInterface.css';
import { 
  MessageCircle, 
  Clock, 
  Grid, 
  Users, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';



const ModernChatbotInterface = () => {
  const [tone, setTone] = useState(50);
  const [professionalism, setProfessionalism] = useState(70);
  const [frequentWords, setFrequentWords] = useState([]);
  const [scheduledTasks, setScheduledTasks] = useState([]);

  useEffect(() => {
    // Fetch data from backend (mocked for now)
    fetch("/api/insights")
      .then((res) => res.json())
      .then((data) => {
        setTone(data.tone);
        setProfessionalism(data.professionalism);
        setFrequentWords(data.frequentWords);
        setScheduledTasks(data.scheduledTasks);
      });
  }, []);
  const departmentOptions = [
    { 
      value: 'engineering', 
      label: 'Engineering', 
      icon: <Grid className="dropdown-icon engineering-icon" />,
    },
    { 
      value: 'support', 
      label: 'Support', 
      icon: <Users className="dropdown-icon support-icon" />,
    },
    { 
      value: 'sales', 
      label: 'Sales', 
      icon: <AlertTriangle className="dropdown-icon sales-icon" />,
    }
  ];

  const priorityOptions = [
    { 
      value: 'low', 
      label: 'Low Priority', 
      icon: <Clock className="dropdown-icon low-priority-icon" />,
    },
    { 
      value: 'high', 
      label: 'High Priority', 
      icon: <AlertTriangle className="dropdown-icon high-priority-icon" />,
    }
  ];

  // State for dropdowns
  const [selectedDepartment, setSelectedDepartment] = useState({
    label: 'Select Department',
    icon: <Grid className="dropdown-icon default-icon" />
  });

  const [selectedPriority, setSelectedPriority] = useState({
    label: 'Select Priority',
    icon: <Clock className="dropdown-icon default-icon" />
  });

  // Scheduled work with more tech-inspired design
  const scheduledWork = [
    { 
      id: 1, 
      title: 'System Optimization Sprint', 
      type: 'Technical Review',
      time: '10:00 AM',
      icon: <MessageCircle className="task-icon cyan-icon" />
    },
    { 
      id: 2, 
      title: 'Infrastructure Scaling', 
      type: 'Architecture Meeting',
      time: '2:30 PM',
      icon: <Grid className="task-icon purple-icon" />
    }
  ];

  const [isDropdownDepartmentOpen, setIsDropdownDepartmentOpen] = useState(false);
  const [isDropdownPriorityOpen, setIsDropdownPriorityOpen] = useState(false);

  return (
    <div className="chatbot-container">
      {/* Chatbot Section */}
      <div className="chatbot-section">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <MessageCircle className="chat-header-icon pulse-animation" />
            <h2 className="chat-header-title">AI Assist</h2>
          </div>
          <div className="chat-header-status">Active</div>
        </div>

        {/* Chat Body */}
        <div className="chat-body">
          <div className="chat-message">
            <p>How can I help you optimize your workflow today?</p>
          </div>
        </div>

        {/* Chat Input */}
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="chat-input"
            />
            <button className="chat-send-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill='none' stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
      <h2>Insights</h2>
        {/* Dropdowns */}
        <div className="dropdown-section">
        <div className="insight-section">
        <h3>Tone Analysis</h3>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-fill tone" style={{ width: `${tone}%` }}>
              {tone}%
            </div>
          </div>
        </div>
        <p>{tone <= 40 ? "Casual" : tone >= 70 ? "Formal" : "Neutral"}</p>
      </div>

      {/* Professionalism Bar */}
      <div className="insight-section">
        <h3>Professionalism Level</h3>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-fill professionalism" style={{ width: `${professionalism}%` }}>
              {professionalism}%
            </div>
          </div>
        </div>
        <p>{professionalism <= 40 ? "Very Informal" : professionalism >= 70 ? "Highly Professional" : "Moderate"}</p>
      </div>
          {/* Department Dropdown */}
          <div className="dropdown">
            <button 
              className="dropdown-trigger"
              onClick={() => setIsDropdownDepartmentOpen(!isDropdownDepartmentOpen)}
            >
              <div className="dropdown-selected">
                {selectedDepartment.icon}
                <span>{selectedDepartment.label}</span>
              </div>
              <ChevronDown className="dropdown-chevron" />
            </button>
            {isDropdownDepartmentOpen && (
              <div className="dropdown-menu">
                {departmentOptions.map((option) => (
                  <div 
                    key={option.value}
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedDepartment(option);
                      setIsDropdownDepartmentOpen(false);
                    }}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Priority Dropdown */}
          <div className="dropdown">
            <button 
              className="dropdown-trigger"
              onClick={() => setIsDropdownPriorityOpen(!isDropdownPriorityOpen)}
            >
              <div className="dropdown-selected">
                {selectedPriority.icon}
                <span>{selectedPriority.label}</span>
              </div>
              <ChevronDown className="dropdown-chevron" />
            </button>
            {isDropdownPriorityOpen && (
              <div className="dropdown-menu">
                {priorityOptions.map((option) => (
                  <div 
                    key={option.value}
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedPriority(option);
                      setIsDropdownPriorityOpen(false);
                    }}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scheduled Work */}
        <div className="scheduled-work">
          <div className="scheduled-work-header">
            <h3>Upcoming Tasks</h3>
            <Clock className="scheduled-work-icon" />
          </div>
          {scheduledWork.map((work) => (
            <div key={work.id} className="task-item">
              <div className="task-details">
                {work.icon}
                <div>
                  <p className="task-title">{work.title}</p>
                  <p className="task-type">{work.type}</p>
                </div>
              </div>
              <span className="task-time">{work.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernChatbotInterface;