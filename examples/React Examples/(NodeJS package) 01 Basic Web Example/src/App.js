import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <zogo-360 auto-init="true" token="YOUR_AUTH_TOKEN_HERE" width="100%" height="600px" />
    </div>
  );
}

export default App;
