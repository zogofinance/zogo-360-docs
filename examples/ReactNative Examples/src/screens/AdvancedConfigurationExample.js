import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Zogo360, Zogo360WebView } from "zogo-360-react-native";
import { useToken } from "../context/TokenContext";

const AdvancedConfigurationExample = () => {
  const webViewRef = useRef(null);
  const [currentTheme, setCurrentTheme] = useState("default");
  const [isInitialized, setIsInitialized] = useState(false);
  const { token } = useToken();

  useEffect(() => {
    // Configure Zogo360 with the authentication token from context
    Zogo360.configure({
      token: token,
    });
  }, [token]);

  // CSS Theme Definitions
  const themes = {
    default: {
      name: "Default",
      css: "", // Empty string uses default Zogo styling
      priority: "inline",
    },
    light: {
      name: "Light Mode",
      css: `
        :root {
          /* Light mode color scheme */
          --brand-primary: #1c64f2;
          --tints-primary-1: #ebf5ff;
          --tints-primary-2: #c3ddfd;
          --tints-primary-3: #76a9fa;
          --shades-primary-1: #233876;
          --shades-primary-2: #1a223a;

          --brand-green: #04cd92;
          --tints-green-1: #e9faf5;
          --shades-green-1: #148060;

          --brand-gold: #faca15;
          --tints-gold-1: #fefae8;
          --shades-gold-1: #886e0c;

          --brand-orange: #ff5a1f;
          --tints-orange-1: #fff3ee;
          --shades-orange-1: #bf4417;

          --utility-red: #ed3731;
          --utility-red-tint-1: #fef0ef;
          --utility-red-shade-1: #c51711;

          --neutral-white: #ffffff;
          --neutral-100: #f6f6f6;
          --neutral-200: #ececec;
          --neutral-300: #dcdcdc;
          --neutral-400: #acacac;
          --neutral-500: #8c8c8c;
          --neutral-600: #6f6f6f;
          --neutral-700: #484848;
          --neutral-800: #313131;
          --neutral-warm-100: #faf9f5;
          --neutral-warm-200: #f5f3eb;
          --neutral-warm-300: #eeebdd;
        }
        
        body {
          background-color: var(--neutral-white) !important;
          color: var(--neutral-800) !important;
        }
      `,
      priority: "inline",
    },
    dark: {
      name: "Dark Mode",
      css: `
        :root {
          /* Dark mode color scheme */
          --brand-primary: #76a9fa;
          --tints-primary-1: #1a223a;
          --tints-primary-2: #233876;
          --tints-primary-3: #1c64f2;
          --shades-primary-1: #c3ddfd;
          --shades-primary-2: #ebf5ff;

          --brand-green: #04cd92;
          --tints-green-1: #148060;
          --shades-green-1: #e9faf5;

          --brand-gold: #faca15;
          --tints-gold-1: #886e0c;
          --shades-gold-1: #fefae8;

          --brand-orange: #ff5a1f;
          --tints-orange-1: #bf4417;
          --shades-orange-1: #fff3ee;

          --utility-red: #ed3731;
          --utility-red-tint-1: #c51711;
          --utility-red-shade-1: #fef0ef;

          --neutral-white: #1a1a1a;
          --neutral-100: #242424;
          --neutral-200: #2d2d2d;
          --neutral-300: #3a3a3a;
          --neutral-400: #6f6f6f;
          --neutral-500: #8c8c8c;
          --neutral-600: #acacac;
          --neutral-700: #dcdcdc;
          --neutral-800: #f6f6f6;
          --neutral-warm-100: #2a2925;
          --neutral-warm-200: #353329;
          --neutral-warm-300: #42402d;
        }
        
        body {
          background-color: var(--neutral-white) !important;
          color: var(--neutral-800) !important;
        }
        
        .card, .module-card {
          background-color: var(--neutral-200) !important;
          border-color: var(--neutral-300) !important;
          color: var(--neutral-800) !important;
        }
        
        .btn-primary {
          background-color: var(--brand-primary) !important;
          border-color: var(--brand-primary) !important;
          color: var(--neutral-white) !important;
        }
        
        .text-muted {
          color: var(--neutral-600) !important;
        }
        
        /* Additional dark mode adjustments */
        .navbar {
          background-color: var(--neutral-100) !important;
          border-bottom: 1px solid var(--neutral-300) !important;
        }
        
        input, select, textarea {
          background-color: var(--neutral-100) !important;
          border-color: var(--neutral-300) !important;
          color: var(--neutral-800) !important;
        }
        
        .modal-content {
          background-color: var(--neutral-200) !important;
          color: var(--neutral-800) !important;
        }
      `,
      priority: "inline",
    },
  };

  const applyTheme = (themeName) => {
    const theme = themes[themeName];
    if (theme && webViewRef.current && isInitialized) {
      // Send SET_CUSTOM_CSS message to the WebView
      webViewRef.current.sendMessage("CUSTOM_CSS", {
        css: theme.css,
        url: null,
        priority: theme.priority,
      });
      setCurrentTheme(themeName);
      console.log(`Applied ${themeName} theme`);
    }
  };

  const handleMessage = (data) => {
    console.log("Message from Zogo360:", data);

    try {
      const message = JSON.parse(data);
      console.log("Parsed message:", message);

      switch (message.type) {
        case "REQUEST_INITIALIZATION":
          // WebView is ready, send the INITIALIZE message
          webViewRef.current?.sendMessage("INITIALIZE", {
            user_auth_token: token,
            widget_type: "full_experience",
          });
          break;

        case "INITIALIZATION_COMPLETE":
          setIsInitialized(true);
          console.log("Zogo 360 initialized");
          break;

        case "CUSTOM_CSS_APPLIED":
          console.log("CSS applied successfully:", message.payload);
          break;

        case "CUSTOM_CSS_ERROR":
          console.error("CSS error:", message.payload);
          alert("Failed to apply CSS: " + message.payload.error);
          break;
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.controls}>
          <Text style={styles.title}>
            Advanced Configuration and Customization
          </Text>
          <Text style={styles.subtitle}>
            Customize the appearance of Zogo 360 with different themes
          </Text>

          <View style={styles.themeSection}>
            <Text style={styles.sectionTitle}>Theme Selection</Text>
            <Text style={styles.sectionDescription}>
              Choose a theme to apply custom CSS styling to Zogo 360. The
              changes will be applied in real-time.
            </Text>

            <View style={styles.themeButtons}>
              {Object.entries(themes).map(([key, theme]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.themeButton,
                    currentTheme === key && styles.themeButtonActive,
                  ]}
                  onPress={() => applyTheme(key)}
                  disabled={!isInitialized}
                >
                  <Text
                    style={[
                      styles.themeButtonText,
                      currentTheme === key && styles.themeButtonTextActive,
                    ]}
                  >
                    {theme.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {!isInitialized && (
              <Text style={styles.waitingText}>
                Waiting for Zogo 360 to initialize...
              </Text>
            )}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>How it works:</Text>
            <Text style={styles.infoText}>
              • CSS variables control the color scheme{"\n"}• Light mode uses
              standard colors for readability{"\n"}• Dark mode inverts the color
              scale{"\n"}• Changes are applied instantly{"\n"}• All UI
              components adapt to the theme
            </Text>
          </View>

          <View style={styles.additionalSection}>
            <Text style={styles.sectionTitle}>Additional Customizations</Text>
            <Text style={styles.sectionDescription}>
              The Zogo 360 SDK also supports:
            </Text>
            <View style={styles.featureList}>
              <Text style={styles.featureItem}>
                • Sound customization - Replace or mute sounds
              </Text>
              <Text style={styles.featureItem}>
                • External CSS loading - Load themes from URLs
              </Text>
              <Text style={styles.featureItem}>
                • Component-specific styling - Target individual elements
              </Text>
              <Text style={styles.featureItem}>
                • Brand consistency - Match your app's design
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.webViewContainer}>
          <Zogo360WebView
            ref={webViewRef}
            onMessage={handleMessage}
            style={styles.webView}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  controls: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  themeSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },
  themeButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },
  themeButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    margin: 5,
    borderWidth: 2,
    borderColor: "transparent",
  },
  themeButtonActive: {
    backgroundColor: "#007bff",
    borderColor: "#0056b3",
  },
  themeButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  themeButtonTextActive: {
    color: "#fff",
  },
  waitingText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    marginTop: 10,
    textAlign: "center",
  },
  infoSection: {
    backgroundColor: "#e7f3ff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#004085",
  },
  infoText: {
    fontSize: 14,
    color: "#004085",
    lineHeight: 22,
  },
  additionalSection: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
  },
  featureList: {
    marginTop: 10,
  },
  featureItem: {
    fontSize: 14,
    color: "#555",
    lineHeight: 24,
  },
  webViewContainer: {
    height: 600,
    margin: 10,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  webView: {
    flex: 1,
  },
});

export default AdvancedConfigurationExample;
