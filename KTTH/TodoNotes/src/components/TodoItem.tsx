// src/components/TodoItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import { Todo } from '../types/todo';

// Định nghĩa Props mới
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, currentDoneState: 0 | 1) => void; // Hàm callback khi nhấn
  // (Chúng ta sẽ thêm onLongPress ở Câu 6)
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle }) => {
  return (
    // Câu 5a: Chạm vào item để toggle
    <TouchableOpacity
      style={styles.container}
      onPress={() => onToggle(todo.id, todo.done)} // Gọi hàm toggle
    >
      <View style={styles.textContainer}>
        {/* Câu 5b: UI gạch ngang */}
        <Text
          style={[
            styles.title,
            todo.done === 1 && styles.titleDone, // Áp dụng style gạch ngang
          ]}
        >
          {todo.title}
        </Text>
      </View>
      {/* (Chúng ta sẽ thêm nút Xóa ở Câu 7) */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between', // Để dành chỗ cho nút Xóa sau
    alignItems: 'center',
  },
  textContainer: {
    flex: 1, // Đảm bảo text không bị đẩy ra ngoài
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  // Câu 5b: Style cho công việc đã hoàn thành
  titleDone: {
    textDecorationLine: 'line-through', // Gạch ngang
    color: '#aaa', // Làm mờ chữ
  },
});

export default TodoItem;