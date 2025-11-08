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

  // Mới (Câu 6): State cho công việc đang sửa
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

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

  const refreshTodos = useCallback(() => {
    setTodos(fetchTodos());
  }, []);

  // Cập nhật (Câu 6): Xử lý cả Thêm (Câu 4) và Sửa (Câu 6)
  const handleSaveTodo = (title: string, id?: number) => {
    try {
      if (id) {
        // Câu 6: Chế độ Sửa (UPDATE)
        db.runSync(
          'UPDATE todos SET title = ? WHERE id = ?',
          [title, id]
        );
      } else {
        // Câu 4: Chế độ Thêm mới (INSERT)
        const now = Date.now();
        db.runSync(
          'INSERT INTO todos (title, created_at) VALUES (?, ?)',
          [title, now]
        );
      }
      refreshTodos(); // Làm mới danh sách
      closeModal(); // Đóng modal
    } catch (error) {
      console.error('Failed to save todo:', error);
      Alert.alert('Lỗi', 'Không thể lưu công việc.');
    }
  };

  // Hàm xử lý Toggle (Câu 5)
  const handleToggleTodo = (id: number, currentDoneState: 0 | 1) => {
    try {
      const newDoneState = currentDoneState === 0 ? 1 : 0;
      db.runSync('UPDATE todos SET done = ? WHERE id = ?', [newDoneState, id]);
      refreshTodos();
    } catch (error) {
      console.error('Failed to toggle todo:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật công việc.');
    }
  };

  // Mới (Câu 6): Hàm xử lý khi nhấn giữ
  const handleLongPressTodo = (todo: Todo) => {
    setEditingTodo(todo); // Set công việc đang sửa
    setModalVisible(true); // Mở modal
  };

  // Mới (Câu 6): Hàm mở modal để Thêm mới
  const openAddModal = () => {
    setEditingTodo(null); // Đảm bảo không có gì đang sửa
    setModalVisible(true);
  };
  
  // Mới (Câu 6): Hàm đóng modal (dọn dẹp)
  const closeModal = () => {
    setModalVisible(false);
    setEditingTodo(null); // Luôn dọn dẹp
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
        
        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
          onLongPress={handleLongPressTodo} // Truyền hàm
        /> 

        {/* Nút "+" (Câu 4) */}
        <TouchableOpacity
          style={styles.fab}
          onPress={openAddModal} // Dùng hàm mới
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        {/* Modal (Câu 4 & 6) */}
        <TodoModal
          visible={modalVisible}
          onClose={closeModal} // Dùng hàm mới
          onSave={handleSaveTodo}
          initialTodo={editingTodo} // Truyền công việc đang sửa
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