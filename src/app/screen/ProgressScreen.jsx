// import React, { useEffect, useState } from "react";
// import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Dimensions } from "react-native";
// import { getDatabase, ref, get } from "firebase/database";
// import { getAuth } from "firebase/auth";
// import { BarChart } from "react-native-chart-kit";

// const ProgressScreen = () => {
//     const [progressData, setProgressData] = useState({});
//     const [loading, setLoading] = useState(true);

//     const auth = getAuth();
//     const user = auth.currentUser;
//     const db = getDatabase();

//     useEffect(() => {
//         if (user?.uid) {
//             fetchUserProgress();
//         }
//     }, [user?.uid]);

//     const fetchUserProgress = async () => {
//         try {
//             const userId = user?.uid;
//             if (!userId) return;

//             const progressRef = ref(db, `users/${userId}/progress`);
//             const snapshot = await get(progressRef);

//             setProgressData(snapshot.exists() ? snapshot.val() : {});
//         } catch (error) {
//             console.error("Error fetching progress:", error);
//             setProgressData({});
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#6A5ACD" />
//                 <Text style={styles.loadingText}>Loading progress...</Text>
//             </View>
//         );
//     }

//     const subjects = Object.keys(progressData);
//     const scores = subjects.map(subject => {
//         const { score, total } = progressData[subject];
//         return total > 0 ? ((score / total) * 100).toFixed(1) : 0;
//     });

//     return (
//         <ScrollView style={styles.container}>
//             <Text style={styles.heading}>Your Progress</Text>
//             {subjects.length > 0 ? (
//                 <View style={styles.chartContainer}>
//                     <BarChart
//                         data={{
//                             labels: subjects,
//                             datasets: [{ data: scores.map(Number) }],
//                         }}
//                         width={Dimensions.get("window").width - 40}
//                         height={280}
//                         yAxisSuffix="%"
//                         yAxisMax={100}
//                         chartConfig={{
//                             backgroundGradientFrom: "#F8F9FA",
//                             backgroundGradientTo: "#E0E7FF",
//                             decimalPlaces: 1,
//                             color: (opacity = 1) => `rgba(72, 61, 139, ${opacity})`,
//                             labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//                             barPercentage: 0.6,
//                             style: {
//                                 borderRadius: 15,
//                             },
//                         }}
//                         verticalLabelRotation={25}
//                         fromZero
//                     />
//                 </View>
//             ) : (
//                 <Text style={styles.noProgressText}>No progress recorded yet.</Text>
//             )}
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: "#E3F2FD",
//     },
//     heading: {
//         fontSize: 24,
//         fontWeight: "bold",
//         color: "#3A85F4",
//         textAlign: "center",
//         marginBottom: 20,
//     },
//     chartContainer: {
//         backgroundColor: "white",
//         padding: 15,
//         borderRadius: 15,
//         elevation: 5,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//         overflow: "hidden", // Prevents overflow
//         alignItems: "center", // Centers the chart
//     },
    
//     noProgressText: {
//         textAlign: "center",
//         fontSize: 16,
//         color: "#555",
//         marginTop: 20,
//         fontStyle: "italic",
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#F8F9FA",
//     },
//     loadingText: {
//         marginTop: 10,
//         fontSize: 16,
//         color: "#4B0082",
//     },
// });

// export default ProgressScreen;

import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Dimensions } from "react-native";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { BarChart } from "react-native-chart-kit";
import BottomNavigationBar from "../screen/BottomNavigationBar"; // Import BottomNavigationBar

const ProgressScreen = () => {
    const [progressData, setProgressData] = useState({});
    const [loading, setLoading] = useState(true);

    const auth = getAuth();
    const user = auth.currentUser;
    const db = getDatabase();

    useEffect(() => {
        if (user?.uid) {
            fetchUserProgress();
        }
    }, [user?.uid]);

    const fetchUserProgress = async () => {
        try {
            const userId = user?.uid;
            if (!userId) return;

            const progressRef = ref(db, `users/${userId}/progress`);
            const snapshot = await get(progressRef);

            setProgressData(snapshot.exists() ? snapshot.val() : {});
        } catch (error) {
            console.error("Error fetching progress:", error);
            setProgressData({});
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6A5ACD" />
                <Text style={styles.loadingText}>Loading progress...</Text>
            </View>
        );
    }

    const subjects = Object.keys(progressData);
    const scores = subjects.map(subject => {
        const { score, total } = progressData[subject];
        return total > 0 ? ((score / total) * 100).toFixed(1) : 0;
    });

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.container}>
                <Text style={styles.heading}>Your Progress</Text>
                {subjects.length > 0 ? (
                    <View style={styles.chartContainer}>
                        <BarChart
                            data={{
                                labels: subjects,
                                datasets: [{ data: scores.map(Number) }],
                            }}
                            width={Dimensions.get("window").width - 40}
                            height={280}
                            yAxisSuffix="%"
                            yAxisMax={100}
                            chartConfig={{
                                backgroundGradientFrom: "#F8F9FA",
                                backgroundGradientTo: "#E0E7FF",
                                decimalPlaces: 1,
                                color: (opacity = 1) => `rgba(72, 61, 139, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                barPercentage: 0.6,
                                style: {
                                    borderRadius: 15,
                                },
                            }}
                            verticalLabelRotation={25}
                            fromZero
                        />
                    </View>
                ) : (
                    <Text style={styles.noProgressText}>No progress recorded yet.</Text>
                )}
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <BottomNavigationBar onProfilePress={() => console.log("Profile Pressed")} />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#E3F2FD",
    },
    container: {
        flex: 1,
        padding: 20,
        marginBottom: 80, // Ensures content doesn't overlap with the bottom bar
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#3A85F4",
        textAlign: "center",
        marginBottom: 20,
    },
    chartContainer: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 15,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        overflow: "hidden",
        alignItems: "center",
    },
    noProgressText: {
        textAlign: "center",
        fontSize: 16,
        color: "#555",
        marginTop: 20,
        fontStyle: "italic",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F9FA",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#4B0082",
    },
});

export default ProgressScreen;

