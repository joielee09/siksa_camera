import React, { useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";

export default function App() {
const createTwoButtonAlert = () =>
    Alert.alert(
    "",
    "✔ saved! ",
    [
        {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed")
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
    ],
    { cancelable: false }
    );
    return (
    <View style={styles.container}>
        <Button title="2-Button Alert" onPress={createTwoButtonAlert} />
    </View>
    );
}