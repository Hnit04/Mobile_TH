// App.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { initDatabase, db } from './src/db/db';
import TodoList from './src/components/TodoList';
import { Todo } from './src/types/todo';
import TodoModal from './src/components/TodoModal';
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/todos?userId=1';

interface ApiTodo {
  id: number;
  title: string;
  completed: boolean;
}

const fetchTodos = (query: string = ''): Todo[] => {
  try {
    let sql = 'SELECT * FROM todos';
    const params = [];
    if (query.trim() !== '') {
      sql += ' WHERE title LIKE ?';
      params.push(`%${query}%`);
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setTodos(fetchTodos(searchQuery));
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      refreshTodos();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, refreshTodos]);

  // Cập nhật (Câu 9): Hàm đồng bộ API
  const handleSyncAPI = async () => {
    setIsLoading(true);
    let importedCount = 0;
    try {
      // 1. Gọi GET tới endpoint
      const response = await axios.get<ApiTodo[]>(API_URL);
      const apiTodos = response.data;

      if (!apiTodos || apiTodos.length === 0) {
        throw new Error('Không nhận được dữ liệu từ API.');
      }

      const now = Date.now();

      // =======================================================
      // SỬA LỖI TẠI ĐÂY: Dùng BEGIN/COMMIT thay vì transactionSync
      // =======================================================
      try {
        // 2. Bắt đầu transaction
        db.execSync('BEGIN TRANSACTION;');

        for (const apiTodo of apiTodos) {
          // 3. Kiểm tra title trùng
          const existingTodo = db.getFirstSync(
            'SELECT id FROM todos WHERE title = ?',
            [apiTodo.title]
          );

          // 4. Nếu title chưa có -> INSERT
          if (!existingTodo) {
            const done = apiTodo.completed ? 1 : 0;
            db.runSync(
              'INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)',
              [apiTodo.title, done, now]
            );
            importedCount++;
          }
        }
        
        // 5. Hoàn thành transaction
        db.execSync('COMMIT;');
        console.log('Transaction committed successfully.');

      } catch (transactionError) {
        // 6. Hoàn tác nếu có lỗi
        db.execSync('ROLLBACK;');
        console.error('Transaction failed, rolling back:', transactionError);
        throw transactionError; // Ném lỗi ra ngoài
      }
      // =======================================================

      // 7. Thông báo thành công và làm mới
      Alert.alert(
        'Thành công',
        `Đã đồng bộ xong. Thêm mới ${importedCount} công việc.`
      );
      refreshTodos();

    } catch (error) {
      console.error('Failed to sync API:', error);
      Alert.alert('Lỗi', 'Không thể đồng bộ từ API.');
    } finally {
      setIsLoading(false);
    }
  };


  // ... (Giữ nguyên các hàm handleSave, handleToggle, handleDelete, handleLongPress, v.v...)
  const handleSaveTodo = (title: string, id?: number) => {
    try {
        if (id) {
          db.runSync('UPDATE todos SET title = ? WHERE id = ?', [title, id]);
        } else {
          const now = Date.now();
          db.runSync('INSERT INTO todos (title, created_at) VALUES (?, ?)', [title, now]);
        }
        refreshTodos();
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
                refreshTodos();
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

        <View style={styles.headerContainer}>
          <View style={styles.syncButtonContainer}>
            <Button
              title="Đồng bộ API"
              onPress={handleSyncAPI}
              disabled={isLoading}
            />
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm công việc..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {isLoading && (
          <ActivityIndicator style={styles.loadingIndicator} size="large" color="#007AFF" />
        )}
        
        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
          onLongPress={handleLongPressTodo}
          onDelete={handleDeleteTodo}
        /> 

        <TouchableOpacity style={styles.fab} onPress={openAddModal} disabled={isLoading}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
        
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
  },
  headerContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncButtonContainer: {
    marginRight: 10,
  },
  searchContainer: {
    flex: 1,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  loadingIndicator: {
    paddingVertical: 10,
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