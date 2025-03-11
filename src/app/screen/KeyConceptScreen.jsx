import React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDatabase, ref, onValue } from "firebase/database";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
} from "react-native-gesture-handler";


import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const { width, height } = Dimensions.get("window");

const KeyConceptScreen = () => {
  const { subject = "Mathematics", chapter = "Trigonometry" } =
    useLocalSearchParams();
  const router = useRouter();
  
  // ✅ Initialize state properly
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [language, setLanguage] = useState("en"); // ✅ Fixed: Initialize language state
  const [zoomImage, setZoomImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const db = getDatabase();

  // ✅ Get authenticated user
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

  // ✅ Get user's preferred language
  useEffect(() => {
    if (!userId) return;

    const langRef = ref(db, `users/${userId}/language`);

    const unsubscribeLang = onValue(langRef, (snapshot) => {
      if (snapshot.exists()) {
        setLanguage(snapshot.val());
      } else {
        setLanguage("en"); // Default to English
      }
    });

    return () => unsubscribeLang();
  }, [userId]);

  // ✅ Fetch images based on language
  useEffect(() => {
    if (!userId || !language) return;

    setLoading(true);

  
    
    
    const chapterRef = ref(db, `${subject}Content/${chapter}`);
    console.log("Fetching from:", `${subject}Content/${chapter}`);

    const unsubscribe = onValue(chapterRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const images = Object.keys(data)
  .filter((key) => {
    if (language === "Gujarati") {
      return key.endsWith("_gu") && data[key]; // ✅ Only include Gujarati images
    } else {
      return !key.endsWith("_gu") && data[key]; // ✅ Only include English images
    }
  })
  .map((key) => data[key]); // ✅ Extract the valid image URLs

          

        setImages(images);
      }
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, [subject,chapter, language]); 

  // ✅ Handle Scroll for pagination
  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  // ✅ Continue Button Logic
  const handleContinue = () => {
    router.push({
      pathname: "screen/McqScreen",
      params: { subject,chapter },
    });
  };

  // ✅ Pinch-to-Zoom State
  const scale = useSharedValue(1);
  const zoomStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePinchGesture = (event) => {
    scale.value = withSpring(event.nativeEvent.scale, {
      damping: 5,
      stiffness: 150,
    });
  };

  if (loading) return <ActivityIndicator size="large" color="#3498db" />;
  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Please log in to continue.</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {chapter} - Key Concepts ({language})
        </Text>
      </View>

      {/* Image Slider */}
      <View style={styles.card}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {images.map((url, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: url }} style={styles.image} resizeMode="contain" />
              {/* Zoom Button */}
              <TouchableOpacity
                style={styles.zoomButton}
                onPress={() => {
                  setZoomImage(url);
                  scale.value = 1; // Reset scale before opening
                }}
              >
                <Text style={styles.zoomText}>🔍</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
          ))}
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      {/* Zoom Image Modal */}
      {zoomImage && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.modalBackground}>
            <PinchGestureHandler onGestureEvent={handlePinchGesture}>
              <Animated.View style={[styles.zoomContainer, zoomStyle]}>
                <Image source={{ uri: zoomImage }} style={styles.zoomedImage} resizeMode="contain" />
              </Animated.View>
            </PinchGestureHandler>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setZoomImage(null)}>
              <Text style={styles.closeButtonText}>✖</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </GestureHandlerRootView>
  );
};
// **Updated Styling for a Modern Look**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7F2FA",
    alignItems: "center",
  },
  header: {
    width: "100%",
    backgroundColor: "#3A85F4",
    paddingVertical: 15,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: width * 0.9,
    height: 500,
    paddingVertical: 10,
    elevation: 3,
    marginTop: 20,
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: width * 0.85,
    height: height * 0.6,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  zoomButton: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "#3A85F4",
    borderRadius: 25,
    padding: 10,
    elevation: 3,
  },
  zoomText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#bbb",
    marginHorizontal: 5,
  }, 
  activeDot: {
    backgroundColor: "#3498db",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  continueButton: {
    width: "90%",
    backgroundColor: "#3A85F4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    position: "absolute",
    bottom: 30,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomContainer: {
    alignItems: "center",
  },
  zoomedImage: {
    width: width * 0.95,
    height: height * 0.8,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    padding: 10,
  },
  closeButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default KeyConceptScreen;

