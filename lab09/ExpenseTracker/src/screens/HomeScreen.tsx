// src/screens/HomeScreen.tsx
import React, { useLayoutEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, Button, View, Text, Alert, TextInput } from 'react-native'; // Import TextInput
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import ExpenseItem from '../components/ExpenseItem';
import { Expense } from '../types/expense';
// Import thêm hàm search
import { getAllExpenses, softDeleteExpense, searchActiveExpenses } from '../db/database'; 

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); // State cho tìm kiếm

  // Hàm tải danh sách
  const loadExpenses = useCallback(() => {
    console.log('Loading active expenses...');
    // Câu 6a: Dùng hàm search nếu có query
    const data = searchQuery
      ? searchActiveExpenses(searchQuery)
      : getAllExpenses();
    setExpenses(data);
  }, [searchQuery]); // Thêm searchQuery làm dependency

  // Tự động load lại mỗi khi màn hình được focus (hoặc query thay đổi)
  useFocusEffect(loadExpenses);

  // Header (giữ nguyên)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Add"
          onPress={() => navigation.navigate('ExpenseDetailScreen', {})}
        />
      ),
      headerLeft: () => (
         <View style={styles.headerLeftButtons}>
            <Button title="Trash" onPress={() => navigation.navigate('TrashScreen')} />
            <Button title="Stats" onPress={() => navigation.navigate('StatisticsScreen')} />
            <Button title="Sync" onPress={() => navigation.navigate('SyncScreen')} />
         </View>
      )
    });
  }, [navigation]);

  // Xử lý nhấn giữ (Câu 5)
  const handleLongPress = (id: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa khoản thu/chi này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            softDeleteExpense(id);
            loadExpenses(); // Tải lại danh sách
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/* Câu 6a: Thêm tính năng tìm kiếm */}
      <TextInput
        style={styles.searchBar}
        placeholder="Tìm kiếm theo tiêu đề..."
        value={searchQuery}
        onChangeText={setSearchQuery} // Cập nhật state khi gõ
      />
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExpenseItem
            item={item}
            onPress={() => {
              navigation.navigate('ExpenseDetailScreen', { expenseId: item.id });
            }}
            onLongPress={() => {
              handleLongPress(item.id);
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy kết quả.</Text>
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
  headerLeftButtons: {
      flexDirection: 'row',
      gap: 8,
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

export default HomeScreen;