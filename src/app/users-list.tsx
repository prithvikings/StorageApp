import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { deleteUserById, getUsers } from "../../db/crud";

const UserList = () => {
  const [users, setUsers] = useState<any[]>([]);

  async function loadUsers() {
    const list = await getUsers();
    setUsers(list);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <View>
      {users.map((user) => (
        <View key={user.id}>
          <Text>{user.name}</Text>
          <Text>{user.email}</Text>
          <Pressable
            onPress={() => {
              // Handle delete user logic here
              deleteUserById(user.id).then(loadUsers); // Refresh the list after deletion
            }}
          >
            <Text>Delete</Text>
          </Pressable>
        </View>
      ))}

      <Link href={"/add-user"}>Add User</Link>
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({});
