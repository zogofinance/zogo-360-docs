import React, { useEffect, useRef } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Zogo360, Zogo360WebView } from "zogo-360-react-native";
import { useToken } from "../context/TokenContext";

const BasicWebExample = () => {
  const webViewRef = useRef(null);
  const { token } = useToken();

  useEffect(() => {
    // Configure Zogo360 with the authentication token from context
    Zogo360.configure({
      token: token,
    });
  }, [token]);

  const handleMessage = (data) => {
    console.log("Message from Zogo360:", data);

    try {
      // Parse the message data
      const message = JSON.parse(data);
      console.log("Parsed message:", message);

      // When the WebView is ready, send the INITIALIZE message
      if (message.type === "REQUEST_INITIALIZATION") {
        webViewRef.current?.sendMessage("INITIALIZE", {
          user_auth_token: token,
          widget_type: "full_experience",
        });
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
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
});

export default BasicWebExample;
