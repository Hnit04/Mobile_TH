// src/components/TodoItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, currentDoneState: 0 | 1) => void;
  onLongPress: (todo: Todo) => void; // <-- Thêm prop onLongPress
  // (Chúng ta sẽ thêm onDelete ở Câu 7)
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onLongPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onToggle(todo.id, todo.done)} // Câu 5: Toggle
      onLongPress={() => onLongPress(todo)} // <-- Câu 6: Nhấn giữ để sửa
    >
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            todo.done === 1 && styles.titleDone,
          ]}
        >
          {todo.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
// ... (styles giữ nguyên)
const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
});

export default TodoItem;