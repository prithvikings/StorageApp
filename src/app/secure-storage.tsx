import * as SecureStore from "expo-secure-store";
import { useState } from "react";

import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function SecureStorageView() {
  // Store the username and password entered by the user.
  // Empty strings mean that the inputs start empty.
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // Controls whether the password is visible.
  const [showPassword, setShowPassword] = useState(false);

  // Prevents multiple storage operations from running simultaneously.
  const [loading, setLoading] = useState(false);

  // Used to display success or error messages in the UI.
  const [message, setMessage] = useState("");

  // Save credentials securely on the device.
  const onSaveCredentials = async () => {
    const cleanedUserName = userName.trim();

    if (!cleanedUserName || !password) {
      setMessage("Please enter both your username and password.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await SecureStore.setItemAsync("userName", cleanedUserName);
      await SecureStore.setItemAsync("password", password);

      // Clear the input fields after saving successfully.
      setUserName("");
      setPassword("");
      setShowPassword(false);

      setMessage("Credentials saved successfully!");
    } catch (error) {
      console.error("Error saving credentials:", error);
      setMessage("Failed to save credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Retrieve credentials from SecureStore.
  const onGetCredentials = async () => {
    try {
      setLoading(true);
      setMessage("");

      const storedUserName = await SecureStore.getItemAsync("userName");
      const storedPassword = await SecureStore.getItemAsync("password");

      // Check whether either credential is missing.
      if (storedUserName === null || storedPassword === null) {
        setMessage("No saved credentials found. Save them first.");
        return;
      }

      // Restore the saved credentials into the input fields.
      setUserName(storedUserName);
      setPassword(storedPassword);

      // Keep the password hidden when it is retrieved.
      setShowPassword(false);

      setMessage("Credentials retrieved successfully!");
    } catch (error) {
      console.error("Error retrieving credentials:", error);
      setMessage("Failed to retrieve credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Delete the stored credentials.
  const onDeleteCredentials = async () => {
    try {
      setLoading(true);
      setMessage("");

      // Delete both stored values.
      await SecureStore.deleteItemAsync("userName");
      await SecureStore.deleteItemAsync("password");

      // Clear the input fields and reset password visibility.
      setUserName("");
      setPassword("");
      setShowPassword(false);

      setMessage("Your saved credentials have been deleted.");
    } catch (error) {
      console.error("Error deleting credentials:", error);
      setMessage("Unable to delete credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Ask for confirmation before deleting saved credentials.
  const confirmDeleteCredentials = () => {
    Alert.alert(
      "Delete credentials?",
      "This will permanently remove the saved username and password from this device.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: onDeleteCredentials,
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.lockIcon}>🔐</Text>
            </View>

            <Text style={styles.title}>Secure Vault</Text>

            <Text style={styles.subtitle}>
              Store and manage your credentials securely on your device.
            </Text>
          </View>

          {/* Credentials form */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Your credentials</Text>

            {/* Username input */}
            <Text style={styles.label}>Username</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#94A3B8"
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              editable={!loading}
              returnKeyType="next"
            />

            {/* Password input */}
            <Text style={styles.label}>Password</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                editable={!loading}
                returnKeyType="done"
              />

              {/* Toggle password visibility */}
              <Pressable
                onPress={() => setShowPassword((previous) => !previous)}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? "Hide password" : "Show password"
                }
                style={styles.visibilityButton}
              >
                <Text style={styles.visibilityText}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </Pressable>
            </View>

            {/* Status message */}
            {message !== "" && (
              <View style={styles.messageBox}>
                <Text style={styles.messageText}>{message}</Text>
              </View>
            )}

            {/* Save button */}
            <Pressable
              style={[
                styles.button,
                styles.saveButton,
                loading && styles.disabledButton,
              ]}
              onPress={onSaveCredentials}
              disabled={loading}
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Save Credentials</Text>
              )}
            </Pressable>

            {/* Retrieve button */}
            <Pressable
              style={[
                styles.button,
                styles.retrieveButton,
                loading && styles.disabledButton,
              ]}
              onPress={onGetCredentials}
              disabled={loading}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>
                Retrieve Credentials
              </Text>
            </Pressable>

            {/* Delete button */}
            <Pressable
              style={[
                styles.button,
                styles.deleteButton,
                loading && styles.disabledButton,
              ]}
              onPress={confirmDeleteCredentials}
              disabled={loading}
              accessibilityRole="button"
            >
              <Text style={styles.deleteButtonText}>Delete Credentials</Text>
            </Pressable>
          </View>

          {/* Security information */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Your privacy matters</Text>

            <Text style={styles.infoText}>
              Expo SecureStore uses platform-provided secure storage mechanisms
              to protect small pieces of sensitive data. Your password is masked
              by default and is not displayed in status messages.
            </Text>
          </View>

          <Text style={styles.footer}>Secure Vault · Expo SecureStore</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Main screen
  screen: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 30,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  lockIcon: {
    fontSize: 36,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
    textAlign: "center",
    maxWidth: 320,
  },

  // Main form card
  card: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",

    // Android shadow
    elevation: 3,

    // iOS shadow
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 22,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },

  // Username input
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
    marginBottom: 20,
  },

  // Password input and visibility control
  passwordContainer: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    marginBottom: 18,
  },

  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#0F172A",
  },

  visibilityButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  visibilityText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 13,
  },

  // Status message
  messageBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },

  messageText: {
    color: "#1D4ED8",
    fontSize: 13,
    lineHeight: 19,
  },

  // Buttons
  button: {
    minHeight: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
  },

  saveButton: {
    backgroundColor: "#2563EB",
  },

  retrieveButton: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  deleteButton: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  secondaryButtonText: {
    color: "#1D4ED8",
    fontSize: 15,
    fontWeight: "600",
  },

  deleteButtonText: {
    color: "#DC2626",
    fontSize: 15,
    fontWeight: "600",
  },

  disabledButton: {
    opacity: 0.5,
  },

  // Security information card
  infoCard: {
    backgroundColor: "#E0F2FE",
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#075985",
    marginBottom: 7,
  },

  infoText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#0C4A6E",
  },

  // Footer
  footer: {
    textAlign: "center",
    marginTop: 22,
    fontSize: 12,
    color: "#94A3B8",
  },
});
