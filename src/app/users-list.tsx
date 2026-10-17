import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { deleteUserById, getUsers, type User } from "../../db/crud";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users whenever this screen becomes active.
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);

      const list = await getUsers();
      setUsers(list);
    } catch (error) {
      console.error("Failed to load users:", error);
      Alert.alert("Error", "Could not load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [loadUsers]),
  );

  // Delete a user and refresh the list.
  const handleDelete = (id: number, name: string) => {
    Alert.alert("Delete user", `Are you sure you want to delete ${name}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUserById(id);
            await loadUsers();
          } catch (error) {
            console.error("Failed to delete user:", error);
            Alert.alert("Error", "Could not delete this user.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>

      <Text style={styles.subtitle}>
        Users saved in your local SQLite database
      </Text>

      <Link href="/add-user" style={styles.addButton}>
        + Add User
      </Link>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
      ) : users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No users yet</Text>

          <Text style={styles.emptyText}>
            Add your first user to see them here.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>

                <Text style={styles.userId}>ID: {user.id}</Text>
              </View>

              <Pressable
                style={styles.deleteButton}
                onPress={() => handleDelete(user.id, user.name)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingTop: 55,
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
    marginBottom: 22,
  },

  addButton: {
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    textAlign: "center",
    overflow: "hidden",
    padding: 14,
    borderRadius: 12,
    fontWeight: "600",
    marginBottom: 20,
  },

  loader: {
    marginTop: 50,
  },

  listContent: {
    paddingBottom: 30,
  },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1D4ED8",
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  userEmail: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  userId: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 5,
  },

  deleteButton: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },

  deleteText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "600",
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 55,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#334155",
  },

  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
  },
});
