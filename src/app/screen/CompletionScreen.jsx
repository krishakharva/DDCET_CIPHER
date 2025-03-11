import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getDatabase, ref, get } from "firebase/database";

const motivationalQuotes = [
  "Success is the sum of small efforts, repeated daily.",
  "Believe in yourself and all that you are.",
  "Hard work beats talent when talent doesn’t work hard.",
  "Every expert was once a beginner.",
  "Push yourself, because no one else is going to do it for you."
];

const CompletionScreen = () => {
  const { subject, unit } = useLocalSearchParams();
  const [quote, setQuote] = useState("");
  const [nextUnit, setNextUnit] = useState(null);

  useEffect(() => {
    // Select a random motivational quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
  }, []);

  useEffect(() => {
    const fetchNextUnit = async () => {
        const db = getDatabase();
        const unitsRef = ref(db, `${subject}/unit`); // Correct Firebase path
        const snapshot = await get(unitsRef);
      
        if (snapshot.exists()) {
          const unitKeys = Object.keys(snapshot.val()); // Fetch all unit names
          const currentIndex = unitKeys.indexOf(unit);
      
          if (currentIndex !== -1 && currentIndex < unitKeys.length - 1) {
            setNextUnit(unitKeys[currentIndex + 1]); // Set the next unit
          } else {
            setNextUnit(null); // No more units available
          }
        }
      };
      

    fetchNextUnit();
  }, [subject, unit]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Congratulations! 🎉</Text>
      <Text style={styles.subtitle}>You have successfully completed all the practice MCQs!</Text>
      <Text style={styles.quote}>"{quote}"</Text>

      {nextUnit ? (
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={() => router.replace({ pathname: "screen/McqScreen", params: { subject, unit: nextUnit } })}
        >
          <Text style={styles.buttonText}>⏭️ Continue Next Chapter</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.noMoreChapters}>No more chapters available.</Text>
      )}

        <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace({ pathname: "screen/McqScreen", params: { subject, unit } })}
        >
          <Text style={styles.buttonText}>🔄 Retry Practice</Text>
        </TouchableOpacity>


      <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => router.replace("/screen/SubjectsScreen")}>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1976D2",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#424242",
    textAlign: "center",
    marginBottom: 20,
  },
  quote: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#616161",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#1976D2",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#388E3C",
  },
  backButton: {
    backgroundColor: "#FF6F61",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  noMoreChapters: {
    fontSize: 16,
    color: "#616161",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default CompletionScreen;
