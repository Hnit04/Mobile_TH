// src/components/TodoList.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Todo } from '../types/todo';
import TodoItem from './TodoItem';

// Props mới: nhận 'todos' và 'onToggle'
interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number, currentDoneState: 0 | 1) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          // Truyền hàm onToggle xuống TodoItem
          <TodoItem todo={item} onToggle={onToggle} />
        )}
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