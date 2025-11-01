// src/screens/TrashScreen.tsx
import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList, Text, View, Alert, TextInput } from 'react-native'; // Import TextInput
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import ExpenseItem from '../components/ExpenseItem';
import { Expense } from '../types/expense';
// Import thêm hàm search
import { getDeletedExpenses, searchDeletedExpenses } from '../db/database'; 

const TrashScreen = () => {
  const [deletedExpenses, setDeletedExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); // State cho tìm kiếm

  // Hàm tải danh sách notes đã xóa
  const loadDeletedExpenses = useCallback(() => {
    console.log('Loading deleted expenses...');
    // Câu 6b: Dùng hàm search nếu có query
    const data = searchQuery
      ? searchDeletedExpenses(searchQuery)
      : getDeletedExpenses();
    setDeletedExpenses(data);
  }, [searchQuery]); // Thêm searchQuery làm dependency

  // Tự động load lại notes mỗi khi màn hình này được focus
  useFocusEffect(loadDeletedExpenses);

  // Xử lý khi nhấn giữ (Chuẩn bị cho Câu 8)
  const handleLongPress = (id: number) => {
    console.log('Restore menu for expense:', id);
    Alert.alert('Khôi phục', 'Bạn có muốn khôi phục khoản này? (Chức năng Câu 8)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/* Câu 6b: Thêm tính năng tìm kiếm */}
      <TextInput
        style={styles.searchBar}
        placeholder="Tìm kiếm trong thùng rác..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={deletedExpenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExpenseItem
            item={item}
            onPress={() => {
              Alert.alert('Thông báo', 'Bạn không thể sửa khoản đã xóa.');
            }}
            onLongPress={() => {
              handleLongPress(item.id);
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Thùng rác trống hoặc không tìm thấy.</Text>
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
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
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