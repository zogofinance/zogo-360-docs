import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Zogo360, Zogo360WebView } from "zogo-360-react-native";
import { useToken } from "../context/TokenContext";

const DeepLinkModuleExample = () => {
  const webViewRef = useRef(null);
  const [showZogo, setShowZogo] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const initTimeoutRef = useRef(null);
  const { token } = useToken();

  useEffect(() => {
    // Configure Zogo360 with authentication token from context
    Zogo360.configure({
      token: token,
    });
  }, [token]);

  const modules = [
    { id: "994850", name: "The Product Life Cycle" },
    { id: "1008545", name: "Investing vs. Savings Goals" },
  ];

  const openZogoModule = (moduleId) => {
    console.log(`Opening module: ${moduleId}`);
    setCurrentModuleId(moduleId);
    setShowZogo(true);

    // Wait for WebView to be ready before initializing
    // The initialization will happen in handleMessage when we receive REQUEST_INITIALIZATION
  };

  const handleMessage = (data) => {
    // Log ALL messages to see what's available
    console.log(`[DeepLink] Raw message received:`, data);

    try {
      // Parse the message data
      const message = JSON.parse(data);
      console.log(
        `[DeepLink] Parsed message - Type: "${message.type}", Payload:`,
        message.payload
      );

      switch (message.type) {
        case "REQUEST_INITIALIZATION":
          // WebView is ready, send initialization with deep link configuration
          // Use a timeout to debounce multiple ready messages
          if (currentModuleId && showZogo) {
            if (initTimeoutRef.current) {
              clearTimeout(initTimeoutRef.current);
            }

            initTimeoutRef.current = setTimeout(() => {
              console.log(`Initializing with module ID: ${currentModuleId}`);
              webViewRef.current?.sendMessage("INITIALIZE", {
                user_auth_token: token,
                widget_type: "deep_link",
                module_id: currentModuleId,
              });
            }, 100); // Small delay to prevent multiple initializations
          }
          break;

        case "EXIT_REQUESTED":
          console.log("EXIT_REQUESTED message received:", message.payload);
          handleZogoExit(message.payload);
          break;

        case "INITIALIZATION_ERROR":
          Alert.alert("Error", "Unable to load module. Please try again.");
          setShowZogo(false);
          setCurrentModuleId(null);
          break;

        case "INITIALIZATION_COMPLETE":
          console.log("Module initialization complete", message.payload);
          break;

        case "NAVIGATION_COMPLETE":
          console.log("Navigation complete", message.payload);
          break;

        default:
          // Log any message that might be exit-related
          const lowerType = message.type.toLowerCase();
          if (
            lowerType.includes("exit") ||
            lowerType.includes("close") ||
            lowerType.includes("complete") ||
            lowerType.includes("finish") ||
            lowerType.includes("back") ||
            lowerType.includes("end")
          ) {
            console.log(
              `[DeepLink] Potential exit message not handled: "${message.type}"`,
              message.payload
            );
          }
          break;
      }
    } catch (error) {
      console.error("[DeepLink] Error parsing message:", error);
    }
  };

  const handleZogoExit = (exitData) => {
    console.log("Exit requested:", exitData);

    // Clear any pending initialization
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }

    // Clear the current module ID first to prevent re-initialization
    setCurrentModuleId(null);

    // Hide Zogo and show app content
    setShowZogo(false);

    // Handle different exit scenarios
    if (exitData && exitData.source === "end_of_module") {
      // Module was completed
      Alert.alert("Congratulations!", "You completed the module.", [
        { text: "OK" },
      ]);
      // In a real app, you would update user progress, unlock rewards, etc.
    } else if (exitData && exitData.source === "back_button") {
      // User clicked back without completing
      console.log("User exited early");
      // In a real app, you might save partial progress
    }
  };

  if (showZogo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleZogoExit({ source: "back_button" })}
          >
            <Text style={styles.backButtonText}>← Back to Modules</Text>
          </TouchableOpacity>
        </View>
        <Zogo360WebView
          ref={webViewRef}
          onMessage={handleMessage}
          style={styles.webView}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Application</Text>
        <Text style={styles.subtitle}>Select a module to learn:</Text>

        <View style={styles.moduleList}>
          {modules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleButton}
              onPress={() => openZogoModule(module.id)}
            >
              <Text style={styles.moduleButtonText}>{module.name}</Text>
              <Text style={styles.moduleId}>Module ID: {module.id}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            • Tap a module to open it directly{"\n"}• The module will open in
            deep link mode{"\n"}• Complete the module or use back button to
            return{"\n"}• Exit events are handled automatically
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  moduleList: {
    marginBottom: 30,
  },
  moduleButton: {
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  moduleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  moduleId: {
    color: "#cce5ff",
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: "#e7f3ff",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#b8daff",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#004085",
  },
  infoText: {
    fontSize: 14,
    color: "#004085",
    lineHeight: 22,
  },
  header: {
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "600",
  },
  webView: {
    flex: 1,
  },
});

export default DeepLinkModuleExample;
