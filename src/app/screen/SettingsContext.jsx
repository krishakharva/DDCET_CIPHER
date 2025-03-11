// import React, { createContext, useContext, useState, useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const SettingsContext = createContext();

// export const SettingsProvider = ({ children }) => {
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [isVibrationOn, setIsVibrationOn] = useState(true);

//     // Load settings from storage on app start
//     useEffect(() => {
//         const loadSettings = async () => {
//             const storedDarkMode = await AsyncStorage.getItem("isDarkMode");
//             const storedVibration = await AsyncStorage.getItem("isVibrationOn");

//             if (storedDarkMode !== null) setIsDarkMode(JSON.parse(storedDarkMode));
//             if (storedVibration !== null) setIsVibrationOn(JSON.parse(storedVibration));
//         };
//         loadSettings();
//     }, []);

//     // Toggle and save settings
//     const toggleDarkMode = async () => {
//         const newMode = !isDarkMode;
//         setIsDarkMode(newMode);
//         await AsyncStorage.setItem("isDarkMode", JSON.stringify(newMode));
//     };

//     const toggleVibration = async () => {
//         const newVibration = !isVibrationOn;
//         setIsVibrationOn(newVibration);
//         await AsyncStorage.setItem("isVibrationOn", JSON.stringify(newVibration));
//     };

//     return (
//         <SettingsContext.Provider value={{ isDarkMode, toggleDarkMode, isVibrationOn, toggleVibration }}>
//             {children}
//         </SettingsContext.Provider>
//     );
// };


// export const useSettings = () => useContext(SettingsContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const loadLanguage = async () => {
            const storedLang = await AsyncStorage.getItem('preferredLanguage');
            setLanguage(storedLang || 'en');
        };
        loadLanguage();
    }, []);

    const updateLanguage = async (newLang) => {
        setLanguage(newLang);
        await AsyncStorage.setItem('preferredLanguage', newLang);
    };

    return (
        <SettingsContext.Provider value={{ language, setLanguage: updateLanguage }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);

