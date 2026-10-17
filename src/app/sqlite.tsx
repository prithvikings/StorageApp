import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { createTables } from "../../db/createTables";

export default function Sqlview() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function initializeDatabase() {
      try {
        // Wait for the database table to be created.
        await createTables();
        setReady(true);
      } catch (error) {
        console.error("Database initialization failed:", error);
        setError("Could not initialize the database.");
      }
    }

    initializeDatabase();
  }, []);

  // Show a loading screen while initializing SQLite.
  if (!ready && !error) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.message}>Initializing database...</Text>
      </View>
    );
  }

  // Show an error instead of allowing navigation to a broken database.
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SQLite User Manager</Text>

      <Text style={styles.subtitle}>
        Manage users stored locally on your device.
      </Text>

      <Link href="/users-list" style={styles.link}>
        View Users
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
  },

  message: {
    marginTop: 12,
    fontSize: 15,
    color: "#475569",
  },

  link: {
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    overflow: "hidden",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    fontWeight: "600",
  },

  error: {
    color: "#DC2626",
    fontSize: 16,
    textAlign: "center",
  },
});
