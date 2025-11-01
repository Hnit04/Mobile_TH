// src/screens/ExpenseDetailScreen.tsx
import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'; // Import thêm useEffect
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addExpense, getExpenseById, updateExpense } from '../db/database';
import { ExpenseType } from '../types/expense';

type ExpenseDetailScreenRouteProp = RouteProp<RootStackParamList, 'ExpenseDetailScreen'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ExpenseDetailScreen = () => {
  const route = useRoute<ExpenseDetailScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  
  const expenseId = route.params?.expenseId;
  const isEditing = expenseId !== undefined;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<ExpenseType>('chi');

  const titleRef = useRef<TextInput>(null);
  const amountRef = useRef<TextInput>(null);


  useEffect(() => {
    if (isEditing) {
      const expense = getExpenseById(expenseId);
      if (expense) {
        setTitle(expense.title);
        setAmount(expense.amount.toString()); 
        setType(expense.type);
      }
    }
  }, [expenseId, isEditing]); 

  const handleAdd = () => {
    const parsedAmount = parseFloat(amount);
    if (title.trim() === '' || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập Tiêu đề và Số tiền hợp lệ.');
      return;
    }

    addExpense({ title, amount: parsedAmount, type });

    titleRef.current?.clear();
    amountRef.current?.clear();
    setTitle('');
    setAmount('');
    setType('chi');

    navigation.goBack();
  };

  const handleUpdate = () => {
    const parsedAmount = parseFloat(amount);
    if (title.trim() === '' || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập Tiêu đề và Số tiền hợp lệ.');
      return;
    }
    

    updateExpense(expenseId!, { title, amount: parsedAmount, type });
    
    // Quay lại màn hình chính
    navigation.goBack();
  };

  // Cập nhật Header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Chỉnh sửa' : 'Thêm mới',
      headerRight: () => (
        <Button
          title="Save"

          onPress={isEditing ? handleUpdate : handleAdd}
        />
      ),
    });
  }, [navigation, isEditing, title, amount, type, handleUpdate, handleAdd]); // Cập nhật dependencies

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
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
          ref={titleRef}
          style={styles.input}
          placeholder="Tiêu đề (ví dụ: Ăn tối)"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          ref={amountRef}
          style={styles.input}
          placeholder="Số tiền (ví dụ: 150000)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
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