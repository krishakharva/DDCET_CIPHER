import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const BottomNavigationBar = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Home Button */}
      <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/screen/Syllabus")}>
        <Ionicons name="home-outline" size={30} color="#ffffff" />
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity style={styles.iconButton} onPress={() => router.push("../screen/UserProfileScreen")}>
        <Ionicons name="person-circle-outline" size={30} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#007BFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: -2 },
    elevation: 5,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconButton: {
    padding: 12,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
    elevation: 3,
  },
});

export default BottomNavigationBar;

