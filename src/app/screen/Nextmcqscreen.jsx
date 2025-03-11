import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDatabase, ref, onValue } from "firebase/database";

const motivationalQuotes = [
  "Success is the sum of small efforts, repeated daily.",
  "Believe in yourself and all that you are.",
  "Hard work beats talent when talent doesn’t work hard.",
  "Every expert was once a beginner.",
  "Push yourself, because no one else is going to do it for you.",
  "Dreams don't work unless you do."
];



const Nextmcqscreen = () => {
  const router = useRouter();

  const [nextChapter, setNextChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState("");
  const [completedAll, setCompletedAll] = useState(false);
  const {
    subject = "Mathematics",
    currentChapter = "Trigonometry",
    correctCount = 0,
    incorrectCount = 0,
    totalMCQS = 30,
  } = useLocalSearchParams();

  useEffect(() => {
  const db = getDatabase();
  const unitsRef = ref(db, `${subject}/units`);

  onValue(unitsRef, (snapshot) => {
    if (snapshot.exists()) {
      const chapters = Object.keys(snapshot.val())
        .map(ch => ({ name: ch, number: parseInt(ch.match(/\d+/) || 0) })) // Extract numeric part
        .sort((a, b) => a.number - b.number) // Sort numerically
        .map(ch => ch.name); // Get back only names

      const currentIndex = chapters.indexOf(currentChapter);

      if (currentIndex !== -1 && currentIndex < chapters.length - 1) {
        setNextChapter(chapters[currentIndex + 1]);
        setCompletedAll(false);
      } else if (currentIndex === chapters.length - 1) {
        setCompletedAll(true);
      }
    }
    setLoading(false);
  });
}, [subject, currentChapter]);


  useEffect(() => {
    // Select a random motivational quote
    const randomQuote =
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
  }, []);

  useEffect(() => {
    if (completedAll) {
      const timeout = setTimeout(() => {
        router.replace("../screen/SubjectsScreen");
      }, 3000); // Auto return after 3 seconds
      return () => clearTimeout(timeout);
    }
  }, [completedAll]);

  if (loading) return <ActivityIndicator size="large" color="#3A85F4" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Congratulations! 🎉</Text>
      <Text style={styles.subtitle}>
        You have successfully completed all the practice MCQs!
      </Text>
      <Text style={styles.quote}>"{quote}"</Text>

    

      <TouchableOpacity
        style={styles.retryButton}
        onPress={() =>
          router.push({
            pathname: "../screen/McqScreen",
            params: { subject, chapter: currentChapter },
          })
        }
      >
        <Text style={styles.buttonText}>Retry {currentChapter} ➜</Text>
      </TouchableOpacity>

      {completedAll ? (
        <>
          <Text style={styles.completedText}>
            🎉 You have completed all chapters! 🎉
          </Text>
          <Text style={styles.redirectText}>
            Returning to subjects screen...
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.nextUpText}>Next up: {nextChapter}</Text>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() =>
              router.push({
                pathname: "../screen/McqScreen",
                params: { subject, chapter: nextChapter },
              })
            }
          >
            <Text style={styles.buttonText}>Start {nextChapter} MCQs ➜</Text>
          </TouchableOpacity>
        </>
      )}


      <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => router.replace("screen/SubjectsScreen")}>
              <Text style={styles.buttonText}>🏠 Back to Subjects</Text>
            </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 20,
  },
 
  retryButton: {
    backgroundColor: "#3A85F4",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
  },
  nextUpText: {
    fontSize: 16,
    marginVertical: 10,
  },
  nextButton: {
    backgroundColor: "#3A85F4",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  completedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
    marginTop: 20,
  },
  redirectText: {
    fontSize: 16,
    color: "#6c757d",
    marginTop: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 18,
    color: "#424242",
    textAlign: "center",
    marginBottom: 10,
  },
  quote: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#616161",
    textAlign: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3A85F4",
    textAlign: "center",
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "#3A85F4",
    top:50,
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },

});

export default Nextmcqscreen;
