// import React from "react";
// import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";

// const ReviewScreen = () => {
//   const router = useRouter();
//   const { quizData } = useLocalSearchParams();
//   const parsedQuizData = JSON.parse(quizData);

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Review Answers</Text>

//       <FlatList
//   data={parsedQuizData}
//   keyExtractor={(item, index) => index.toString()}
//   renderItem={({ item }) => {
//     const userAnswer = item.userAnswer || ""; // Ensure it's a string
//     const correctAnswer = item[item.answer] || ""; // Ensure it's a string
//     const explanationImage = item.explanation || ""; // Ensure this matches the Firebase field
//  // Explanation image URL
  
//     return (
//       <View style={styles.card}>
//         {/* Question */}
//         {typeof item.question === "string" && item.question.startsWith("https") ? (
//           <Image source={{ uri: item.question }} style={styles.questionImage} />
//         ) : (
//           <Text style={styles.question}>{item.question}</Text>
//         )}
  
//         {/* User Answer */}
//         <Text style={styles.heading}>Your Answer:</Text>
//         {userAnswer && typeof userAnswer === "string" && userAnswer.startsWith("https") ? (
//           <Image source={{ uri: userAnswer }} style={styles.answerImage} />
//         ) : (
//           <Text style={[styles.option, userAnswer === correctAnswer ? styles.correctAnswer : styles.wrongAnswer]}>
//             {userAnswer || "Not answered"}
//           </Text>
//         )}
  
//         {/* Correct Answer */}
//         <Text style={styles.heading}>Correct Answer:</Text>
//         {correctAnswer && typeof correctAnswer === "string" && correctAnswer.startsWith("https") ? (
//           <Image source={{ uri: correctAnswer }} style={styles.answerImage} />
//         ) : (
//           <Text style={[styles.option, styles.correctAnswer]}>
//             {correctAnswer || "Not available"}
//           </Text>
//         )}
  
//         {/* Explanation Image */}
//         {explanationImage && typeof explanationImage === "string" && explanationImage.startsWith("https") && (
//           <>
//             <Text style={styles.heading}>Explanation:</Text>
//             <Image source={{ uri: explanationImage }} style={styles.explanationImage} />
//           </>
//         )}
//       </View>
//     );
//   }}
  
// />

//       <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//         <Text style={styles.backButtonText}>Back</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#E7F2FA",
//     padding: 20,
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: "bold",
//     marginVertical: 15,
//     color: "#3A85F4",
//     textAlign: "center",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     elevation: 3,
//     borderColor:"#3A85F4",
//   },
//   question: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 10,
//     color: "#444",
//   },
//   option: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   correctAnswer: {
//     color: "#27ae60",
//   },
//   wrongAnswer: {
//     color: "#e74c3c",
//   },
//   questionImage: {
//     width: "100%",
//     height: 150,
//     resizeMode: "contain",
//     marginBottom: 10,
//   },
//   answerImage: {
//     width: "100%",
//     height: 150,
//     resizeMode: "contain",
//     marginBottom: 10,
//     borderRadius: 8,
//   },
//   explanationImage: {
//     width: "100%",
//     height: 200,
//     resizeMode: "contain",
//     marginTop: 15,
//     borderRadius: 10,
//   },
//   backButton: {
//     paddingVertical: 12,
//     backgroundColor: "#3A85F4",
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 20,
//     bottom:25,
//   },
//   backButtonText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#fff",
//   },
// });

// export default ReviewScreen;

import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDatabase, ref, get } from "firebase/database";

