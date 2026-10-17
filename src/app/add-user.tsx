import { useRouter } from "expo-router";
import { useState } from "react";

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { insertUser } from "../../db/crud";

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  const handleAddUser = async () => {
    // Trim whitespace from the inputs.
    const cleanedName = name.trim();
    const cleanedEmail = email.trim().toLowerCase();

    // Validate required fields.
    if (!cleanedName || !cleanedEmail) {
      Alert.alert("Missing information", "Please enter both name and email.");
      return;
    }

    // Basic email format validation.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanedEmail)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    try {
      setSaving(true);

      // Insert the new record.
      await insertUser(cleanedName, cleanedEmail);

      // Navigate back to the existing list.
      router.replace("/users-list");
    } catch (error) {
      console.error("Failed to add user:", error);

      Alert.alert(
        "Unable to add user",
        "This email may already exist, or the database operation failed.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Add a user</Text>

        <Text style={styles.subtitle}>Enter the user's details below.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Full name</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Prithvi Raj"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!saving}
            returnKeyType="next"
          />

          <Text style={styles.label}>Email address</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. prithvi@example.com"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!saving}
            returnKeyType="done"
          />

          <Pressable
            style={[styles.button, saving && styles.disabledButton]}
            onPress={handleAddUser}
            disabled={saving}
          >
            <Text style={styles.buttonText}>
              {saving ? "Saving..." : "Add User"}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
    padding: 22,
    paddingTop: 60,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 11,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
    marginBottom: 20,
  },

  button: {
    height: 52,
    backgroundColor: "#2563EB",
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.6,
  },
});
