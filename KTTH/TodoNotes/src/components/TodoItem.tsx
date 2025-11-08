// src/components/TodoItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, currentDoneState: 0 | 1) => void;
  onLongPress: (todo: Todo) => void;
  onDelete: (id: number) => void; // <-- Thêm prop onDelete
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onLongPress, onDelete }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onToggle(todo.id, todo.done)} // Câu 5
      onLongPress={() => onLongPress(todo)} // Câu 6
    >
      {/* Container cho Tiêu đề (flex: 1 để chiếm hết phần bên trái) */}
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            todo.done === 1 && styles.titleDone,
          ]}
          // Dùng ellipsizeMode để cắt chữ nếu quá dài
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {todo.title}
        </Text>
      </View>

      {/* Câu 7a: Nút xóa */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(todo.id)} // Chỉ gọi onDelete, không toggle
        // Dùng hitSlop để tăng vùng nhấn, giúp dễ nhấn hơn
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// Cập nhật styles
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
    flex: 1, // Quan trọng: làm cho container này co giãn
    marginRight: 16, // Thêm khoảng cách với nút xóa
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  // Style cho nút Xóa (Câu 7)
  deleteButton: {
    paddingHorizontal: 8,
  },
  deleteText: {
    fontSize: 18,
    color: '#FF3B30', // Màu đỏ (xóa)
    fontWeight: 'bold',
  },
});

export default TodoItem;