// App.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity, // Import nút
  Alert, // Import Alert
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { initDatabase, db } from './src/db/db';
import TodoList from './src/components/TodoList';
import { Todo } from './src/types/todo';
import TodoModal from './src/components/TodoModal'; // <-- Import Modal

// Hàm fetchTodos (giữ nguyên)
const fetchTodos = (): Todo[] => {
  try {
    const allRows = db.getAllSync<Todo>('SELECT * FROM todos ORDER BY created_at DESC');
    return allRows;
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    return [];
  }
};

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  
  // Mới (Câu 4): State để quản lý Modal
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    try {
      initDatabase();
      setDbInitialized(true);
      setTodos(fetchTodos());
      console.log('Database is ready.');
    } catch (e) {
      console.error('Failed to init DB on App mount:', e);
    }
  }, []);

  // Hàm để làm mới danh sách (giữ nguyên)
  const refreshTodos = useCallback(() => {
    setTodos(fetchTodos());
  }, []);

  // Mới (Câu 4a): Hàm xử lý khi lưu từ Modal
  const handleSaveTodo = (title: string) => {
    try {
      const now = Date.now();
      // Chạy INSERT
      db.runSync(
        'INSERT INTO todos (title, created_at) VALUES (?, ?)',
        [title, now]
      );

      // Câu 4c: auto refresh list
      refreshTodos();
      setModalVisible(false); // Đóng modal
    } catch (error) {
      console.error('Failed to add todo:', error);
      Alert.alert('Lỗi', 'Không thể thêm công việc.');
    }
  };

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
        <TodoList todos={todos} /> 

        {/* Nút "+" (Câu 4a) */}
        <TouchableOpacity
          style={styles.fab} // Nút tròn
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        {/* Modal Thêm mới (Câu 4) */}
        <TodoModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveTodo}
        />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Cập nhật styles
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
  // Style cho nút "+"
  fab: {
    position: 'absolute', // Nằm đè lên
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF', // Màu xanh
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 30,
    color: 'white',
    lineHeight: 30, // Căn chỉnh dấu +
    paddingBottom: 2,
  },
});