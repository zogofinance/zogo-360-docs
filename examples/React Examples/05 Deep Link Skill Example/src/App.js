import React, { useRef, useEffect, useState } from "react";
import "./App.css";

function App() {
  const zogoRef = useRef(null);
  const [showZogo, setShowZogo] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [completedSkills, setCompletedSkills] = useState(new Set());

  const skills = [
    {
      id: "1",
      name: "Choose a Financial Institution",
      description:
        "Learn how to select the right bank or credit union for your needs.",
      icon: "🏦",
    },
    {
      id: "3",
      name: "Apply for Credit",
      description:
        "Understand the credit application process and improve your chances of approval.",
      icon: "💳",
    },
  ];

  const openZogoSkill = (skillId, skillName) => {
    setCurrentSkill({ id: skillId, name: skillName });
    setShowZogo(true);

    // Initialize with deep link configuration for skill
    if (zogoRef.current) {
      zogoRef.current.initialize({
        user_auth_token: "YOUR_AUTH_TOKEN_HERE",
        widget_type: "deep_link",
        skill_id: skillId,
      });
    }
  };

  useEffect(() => {
    if (!zogoRef.current) return;

    const handleMessage = (event) => {
      console.log(
        "Message from Zogo:",
        event.detail.type,
        event.detail.payload
      );

      if (event.detail.type === "EXIT_REQUESTED") {
        handleZogoExit(event.detail.payload);
      }
    };

    zogoRef.current.addEventListener("message", handleMessage);

    return () => {
      if (zogoRef.current) {
        zogoRef.current.removeEventListener("message", handleMessage);
      }
    };
  }, [currentSkill]);

  const handleZogoExit = (exitData) => {
    console.log("Exit requested:", exitData);

    // Hide Zogo and show app content
    setShowZogo(false);

    // Handle different exit scenarios
    if (exitData.source === "end_of_module") {
      // User completed the entire skill
      handleSkillCompletion(currentSkill.id, currentSkill.name);
    } else if (
      exitData.source === "back_button" ||
      exitData.source === "exit_button"
    ) {
      // User exited without completing the skill
      console.log("User exited skill early");
    }

    setCurrentSkill(null);
  };

  const handleSkillCompletion = (skillId, skillName) => {
    alert(`Congratulations! You completed the "${skillName}" skill!`);

    // Add to completed skills
    setCompletedSkills((prev) => new Set([...prev, skillId]));
  };

  return (
    <div className="App">
      {!showZogo ? (
        <div className="app-content">
          <h1>Financial Skills Training</h1>
          <p>Complete these skills to improve your financial knowledge:</p>

          <div className="skills-grid">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className={`skill-card ${
                  completedSkills.has(skill.id) ? "completed" : ""
                }`}
              >
                <div className="skill-icon">{skill.icon}</div>
                <h3>{skill.name}</h3>
                <p>{skill.description}</p>
                <button
                  onClick={() => openZogoSkill(skill.id, skill.name)}
                  className="skill-button"
                  disabled={completedSkills.has(skill.id)}
                >
                  {completedSkills.has(skill.id)
                    ? "✓ Completed"
                    : "Start Skill"}
                </button>
              </div>
            ))}
          </div>

          <div className="progress-section">
            <h2>Your Progress</h2>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(completedSkills.size / skills.length) * 100}%`,
                }}
              />
            </div>
            <p>
              {completedSkills.size} of {skills.length} skills completed
            </p>
          </div>
        </div>
      ) : (
        <div className="zogo-container">
          <zogo-360
            ref={zogoRef}
            id="zogo-element"
            width="100%"
            height="100vh"
            auto-init="false"
          />
        </div>
      )}
    </div>
  );
}

export default App;
