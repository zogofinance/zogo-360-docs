import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Button,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ExampleScreen from "../screens/ExampleScreen";
import BasicWebExample from "../screens/BasicWebExample";
import DelayedInitializationExample from "../screens/DelayedInitializationExample";
import EventListenersExample from "../screens/EventListenersExample";
import DeepLinkModuleExample from "../screens/DeepLinkModuleExample";
import DeepLinkSkillExample from "../screens/DeepLinkSkillExample";
import AdvancedConfigurationExample from "../screens/AdvancedConfigurationExample";
import UserDataExample from "../screens/UserDataExample";
import { useToken } from "../context/TokenContext";

const Stack = createNativeStackNavigator();

// Menu screen with navigation options
function MenuScreen({ navigation }) {
  const { token, setToken } = useToken();
  const [inputToken, setInputToken] = useState(token);
  const [showToken, setShowToken] = useState(false);

  const handleSaveToken = () => {
    if (inputToken.trim()) {
      setToken(inputToken.trim());
      Alert.alert("Success", "Token updated successfully!");
    } else {
      Alert.alert("Error", "Please enter a valid token");
    }
  };

  const handleUseExampleToken = () => {
    const exampleToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXBsb3ltZW50IjoicHJvZHVjdGlvbiIsInRva2VuX2lkIjo0Nzg1Njk5LCJ0b2tlbl90eXBlIjoiVXNlciIsInVzZXJfaWQiOjExMDY5NzYyLCJpbnN0aXR1dGlvbl9pZCI6Nzg5NzcsImlhdCI6MTc2MzQ3OTcyMSwiZXhwIjoxNzYzNTY2MTIxfQ.ocCXk89PJEZkws2PeOL4Wv9AsCAPRIiuOoX01yjSolI";
    setInputToken(exampleToken);
    setToken(exampleToken);
    Alert.alert("Success", "Example token loaded!");
  };

  const handleNavigateToExample = (screenName, exampleName) => {
    if (!token || token.trim() === "") {
      Alert.alert(
        "Token Required",
        "Please enter a valid authentication token before accessing examples.",
        [{ text: "OK" }]
      );
      return;
    }

    if (screenName) {
      navigation.navigate(screenName);
    } else {
      navigation.navigate("Example", { name: exampleName });
    }
  };
  // Using the actual folder names from vanillaJSExmples
  const examples = [
    "01 Basic Web Example",
    "02 Delayed Initialization Example",
    "03 Event Listeners Example",
    "04 Deep Link Module Example",
    "05 Deep Link Skill Example",
    "06 Advanced Configuration and Customization",
    "07 User Data Example",
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>React Native Examples</Text>

        {/* Token Input Section */}
        <View style={styles.tokenSection}>
          <Text style={styles.tokenTitle}>Authentication Token</Text>
          <Text style={styles.tokenDescription}>
            Enter your Zogo360 token to access examples
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.tokenInput}
              value={inputToken}
              onChangeText={setInputToken}
              placeholder="Enter your authentication token"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              secureTextEntry={!showToken}
            />
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowToken(!showToken)}
            >
              <Text style={styles.toggleButtonText}>
                {showToken ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                inputToken === token && styles.savedButton,
              ]}
              onPress={handleSaveToken}
            >
              <Text style={styles.saveButtonText}>
                {inputToken === token ? "✓ Token Saved" : "Save Token"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exampleButton}
              onPress={handleUseExampleToken}
            >
              <Text style={styles.exampleButtonText}>Use Example Token</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Menu */}
        {examples.map((example, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              (!token || token.trim() === "") && styles.disabledMenuItem,
            ]}
            onPress={() => {
              // Navigate to specific screens for implemented examples
              if (example === "01 Basic Web Example") {
                handleNavigateToExample("BasicWebExample", example);
              } else if (example === "02 Delayed Initialization Example") {
                handleNavigateToExample(
                  "DelayedInitializationExample",
                  example
                );
              } else if (example === "03 Event Listeners Example") {
                handleNavigateToExample("EventListenersExample", example);
              } else if (example === "04 Deep Link Module Example") {
                handleNavigateToExample("DeepLinkModuleExample", example);
              } else if (example === "05 Deep Link Skill Example") {
                handleNavigateToExample("DeepLinkSkillExample", example);
              } else if (
                example === "06 Advanced Configuration and Customization"
              ) {
                handleNavigateToExample(
                  "AdvancedConfigurationExample",
                  example
                );
              } else if (example === "07 User Data Example") {
                handleNavigateToExample("UserDataExample", example);
              } else {
                handleNavigateToExample(null, example);
              }
            }}
          >
            <Text
              style={[
                styles.menuText,
                (!token || token.trim() === "") && styles.disabledMenuText,
              ]}
            >
              {example}
            </Text>
            {(!token || token.trim() === "") && (
              <Text style={styles.requiresTokenText}>Requires token</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Menu"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#007bff",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ title: "Zogo 360 React Native Examples" }}
        />
        <Stack.Screen
          name="BasicWebExample"
          component={BasicWebExample}
          options={{ title: "01 Basic Web Example" }}
        />
        <Stack.Screen
          name="DelayedInitializationExample"
          component={DelayedInitializationExample}
          options={{ title: "02 Delayed Initialization Example" }}
        />
        <Stack.Screen
          name="EventListenersExample"
          component={EventListenersExample}
          options={{ title: "03 Event Listeners Example" }}
        />
        <Stack.Screen
          name="DeepLinkModuleExample"
          component={DeepLinkModuleExample}
          options={{ title: "04 Deep Link Module Example" }}
        />
        <Stack.Screen
          name="DeepLinkSkillExample"
          component={DeepLinkSkillExample}
          options={{ title: "05 Deep Link Skill Example" }}
        />
        <Stack.Screen
          name="AdvancedConfigurationExample"
          component={AdvancedConfigurationExample}
          options={{ title: "06 Advanced Configuration" }}
        />
        <Stack.Screen
          name="UserDataExample"
          component={UserDataExample}
          options={{ title: "07 User Data Example" }}
        />
        <Stack.Screen
          name="Example"
          component={ExampleScreen}
          options={({ route }) => ({ title: route.params?.name || "Example" })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  tokenSection: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#007bff",
  },
  tokenTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  tokenDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  inputContainer: {
    position: "relative",
    marginBottom: 15,
  },
  tokenInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    minHeight: 80,
  },
  toggleButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  savedButton: {
    backgroundColor: "#28a745",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  exampleButton: {
    flex: 1,
    backgroundColor: "#6c757d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  exampleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  menuItem: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledMenuItem: {
    backgroundColor: "#f0f0f0",
    opacity: 0.7,
  },
  menuText: {
    fontSize: 18,
    color: "#007bff",
  },
  disabledMenuText: {
    color: "#999",
  },
  requiresTokenText: {
    fontSize: 12,
    color: "#ff6b6b",
    marginTop: 5,
    fontStyle: "italic",
  },
});

export default AppNavigator;
