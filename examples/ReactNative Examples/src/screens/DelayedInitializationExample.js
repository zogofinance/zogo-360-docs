import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Zogo360, Zogo360WebView } from "zogo-360-react-native";
import { useToken } from "../context/TokenContext";

const DelayedInitializationExample = () => {
  const webViewRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [webViewReady, setWebViewReady] = useState(false);
  const { token } = useToken();

  useEffect(() => {
    // Configure Zogo360 with the authentication token from context
    // But don't initialize yet - wait for user action
    Zogo360.configure({
      token: token,
    });
  }, [token]);

  const handleInitialize = () => {
    if (webViewReady && !isInitialized) {
      console.log("Button clicked - sending INITIALIZE message");
      webViewRef.current?.sendMessage("INITIALIZE", {
        user_auth_token: token,
        widget_type: "full_experience",
      });
      setIsInitialized(true);
    }
  };

  const handleMessage = (data) => {
    console.log("Message from Zogo360:", data);

    try {
      // Parse the message data
      const message = JSON.parse(data);
      console.log("Parsed message:", message);

      // When the WebView is ready, mark it as ready but don't initialize yet
      if (message.type === "REQUEST_INITIALIZATION") {
        console.log(
          "WebView is ready - waiting for user to click Initialize button"
        );
        setWebViewReady(true);
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Text style={styles.title}>Delayed Initialization Example</Text>
        <Text style={styles.description}>
          The WebView below is loaded but not initialized. Click the button to
          initialize Zogo 360.
        </Text>
        <TouchableOpacity
          style={[
            styles.button,
            (!webViewReady || isInitialized) && styles.buttonDisabled,
          ]}
          onPress={handleInitialize}
          disabled={!webViewReady || isInitialized}
        >
          <Text style={styles.buttonText}>
            {!webViewReady
              ? "Loading WebView..."
              : isInitialized
              ? "Initialized ✓"
              : "Initialize Zogo 360"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.webViewContainer}>
        <Zogo360WebView
          ref={webViewRef}
          onMessage={handleMessage}
          style={styles.webView}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  webViewContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#ddd",
    margin: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  webView: {
    flex: 1,
  },
});

export default DelayedInitializationExample;
