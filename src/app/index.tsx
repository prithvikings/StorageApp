import { Link } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { createTables } from "../../db/createTables";

const index = () => {
  useEffect(() => {
    createTables();
  }, []);

  return (
    <View>
      <Link href={"/users-list"}>Users List</Link>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
