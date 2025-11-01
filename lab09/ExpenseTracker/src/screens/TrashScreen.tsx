// src/screens/TrashScreen.tsx
import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import ExpenseItem from '../components/ExpenseItem';
import { Expense } from '../types/expense';
import { getDeletedExpenses } from '../db/database'; // Import hàm lấy note đã xóa

const TrashScreen = () => {
  const [deletedExpenses, setDeletedExpenses] = useState<Expense[]>([]);

  // Hàm tải danh sách notes đã xóa
  const loadDeletedExpenses = useCallback(() => {
    console.log('Loading deleted expenses...');
    const data = getDeletedExpenses();
    setDeletedExpenses(data);
  }, []);

  // Tự động load lại notes mỗi khi màn hình này được focus
  useFocusEffect(loadDeletedExpenses);

  // Xử lý khi nhấn giữ (Chuẩn bị cho Câu 8 - Restore)
  const handleLongPress = (id: number) => {
    console.log('Restore menu for expense:', id);
    // Logic cho Câu 8 sẽ ở đây
    Alert.alert('Khôi phục', 'Bạn có muốn khôi phục khoản này? (Chức năng Câu 8)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={deletedExpenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExpenseItem
            item={item}
            onPress={() => {
              // Không cho phép sửa item đã xóa
              Alert.alert('Thông báo', 'Bạn không thể sửa khoản đã xóa.');
            }}
            onLongPress={() => {
              // Câu 8: Khôi phục
              handleLongPress(item.id);
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Thùng rác trống.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default TrashScreen;