// src/components/TodoList.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Todo } from '../types/todo';
import TodoItem from './TodoItem';

// Props mới: nhận 'todos' từ App.tsx
interface TodoListProps {
  todos: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  // Đã xóa logic useState và useEffect
  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TodoItem todo={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có việc nào</Text>
          </View>
        }
      />
    </View>
  );
};
// ... (styles giữ nguyên)
const styles = StyleSheet.create({
  container: {
    flex: 1,
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