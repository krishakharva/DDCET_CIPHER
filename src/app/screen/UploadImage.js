import { View, TextInput, Button, Image, StyleSheet } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Get Database Instance
const database = getDatabase(app);

const UploadImage = () => {
  const uploadImageUrl = () => {
    const imageUrl = "https://example.com/image.jpg"; // Replace with your image URL
    const dbRef = ref(database, 'images/1'); // Example path

    set(dbRef, {
      imageUrl: imageUrl,
    })
      .then(() => {
        console.log("Image URL uploaded successfully!");
      })
      .catch((error) => {
        console.error("Error uploading URL: ", error);
      });
  };

  return (
    <View style={styles.container}>
      <Button title="Upload Image URL" onPress={uploadImageUrl} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UploadImage;
