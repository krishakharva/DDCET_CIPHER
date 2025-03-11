import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import BottomNavigationBar from "../screen/BottomNavigationBar";
import { BackHandler, ToastAndroid } from "react-native";

const SubjectsScreen = () => {
  const [userName, setUserName] = useState('User');
  const [backPressed, setBackPressed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserName(userData.name || 'User');
          setDarkMode(userData.darkMode || false);
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (backPressed) {
        BackHandler.exitApp();
        return true;
      }
      setBackPressed(true);
      ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
      setTimeout(() => setBackPressed(false), 2000);
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [backPressed]);

  const subjects = [
    { id: '1', name: 'Physics', icon: 'atom' },
    { id: '2', name: 'Chemistry', icon: 'flask' },
    { id: '3', name: 'Mathematics', icon: 'calculator' },
    { id: '4', name: 'Soft Skills', icon: 'book' },
  ];

  const handleSubjectSelect = (subjectName) => {
    let formattedSubject = subjectName === "Soft Skills" ? "SoftSkills" : subjectName;
    router.push({ pathname: '../screen/ChaptersScreen', params: { subject: formattedSubject } });
  };

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <View style={[styles.header, darkMode && styles.headerDark]}>
        <Text style={[styles.greeting, darkMode && styles.textDark]}>Hey, {userName} 👋</Text>
        <Text style={[styles.subtitle, darkMode && styles.textDark]}>Ready to practice for DDCET today?</Text>
      </View>
      <View style={[styles.progressCard, darkMode && styles.cardDark]}>
        <View style={styles.progressHeader}>
          <FontAwesome5 name="chart-line" size={24} color={darkMode ? "#FFA500" : "#3A85F4"} />
          <Text style={[styles.progressTitle, darkMode && styles.textDark]}>Track Your Progress</Text>
        </View>
        <TouchableOpacity style={[styles.progressButton, darkMode && styles.progressButtonDark]} onPress={() => router.push('../screen/ProgressScreen')}>
          <Text style={styles.progressButtonText}>View Progress</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.subjectTitle, darkMode && styles.textDark]}>Select a Subject</Text>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.subjectCard, darkMode && styles.cardDark]} onPress={() => handleSubjectSelect(item.name)}>
            <FontAwesome5 name={item.icon} size={24} color={darkMode ? "#FFA500" : "#3A85F4"} />
            <Text style={[styles.subjectText, darkMode && styles.textDark]}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <BottomNavigationBar onProfilePress={() => router.push("../screen/UserProfileScreen")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E7F2FA', paddingHorizontal: 20, paddingTop: 40 },
  containerDark: { backgroundColor: '#121212' },
  header: { backgroundColor: '#3A85F4', padding: 20, borderRadius: 15, marginBottom: 20, alignItems: 'center' },
  headerDark: { backgroundColor: '#1E1E1E' },
  greeting: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  subtitle: { fontSize: 14, color: 'white', marginTop: 5 },
  textDark: { color: 'white' },
  progressCard: { backgroundColor: 'white', borderRadius: 15, padding: 20, shadowOpacity: 0.1, elevation: 5, marginBottom: 20 },
  cardDark: { backgroundColor: '#1E1E1E' },
  progressHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  progressTitle: { fontSize: 18, fontWeight: 'bold', color: '#3A85F4', marginLeft: 10 },
  progressButton: { backgroundColor: '#3A85F4', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  progressButtonDark: { backgroundColor: '#FFA500' },
  progressButtonText: { fontSize: 16, color: 'white', fontWeight: 'bold' },
  subjectTitle: { fontSize: 18, fontWeight: 'bold', color: '#3A85F4', marginBottom: 10 },
  subjectCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 15, shadowOpacity: 0.1, elevation: 5 },
  subjectText: { fontSize: 18, fontWeight: 'bold', color: '#3A85F4', marginLeft: 10 },
});

export default SubjectsScreen;
