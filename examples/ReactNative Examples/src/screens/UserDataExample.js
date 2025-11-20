import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { getUserData } from "zogo-360-react-native";
import { useToken } from "../context/TokenContext";

const UserDataExample = () => {
  const { token } = useToken();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [userData, setUserData] = useState(null);

  const dataTypes = [
    { type: "module_history", label: "Module History", icon: "📚" },
    { type: "current_module", label: "Current Module", icon: "📖" },
    { type: "skill_history", label: "Skill History", icon: "🎯" },
    { type: "current_skill", label: "Current Skill", icon: "💡" },
    { type: "current_achievements", label: "Current Achievements", icon: "🏆" },
    { type: "achievements_history", label: "Achievement History", icon: "🏅" },
    { type: "reward_history", label: "Reward History", icon: "🎁" },
  ];

  const fetchUserData = async (type) => {
    if (!token) {
      Alert.alert("Error", "Please set your authentication token first");
      return;
    }

    setLoading(true);
    setSelectedType(type);
    try {
      const data = await getUserData(type, token);
      setUserData(data);
      console.log(`Fetched ${type} data:`, data);
    } catch (error) {
      console.error(`Failed to fetch ${type} data:`, error);
      Alert.alert("Error", `Failed to fetch ${type} data: ${error.message}`);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderModuleHistory = (data) => {
    if (!data?.modules || data.modules.length === 0) {
      return <Text style={styles.noData}>No module history available</Text>;
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>Module History</Text>
        {data.modules.map((module, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{module.name}</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${module.progress * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(module.progress * 100)}%
              </Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statText}>
                Points: {module.points_earned}/{module.points_available}
              </Text>
              <Text style={styles.statText}>
                Accuracy: {Math.round(module.accuracy * 100)}%
              </Text>
            </View>
            {module.date_completed && (
              <Text style={styles.dateText}>
                Completed:{" "}
                {new Date(module.date_completed).toLocaleDateString()}
              </Text>
            )}
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaText}>Review Module</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderCurrentModule = (data) => {
    if (!data?.module) {
      return (
        <Text style={styles.noData}>No current module data available</Text>
      );
    }

    const module = data.module;
    return (
      <View>
        <Text style={styles.sectionTitle}>Current Module</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{module.name}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${module.progress * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(module.progress * 100)}%
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>
              Points: {module.points_earned}/{module.points_available}
            </Text>
            <Text style={styles.statText}>
              Accuracy: {Math.round(module.accuracy * 100)}%
            </Text>
          </View>
          <TouchableOpacity style={[styles.ctaButton, styles.primaryCta]}>
            <Text style={[styles.ctaText, styles.primaryCtaText]}>
              Continue Learning
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSkillHistory = (data) => {
    if (!data?.skills || data.skills.length === 0) {
      return <Text style={styles.noData}>No skill history available</Text>;
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>Skill History</Text>
        {data.skills.map((skill, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{skill.name}</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${skill.progress * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(skill.progress * 100)}%
              </Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statText}>
                Points: {skill.points_earned}/{skill.points_available}
              </Text>
              <Text style={styles.statText}>
                Accuracy: {Math.round(skill.accuracy * 100)}%
              </Text>
            </View>
            {skill.date_completed && (
              <Text style={styles.dateText}>
                Completed: {new Date(skill.date_completed).toLocaleDateString()}
              </Text>
            )}
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaText}>Practice Again</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderCurrentSkill = (data) => {
    if (!data?.skill) {
      return <Text style={styles.noData}>No current skill data available</Text>;
    }

    const skill = data.skill;
    return (
      <View>
        <Text style={styles.sectionTitle}>Current Skill</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{skill.name}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${skill.progress * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(skill.progress * 100)}%
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>
              Points: {skill.points_earned}/{skill.points_available}
            </Text>
            <Text style={styles.statText}>
              Accuracy: {Math.round(skill.accuracy * 100)}%
            </Text>
          </View>
          <TouchableOpacity style={[styles.ctaButton, styles.primaryCta]}>
            <Text style={[styles.ctaText, styles.primaryCtaText]}>
              Master This Skill
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCurrentAchievements = (data) => {
    if (!data?.achievements || data.achievements.length === 0) {
      return (
        <Text style={styles.noData}>No current achievements available</Text>
      );
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>Current Achievements</Text>
        {data.achievements.map((achievement, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{achievement.name}</Text>
            <Text style={styles.subText}>{achievement.sub_text}</Text>
            <View style={styles.achievementProgress}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${achievement.progress * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {achievement.current_metric_value}/
                {achievement.complete_metric_value}
              </Text>
            </View>
            <Text style={styles.pointsText}>
              🏆 {achievement.points_available} points
            </Text>
            {achievement.progress < 1 && (
              <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaText}>View Progress</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderAchievementsHistory = (data) => {
    if (!data?.achievements || data.achievements.length === 0) {
      return (
        <Text style={styles.noData}>No achievement history available</Text>
      );
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>Achievement History</Text>
        {data.achievements.map((achievement, index) => (
          <View key={index} style={[styles.card, styles.completedCard]}>
            <Text style={styles.cardTitle}>✅ {achievement.name}</Text>
            <Text style={styles.subText}>{achievement.sub_text}</Text>
            <Text style={styles.pointsText}>
              🏆 {achievement.points_available} points earned
            </Text>
            {achievement.date_complete && (
              <Text style={styles.dateText}>
                Completed:{" "}
                {new Date(achievement.date_complete).toLocaleDateString()}
              </Text>
            )}
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaText}>Share Achievement</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderRewardHistory = (data) => {
    if (!data?.rewards || data.rewards.length === 0) {
      return <Text style={styles.noData}>No reward history available</Text>;
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>Reward History</Text>
        {data.rewards.map((reward, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{reward.name}</Text>
            <Text style={styles.subText}>{reward.description}</Text>
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardType}>Type: {reward.type}</Text>
              <Text style={styles.rewardCost}>💰 {reward.cost} points</Text>
            </View>
            {reward.redemption_date && (
              <Text style={styles.dateText}>
                Redeemed:{" "}
                {new Date(reward.redemption_date).toLocaleDateString()}
              </Text>
            )}
            <TouchableOpacity style={[styles.ctaButton, styles.successCta]}>
              <Text style={[styles.ctaText, styles.successCtaText]}>
                View Details
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderData = () => {
    if (!userData || !selectedType) return null;

    switch (selectedType) {
      case "module_history":
        return renderModuleHistory(userData);
      case "current_module":
        return renderCurrentModule(userData);
      case "skill_history":
        return renderSkillHistory(userData);
      case "current_skill":
        return renderCurrentSkill(userData);
      case "current_achievements":
        return renderCurrentAchievements(userData);
      case "achievements_history":
        return renderAchievementsHistory(userData);
      case "reward_history":
        return renderRewardHistory(userData);
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User Data Example</Text>
      <Text style={styles.description}>
        This example demonstrates fetching and displaying various types of user
        data from the Zogo API. Select a data type below to fetch and visualize
        the data.
      </Text>

      <View style={styles.buttonGrid}>
        {dataTypes.map((item) => (
          <TouchableOpacity
            key={item.type}
            style={[
              styles.dataTypeButton,
              selectedType === item.type && styles.selectedButton,
            ]}
            onPress={() => fetchUserData(item.type)}
            disabled={loading}
          >
            <Text style={styles.buttonIcon}>{item.icon}</Text>
            <Text style={styles.buttonLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Fetching data...</Text>
        </View>
      )}

      {!loading && userData && (
        <View style={styles.dataContainer}>{renderData()}</View>
      )}

      <View style={styles.codeExample}>
        <Text style={styles.codeTitle}>Code Example:</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
            {`import { getUserData } from 'zogo-360-react-native';

// Fetch user data
const fetchData = async (type) => {
  try {
    const data = await getUserData(type, authToken);
    console.log('User data:', data);
    // Process and display the data
  } catch (error) {
    console.error('Error:', error);
  }
};

// Example: Fetch module history
fetchData('module_history');`}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dataTypeButton: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  buttonLabel: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  dataContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedCard: {
    backgroundColor: "#f0f9ff",
    borderWidth: 1,
    borderColor: "#4ade80",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginRight: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4ade80",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    minWidth: 45,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statText: {
    fontSize: 14,
    color: "#666",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 10,
  },
  achievementProgress: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f59e0b",
    marginBottom: 10,
  },
  rewardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  rewardType: {
    fontSize: 14,
    color: "#666",
  },
  rewardCost: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  ctaButton: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  primaryCta: {
    backgroundColor: "#007AFF",
  },
  successCta: {
    backgroundColor: "#4ade80",
  },
  ctaText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  primaryCtaText: {
    color: "#fff",
  },
  successCtaText: {
    color: "#fff",
  },
  noData: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
  },
  codeExample: {
    marginTop: 20,
    marginBottom: 40,
  },
  codeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  codeBlock: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 8,
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#fff",
    lineHeight: 18,
  },
});

export default UserDataExample;
