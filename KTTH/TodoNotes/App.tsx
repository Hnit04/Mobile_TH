// App.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput, // <-- Import TextInput
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { initDatabase, db } from './src/db/db';
import TodoList from './src/components/TodoList';
import { Todo } from './src/types/todo';
import TodoModal from './src/components/TodoModal';

// Cập nhật (Câu 8): Hàm fetchTodos giờ nhận query
const fetchTodos = (query: string = ''): Todo[] => {
  try {
    let sql = 'SELECT * FROM todos';
    const params = [];

    // Nếu có query, dùng LIKE
    if (query.trim() !== '') {
      sql += ' WHERE title LIKE ?';
      params.push(`%${query}%`); // Dùng % để tìm kiếm
    }

    sql += ' ORDER BY created_at DESC';

    const allRows = db.getAllSync<Todo>(sql, params);
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
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  
  // Mới (Câu 8): State cho tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');

  // useEffect ban đầu (giữ nguyên)
  useEffect(() => {
    try {
      initDatabase();
      setDbInitialized(true);
      setTodos(fetchTodos()); // Lấy dữ liệu lần đầu (không có query)
      console.log('Database is ready.');
    } catch (e) {
      console.error('Failed to init DB on App mount:', e);
    }
  }, []);

  // Cập nhật (Câu 8): refreshTodos giờ sẽ dùng searchQuery
  const refreshTodos = useCallback(() => {
    setTodos(fetchTodos(searchQuery));
  }, [searchQuery]); // <-- Thêm searchQuery vào dependency

  // Mới (Câu 8): useEffect để lọc real-time
  // (Câu 8c: Tối ưu, chỉ chạy khi user dừng gõ 300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Khi gõ, nó sẽ gọi hàm này
      refreshTodos();
    }, 300); // Debounce 300ms

    // Hủy timer cũ nếu user gõ tiếp
    return () => clearTimeout(timer);
  }, [searchQuery, refreshTodos]); // Chạy lại khi searchQuery hoặc refreshTodos thay đổi

  
  // Cập nhật (Câu 4, 6, 7): Các hàm này giờ đã gọi
  // refreshTodos() (vốn đã phụ thuộc vào searchQuery),
  // nên danh sách sẽ được làm mới chính xác.
  const handleSaveTodo = (title: string, id?: number) => {
    try {
        if (id) {
          db.runSync('UPDATE todos SET title = ? WHERE id = ?', [title, id]);
        } else {
          const now = Date.now();
          db.runSync('INSERT INTO todos (title, created_at) VALUES (?, ?)', [title, now]);
        }
        refreshTodos(); // Cập nhật danh sách (đã bao gồm filter)
        closeModal();
    } catch (error) {
        console.error('Failed to save todo:', error);
        Alert.alert('Lỗi', 'Không thể lưu công việc.');
    }
  };
  
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

  const handleDeleteTodo = (id: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa công việc này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            try {
                db.runSync('DELETE FROM todos WHERE id = ?', [id]);
                refreshTodos(); // Cập nhật danh sách
            } catch (error) {
                console.error('Failed to delete todo:', error);
                Alert.alert('Lỗi', 'Không thể xóa công việc.');
            }
          },
        },
      ]
    );
  };

  const handleLongPressTodo = (todo: Todo) => {
    setEditingTodo(todo); 
    setModalVisible(true);
  };
  const openAddModal = () => {
    setEditingTodo(null); 
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setEditingTodo(null);
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

        {/* (Câu 8a): Thanh tìm kiếm */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm công việc..."
            value={searchQuery}
            onChangeText={setSearchQuery} // Cập nhật state real-time
          />
        </View>
        
        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
          onLongPress={handleLongPressTodo}
          onDelete={handleDeleteTodo}
        /> 

        {/* Nút "+" */}
        <TouchableOpacity style={styles.fab} onPress={openAddModal}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
        
        {/* Modal */}
        <TodoModal
          visible={modalVisible}
          onClose={closeModal}
          onSave={handleSaveTodo}
          initialTodo={editingTodo}
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
  },
  // (Câu 8): Style cho Search
  searchContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  // --------------------
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