import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
} from "react-native";
import { Zogo360, Zogo360WebView } from "zogo-360-react-native";
import { useToken } from "../context/TokenContext";

const EventListenersExample = () => {
  const webViewRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [logs, setLogs] = useState([]);
  const { token } = useToken();

  useEffect(() => {
    // Configure Zogo360 with the authentication token from context
    Zogo360.configure({
      token: token,
    });
  }, [token]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const id = `${Date.now()}-${Math.random()}`;
    setLogs((prev) => [...prev, { id, message, timestamp }]);
    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleMessage = (data) => {
    // Log the raw message
    const rawLogMessage = `Raw message received: ${data}`;
    console.log(rawLogMessage);
    addLog(rawLogMessage);

    try {
      // Parse the message data
      const message = JSON.parse(data);
      const parsedLogMessage = `Parsed message: ${
        message.type
      } ${JSON.stringify(message.payload)}`;
      console.log(parsedLogMessage);
      addLog(parsedLogMessage);

      // Handle specific message types
      switch (message.type) {
        case "REQUEST_INITIALIZATION":
          // WebView is ready, send initialization
          const readyMessage = "WebView ready - sending INITIALIZE message";
          console.log(readyMessage);
          addLog(readyMessage);

          webViewRef.current?.sendMessage("INITIALIZE", {
            user_auth_token: token,
            widget_type: "full_experience",
          });
          break;

        case "INITIALIZATION_COMPLETE":
          // Listen for when Zogo 360 is initialized
          const initMessage = `Zogo 360 initialized with config: ${JSON.stringify(
            message.payload
          )}`;
          console.log(initMessage);
          addLog(initMessage);
          break;

        case "OPEN_URL":
          // Listen for URL open requests
          const urlMessage = `URL requested: ${message.payload?.url}`;
          console.log(urlMessage);
          addLog(urlMessage);

          if (message.payload?.url) {
            // In React Native, we use Linking API instead of window.open
            Linking.openURL(message.payload.url).catch((err) => {
              const errorMessage = `Failed to open URL: ${err}`;
              console.error(errorMessage);
              addLog(errorMessage);
            });
          }
          break;

        case "PLAY_SOUND":
          // Listen for sound play requests
          const soundMessage = `Sound requested: ${message.payload?.sound}`;
          console.log(soundMessage);
          addLog(soundMessage);
          // In a real app, you would play the sound here
          break;

        case "NAVIGATION_COMPLETE":
          // Listen for navigation events
          const navMessage = `Navigation complete: ${message.payload?.url}`;
          console.log(navMessage);
          addLog(navMessage);
          break;

        case "ERROR":
        case "INITIALIZATION_ERROR":
          // Listen for errors
          const errorMessage = `Error: ${
            message.payload?.message || JSON.stringify(message.payload)
          }`;
          console.error(errorMessage);
          addLog(errorMessage);
          break;

        case "EXIT_REQUESTED":
          // Listen for exit requests
          const exitMessage = `Exit requested: ${JSON.stringify(
            message.payload
          )}`;
          console.log(exitMessage);
          addLog(exitMessage);
          break;

        default:
          console.log(defaultMessage);
          addLog(defaultMessage);
          break;
      }
    } catch (error) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webViewContainer}>
        <Zogo360WebView
          ref={webViewRef}
          onMessage={handleMessage}
          style={styles.webView}
        />
      </View>

      <View style={styles.consoleContainer}>
        <View style={styles.consoleHeader}>
          <Text style={styles.consoleTitle}>Console Logs</Text>
        </View>
        <ScrollView
          ref={scrollViewRef}
          style={styles.consoleScroll}
          contentContainerStyle={styles.consoleContent}
        >
          {logs.map((log) => (
            <View key={log.id} style={styles.logEntry}>
              <Text style={styles.logTimestamp}>{log.timestamp}</Text>
              <Text style={styles.logMessage}>{log.message}</Text>
            </View>
          ))}
          {logs.length === 0 && (
            <Text style={styles.emptyMessage}>
              Waiting for messages from Zogo 360...
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  consoleContainer: {
    height: 300,
    backgroundColor: "#1e1e1e",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  consoleHeader: {
    padding: 10,
    backgroundColor: "#2d2d2d",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  consoleTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  consoleScroll: {
    flex: 1,
  },
  consoleContent: {
    padding: 10,
  },
  logEntry: {
    marginBottom: 8,
  },
  logTimestamp: {
    color: "#888",
    fontSize: 12,
    marginBottom: 2,
  },
  logMessage: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "monospace",
  },
  emptyMessage: {
    color: "#888",
    fontSize: 12,
    fontStyle: "italic",
  },
});

export default EventListenersExample;
