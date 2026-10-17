import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { insertUser } from "../../db/crud";

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  return (
    <View>
      <TextInput placeholder="Name" onChangeText={setName} />
      <TextInput placeholder="Email" onChangeText={setEmail} />

      <Button
        title="Add User"
        onPress={async () => {
          await insertUser(name, email);
          router.push("/users-list");
        }}
      />
    </View>
  );
};

export default AddUser;

const styles = StyleSheet.create({});