const ReviewScreen = () => {
  const router = useRouter();
  const { quizData, userId } = useLocalSearchParams();
  const parsedQuizData = JSON.parse(quizData);

  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ User ID is undefined! Using default language.");
      setLoading(false);
      return;
    }

    const db = getDatabase();
    const userLanguageRef = ref(db, `users/${userId}/selectedLanguage`);

    get(userLanguageRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setSelectedLanguage(snapshot.val());
          console.log("✅ Language Fetched:", snapshot.val());
        } else {
          console.warn("⚠️ Language not found! Defaulting to English.");
        }
      })
      .catch((error) => console.error("❌ Error fetching language:", error))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3A85F4" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={parsedQuizData}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={<Text style={styles.header}>Review Answers</Text>}
      renderItem={({ item }) => {
        const userAnswer = String(item.userAnswer || "Not answered");
        

        // ✅ Select text based on language
        const questionText = selectedLanguage === "Gujarati" ? item.question_gu || item.question : item.question;
        const correctAnswer = selectedLanguage === "Gujarati" ? item.correctAnswer_gu || item[item.answer] : item[item.answer];
        const explanationText = selectedLanguage === "Gujarati" ? item.explanation_gu || item.explanation : item.explanation;

        return (
          <View style={styles.card}>
            {/* ✅ Display Question (Text or Image) */}
            {questionText?.startsWith("https") ? (
              <Image source={{ uri: questionText }} style={styles.questionImage} />
            ) : (
              <Text style={styles.question}>{questionText}</Text>
            )}

            <Text style={styles.heading}>Your Answer:</Text>
            {userAnswer.startsWith("https") ? (
              <Image source={{ uri: userAnswer }} style={styles.answerImage} />
            ) : (
              <Text style={[styles.option, userAnswer === correctAnswer ? styles.correctAnswer : styles.wrongAnswer]}>
                {userAnswer}
              </Text>
            )}

<Text style={styles.heading}>Correct Answer:</Text>
{correctAnswer && typeof correctAnswer === "string" ? (
  correctAnswer.startsWith("https") ? (
    <Image source={{ uri: correctAnswer }} style={styles.answerImage} />
  ) : (
    <Text style={[styles.option, styles.correctAnswer]}>{correctAnswer}</Text>
  )
) : (
  <Text style={styles.noImageText}>Correct answer not available</Text>
)}


            {/* ✅ Show Explanation (Text or Image) */}
            {explanationText ? (
              explanationText.startsWith("https") ? (
                <>
                  <Text style={styles.heading}>Explanation:</Text>
                  <Image source={{ uri: explanationText }} style={styles.explanationImage} />
                </>
              ) : (
                <Text style={styles.explanationText}>{explanationText}</Text>
              )
            ) : (
              <Text style={styles.noImageText}>No explanation available.</Text>
            )}
          </View>
        );
      }}
      ListFooterComponent={
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      }
    />
  );
};

// Styles
const styles = StyleSheet.create({
  header: { fontSize: 26, fontWeight: "bold", marginVertical: 15, color: "#3A85F4", textAlign: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#3A85F4" },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 15, marginBottom: 15, elevation: 3, borderColor: "#3A85F4" },
  question: { fontSize: 18, fontWeight: "600", marginBottom: 10, color: "#444" },
  explanationText: { fontSize: 16, fontStyle: "italic", color: "#555", marginTop: 10 },
  option: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  correctAnswer: { color: "#27ae60" },
  wrongAnswer: { color: "#e74c3c" },
  questionImage: { width: "100%", height: 150, resizeMode: "contain", marginBottom: 10 },
  answerImage: { width: "100%", height: 150, resizeMode: "contain", marginBottom: 10, borderRadius: 8 },
  explanationImage: { width: "100%", height: 200, resizeMode: "contain", marginTop: 15, borderRadius: 10 },
  noImageText: { fontSize: 14, fontStyle: "italic", color: "#999", marginTop: 10 },
  backButton: { paddingVertical: 12, backgroundColor: "#3A85F4", borderRadius: 8, alignItems: "center", marginTop: 20 },
  backButtonText: { fontSize: 16, fontWeight: "bold", color: "#fff", textAlign: "center" },
});

export default ReviewScreen;
