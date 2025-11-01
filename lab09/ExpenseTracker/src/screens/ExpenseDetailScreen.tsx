// src/screens/ExpenseDetailScreen.tsx
import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity, // Dùng để tạo nút Thu/Chi
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addExpense } from '../db/database'; // Import hàm addExpense
import { ExpenseType } from '../types/expense'; // Import kiểu

type ExpenseDetailScreenRouteProp = RouteProp<RootStackParamList, 'ExpenseDetailScreen'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ExpenseDetailScreen = () => {
  const route = useRoute<ExpenseDetailScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  
  const expenseId = route.params?.expenseId;
  const isEditing = expenseId !== undefined;

  // State cho việc nhập liệu
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<ExpenseType>('chi'); // Mặc định là 'chi'

  // useRef cho việc clear input (Câu 3d)
  const titleRef = useRef<TextInput>(null);
  const amountRef = useRef<TextInput>(null);

  // Xử lý khi nhấn nút "Save"
  const handleSave = () => {
    // Validate dữ liệu
    const parsedAmount = parseFloat(amount);
    if (title.trim() === '' || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập Tiêu đề và Số tiền hợp lệ.');
      return;
    }

    // Câu 3c: Gọi function Add
    addExpense({ title, amount: parsedAmount, type });

    // Câu 3d: Clear nội dung (dùng useRef)
    titleRef.current?.clear();
    amountRef.current?.clear();
    
    // Reset state
    setTitle('');
    setAmount('');
    setType('chi');

    // Quay lại màn hình chính
    navigation.goBack();
  };

  // Cập nhật Header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Chỉnh sửa' : 'Thêm mới',
      // Câu 3b & 3c: Có nút "Save"
      headerRight: () => (
        <Button
          title="Save"
          onPress={handleSave} // Tạm thời chỉ xử lý Add
        />
      ),
    });
  }, [navigation, isEditing, title, amount, type]); // Thêm state vào dependency

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
        {/* Bộ chọn Thu / Chi */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'chi' && styles.typeButtonActive]}
            onPress={() => setType('chi')}
          >
            <Text style={[styles.typeText, type === 'chi' && styles.typeTextActive]}>Chi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'thu' && styles.typeButtonActive]}
            onPress={() => setType('thu')}
          >
            <Text style={[styles.typeText, type === 'thu' && styles.typeTextActive]}>Thu</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          ref={titleRef} // Gán ref
          style={styles.input}
          placeholder="Tiêu đề (ví dụ: Ăn tối)"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          ref={amountRef} // Gán ref
          style={styles.input}
          placeholder="Số tiền (ví dụ: 150000)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric" // Bàn phím số
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoiding: {
    flex: 1,
    padding: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
  },
  typeText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  typeTextActive: {
    color: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
  },
});

export default ExpenseDetailScreen;