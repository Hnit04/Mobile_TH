// src/screens/HomeScreen.tsx
import React, { useLayoutEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  FlatList,
  Button,
  View,
  Text,
  Alert,
  TextInput,
  RefreshControl,
  TouchableOpacity, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import ExpenseItem from '../components/ExpenseItem';
import { Expense, ExpenseType } from '../types/expense'; 
import { softDeleteExpense, getAndFilterExpenses } from '../db/database'; 

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;
type FilterType = 'tat_ca' | 'thu' | 'chi';

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const [filter, setFilter] = useState<FilterType>('tat_ca');


  const loadExpenses = useCallback(() => {
    console.log(`Loading expenses (filter: ${filter}, query: ${searchQuery})...`);

    const data = getAndFilterExpenses(searchQuery, filter);
    setExpenses(data);
  }, [searchQuery, filter]);


  useFocusEffect(loadExpenses);

  const onRefresh = useCallback(() => {
    console.log('Refreshing expenses...');
    setRefreshing(true);
    loadExpenses();
    setRefreshing(false);
  }, [loadExpenses]);

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
            loadExpenses();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <TextInput
        style={styles.searchBar}
        placeholder="Tìm kiếm theo tiêu đề..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'tat_ca' && styles.filterButtonActive]}
          onPress={() => setFilter('tat_ca')}
        >
          <Text style={[styles.filterText, filter === 'tat_ca' && styles.filterTextActive]}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'thu' && styles.filterButtonActive]}
          onPress={() => setFilter('thu')}
        >
          <Text style={[styles.filterText, filter === 'thu' && styles.filterTextActive]}>Thu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'chi' && styles.filterButtonActive]}
          onPress={() => setFilter('chi')}
        >
          <Text style={[styles.filterText, filter === 'chi' && styles.filterTextActive]}>Chi</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    marginHorizontal: 16,
    backgroundColor: '#e4e4e7',
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#fff',
    elevation: 1,
    shadowOpacity: 0.1,
  },
  filterText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#007AFF',
    fontWeight: '700',
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