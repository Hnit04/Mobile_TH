// App.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { initDatabase } from './src/db/db';
import TodoList from './src/components/TodoList'; // <-- Import TodoList

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    try {
      initDatabase();
      setDbInitialized(true);
      console.log('Database is ready.');
    } catch (e) {
      console.error('Failed to init DB on App mount:', e);
    }
  }, []);

  if (!dbInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading database...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Todo Notes</Text>
        
        {/* <-- Thay thế bằng TodoList */}
        <TodoList /> 

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});