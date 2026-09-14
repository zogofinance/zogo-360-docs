import React, { useRef, useEffect, useState } from "react";
import "./App.css";

function App() {
  const zogoRef = useRef(null);
  const [showZogo, setShowZogo] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);

  const modules = [
    {
      id: "994850",
      name: "The Product Life Cycle",
      description:
        "Learn about the stages products go through from introduction to decline.",
    },
    {
      id: "1008545",
      name: "Investing vs. Savings Goals",
      description:
        "Understand the differences between investing and saving for your financial goals.",
    },
  ];

  const openZogoModule = (moduleId, moduleName) => {
    setCurrentModule({ id: moduleId, name: moduleName });
    setShowZogo(true);

    // Initialize with deep link configuration
    if (zogoRef.current) {
      zogoRef.current.initialize({
        user_auth_token: "YOUR_AUTH_TOKEN_HERE",
        widget_type: "deep_link",
        module_id: moduleId,
      });
    }
  };

  useEffect(() => {
    if (!zogoRef.current) return;

    const handleMessage = (event) => {
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
  }, []);

  const handleZogoExit = (exitData) => {
    console.log("Exit requested:", exitData);

    // Hide Zogo and show app content
    setShowZogo(false);

    // Handle different exit scenarios
    if (exitData.source === "end_of_module") {
      // Module was completed
      alert(`Congratulations! You completed "${currentModule.name}".`);
      // Update user progress, unlock rewards, etc.
    } else if (exitData.source === "back_button") {
      // User clicked back without completing
      console.log("User exited early");
      // Maybe save partial progress
    }

    setCurrentModule(null);
  };

  return (
    <div className="App">
      {!showZogo ? (
        <div className="app-content">
          <h1>My Learning Application</h1>
          <p>Choose a module to begin your learning journey:</p>

          <div className="modules-grid">
            {modules.map((module) => (
              <div key={module.id} className="module-card">
                <h3>{module.name}</h3>
                <p>{module.description}</p>
                <button
                  onClick={() => openZogoModule(module.id, module.name)}
                  className="module-button"
                >
                  Start Module
                </button>
              </div>
            ))}
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
