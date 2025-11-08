// src/components/TodoItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Todo } from '../types/todo';

// Định nghĩa Props cho component
interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{todo.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 16,
  },
});

export default TodoItem;