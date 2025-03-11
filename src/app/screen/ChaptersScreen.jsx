// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   SafeAreaView,
// } from "react-native";
// import { getDatabase, ref, get } from "firebase/database";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { FontAwesome5 } from "@expo/vector-icons";

// const ChaptersScreen = () => {
//   const [chapters, setChapters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { subject } = useLocalSearchParams();
//   const router = useRouter();

//   useEffect(() => {
//     const fetchChapters = async () => {
//       if (!subject) {
//         setLoading(false);
//         return;
//       }
//       try {
//         const database = getDatabase();
//         const chaptersRef = ref(database, `units/${subject}`);
//         const snapshotChapters = await get(chaptersRef);

//         if (snapshotChapters.exists()) {
//           const chaptersData = snapshotChapters.val();
//           const formattedChapters = Object.entries(chaptersData).map(
//             ([key, name], index) => ({
//               key,
//               name,
//               index: index + 1,
//             })
//           );
//           setChapters(formattedChapters);
//         }
//       } catch (error) {
//         console.error("Error fetching chapters:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchChapters();
//   }, [subject]);

//   const handleChapterPress = (item) => {
//     router.push(
//       `/screen/KeyConceptScreen?subject=${subject}&chapter=${item.name}`
//     );
//   };

//   // 🔥 New Function: Handle "Test Your Knowledge" Button Press
//   const handleTestYourKnowledge = () => {
//     router.push(`screen/QuizScreen?subject=${subject}&mixed=true`);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>{subject} - Chapters</Text>
//       </View>
//       {loading ? (
//         <ActivityIndicator size="large" color="#3A85F4" style={styles.loader} />
//       ) : (
//         <>
//           <FlatList
//             data={chapters}
//             keyExtractor={(item) => item.key}
//             renderItem={({ item }) => (
//               <TouchableOpacity style={styles.chapterCard} onPress={() => handleChapterPress(item)}>
//                 <FontAwesome5 name="book" size={24} color="#3A85F4" />
//                 <Text style={styles.chapterText}>{item.index}. {item.name}</Text>
//               </TouchableOpacity>
//             )}
//             contentContainerStyle={{ paddingBottom: 100 }} // Extra space for the button
//           />

//           {/* 🚀 "Test Your Knowledge" Button (Only Shows if Chapters Exist) */}
//           {chapters.length > 0 && (
//             <TouchableOpacity style={styles.testButton} onPress={handleTestYourKnowledge}>
//               <Text style={styles.testButtonText}>Test Your Knowledge</Text>
//             </TouchableOpacity>
//           )}
//         </>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#E7F2FA",
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   header: {
//     backgroundColor: "#3A85F4",
//     padding: 20,
//     borderRadius: 15,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "white",
//   },
//   loader: {
//     marginTop: 20,
//   },
//   chapterCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "white",
//     padding: 15,
//     borderRadius: 15,
//     marginBottom: 15,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   chapterText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#3A85F4",
//     marginLeft: 10,
//   },
//   testButton: {
//     backgroundColor: "#3A85F4",
//     padding: 15,
//     borderRadius: 15,
//     alignItems: "center",
//     position: "absolute",
//     bottom: 20,
//     left: 20,
//     right: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   testButtonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//   },
// });

// export default ChaptersScreen;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { getDatabase, ref, get } from "firebase/database";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

const ChaptersScreen = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { subject } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!subject) {
        setLoading(false);
        return;
      }
      try {
        const database = getDatabase();

        // Fetch chapters
        const chaptersRef = ref(database, `units/${subject}`);
        const snapshotChapters = await get(chaptersRef);
        if (snapshotChapters.exists()) {
          const chaptersData = snapshotChapters.val();
          const formattedChapters = Object.entries(chaptersData).map(
            ([key, name], index) => ({
              key,
              name,
              index: index + 1,
            })
          );
          setChapters(formattedChapters);
        }

        // Fetch dark mode setting
        const darkModeRef = ref(database, "settings/darkMode");
        const snapshotDarkMode = await get(darkModeRef);
        if (snapshotDarkMode.exists()) {
          setDarkMode(snapshotDarkMode.val()); // true or false
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subject]);

  const handleChapterPress = (item) => {
    router.push(
      `/screen/KeyConceptScreen?subject=${subject}&chapter=${item.name}`
    );
  };

  const handleTestYourKnowledge = () => {
    router.push(`screen/QuizScreen?subject=${subject}&mixed=true`);
  };

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]}>
      <View style={[styles.header, darkMode && styles.darkHeader]}>
        <Text style={[styles.title, darkMode && styles.darkTitle]}>
          {subject} - Chapters
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={darkMode ? "#FFFFFF" : "#3A85F4"}
          style={styles.loader}
        />
      ) : (
        <>
          <FlatList
            data={chapters}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.chapterCard, darkMode && styles.darkChapterCard]}
                onPress={() => handleChapterPress(item)}
              >
                <FontAwesome5
                  name="book"
                  size={24}
                  color={darkMode ? "#FFFFFF" : "#3A85F4"}
                />
                <Text
                  style={[styles.chapterText, darkMode && styles.darkChapterText]}
                >
                  {item.index}. {item.name}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
          />

          {chapters.length > 0 && (
            <TouchableOpacity
              style={[styles.testButton, darkMode && styles.darkTestButton]}
              onPress={handleTestYourKnowledge}
            >
              <Text
                style={[styles.testButtonText, darkMode && styles.darkTestButtonText]}
              >
                Test Your Knowledge
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7F2FA",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  header: {
    backgroundColor: "#3A85F4",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  darkHeader: {
    backgroundColor: "#1E1E1E",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  darkTitle: {
    color: "#CCCCCC",
  },
  loader: {
    marginTop: 20,
  },
  chapterCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  darkChapterCard: {
    backgroundColor: "#1E1E1E",
    shadowColor: "#FFFFFF",
  },
  chapterText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3A85F4",
    marginLeft: 10,
  },
  darkChapterText: {
    color: "#FFFFFF",
  },
  testButton: {
    backgroundColor: "#3A85F4",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  darkTestButton: {
    backgroundColor: "#1E1E1E",
  },
  testButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  darkTestButtonText: {
    color: "#CCCCCC",
  },
});

export default ChaptersScreen;

