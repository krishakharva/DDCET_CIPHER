
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { useSettings } from './SettingsContext';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguageSelector from "../components/LanguageSelector";
import { LanguageContext } from "../utils/languagePreference"; 
import { useRouter } from 'expo-router';

const SettingsScreen = () => {
    const { isDarkMode, toggleDarkMode, isVibrationOn, toggleVibration, t } = useSettings();
    const { language, setLanguage } = useContext(LanguageContext);
    const [selectedLanguage, setSelectedLanguage] = useState(language || 'en');

    const auth = getAuth();
    const db = getDatabase();
    const router = useRouter();
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace("/loginScreen"); // Force user to login if not authenticated
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            fetchUserLanguage();
        } else {
            loadLocalLanguage();
        }
    }, [auth.currentUser]);

    const loadLocalLanguage = async () => {
        const storedLang = await AsyncStorage.getItem('language');
        if (storedLang) {
            setSelectedLanguage(storedLang);
            setLanguage(storedLang);
        }
    };

    const fetchUserLanguage = async () => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;
            const userRef = ref(db, `users/${userId}/language`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                setSelectedLanguage(snapshot.val());
                setLanguage(snapshot.val());
            }
        } catch (error) {
            console.log('Error fetching language:', error);
        }
    };

    const updateLanguage = async (newLanguage) => {
        setSelectedLanguage(newLanguage);
        setLanguage(newLanguage);
        await AsyncStorage.setItem('language', newLanguage);
    
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const userRef = ref(db, `users/${userId}`);
            await update(userRef, { language: newLanguage });
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace("/loginScreen"); // Clears history and moves to login
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{t('settings')}</Text>

            <View style={styles.setting}>
                <Text style={styles.settingText}>{t('darkMode')}</Text>
                <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
            </View>

            <View style={styles.setting}>
                <Text style={styles.settingText}>{t('vibration')}</Text>
                <Switch value={isVibrationOn} onValueChange={toggleVibration} />
            </View>

            <LanguageSelector selectedLanguage={selectedLanguage} onChange={updateLanguage} />

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F8FAFC',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    setting: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    settingText: {
        fontSize: 16,
        color: '#555',
    },
    logoutButton: {
        backgroundColor: '#FF4D4D',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SettingsScreen;
