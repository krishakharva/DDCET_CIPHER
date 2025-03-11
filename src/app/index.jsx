import { View, Text,Button } from "react-native";
import { Stack } from "expo-router"; 
import Home from "./Home";
import { SettingsProvider } from './screen/SettingsContext';
import LoginScreen from "./screen/LoginScreen";
import Syllabus from "./screen/Syllabus";
import SubjectsScreen from "./screen/SubjectsScreen";
import ChaptersScreen from "./screen/ChaptersScreen";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
     <SettingsProvider>
         <Home />
       </SettingsProvider>
      
    
    </View>
  );
}


