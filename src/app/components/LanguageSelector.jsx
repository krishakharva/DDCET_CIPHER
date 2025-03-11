// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// const LanguageSelector = ({ selectedLanguage, onChange }) => {
//     return (
//         <View style={styles.container}>
//             <Text style={styles.label}>Select Language:</Text>
//             <View style={styles.buttonContainer}>
//                 <TouchableOpacity
//                     style={[styles.button, selectedLanguage === 'en' && styles.selected]}
//                     onPress={() => onChange('en')}
//                 >
//                     <Text style={styles.buttonText}>English</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={[styles.button, selectedLanguage === 'gu' && styles.selected]}
//                     onPress={() => onChange('gu')}
//                 >
//                     <Text style={styles.buttonText}>ગુજરાતી</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         marginTop: 20,
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     button: {
//         flex: 1,
//         padding: 12,
//         marginHorizontal: 5,
//         backgroundColor: '#3A85F4',
//         borderRadius: 10,
//         alignItems: 'center',
//     },
//     selected: {
//         backgroundColor: '#2A65D1',
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

// export default LanguageSelector;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LanguageSelector = ({ selectedLanguage, onChange }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select Language:</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, selectedLanguage === 'en' ? styles.selected : styles.unselected]}
                    onPress={() => onChange('en')}
                    accessibilityLabel="Select English"
                    aria-pressed={selectedLanguage === 'en'}
                >
                    <Text style={[styles.buttonText, selectedLanguage === 'en' && styles.selectedText]}>
                        English
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, selectedLanguage === 'gu' ? styles.selected : styles.unselected]}
                    onPress={() => onChange('gu')}
                    accessibilityLabel="Select Gujarati"
                    aria-pressed={selectedLanguage === 'gu'}
                >
                    <Text style={[styles.buttonText, selectedLanguage === 'gu' && styles.selectedText]}>
                        ગુજરાતી
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        padding: 12,
        marginHorizontal: 5,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2, // Adds a border effect
        borderColor: 'transparent', // Default is transparent
    },
    selected: {
        backgroundColor: '#2A65D1',
        borderColor: '#1B4FB5', // Adds a slight border effect for selected
    },
    unselected: {
        backgroundColor: '#3A85F4',
        opacity: 0.7, // Dim unselected buttons for better contrast
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    selectedText: {
        color: '#FFD700', // Slightly different text color for selected (Goldish)
    },
});

export default LanguageSelector;
