// src/screens/HomeScreen.tsx
import React, { useLayoutEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, Button, View, Text, Alert } from 'react-native'; // Import Alert
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import ExpenseItem from '../components/ExpenseItem';
import { Expense } from '../types/expense';
import { getAllExpenses, softDeleteExpense } from '../db/database'; // Import softDeleteExpense

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Hàm tải danh sách (chưa bị xóa)
  const loadExpenses = useCallback(() => {
    console.log('Loading expenses from DB...');
    const data = getAllExpenses();
    setExpenses(data);
  }, []);

  // Tự động load lại mỗi khi màn hình được focus
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

  // Mới (Câu 5): Xử lý khi nhấn giữ item
  const handleLongPress = (id: number) => {
    // Câu 5a: Xuất hiện Menu (Alert)
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa khoản thu/chi này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          // Câu 5b: Khi bấm "Xóa"
          onPress: () => {
            softDeleteExpense(id); // Gọi function soft delete
            loadExpenses(); // Tải lại danh sách
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExpenseItem
            item={item}
            onPress={() => {
              // Câu 4: Chuyển sang màn hình sửa
              navigation.navigate('ExpenseDetailScreen', { expenseId: item.id });
            }}
            onLongPress={() => {
              // Câu 5: Gọi hàm xử lý nhấn giữ
              handleLongPress(item.id);
            }}
          />
        )}
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

// ... (phần styles giữ nguyên)
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