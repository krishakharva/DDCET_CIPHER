import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SettingsProvider } from "./SettingsContext"; 
import { LanguageProvider } from "../utils/languagePreference"; // Ensure correct path

import UserProfileScreen from "./UserProfileScreen";
import SettingsScreen from "./SettingsScreen"; 

const Stack = createStackNavigator();

const App = () => {
  const [language,setLanguage]=useState("en");
  return (
   
    <LanguageContext.Provider value={{ language, setLanguage }}> {/* Ensure LanguageProvider wraps everything */}
      <SettingsProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SettingsProvider>
      </LanguageContext.Provider>
    
  );
};

export default App;
