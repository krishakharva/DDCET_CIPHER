import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler, Alert } from "react-native";

const LoginScreen = () => {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const auth = getAuth();
  //console.log("auth: ", auth)
  const db = getDatabase();
  //console.log("db: ", db)
  
  useFocusEffect(
    React.useCallback(() => {
        const onBackPress = () => {
            Alert.alert("Exit App", "Are you sure you want to exit?", [
                { text: "Cancel", style: "cancel" },
                { text: "Exit", onPress: () => BackHandler.exitApp() },
            ]);
            return true; // Prevent going back
        };

        BackHandler.addEventListener("hardwareBackPress", onBackPress);

        return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
);


  const handleLogin = async () => {
    if (!email.includes("@")) {
      setErrorMessage("Invalid email format.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userID = userCredential.user.uid; // Get the user ID (UID)
      
      console.log("User ID:", userID); // Log the user ID
      router.push("./Syllabus");
    } catch (error) {
      setErrorMessage("Invalid email or password.");
    }
  };
  

  const handleSignUp = async () => {
    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!email.includes("@")) {
      setErrorMessage("Invalid email format.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await set(ref(db, `users/${user.uid}`), {
        name: name,
        email: user.email,
        darkMode: false,
        vibration: true,
      });

      router.push("./Syllabus");
    } catch (error) {
      setErrorMessage("Signup failed. Try again.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter your email to reset the password.");
      return;
    }
  
    setErrorMessage(
      "Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, and one special character."
    );
  
    try {
      await sendPasswordResetEmail(auth, email);
      setErrorMessage("Password reset email sent. Check your inbox.");
    } catch (error) {
      setErrorMessage("Error sending reset email. Try again.");
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {isLoginMode ? "Welcome Back!" : "Create Your Account"}
        </Text>
        <Text style={styles.subtitle}>
          {isLoginMode
            ? "Log in to continue your DDCET preparation."
            : "Sign up and start practicing now!"}
        </Text>
      </View>

      {/* Logo */}
      <Image source={require("../assets/logo-removebg-preview.png")} style={styles.logo} />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {!isLoginMode && (
        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color="#3A85F4" />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#3A85F4"
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="#3A85F4" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#3A85F4"
        />
      </View>

      <View style={styles.passwordContainer}>
  <MaterialIcons name="lock" size={24} color="#3A85F4" />
  <TextInput
    style={styles.passwordInput}
    placeholder="Password"
    secureTextEntry={!isPasswordVisible}
    value={password}
    onChangeText={setPassword}
    placeholderTextColor="#3A85F4"
  />
  <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
    <MaterialIcons
      name={isPasswordVisible ? "visibility-off" : "visibility"}
      size={24}
      color="#3A85F4"
    />
  </TouchableOpacity>
</View>



      {/* Forgot Password Button (Only in Login Mode) */}
      {isLoginMode && (
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      )}

      {!isLoginMode && (
        <View style={styles.passwordContainer}>
          <MaterialIcons name="lock" size={24} color="#3A85F4" />
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            secureTextEntry={!isPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="#3A85F4"
          />
        </View>
      )}

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={isLoginMode ? handleLogin : handleSignUp}
      >
        <Text style={styles.buttonText}>
          {isLoginMode ? "Login" : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLoginMode(!isLoginMode)}>
        <Text style={styles.switchText}>
          {isLoginMode
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7F2FA",
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  header: {
    backgroundColor: "#3A85F4",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: "center",
    width: "100%",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
    width: "100%",
    marginBottom: 15,
  },
  
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
    width: "100%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    justifyContent: "space-between", // Ensures right alignment
  },
  passwordInput: {
    flex: 1,
    marginLeft: 10, // Space between lock icon and text input
    fontSize: 16,
    color: "black",
  },
  
  forgotPasswordText: {
    alignSelf: "flex-end",
    marginBottom: 15,
    color: "#3A85F4",
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#3A85F4",
    padding: 13,
    borderRadius: 15,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  switchText: {
    fontSize: 16,
    color: "#3A85F4",
    marginTop: 10,
  },
  

});

export default LoginScreen;
