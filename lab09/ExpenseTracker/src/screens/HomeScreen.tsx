// src/screens/HomeScreen.tsx
import React, { useLayoutEffect } from 'react';
import { StyleSheet, FlatList, Button, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import ExpenseItem from '../components/ExpenseItem';
import { Expense } from '../types/expense';

// Kiểu dữ liệu cho navigation prop
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

// Dữ liệu giả (mock data) để test giao diện Câu 2
const MOCK_EXPENSES: Expense[] = [
  {
    id: 1,
    title: 'Tiền lương tháng 10',
    amount: 10000000,
    type: 'thu',
    date: '2025-10-31T10:30:00.000Z',
    isDeleted: 0,
  },
  {
    id: 2,
    title: 'Ăn tối',
    amount: 150000,
    type: 'chi',
    date: '2025-10-30T19:00:00.000Z',
    isDeleted: 0,
  },
   {
    id: 3,
    title: 'Tiền nhà',
    amount: 3500000,
    type: 'chi',
    date: '2025-10-29T19:00:00.000Z',
    isDeleted: 0,
  },
];

const HomeScreen = () => {
  // Lấy navigation prop
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Câu 1d: Thêm các nút điều hướng vào header
  useLayoutEffect(() => {
    navigation.setOptions({
      // Thêm nút Add (Câu 3b)
      headerRight: () => (
        <Button
          title="Add"
          onPress={() => navigation.navigate('ExpenseDetailScreen', {})} // Chuyển sang màn hình chi tiết (thêm mới)
        />
      ),
      // Thêm các nút điều hướng khác vào bên trái
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
    // Câu 1b: Sử dụng SafeAreaView
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={MOCK_EXPENSES} // Tạm thời dùng MOCK_EXPENSES. Sẽ thay bằng DB ở Câu 3
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExpenseItem
            item={item}
            onPress={() => {
              // Xử lý khi nhấn vào (Câu 4a)
              console.log('Navigating to edit expense:', item.id);
              navigation.navigate('ExpenseDetailScreen', { expenseId: item.id });
            }}
            onLongPress={() => {
              // Xử lý khi nhấn giữ (Câu 5a)
              console.log('Long pressed on expense:', item.id);
            }}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#f5f5f5', // Màu nền cho app
  },
  headerLeftButtons: {
      flexDirection: 'row',
      gap: 8, // Khoảng cách giữa các nút (cần React Native 0.71+)
  }
});

export default HomeScreen;