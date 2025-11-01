// src/components/ExpenseItem.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Expense } from '../types/expense';
import dayjs from 'dayjs';

// Định nghĩa props cho component
interface ExpenseItemProps {
  item: Expense;
  onPress: () => void;      // Xử lý khi nhấn (Câu 4)
  onLongPress: () => void; // Xử lý khi nhấn giữ (Câu 5)
}

// Hàm format số tiền (ví dụ: 1000000 -> 1,000,000)
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('vi-VN'); // Format theo kiểu Việt Nam
};

const ExpenseItem: React.FC<ExpenseItemProps> = ({ item, onPress, onLongPress }) => {
  // Câu 2c: Format ngày tháng
  const formattedDate = dayjs(item.date).format('HH:mm - DD/MM/YYYY');
  
  // Câu 2b & 2d: Format số tiền và xác định màu sắc
  const isIncome = item.type === 'thu';
  const amountText = `${isIncome ? '+' : '-'}${formatCurrency(item.amount)} ₫`;
  const amountColor = isIncome ? '#28a745' : '#dc3545'; // Xanh lá (thu) / Đỏ (chi)

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.leftColumn}>
        {/* Câu 2a: Tên khoản chi */}
        <Text style={styles.title}>{item.title}</Text>
        
        {/* Câu 2c: Ngày tháng */}
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <View style={styles.rightColumn}>
        {/* Câu 2b & 2d: Số tiền và Loại */}
        <Text style={[styles.amount, { color: amountColor }]}>{amountText}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftColumn: {
    flex: 1,
    marginRight: 12,
  },
  rightColumn: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExpenseItem;