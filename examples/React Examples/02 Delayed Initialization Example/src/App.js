import React, { useRef } from "react";
import "./App.css";

function App() {
  const zogoRef = useRef(null);

  const initializeZogo = () => {
    if (zogoRef.current) {
      zogoRef.current.initialize({
        user_auth_token: "YOUR_AUTH_TOKEN_HERE",
      });
    }
  };

  return (
    <div className="App">
      <button onClick={initializeZogo} className="init-button">
        Initialize Zogo 360
      </button>

      <zogo-360
        ref={zogoRef}
        id="zogo-container"
        width="100%"
        height="600px"
        auto-init="false"
      />
    </div>
  );
}

export default App;
