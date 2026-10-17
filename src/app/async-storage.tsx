import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function AsyncStorageView() {
  const [output, setOutput] = useState("");
  const log = (msg: any) => setOutput((prev) => prev + "\n" + msg);
  const clear = () => setOutput("");
  const example1 = async () => {
    clear();
    await AsyncStorage.setItem("userName", "suraj");
    log("Username stored successfully.");
  };

  const example2 = async () => {
    clear();
    const userName = await AsyncStorage.getItem("userName");
    if (userName === null) {
      log("No user name found in storage.");
      return;
    }
    log(`User name retrieved: ${userName}`);
  };

  const example3 = async () => {
    clear();
    await AsyncStorage.removeItem("userName");
    log("User name removed from storage.");
  };

  return (
    <View style={styles.container}>
      <Text>{output}</Text>
      <Text>Saved Item into Storage.</Text>

      <Pressable
        style={{
          backgroundColor: "green",
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        }}
        onPress={example1}
      >
        <Text style={{ color: "#fff" }}>Save the data</Text>
      </Pressable>

      <Pressable
        style={{
          backgroundColor: "darkgreen",
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        }}
        onPress={example2}
      >
        <Text style={{ color: "#fff" }}>Get the data</Text>
      </Pressable>

      <Pressable
        style={{
          backgroundColor: "darkred",
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        }}
        onPress={example3}
      >
        <Text style={{ color: "#fff" }}>Remove the data</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
