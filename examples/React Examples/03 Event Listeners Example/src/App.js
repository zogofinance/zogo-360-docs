import React, { useRef, useEffect, useState } from "react";
import "./App.css";

function App() {
  const zogoRef = useRef(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const zogoElement = zogoRef.current;
    if (!zogoElement) return;

    // Event handler functions
    const handleInitialized = (event) => {
      console.log("Zogo 360 initialized with config:", event.detail.config);
      addEvent("Initialized", event.detail.config);
    };

    const handleMessage = (event) => {
      console.log("Message received:", event.detail.type, event.detail.payload);
      addEvent(`Message: ${event.detail.type}`, event.detail.payload);
    };

    const handleOpenUrl = (event) => {
      console.log("URL requested:", event.detail.url);
      addEvent("Open URL", event.detail.url);
      window.open(event.detail.url, "_blank");
    };

    const handlePlaySound = (event) => {
      console.log("Sound requested:", event.detail);
      addEvent("Play Sound", event.detail);
    };

    // Add event listeners
    zogoElement.addEventListener("zogo360:initialized", handleInitialized);
    zogoElement.addEventListener("message", handleMessage);
    zogoElement.addEventListener("openurl", handleOpenUrl);
    zogoElement.addEventListener("playsound", handlePlaySound);

    // Cleanup function
    return () => {
      zogoElement.removeEventListener("zogo360:initialized", handleInitialized);
      zogoElement.removeEventListener("message", handleMessage);
      zogoElement.removeEventListener("openurl", handleOpenUrl);
      zogoElement.removeEventListener("playsound", handlePlaySound);
    };
  }, []);

  const addEvent = (type, data) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents((prev) => [...prev, { timestamp, type, data }]);
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="zogo-container">
          <zogo-360
            ref={zogoRef}
            id="zogo-container"
            token="YOUR_AUTH_TOKEN_HERE"
            width="100%"
            height="600px"
          />
        </div>

        <div className="events-panel">
          <div className="events-header">
            <h2>Event Log</h2>
            <button onClick={clearEvents} className="clear-button">
              Clear Log
            </button>
          </div>

          <div className="events-list">
            {events.length === 0 ? (
              <p className="no-events">
                No events captured yet. Interact with Zogo 360 to see events.
              </p>
            ) : (
              events.map((event, index) => (
                <div key={index} className="event-item">
                  <div className="event-header">
                    <span className="event-time">{event.timestamp}</span>
                    <span className="event-type">{event.type}</span>
                  </div>
                  <div className="event-data">
                    <pre>{JSON.stringify(event.data, null, 2)}</pre>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
