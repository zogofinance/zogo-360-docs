import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import { themes } from "./themes";

function App() {
  const zogoRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("default");
  const [customizationLog, setCustomizationLog] = useState([]);

  useEffect(() => {
    // Initialize Zogo 360 with default settings
    if (zogoRef.current && !isInitialized) {
      zogoRef.current.initialize({
        user_auth_token: "YOUR_AUTH_TOKEN_HERE",
      });
      setIsInitialized(true);
      addLog("Initialized", "Zogo 360 initialized with default settings");
    }
  }, [isInitialized]);

  useEffect(() => {
    if (!zogoRef.current) return;

    const handleMessage = (event) => {
      switch (event.detail.type) {
        case "CUSTOM_CSS_APPLIED":
          console.log("CSS applied successfully:", event.detail.payload);
          addLog("CSS Applied", "Custom CSS applied successfully");
          break;
        case "CUSTOM_CSS_ERROR":
          console.error("CSS error:", event.detail.payload);
          addLog(
            "CSS Error",
            `Failed to apply CSS: ${event.detail.payload.error}`
          );
          break;
        case "CUSTOM_SOUNDS_LOADED":
          console.log("Sounds loaded successfully:", event.detail.payload);
          addLog("Sounds Loaded", "Custom sounds loaded successfully");
          break;
        case "CUSTOM_SOUNDS_ERROR":
          console.error("Sound loading error:", event.detail.payload);
          addLog(
            "Sound Error",
            `Failed to load sounds: ${event.detail.payload.error}`
          );
          break;
        default:
          break;
      }
    };

    zogoRef.current.addEventListener("message", handleMessage);

    return () => {
      if (zogoRef.current) {
        zogoRef.current.removeEventListener("message", handleMessage);
      }
    };
  }, []);

  const applyTheme = (themeName) => {
    const theme = themes[themeName];
    if (theme && zogoRef.current) {
      zogoRef.current.setCustomCSS(theme.css, null, theme.priority);
      setCurrentTheme(themeName);
      addLog("Theme Change", `Applied ${themeName} theme`);
    }
  };

  const addLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setCustomizationLog((prev) => [...prev, { timestamp, type, message }]);
  };

  const clearLog = () => {
    setCustomizationLog([]);
  };

  return (
    <div className="App">
      <div className="controls-panel">
        <h1>Zogo 360 Advanced Configuration</h1>

        <div className="control-section">
          <h3>Theme Selection</h3>
          <p>Choose a theme to customize the appearance of Zogo 360:</p>
          <div className="theme-buttons">
            <button
              onClick={() => applyTheme("default")}
              className={currentTheme === "default" ? "active" : ""}
            >
              Default Theme
            </button>
            <button
              onClick={() => applyTheme("light")}
              className={currentTheme === "light" ? "active" : ""}
            >
              Light Mode
            </button>
            <button
              onClick={() => applyTheme("dark")}
              className={currentTheme === "dark" ? "active" : ""}
            >
              Dark Mode
            </button>
          </div>
        </div>

        <div className="control-section">
          <h3>Customization Log</h3>
          <div className="log-header">
            <p>Track customization events and changes:</p>
            <button onClick={clearLog} className="clear-log-btn">
              Clear Log
            </button>
          </div>
          <div className="customization-log">
            {customizationLog.length === 0 ? (
              <p className="no-logs">No customization events yet</p>
            ) : (
              customizationLog.map((log, index) => (
                <div key={index} className="log-entry">
                  <span className="log-time">{log.timestamp}</span>
                  <span className="log-type">{log.type}:</span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="info-section">
          <h3>Additional Customization Options</h3>
          <p>The Zogo 360 SDK supports additional customization features:</p>
          <ul>
            <li>
              <strong>Custom Sounds:</strong> Replace default sounds with your
              own audio files
            </li>
            <li>
              <strong>External CSS:</strong> Load styles from external URLs for
              easier management
            </li>
            <li>
              <strong>Dynamic Theming:</strong> Change themes based on user
              preferences or time of day
            </li>
            <li>
              <strong>Component Styling:</strong> Target specific UI components
              with custom CSS
            </li>
          </ul>
        </div>
      </div>

      <div className="zogo-container">
        <zogo-360
          ref={zogoRef}
          id="zogo-element"
          width="100%"
          height="600px"
          auto-init="false"
        />
      </div>
    </div>
  );
}

export default App;
