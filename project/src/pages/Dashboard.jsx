import { useState, FormEvent, useEffect, JSX } from 'react';
import './Dashboard.css';
import axios from 'axios';
import { 
  MessageCircle, 
  Clock, 
  Grid, 
  Users, 
  AlertTriangle,
  ChevronDown,
  Code,
  Bot,
  Clipboard,
  Send,
  MessageSquare,
  Gamepad,
  Server,
  Building,
  Plus,
  X,
  Terminal
} from 'lucide-react';

const Dashboard = () => {
      const url = "https://068e-2409-40d4-123-34ed-a1aa-3deb-7e10-4d2e.ngrok-free.app/"
      const [tone, setTone] = useState(0);
      const [professionalism, setProfessionalism] = useState(0);
      // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
      const [categories, setCategories] = useState([]);
  // Existing state and data
const topicOptions = [
  { 
    value: 'programming', 
    label: 'Programming', 
    icon: <Code className="dropdown-icon programming-icon" />,
  },
  // { 
  //   value: 'Chatting', 
  //   label: 'Chatting', 
  //   icon: <MessageSquare className="dropdown-icon chatting-icon" />,
  // },
  { 
    value: 'gaming', 
    label: 'Gaming', 
    icon: <Gamepad className="dropdown-icon gaming-icon" />,
  },
  { 
    value: 'devops', 
    label: 'DevOps', 
    icon: <Server className="dropdown-icon devops-icon" />,
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

  const [isTopicsDropdownOpen, setIsTopicsDropdownOpen] = useState(false);

  const [selectedPriority, setSelectedPriority] = useState({
    label: 'Select Priority',
    icon: <Clock className="dropdown-icon default-icon" />
  });

  const [scheduledWork, setScheduledWork] = useState([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('scheduledTasks');
    if (savedTasks) {
      setScheduledWork(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('scheduledTasks', JSON.stringify(scheduledWork));
  }, [scheduledWork]);

    // Changed to track actual counts instead of just incrementing
  const [topicUsageCounts, setTopicUsageCounts] = useState({
    programming: 0,
    // chatting: 0,
    gaming: 0,
    devops: 0,
  });

  // New state for tabs
  const [activeTab, setActiveTab] = useState('assistant');
  const [codeInput, setCodeInput] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownPriorityOpen, setIsDropdownPriorityOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    type: '',
    date: '',
    time: '',
  });

  // Function to handle code execution (simplified)
  const handleCodeRun = () => {
    try {
      // Simple eval for demonstration (not recommended in production)
      const result = eval(codeInput);
      setCodeOutput(String(result));
    } catch (error) {
      setCodeOutput(`Error: sorry`);
    }
  };

  // Tab navigation icons
  const tabIcons = [
    { 
      id: 'assistant', 
      icon: <Bot className="tab-icon" />,
      tooltip: 'Assistant Chat'
    },
    { 
      id: 'programming', 
      icon: <Code className="tab-icon" />,
      tooltip: 'Programming'
    }
  ];

  const [messages, setMessages] = useState([
    { 
      id: 0, 
      text: "How can I help you optimize your workflow today?", 
      sender: 'assistant' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

const sendMessage = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!inputMessage.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user'
    };
  
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);
  
    try {
      // First, get the category prediction for the message
      const categoryResponse = await axios.post(
        `${url}api/predict-text-category`,
        {
          "text": inputMessage
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Category response:', categoryResponse.data.category);
      
      if (categoryResponse.status === 200 && categoryResponse.data) {
        const updatedCounts = {...topicUsageCounts};
        
        if (typeof categoryResponse.data.category === 'object') {
          Object.entries(categoryResponse.data.category).forEach(([category, value]) => {
            // Convert category to lowercase for consistent comparison
            const categoryKey = category.toLowerCase();
            if (updatedCounts.hasOwnProperty(categoryKey)) {
              const numValue = typeof value === 'number' ? value : parseFloat(value);
              if (!isNaN(numValue) && numValue >= 0.3) { 
                updatedCounts[categoryKey] += 1;
              }
            }
          });
          
          // Update the state with the new counts
          console.log('Updated counts:', updatedCounts);
          setTopicUsageCounts(prevCounts => ({ ...prevCounts, ...updatedCounts }));
        }
      }
  
      // Now get the assistant response as before
      const response = await axios.post(
        `${url}/api/get_response`,
        {
          "text": inputMessage
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.data;
  
      // Add assistant response to chat
      const assistantMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'assistant'
      };
  
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = {
        id: Date.now() + 2,
        text: "Sorry, there was an error processing your message.",
        sender: 'assistant'
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get max usage value for scaling the bars
  const maxUsage = Math.max(...topicOptions.map(option => option.usage));
  const fetchProfessionalismScore = async () => {
    try {
      const response = await axios.post(`${url}/api/professionalism-score`, {
        text: inputMessage,
      });
  
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
  
      const analysisData = response.data;
      console.log("Professionalism API Response:", analysisData);
  
      // Convert values to integers
      const newTone = parseInt(analysisData.tone, 10);
      const newProfessionalism = parseInt(analysisData.professionalism, 10);
  
      // Update states with averaged values and round to one decimal place
      setTone(prevTone => parseFloat((10 - (prevTone + newTone) / 2).toFixed(1)));
      setProfessionalism(prevProfessionalism => 
        parseFloat((10 - (prevProfessionalism + newProfessionalism) / 2).toFixed(1))
      );
  
    } catch (error) {
      console.error("Error fetching professionalism score:", error);
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.date || !newTask.time) return;

    const formattedDate = new Date(newTask.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    const formattedTime = new Date(`2000-01-01T${newTask.time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    const newWorkItem = {
      id: Date.now(),
      title: newTask.title,
      type: newTask.type,
      time: `${formattedDate} ${formattedTime}`,
      icon: <MessageCircle className="task-icon cyan-icon" />
    };

    setScheduledWork(prev => [...prev, newWorkItem]);
    setIsModalOpen(false);
    setNewTask({
      title: '',
      type: '',
      date: '',
      time: '',
    });
  };

  const handleDeleteTask = (taskId) => {
    setScheduledWork(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <div className="chatbot-container">
      {/* Vertical Tab Bar */}
      <div className="vertical-tab-bar">
        {tabIcons.map((tab) => (
          <div 
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.tooltip}
          >
            {tab.icon}
          </div>
        ))}
      </div>

      {/* Chatbot Section */}
      <div className="chatbot-section">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <MessageCircle className="chat-header-icon pulse-animation" />
            <h2 className="chat-header-title">
              {activeTab === 'assistant' ? 'AI Assist' : 'Code Playground'}
            </h2>
          </div>
          <div className="chat-header-status">Active</div>
        </div>

        {/* Chat Body - Conditional Rendering */}
        {activeTab === 'assistant' ? (
          <div className="chat-body">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`chat-message ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <p>{message.text}</p>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message assistant-message">
                <p>Thinking...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="programming-container">
            <div className="code-input-section">
              <div className="section-header">
                <Terminal className="section-icon" />
                <span>Code Input</span>
              </div>
              <textarea
                className="code-input"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Write your code here..."
              />
            </div>
            <div className="code-output-section">
              <div className="section-header">
                <Clipboard className="section-icon" />
                <span>Output</span>
              </div>
              <div className="code-output">
                {codeOutput || 'Run code to see output'}
              </div>
            </div>
          </div>
        )}

        {/* Chat Input */}
        <form 
          onSubmit={sendMessage} 
          className="chat-input-container"
        >
          <div className="chat-input-wrapper">
            <input 
              type="text" 
              placeholder={
                activeTab === 'assistant' 
                  ? "Type your message..." 
                  : "Run your code (Press Enter)"
              }
              className="chat-input"
              value={activeTab === 'assistant' ? inputMessage : codeInput}
              onChange={(e) => 
                activeTab === 'assistant' 
                  ? setInputMessage(e.target.value) 
                  : setCodeInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (activeTab === 'programming' && e.key === 'Enter') {
                  handleCodeRun();
                }
              }}
            />
            {activeTab === 'assistant' ? (
              <button 
                type="submit" 
                className="chat-send-button"
                disabled={isLoading}
                onClick={fetchProfessionalismScore}
              >
                <Send className="send-icon" />
              </button>
            ) : (
              <button 
                className="chat-send-button code-run-button"
                onClick={handleCodeRun}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </form>
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
                <div 
                  className="progress-fill tone" 
                  style={{ width: `${(tone || 0) * 10}%` }}
                >
                  {tone}
                </div>
              </div>
            </div>
            <p>
              {tone === null ? "Loading..." : tone <= 4 ? "Casual" : tone >= 7 ? "Formal" : "Neutral"}
            </p>
          </div>

          {/* Professionalism Bar */}
          <div className="insight-section">
            <h3>Professionalism Level</h3>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill professionalism" 
                  style={{ width: `${(professionalism || 0) * 10}%` }}
                >
                  {professionalism}
                </div>
              </div>
            </div>
            <p>
              {professionalism === null
                ? "Loading..."
                : professionalism <= 4
                ? "Very Informal"
                : professionalism >= 7
                ? "Highly Professional"
                : "Moderate"}
            </p>
          </div>

          {/* Chat Categories Dropdown */}
        <div className="dropdown-section">
          <div className="dropdown">
            <button 
              className="dropdown-trigger"
              onClick={() => setIsTopicsDropdownOpen(!isTopicsDropdownOpen)}
            >
              <div className="dropdown-selected">
                <MessageSquare className="dropdown-icon default-icon" />
                <span>Discussion Topics</span>
              </div>
              <ChevronDown className="dropdown-chevron" />
            </button>
            {isTopicsDropdownOpen && (
            <div className="dropdown-menu topics-dropdown-menu">
              {topicOptions.map((option) => {
                const currentCount = topicUsageCounts[option.value] || 0; // Default to 0 if undefined
                const maxCount = Math.max(...Object.values(topicUsageCounts), 1); // Ensure maxCount is at least 1
                const usagePercentage = maxCount > 0 ? Math.round((currentCount / maxCount) * 100) : 0;
              
                return (
                  <div 
                    key={option.value}
                    className="dropdown-item topic-item"
                  >
                    <div className="topic-item-left">
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                    <div className="topic-usage-container">
                      <div className="topic-usage-bar">
                        <div 
                          className="topic-usage-fill"
                          style={{ width: `${usagePercentage}%` }}
                        ></div>
                      </div>
                      <span className="topic-usage-count">
                        {usagePercentage}% (Count: {currentCount})
                      </span>
                    </div>
                  </div>
                );
              })}
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
            <div className="scheduled-work-actions">
              <Clock className="scheduled-work-icon" />
              <button 
                className="add-task-button"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="add-task-icon" />
              </button>
            </div>
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
              <div className="task-actions">
                <span className="task-time">{work.time}</span>
                <button 
                  className="delete-task-button"
                  onClick={() => handleDeleteTask(work.id)}
                >
                  <X className="delete-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Schedule Task Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Schedule New Task</h3>
              <button 
                className="close-modal-button"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="close-icon" />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="schedule-form">
              <div className="form-group">
                <label htmlFor="taskTitle">Task Title</label>
                <input
                  type="text"
                  id="taskTitle"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="taskType">Task Type</label>
                <input
                  type="text"
                  id="taskType"
                  value={newTask.type}
                  onChange={(e) => setNewTask(prev => ({ ...prev, type: e.target.value }))}
                  placeholder="Enter task type"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="taskDate">Date</label>
                <input
                  type="date"
                  id="taskDate"
                  value={newTask.date}
                  onChange={(e) => setNewTask(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="taskTime">Time</label>
                <input
                  type="time"
                  id="taskTime"
                  value={newTask.time}
                  onChange={(e) => setNewTask(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;