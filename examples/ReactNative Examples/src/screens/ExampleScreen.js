import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Zogo360, Zogo360WebView } from "zogo-360-react-native";

const ExampleScreen = ({ route }) => {
  const { name } = route.params || { name: "Example" };
  const webViewRef = useRef(null);

  useEffect(() => {
    // Configure Zogo360 when component mounts
    if (name === "01 Basic Web Example") {
      Zogo360.configure({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXBsb3ltZW50IjoicHJvZHVjdGlvbiIsInRva2VuX2lkIjo0Nzg1Njk5LCJ0b2tlbl90eXBlIjoiVXNlciIsInVzZXJfaWQiOjExMDY5NzYyLCJpbnN0aXR1dGlvbl9pZCI6Nzg5NzcsImlhdCI6MTc2MzQ3OTcyMSwiZXhwIjoxNzYzNTY2MTIxfQ.ocCXk89PJEZkws2PeOL4Wv9AsCAPRIiuOoX01yjSolI",
      });
    }
  }, [name]);

  // Render different examples based on the name
  const renderExample = () => {
    switch (name) {
      case "01 Basic Web Example":
        return (
          <View style={styles.webViewContainer}>
            <Zogo360WebView
              ref={webViewRef}
              onMessage={(type, data) => {
                console.log("Message from Zogo360:", type, data);
              }}
              style={styles.webView}
            />
          </View>
        );

      default:
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.subtitle}>
              This example will be implemented soon
            </Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>{renderExample()}</SafeAreaView>
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
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default ExampleScreen;
