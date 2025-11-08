// App.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { initDatabase, db } from './src/db/db';
import TodoList from './src/components/TodoList';
import { Todo } from './src/types/todo';
import TodoModal from './src/components/TodoModal';

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

  // Hàm để làm mới danh sách
  const refreshTodos = useCallback(() => {
    setTodos(fetchTodos());
  }, []);

  // Hàm xử lý Thêm mới (Câu 4)
  const handleSaveTodo = (title: string) => {
    try {
      const now = Date.now();
      db.runSync(
        'INSERT INTO todos (title, created_at) VALUES (?, ?)',
        [title, now]
      );
      refreshTodos();
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to add todo:', error);
      Alert.alert('Lỗi', 'Không thể thêm công việc.');
    }
  };

  // Mới (Câu 5): Hàm xử lý Toggle
  const handleToggleTodo = (id: number, currentDoneState: 0 | 1) => {
    try {
      // Tính toán trạng thái mới
      const newDoneState = currentDoneState === 0 ? 1 : 0;
      
      // Chạy lệnh UPDATE
      db.runSync(
        'UPDATE todos SET done = ? WHERE id = ?',
        [newDoneState, id]
      );

      // Câu 5c: Cập nhật danh sách ngay
      refreshTodos();
    } catch (error) {
      console.error('Failed to toggle todo:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật công việc.');
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
        
        {/* Truyền hàm onToggle xuống TodoList */}
        <TodoList todos={todos} onToggle={handleToggleTodo} /> 

        {/* Nút "+" (Câu 4) */}
        <TouchableOpacity
          style={styles.fab}
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

// ... (styles giữ nguyên)
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
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
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
    lineHeight: 30,
    paddingBottom: 2,
  },
});