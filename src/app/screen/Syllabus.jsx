// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Linking,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import BottomNavigationBar from "../screen/BottomNavigationBar";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// const Syllabus = () => {
//   const router = useRouter();
//   const pdfUri = "https://i.ibb.co/vCpp1ZTV/syllabusguj-png.jpg";

//   const openPDF = () => {
//     Linking.openURL(pdfUri);
//   };

//   const handleContinue = () => {
//     router.push("/screen/SubjectsScreen");
//   };

//   return (
//     <LinearGradient colors={["#E3F2FD", "#FFFFFF"]} style={styles.container}>
//       <View style={styles.contentContainer}>
//         <View style={styles.titleContainer}>
//           <MaterialCommunityIcons
//             name="book-open-page-variant"
//             size={28}
//             color="#1565C0"
//           />
//           <Text style={styles.title}>About DDCET</Text>
//         </View>

//         <Text style={styles.content}>
//           DDCET stands for{" "}
//           <Text style={styles.boldText}>
//             Diploma to Degree Common Entrance Test
//           </Text>
//           . It is an entrance exam specifically designed for diploma holders who
//           wish to gain direct admission into the second year of a Bachelor of
//           Engineering (B.E.) program.
//         </Text>
//         <Text style={styles.content}>
//           This exam allows students who have completed a diploma in engineering
//           to transition into a degree-level education, bypassing the first year
//           of the engineering curriculum.
//         </Text>

//         <TouchableOpacity style={styles.button} onPress={openPDF}>
//           <LinearGradient
//             colors={["#BBDEFB", "#90CAF9"]}
//             style={styles.buttonGradient}
//           >
//             <View style={styles.buttonContent}>
//               <MaterialCommunityIcons
//                 name="file-document-outline"
//                 size={22}
//                 color="#0D47A1"
//               />
//               <Text style={styles.buttonText}>Open Syllabus PDF</Text>
//             </View>
//           </LinearGradient>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.button} onPress={handleContinue}>
//           <LinearGradient
//             colors={["#BBDEFB", "#90CAF9"]}
//             style={styles.buttonGradient}
//           >
//             <View style={styles.buttonContent}>
//               <Text style={styles.buttonText}>Continue</Text>
//               <MaterialIcons
//                 name="arrow-forward-ios"
//                 size={18}
//                 color="#0D47A1"
//               />
//             </View>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>

//       <BottomNavigationBar
//         onProfilePress={() => router.push("/screen/UserProfileScreen")}
//       />
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   contentContainer: {
//     flex: 1,
//     alignItems: "center",
//     padding: 20,
//     paddingTop: 70,
//   },
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#0D47A1",
//     marginLeft: 8,
//   },
//   content: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: "#0D47A1",
//     textAlign: "center",
//     marginBottom: 12,
//     paddingHorizontal: 10,
//   },
//   boldText: {
//     fontWeight: "bold",
//   },
//   button: {
//     borderRadius: 12,
//     overflow: "hidden",
//     width: "80%",
//     marginBottom: 12,
//   },
//   buttonGradient: {
//     paddingVertical: 15,
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 12,
//   },
//   buttonContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#0D47A1",
//   },
// });

// export default Syllabus;


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import BottomNavigationBar from "../screen/BottomNavigationBar";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Syllabus = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const pdfUri = "https://i.ibb.co/vCpp1ZTV/syllabusguj-png.jpg";

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}/darkMode`);

    // Listen for dark mode value changes
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setIsDarkMode(snapshot.val());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openPDF = () => {
    Linking.openURL(pdfUri);
  };

  const handleContinue = () => {
    router.push("/screen/SubjectsScreen");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={isDarkMode ? ["#121212", "#1E1E1E"] : ["#E3F2FD", "#FFFFFF"]}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={28}
            color={isDarkMode ? "#BB86FC" : "#1565C0"}
          />
          <Text style={[styles.title, isDarkMode && styles.darkText]}>
            About DDCET
          </Text>
        </View>

        <Text style={[styles.content, isDarkMode && styles.darkText]}>
          DDCET stands for{" "}
          <Text style={styles.boldText}>
            Diploma to Degree Common Entrance Test
          </Text>
          . It is an entrance exam specifically designed for diploma holders who
          wish to gain direct admission into the second year of a Bachelor of
          Engineering (B.E.) program.
        </Text>

        <Text style={[styles.content, isDarkMode && styles.darkText]}>
          This exam allows students who have completed a diploma in engineering
          to transition into a degree-level education, bypassing the first year
          of the engineering curriculum.
        </Text>

        <TouchableOpacity style={styles.button} onPress={openPDF}>
          <LinearGradient
            colors={isDarkMode ? ["#444", "#666"] : ["#BBDEFB", "#90CAF9"]}
            style={styles.buttonGradient}
          >
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={22}
                color={isDarkMode ? "#EDEDED" : "#0D47A1"}
              />
              <Text
                style={[
                  styles.buttonText,
                  isDarkMode && { color: "#EDEDED" },
                ]}
              >
                Open Syllabus PDF
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <LinearGradient
            colors={isDarkMode ? ["#444", "#666"] : ["#BBDEFB", "#90CAF9"]}
            style={styles.buttonGradient}
          >
            <View style={styles.buttonContent}>
              <Text
                style={[
                  styles.buttonText,
                  isDarkMode && { color: "#EDEDED" },
                ]}
              >
                Continue
              </Text>
              <MaterialIcons
                name="arrow-forward-ios"
                size={18}
                color={isDarkMode ? "#EDEDED" : "#0D47A1"}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <BottomNavigationBar
        onProfilePress={() => router.push("/screen/UserProfileScreen")}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 70,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0D47A1",
    marginLeft: 8,
  },
  darkText: {
    color: "#EDEDED",
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#0D47A1",
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  button: {
    borderRadius: 12,
    overflow: "hidden",
    width: "80%",
    marginBottom: 12,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0D47A1",
  },
});

export default Syllabus;
