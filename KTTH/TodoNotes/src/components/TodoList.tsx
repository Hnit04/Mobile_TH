// src/components/TodoList.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { db } from '../db/db';
import { Todo } from '../types/todo';
import TodoItem from './TodoItem';

// Hàm đọc dữ liệu từ DB
const fetchTodos = (): Todo[] => {
  try {
    // Dùng API 'next' (sync)
    const allRows = db.getAllSync<Todo>('SELECT * FROM todos ORDER BY created_at DESC');
    return allRows;
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    return [];
  }
};

const TodoList = () => {
  // Câu 3b: Dùng useState để lưu danh sách todos
  const [todos, setTodos] = useState<Todo[]>([]);

  // Câu 3b: Dùng useEffect để lấy dữ liệu khi component_mount
  useEffect(() => {
    const data = fetchTodos();
    setTodos(data);
  }, []); // Mảng rỗng nghĩa là chỉ chạy 1 lần lúc đầu

  return (
    <View style={styles.container}>
      {/* Câu 3a: Dùng FlatList */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TodoItem todo={item} />}
        // Câu 3c: Empty state
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có việc nào</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Đảm bảo FlatList chiếm hết không gian
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default TodoList;