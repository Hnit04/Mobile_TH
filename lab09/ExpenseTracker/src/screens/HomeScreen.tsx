// src/screens/HomeScreen.tsx
import React, { useLayoutEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, Button, View, Text } from 'react-native'; // Import Text
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import ExpenseItem from '../components/ExpenseItem';
import { Expense } from '../types/expense';
import { getAllExpenses } from '../db/database'; // Import hàm lấy từ DB

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

// Bỏ MOCK_EXPENSES

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // State để lưu danh sách thật
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Hàm tải danh sách từ DB
  const loadExpenses = () => {
    console.log('Loading expenses from DB...');
    const data = getAllExpenses(); // Lấy dữ liệu thật
    setExpenses(data);
  };

  // Tự động load lại mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  // Thêm các nút điều hướng vào header (đã làm ở Câu 1)
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

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={expenses} // Sử dụng dữ liệu thật từ state
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExpenseItem
            item={item}
            onPress={() => {
              // Câu 4a:
              navigation.navigate('ExpenseDetailScreen', { expenseId: item.id });
            }}
            onLongPress={() => {
              // Câu 5a:
              console.log('Long pressed on expense:', item.id);
            }}
          />
        )}
        // Hiển thị thông báo nếu không có dữ liệu
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có khoản thu/chi nào.</Text>
            <Text style={styles.emptyText}>Nhấn "Add" để thêm mới.</Text>
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