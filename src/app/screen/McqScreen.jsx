import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Animated,
  Alert,
  Vibration,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const McqScreen = () => {
  const { subject = "Mathematics", chapter = "Trigonometry" } =
    useLocalSearchParams();
  const [userId, setUserId] = useState(null);

  const [mcqs, setMcqs] = useState([]);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const router = useRouter();
  const [correctCount, setCorrectCount] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(null); // Start as null
  const fadeAnim = useState(new Animated.Value(0))[0];
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.warn("User is not logged in!");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return; // Wait until userId is available

    const db = getDatabase();
    const langRef = ref(db, `users/${userId}/language`);

    const unsubscribeLang = onValue(langRef, (snapshot) => {
      if (snapshot.exists()) {
        setLanguage(snapshot.val());
      } else {
        setLanguage("en");
      }
    });

    return () => unsubscribeLang();
  }, [userId]);
  // ✅ Fetch MCQs when language is available
  useEffect(() => {
    if (!userId || !language) return; // Ensure we only fetch when language is set

    setLoading(true);
    const db = getDatabase();
    const mcqRef = ref(db, `${subject}/units/${chapter}/mcqs`);

    const unsubscribeMcqs = onValue(mcqRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val()).map((item, idx) => ({
          id: idx,
          ...item,
        }));
        setMcqs(data);
        console.log("MCQs updated for", subject, chapter, "in", language);
      } else {
        console.warn("No MCQs found for", subject, chapter);
        setMcqs([]); // Prevent undefined errors
      }
      setLoading(false);
    });

    return () => unsubscribeMcqs(); // Cleanup
  }, [userId, subject, chapter, language]); // ✅ Runs whenever language updates
  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Please log in to continue.</Text>
      </View>
    );
  }
  if (!language || loading) {
    return <ActivityIndicator size="large" color="#3498db" />;
  }

  if (mcqs.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>No MCQs available for this chapter.</Text>
      </View>
    );
  }

  const currentQuestion = mcqs[currentIndex];
  {
    showCorrectAnswer && (
      <Text style={styles.correctAnswerText}>
        ✅ Correct Answer: {currentQuestion[currentQuestion.answer]}
      </Text>
    );
  }
  const isValidUrl = (url) =>
    typeof url === "string" &&
    (url.startsWith("https://") || url.startsWith("http://")) &&
    (url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg"));

  const getLocalizedText = (key) =>
    language === "Gujarati"
      ? currentQuestion?.[`${key}_gu`] || currentQuestion?.[key]
      : currentQuestion?.[key];
  ``;
  const handleAnswer = (option) => {
    if (isAnswered) return;
    Vibration.vibrate(100);
    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === currentQuestion.answer) {
      setCorrectCount((prev) => prev + 1);
      setFeedbackMessage("🎉 Great! Correct Answer.");
    } else {
      setIncorrectCount((prev) => prev + 1);
      setFeedbackMessage("❌ Wrong Answer! Keep Practicing.");
    }
    fadeInAndOut();
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);

    const moveToNextQuestion = () => {
      if (currentIndex < mcqs.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setFeedbackMessage("");
      } else {
        router.push('../screen/Nextmcqscreen'); 
      }
    }; 
  }
            
  
  const handleNavigation = (step) => {
    if (currentIndex + step < mcqs.length) {
      if (selectedAnswer === null) {
        setIncorrectCount((prev) => prev + 1);
      }
      setCurrentIndex((prev) => prev + step);
      setSelectedAnswer(null);
      setIsCorrect(false);
      setFeedbackMessage("");
      setShowCorrectAnswer(false);
    }
  };
  const fadeInAndOut = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 1500);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {chapter} - MCQ ({language})
      </Text>
      <View style={styles.card}>
        {currentQuestion?.image && isValidUrl(currentQuestion.image) ? (
          <Image
            source={{ uri: currentQuestion.image }}
            style={styles.questionImage}
          />
        ) : (
          currentQuestion?.question &&
          (isValidUrl(currentQuestion.question) ? (
            <Image
              source={{ uri: getLocalizedText("question") }}
              style={styles.questionImage}
            />
          ) : (
            <Text style={styles.question}>{getLocalizedText("question")}</Text>
          ))
        )}

        {["optionA", "optionB", "optionC", "optionD"].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedAnswer === option &&
                (option === currentQuestion.answer
                  ? styles.correct
                  : styles.wrong),
            ]}
            onPress={() => handleAnswer(option)}
          >
            {isValidUrl(currentQuestion[option]) ? (
              <Image
                source={{ uri: getLocalizedText(option) }}
                style={styles.optionImage}
              />
            ) : (
              <Text style={styles.optionText}>{getLocalizedText(option)}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Animated.Text style={[styles.feedbackText, { opacity: fadeAnim }]}>
        {selectedAnswer
          ? selectedAnswer === currentQuestion.answer
            ? "🎉 Correct!"
            : "❌ Wrong!"
          : ""}
      </Animated.Text>
      {/* {showCorrectAnswer && (
        <Text style={styles.correctAnswerText}>
          ✅ Correct Answer: {currentQuestion[currentQuestion.answer]}
        </Text> */}
      {showCorrectAnswer && (
        <View style={styles.answerContainer}>
          <Text style={styles.correctAnswerText}>✅ Correct Answer:</Text>
          {isValidUrl(currentQuestion[currentQuestion.answer]) ? (
            <Image
              source={{ uri: getLocalizedText(currentQuestion.answer) }}
              style={styles.answerImage}
            />
          ) : (
            <Text style={styles.correctAnswerText}>
              {getLocalizedText(currentQuestion.answer)}
            </Text>
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.showAnswerButton}
        onPress={() => setShowCorrectAnswer(true)}
      >
        <Text style={styles.buttonText}>Show Correct Answer</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        {currentIndex > 0 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleNavigation(-1)}
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        )}

        {currentIndex < mcqs.length - 1 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleNavigation(1)}
          >
            <Text style={styles.buttonText}>Next ➜</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3A85F4",
    marginBottom: 20,
  },

  card: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 12,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#3A85F4",
    alignItems: "center",
    width: 320,
    height: 80,
  },
  correct: { backgroundColor: "#66BB6A" },
  wrong: { backgroundColor: "#EF5350" },
  feedbackText: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#3A85F4",
  },
  showAnswerButton: {
    padding: 12,
    margin: 5,
    backgroundColor: "#3498db",
    borderRadius: 8,
    alignItems: "center",
    width: "60%",
    bottom: 50,
  },
  navButton: {
    padding: 10,
    margin: 5,
    backgroundColor: "#3A85F4",
    borderRadius: 8,
    width: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  questionImage: {
    width: 300,
    height: 80,
    resizeMode: "contain",
    marginBottom: 10,
    borderRadius: 10,
  },
  optionImage: {
    width: 120,
    height: 50,
    resizeMode: "contain",
    marginBottom: 5,
  },
  correctAnswerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#27ae60",
    marginTop: 10,
    bottom: 60,
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#FFD700",
    top: 170,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default McqScreen;

