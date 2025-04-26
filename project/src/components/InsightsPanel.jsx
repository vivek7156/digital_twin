import React, { useState, useEffect } from "react";
import "./InsightsPanel.css";

function InsightsPanel() {
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

  return (
    <div className="insights-panel">
      <h2>Insights</h2>

      {/* Tone Bar */}
      <div className="insight-section">
        <h3>Tone Analysis</h3>
        <div className="progress-bar">
          <div className="progress-fill tone" style={{ width: `${tone}%` }}>
            {tone}%
          </div>
        </div>
        <p>{tone <= 40 ? "Casual" : tone >= 70 ? "Formal" : "Neutral"}</p>
      </div>

      {/* Professionalism Bar */}
      <div className="insight-section">
        <h3>Professionalism Level</h3>
        <div className="progress-bar">
          <div className="progress-fill professionalism" style={{ width: `${professionalism}%` }}>
            {professionalism}%
          </div>
        </div>
        <p>{professionalism <= 40 ? "Very Informal" : professionalism >= 70 ? "Highly Professional" : "Moderate"}</p>
      </div>

      {/* Frequent Words */}
      <div className="insight-section">
        <h3>Most Frequent Words</h3>
        <ul className="frequent-words-list">
          {frequentWords.length > 0 ? (
            frequentWords.map((word, index) => (
              <li key={index}>{word}</li>
            ))
          ) : (
            <p>No data available</p>
          )}
        </ul>
      </div>

      {/* Scheduled Tasks */}
      <div className="insight-section">
        <h3>Scheduled Tasks</h3>
        <ul className="scheduled-tasks-list">
          {scheduledTasks.length > 0 ? (
            scheduledTasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))
          ) : (
            <p>No tasks scheduled</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default InsightsPanel;
