

import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

const Home = ({ navigation }) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/screen/LoginScreen');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('./assets/logo-removebg-preview.png')} style={styles.logo} />

      {/* Welcome Text */}
      <Text style={styles.title}>Welcome to DDCET Exam Preparation</Text>
      <Text style={styles.subtitle}>Ace the Diploma to Degree Common Entrance Test with personalized learning!</Text>

      {/* Motivational Text */}
      <Text style={styles.motivation}>Get ready to unlock your potential!</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7F2FA', // Light background color
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: '100%',
    width: '100%',
  },
  logo: {
    height: 150,
    width: 150,
    marginBottom: 20,
    //borderRadius: 10, // Optional: To give the logo rounded corners
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation:10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3A85F4', // Darker text for contrast
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#3A85F4', // Lighter gray text for subtitle
    textAlign: 'center',
    marginBottom: 20,
  },
  motivation: {
    fontSize: 18,
    color: '#3498DB', // Blue for motivational touch
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

