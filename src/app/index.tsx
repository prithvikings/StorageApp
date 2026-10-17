import { Directory, File, Paths } from "expo-file-system";
import { fetch } from "expo/fetch";
import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

const Index = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${message}`]);
  };

  const createAndReadFile = async () => {
    try {
      const file = new File(Paths.document, "hello.txt");

      file.create();
      file.write("Suraj from this side");

      const content = await file.text();

      addLog(`File created & read: "${content}"`);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const readAsBase64 = async () => {
    try {
      const file = new File(Paths.document, "base64-test.txt");
      file.create();
      file.write("Convert me to base64");

      const base64 = await file.base64();
      addLog(`File created & read: "${base64.substring(0, 30)}"`);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const deleteFile = () => {
    const file = new File(Paths.document, "delete-me.txt");
    file.create();
    file.write("Delete Me");

    file.delete();
  };

  const copyFile = () => {
    const original = new File(Paths.document, "original.txt");

    if (!original.exists) {
      original.create();
      original.write("Original content");
    }

    const copy = new File(Paths.cache, "cpoy.txt");
    original.copy(copy);
  };

  const listDirectory = () => {
    try {
      const dir = new Directory(Paths.document);
      const items = dir.list();

      addLog(`✅ Found ${items.length} items:`);
    } catch (error) {}
  };

  const uploadFile = async () => {
    setLoading(true);
    try {
      const file = new File(Paths.cache, "upload.txt");
      file.create();
      file.write("Upload this content");

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        body: formData,
      });

      addLog(`✅ Uploaded! Status: ${response.status}`);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📦 FileSystem Operations</Text>

      <ScrollView style={styles.buttonsContainer}>
        <View style={styles.row}>
          <Button title="1. Create & Read" onPress={createAndReadFile} />
          <Button title="2. Base64" onPress={readAsBase64} />
        </View>

        <View style={styles.row}>
          <Button title="3. List Dir" onPress={listDirectory} />
          <Button title="4. Upload" onPress={uploadFile} />
        </View>
      </ScrollView>

      <View style={styles.logsContainer}>
        <Text style={styles.logsHeader}>📋 Operation Logs:</Text>
        <ScrollView style={styles.logsScroll}>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logText}>
              {log}
            </Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  buttonsContainer: {
    maxHeight: 400,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 10,
  },
  logsContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  logsHeader: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  logsScroll: {
    flex: 1,
  },
  logText: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: "monospace",
  },
  emptyLog: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});
