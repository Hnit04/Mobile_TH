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

interface TodoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  // (Chúng ta sẽ thêm 'initialTodo' ở Câu 6 để Sửa)
}

const TodoModal: React.FC<TodoModalProps> = ({ visible, onClose, onSave }) => {
  const [title, setTitle] = useState('');

  const handleSave = () => {
    // Câu 4b: Validate: title không rỗng
    if (title.trim() === '') {
      Alert.alert('Lỗi', 'Tiêu đề không được để trống.');
      return;
    }
    
    onSave(title); // Gửi title ra App.tsx
    setTitle(''); // Xóa text
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true} // Nền trong suốt
      onRequestClose={onClose}
    >
      {/* KeyboardAvoidingView để bàn phím không che mất input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        {/* Lớp nền mờ */}
        <View style={styles.modalBackdrop}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Thêm công việc mới</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nhập tiêu đề công việc..."
              value={title}
              onChangeText={setTitle}
              autoFocus={true} // Tự động focus vào input khi mở
            />
            
            <View style={styles.buttonContainer}>
              <Button title="Hủy" onPress={onClose} color="#888" />
              <Button title="Lưu" onPress={handleSave} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center', // Đẩy modal ra giữa
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ
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