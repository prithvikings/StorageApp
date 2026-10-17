import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />

      <Stack.Screen name="users-list" options={{ title: "Users" }} />

      <Stack.Screen name="add-user" options={{ title: "Add User" }} />
    </Stack>
  );
}
