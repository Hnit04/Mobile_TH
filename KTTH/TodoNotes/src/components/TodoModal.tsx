// src/components/TodoModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Todo } from '../types/todo'; // Import Todo

interface TodoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, id?: number) => void; // onSave giờ có thể nhận id
  initialTodo: Todo | null; // Nhận todo đang sửa
}

const TodoModal: React.FC<TodoModalProps> = ({ visible, onClose, onSave, initialTodo }) => {
  const [title, setTitle] = useState('');
  
  // Xác định xem đây là Sửa hay Thêm
  const isEditing = initialTodo !== null;

  // Tự động điền title khi 'initialTodo' thay đổi
  useEffect(() => {
    if (isEditing) {
      setTitle(initialTodo.title);
    } else {
      // Nếu là thêm mới, đảm bảo title trống
      setTitle('');
    }
  }, [initialTodo, visible]); // Chạy lại khi modal mở

  const handleSave = () => {
    if (title.trim() === '') {
      Alert.alert('Lỗi', 'Tiêu đề không được để trống.');
      return;
    }
    
    // Nếu đang sửa, gửi cả id. Nếu không, chỉ gửi title.
    onSave(title, isEditing ? initialTodo.id : undefined);
    
    // Chỉ clear title nếu là Thêm mới (nếu sửa, giữ nguyên cho lần sau)
    if (!isEditing) {
        setTitle('');
    }
  };

  const handleClose = () => {
    onClose();
    // Đảm bảo clear title khi đóng (nếu là Thêm mới)
    if (!isEditing) {
        setTitle('');
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalView}>
            {/* Tiêu đề động */}
            <Text style={styles.modalTitle}>
              {isEditing ? 'Sửa công việc' : 'Thêm công việc mới'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nhập tiêu đề công việc..."
              value={title}
              onChangeText={setTitle}
              autoFocus={true}
            />
            
            <View style={styles.buttonContainer}>
              <Button title="Hủy" onPress={handleClose} color="#888" />
              <Button title="Lưu" onPress={handleSave} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ... (styles giữ nguyên)
const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default TodoModal;