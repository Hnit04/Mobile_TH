// src/screens/TrashScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import ExpenseItem from '../components/ExpenseItem';
import { Expense } from '../types/expense';
import {
  getDeletedExpenses,
  searchDeletedExpenses,
  restoreExpense,
} from '../db/database';

const TrashScreen = () => {
  const [deletedExpenses, setDeletedExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadDeletedExpenses = useCallback(() => {
    console.log('Loading deleted expenses...');
    const data = searchQuery
      ? searchDeletedExpenses(searchQuery)
      : getDeletedExpenses();
    setDeletedExpenses(data);
  }, [searchQuery]);

  useFocusEffect(loadDeletedExpenses);

  const onRefresh = useCallback(() => {
    console.log('Refreshing deleted expenses...');
    setRefreshing(true);
    loadDeletedExpenses();
    setRefreshing(false);
  }, [loadDeletedExpenses]);

  const handleLongPress = (id: number) => {
  
    Alert.alert(
      'Khôi phục khoản thu/chi',
      'Bạn có muốn khôi phục khoản này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Khôi phục',
          style: 'default', 
          onPress: () => {
            restoreExpense(id); 
            loadDeletedExpenses();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor={'#007AFF'}
          />
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