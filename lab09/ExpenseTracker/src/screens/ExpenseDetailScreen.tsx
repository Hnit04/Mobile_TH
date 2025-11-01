// src/screens/ExpenseDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

// Lấy kiểu dữ liệu của route
type ExpenseDetailScreenRouteProp = RouteProp<RootStackParamList, 'ExpenseDetailScreen'>;

const ExpenseDetailScreen = () => {
  // Lấy thông tin route (để biết có expenseId hay không)
  const route = useRoute<ExpenseDetailScreenRouteProp>();
  const expenseId = route.params?.expenseId;

  // Kiểm tra xem đây là màn hình thêm mới hay chỉnh sửa
  const isEditing = expenseId !== undefined;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Text style={styles.title}>
        {isEditing ? `Chỉnh sửa (ID: ${expenseId})` : 'Thêm khoản Thu/Chi Mới'}
      </Text>
      {/* Các ô TextInput và nút "Save" sẽ được thêm ở Câu 3 và 4 */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ExpenseDetailScreen;