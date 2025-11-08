// App.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { initDatabase } from './src/db/db'; // Import hàm init

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    try {
      // Vì initDatabase là đồng bộ (sync),
      // chúng ta gọi nó trực tiếp.
      initDatabase();
      setDbInitialized(true); // Báo là DB đã sẵn sàng
      console.log('Database is ready.');
    } catch (e) {
      console.error('Failed to init DB on App mount:', e);
    }
  }, []); // Chạy 1 lần khi app mở

  if (!dbInitialized) {
    // Hiển thị loading trong khi chờ DB
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading database...</Text>
      </View>
    );
  }

  // Tiêu chí đạt Câu 1: Chạy expo start OK
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Todo Notes</Text>
        {/* Chúng ta sẽ thêm FlatList (Câu 3) ở đây */}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});