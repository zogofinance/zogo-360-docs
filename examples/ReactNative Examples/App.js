import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { TokenProvider } from "./src/context/TokenContext";

export default function App() {
  return (
    <TokenProvider>
      <AppNavigator />
    </TokenProvider>
  );
}
