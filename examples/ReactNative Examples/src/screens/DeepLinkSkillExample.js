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

const DeepLinkSkillExample = () => {
  const webViewRef = useRef(null);
  const [showZogo, setShowZogo] = useState(false);
  const [currentSkillId, setCurrentSkillId] = useState(null);
  const [completedSkills, setCompletedSkills] = useState([]);
  const initTimeoutRef = useRef(null);
  const { token } = useToken();

  useEffect(() => {
    // Configure Zogo360 with authentication token from context
    Zogo360.configure({
      token: token,
    });
  }, [token]);

  const skills = [
    {
      id: "1",
      name: "Choose a Financial Institution",
      description:
        "Learn how to select the right bank or credit union for your needs.",
      modules: 5,
      estimatedTime: "25 minutes",
    },
    {
      id: "3",
      name: "Apply for Credit",
      description:
        "Understand the credit application process and improve your chances of approval.",
      modules: 7,
      estimatedTime: "35 minutes",
    },
  ];

  const openZogoSkill = (skillId) => {
    console.log(`Opening skill: ${skillId}`);
    setCurrentSkillId(skillId);
    setShowZogo(true);
  };

  const handleMessage = (data) => {
    console.log(`[DeepLinkSkill] Raw message received:`, data);

    try {
      const message = JSON.parse(data);
      console.log(
        `[DeepLinkSkill] Parsed message - Type: "${message.type}", Payload:`,
        message.payload
      );

      switch (message.type) {
        case "REQUEST_INITIALIZATION":
          // WebView is ready, send initialization with skill deep link
          if (currentSkillId && showZogo) {
            if (initTimeoutRef.current) {
              clearTimeout(initTimeoutRef.current);
            }

            initTimeoutRef.current = setTimeout(() => {
              console.log(`Initializing with skill ID: ${currentSkillId}`);
              webViewRef.current?.sendMessage("INITIALIZE", {
                user_auth_token: token,
                widget_type: "deep_link",
                skill_id: currentSkillId, // Using skill_id instead of module_id
              });
            }, 100);
          }
          break;

        case "EXIT_REQUESTED":
          console.log("EXIT_REQUESTED message received:", message.payload);
          handleZogoExit(message.payload);
          break;

        case "INITIALIZATION_ERROR":
          Alert.alert("Error", "Unable to load skill. Please try again.");
          setShowZogo(false);
          setCurrentSkillId(null);
          break;

        case "INITIALIZATION_COMPLETE":
          console.log("Skill initialization complete", message.payload);
          break;

        default:
          // Log any message that might be exit-related
          const lowerType = message.type.toLowerCase();
          if (
            lowerType.includes("exit") ||
            lowerType.includes("close") ||
            lowerType.includes("complete") ||
            lowerType.includes("finish")
          ) {
            console.log(
              `[DeepLinkSkill] Potential exit message: "${message.type}"`,
              message.payload
            );
          }
          break;
      }
    } catch (error) {
      console.error("[DeepLinkSkill] Error parsing message:", error);
    }
  };

  const handleZogoExit = (exitData) => {
    console.log("Exit requested:", exitData);

    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }

    const skillId = currentSkillId;
    setCurrentSkillId(null);
    setShowZogo(false);

    // Handle different exit scenarios
    if (exitData && exitData.source === "end_of_module") {
      // Skill was completed
      handleSkillCompletion(skillId);
    } else if (exitData && exitData.source === "back_button") {
      console.log("User exited skill early");
      // In a real app, you might save partial progress
    }
  };

  const handleSkillCompletion = (skillId) => {
    const skill = skills.find((s) => s.id === skillId);
    if (skill) {
      Alert.alert(
        "Congratulations!",
        `You completed the "${skill.name}" skill!`,
        [{ text: "OK" }]
      );

      // Mark skill as completed
      setCompletedSkills((prev) => [...prev, skillId]);
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
            <Text style={styles.backButtonText}>← Back to Skills</Text>
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
        <Text style={styles.title}>Financial Skills Training</Text>
        <Text style={styles.subtitle}>
          Complete these skills to improve your financial knowledge:
        </Text>

        <View style={styles.skillList}>
          {skills.map((skill) => {
            const isCompleted = completedSkills.includes(skill.id);
            return (
              <TouchableOpacity
                key={skill.id}
                style={[
                  styles.skillCard,
                  isCompleted && styles.skillCardCompleted,
                ]}
                onPress={() => !isCompleted && openZogoSkill(skill.id)}
                disabled={isCompleted}
              >
                <View style={styles.skillHeader}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  {isCompleted && (
                    <Text style={styles.completedBadge}>✓ Completed</Text>
                  )}
                </View>
                <Text style={styles.skillDescription}>{skill.description}</Text>
                <View style={styles.skillMeta}>
                  <Text style={styles.skillMetaText}>
                    {skill.modules} modules
                  </Text>
                  <Text style={styles.skillMetaText}>
                    {skill.estimatedTime}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.startButton,
                    isCompleted && styles.startButtonDisabled,
                  ]}
                  onPress={() => !isCompleted && openZogoSkill(skill.id)}
                  disabled={isCompleted}
                >
                  <Text style={styles.startButtonText}>
                    {isCompleted ? "Completed" : "Start Skill"}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What are Skills?</Text>
          <Text style={styles.infoText}>
            Skills are complete learning paths containing multiple modules.
            Complete all modules in a skill to earn badges and unlock
            achievements!
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
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  skillList: {
    marginBottom: 20,
  },
  skillCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
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
  skillCardCompleted: {
    backgroundColor: "#f0f8ff",
    borderWidth: 1,
    borderColor: "#28a745",
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  skillName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  completedBadge: {
    color: "#28a745",
    fontSize: 14,
    fontWeight: "600",
  },
  skillDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },
  skillMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  skillMetaText: {
    fontSize: 12,
    color: "#999",
  },
  startButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  startButtonDisabled: {
    backgroundColor: "#28a745",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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

export default DeepLinkSkillExample;
