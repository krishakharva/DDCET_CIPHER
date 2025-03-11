import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ImageViewing from "react-native-image-viewing";

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const QuizScreen = () => {
  const { subject = "SoftSkills" } = useLocalSearchParams();
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [language, setLanguage] = useState("en"); // Default language

  useEffect(() => {
    const db = getDatabase();
    if (user) {
      const langRef = ref(db, `users/${user.uid}/language`);
      onValue(langRef, (snapshot) => {
        if (snapshot.exists()) {
          setLanguage(snapshot.val());
        }
      });
    }
  }, [user]);

  useEffect(() => {
    const db = getDatabase();
    const mcqRef = ref(db, `/allmcqs/${subject}`);

    const unsubscribe = onValue(mcqRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        setQuestions(shuffleArray(data));
      } else {
        setQuestions([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [subject, language]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.noDataText}>No quiz data available.</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];

  const getLocalizedText = (key) =>
    language === "Gujarati"
      ? currentQuestion?.[`${key}_gu`] || currentQuestion?.[key]
      : currentQuestion?.[key];

  const handleAnswer = (option) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].userAnswer = option;

    setUserAnswers((prev) => ({ ...prev, [currentIndex]: option }));

    if (currentIndex === questions.length - 1) {
      let tempScore = 0;
      updatedQuestions.forEach((q) => {
        if (q.userAnswer === q[q.answer]) {
          tempScore += 1;
        }
      });

      setScore(tempScore);
      setQuizCompleted(true);

      if (user) {
        saveProgress(user.uid, subject, tempScore, questions.length);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const saveProgress = async (userId, subject, newScore, totalQuestions) => {
    try {
      const db = getDatabase();
      const progressRef = ref(db, `users/${userId}/progress/${subject}`);
      update(progressRef, {
        score: newScore,
        total: totalQuestions,
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  if (!quizCompleted) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{getLocalizedText("subject")} Quiz</Text>
        <View style={styles.card}>
          {typeof currentQuestion.question === "string" &&
          currentQuestion.question.startsWith("https") ? (
            <Image
              source={{ uri: getLocalizedText("question") }}
              style={styles.questionImage}
            />
          ) : (
            <Text style={styles.question}>{getLocalizedText("question")}</Text>
          )}

          <FlatList
            data={["optionA", "optionB", "optionC", "optionD"]}
            renderItem={({ item }) => {
              const optionText = getLocalizedText(item) || "";
              const isImage =
                typeof optionText === "string" &&
                optionText.startsWith("https");

              return (
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleAnswer(optionText)}
                >
                  {isImage ? (
                    <Image
                      source={{ uri: optionText }}
                      style={styles.optionImage}
                    />
                  ) : (
                    <Text style={styles.optionText}>
                      {optionText || "No Option"}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.optionsContainer}
          />

          <Text style={styles.questionCounter}>
            {getLocalizedText("Question")} {currentIndex + 1} of{" "}
            {questions.length}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{getLocalizedText("Quiz Result")}</Text>
      <View style={styles.resultCard}>
        <Text style={styles.resultScore}>
          {score} / {questions.length}
        </Text>
        <Text style={styles.resultLabel}>Total Correct Answers</Text>

        <Button
          title="Review Answers"
          onPress={() => {
            const quizDataWithUserAnswers = questions.map((q, index) => ({
              ...q,
              userAnswer: q.userAnswer || userAnswers[index] || null,
            }));
            router.push({
              pathname: "../screen/ReviewScreen",
              params: { quizData: JSON.stringify(quizDataWithUserAnswers) },
            });
          }}
        />
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  explanationImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginTop: 15,
    borderRadius: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 18,
    color: "#333",
  },
  container: {
    flex: 1,
    backgroundColor: "#E7F2FA",
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#3A85F4",
    textAlign: "center",
  },
  resultCard: {
    alignItems: "center",
    marginBottom: 20,
  },
  resultScore: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#27ae60",
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  questionImage: {
    width: "100%",
    height: 50,
    resizeMode: "contain",
    marginBottom: 15,
  },
  optionImage: {
    width: "100%",
    height: 50,
    resizeMode: "contain",
  },
  reviewImage: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    marginBottom: 10,
  },
 
  card: {
    width: "100%",
    backgroundColor: "#E7F2FA",
    borderRadius: 12,
    padding: 20,
    elevation: 4,
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#444",
    textAlign: "center",
  },
  optionsContainer: {
    paddingVertical: 10,
  
  },
  optionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#FFFF",
    alignItems: "center",
    marginVertical: 6,
    borderColor: "#3A85F4", 
    borderWidth:1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  questionCounter: {
    marginTop: 10,
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
  resultCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 30,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  resultScore: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#27ae60",
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#3A85F4",
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 30,
  },
  reviewButton: {
    backgroundColor: "#3A85F4", // Soft blue color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    width: "80%", // Adjust button width
    alignSelf: "center", // Center button
  },
  reviewButtonText: {
    color: "#fff", // White text
    fontSize: 18,
    fontWeight: "bold",
  },
  
  
});

export default QuizScreen;