// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const setLanguagePreference = async (lang) => {
//   await AsyncStorage.setItem('preferredLanguage', lang);
// };

// export const getLanguagePreference = async () => {
//   const lang = await AsyncStorage.getItem('preferredLanguage');
//   return lang || 'en'; // Default to English
// };

import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the context
export const LanguageContext = createContext(null);

// Provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // Default to English

  // Load stored language from AsyncStorage
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem("preferredLanguage");
        if (storedLanguage) {
          setLanguage(storedLanguage);
        }
      } catch (error) {
        console.error("Error loading language:", error);
      }
    };
    loadLanguage();
  }, []);

  // Function to change language and store it
  const changeLanguage = async (lang) => {
    try {
      setLanguage(lang);
      await AsyncStorage.setItem("preferredLanguage", lang);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
