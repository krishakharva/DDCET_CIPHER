
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNavigationBar from './BottomNavigationBar';

const UserProfileScreen = () => {
  const [userData, setUserData] = useState({ name: '', email: '', darkMode: false, vibration: true, language: 'English' });
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isVibrationOn, setIsVibrationOn] = useState(true);
  const [language, setLanguage] = useState('English');
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');


  const auth = getAuth();
  const db = getDatabase();
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const userId = user.uid;
      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);

      let fetchedData = { name: '', email: user.email, darkMode: false, vibration: true, language: 'English' };

      if (snapshot.exists()) {
        fetchedData = { ...fetchedData, ...snapshot.val() };
      }

      const storedDarkMode = await AsyncStorage.getItem('darkMode');
      const darkModeSetting = storedDarkMode !== null ? JSON.parse(storedDarkMode) : fetchedData.darkMode;

      setUserData(fetchedData);
      setName(fetchedData.name || '');
      setIsDarkMode(darkModeSetting);
      setIsVibrationOn(fetchedData.vibration !== undefined ? fetchedData.vibration : true);
      setLanguage(fetchedData.language || 'English');

      // Store dark mode in AsyncStorage for quick access
      await AsyncStorage.setItem('darkMode', JSON.stringify(darkModeSetting));
    } catch (error) {
      Alert.alert('Error', 'Failed to load user data.');
    }
    setLoading(false);
  };

  const updateProfile = async () => {
    try {
      const userId = user.uid;
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, {
        name,
        darkMode: isDarkMode,
        vibration: isVibrationOn,
        language,
      });

      await AsyncStorage.setItem('darkMode', JSON.stringify(isDarkMode));
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };
  const updateProfileSave = async () => {
    try {
      const userId = user.uid;
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, {
        name,
        darkMode: isDarkMode,
        vibration: isVibrationOn,
        language,
      });

      await AsyncStorage.setItem('darkMode', JSON.stringify(isDarkMode));
      setSettingsModalVisible(false)
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };


  const toggleLanguage = async () => {
    const newLanguage = language === 'English' ? 'Gujarati' : 'English';
    setLanguage(newLanguage);

    if (user) {
      const userId = user.uid;
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, { language: newLanguage });

      await AsyncStorage.setItem('userLanguage', newLanguage);
    }
  };
 
  const handleChangePassword = async () => {
        if (!newPassword) {
          Alert.alert('Error', 'Please enter a new password.');
          return;
        }
    
        try {
          await updatePassword(user, newPassword);
          Alert.alert('Success', 'Password updated successfully!');
          setPasswordModalVisible(false);
        } catch (error) {
          Alert.alert('Error', error.message);
        }
      };

    
      const handleLogout = async () => {
        try {
          // await signOut(auth);
          // await AsyncStorage.removeItem('userLanguage');
          router.replace('/screen/LoginScreen');
        } catch (error) {
          Alert.alert('Error', 'Failed to log out.');
        }
      };
   
  if (loading) {
    return <ActivityIndicator size="large" color="#3A85F4" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.title, isDarkMode && styles.darkTitle]}>User Profile</Text>
        <TouchableOpacity onPress={() => setSettingsModalVisible(true)} style={styles.settingsIcon}>
          <Ionicons name="settings-outline" size={28} color={isDarkMode ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
      </View>

      {/* Profile Icon */}
      <Ionicons name="person-circle-outline" size={100} color={isDarkMode ? '#FFFFFF' : '#3A85F4'} style={styles.profileIcon} />

      <Text style={[styles.label, isDarkMode && styles.darkLabel]}>Name:</Text>
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor={isDarkMode ? '#BBBBBB' : '#000000'}
      />

      <Text style={[styles.label, isDarkMode && styles.darkLabel]}>Email:</Text>
      <TextInput style={[styles.input, styles.disabledInput, isDarkMode && styles.darkInput]} value={userData.email} editable={false} />

      {/* Update Profile Button */}
      <TouchableOpacity style={styles.updateProfileButton} onPress={updateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.passwordButton} onPress={() => setPasswordModalVisible(true)}>
        <Text style={styles.buttonText}>Change Password</Text>
       </TouchableOpacity>

       <TouchableOpacity style={styles.passwordButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
       </TouchableOpacity>


      {/* Settings Modal */}
      <Modal animationType="slide" transparent={true} visible={settingsModalVisible} onRequestClose={() => setSettingsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <Text style={[styles.modalHeading, isDarkMode && styles.darkModalHeading]}>Settings</Text>

            {/* Dark Mode Toggle */}
            <View style={styles.toggleContainer}>
              <Text style={[styles.toggleLabel, isDarkMode && styles.darkToggleLabel]}>Dark Mode</Text>
              <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
            </View>

            <View style={styles.toggleContainer}>
               <Text style={styles.toggleLabel}>Vibration</Text>
               <Switch value={isVibrationOn} onValueChange={setIsVibrationOn} />
             </View>

            {/* Language Selection */}
            <View style={styles.toggleContainer}>
              <Text style={[styles.toggleLabel, isDarkMode && styles.darkToggleLabel]}>Language</Text>
              <TouchableOpacity onPress={toggleLanguage}>
                <Text style={{ fontWeight: 'bold', color: '#3A85F4' }}>{language}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.savechanges}  onPress={updateProfileSave}>
               <Text style={styles.savechangesText}>Save Changes</Text>
            </TouchableOpacity>
            


            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setSettingsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>

          
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={passwordModalVisible} onRequestClose={() => setPasswordModalVisible(false)}>
         <View style={styles.modalContainer}>
           <View style={styles.modalContent}>
             <Text style={styles.modalHeading}>Change Password</Text>
             <TextInput style={styles.input} placeholder="Enter new password" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
             <TouchableOpacity style={styles.updateProfileButton} onPress={handleChangePassword}>
               <Text style={styles.buttonText}>Update Password</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.closeButton2} onPress={() => setPasswordModalVisible(false)}>
               <Text style={styles.closeButtonText}>Close</Text>
             </TouchableOpacity>
           </View>
         </View>
       </Modal>

      {/* Bottom Navigation */}
      <BottomNavigationBar onProfilePress={() => Alert.alert('Already on Profile Screen')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3A85F4',
    padding: 15,
    borderRadius: 10,
  },
  darkHeader: {
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkTitle: {
    color: '#BBBBBB',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  darkLabel: {
    color: '#CCCCCC',
  },
  input: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  darkInput: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
  },
  container: {
                flex: 1,
                backgroundColor: '#E7F2FA',
                paddingHorizontal: 20,
                paddingTop: 20,
              },
              header: {
                backgroundColor: '#3A85F4',
                padding: 20,
                borderRadius: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between', // Moves settings icon to the right
                marginBottom: 20,
              },
              title: {
                fontSize: 22,
                fontWeight: 'bold',
                color: 'white',
              },
              settingsIcon: {
                position: 'absolute',
                right: 20,
                top: '50%',
                transform: [{ translateY: -14 }],
                top:30,
              },
              profileIcon: {
                alignSelf: 'center',
                marginBottom: 20,
              },
              label: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#3A85F4',
                marginBottom: 5,
              },
              input: {
                width: '100%',
                padding: 12,
                borderWidth: 1,
                borderColor: '#3A85F4',
                borderRadius: 15,
                marginBottom: 15,
                backgroundColor: 'white',
              },
              disabledInput: {
                backgroundColor: '#EAEAEA',
                color: '#666',
              },
              updateProfileButton: {
                backgroundColor: '#3A85F4',
                padding: 15,
                borderRadius: 15,
                alignItems: 'center',
                marginBottom: 10,
                marginTop: 40,
              },
              buttonText: {
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
                color:"#000000",
              },
              progressButton: {
                backgroundColor: '#3A85F4',
                padding: 15,
                borderRadius: 15,
                alignItems: 'center',
              },
              modalContainer: {
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              },
              modalContent: {
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 15,
                width: '80%',
                alignItems: 'center',
              },
              modalHeading: {
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 20,
                color:"#3A85F4",
              },
              toggleContainer: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: 20,
              },
              toggleLabel: {
                fontSize: 16,
                fontWeight: 'bold',
              },
              closeButton2: {
                backgroundColor: '#3A85F4',
                padding: 10,
                borderRadius: 10,
                width: '100%',
                alignItems: 'center',
              },
              closeButtonText: {
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
              },
              
              savechangesText: {
                color:"#3A85F4",
                fontSize: 16,
                fontWeight: 'bold',
              },
              savechanges: {
                backgroundColor: '#FFFFFF', 
                padding: 10,
                borderRadius: 10,
                width: '100%',
                alignItems: 'center',
                marginTop: 10,
                bottom:10,
              },
              passwordButton:{
                backgroundColor: '#3A85F4', 
                padding: 15,
                borderRadius: 15,
                width: '100%',
                alignItems: 'center',
                marginTop: 10,
                top:10,
              },
              closeButton: {
                backgroundColor: '#3A85F4',
                padding: 10,
                borderRadius: 10,
                width: '100%',
                alignItems: 'center',
                
              },
});

export default UserProfileScreen;

