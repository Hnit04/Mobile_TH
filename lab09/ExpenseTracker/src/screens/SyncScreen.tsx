// src/screens/SyncScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { getAllExpenses } from '../db/database'; 

const SyncScreen = () => {

  const [apiUrl, setApiUrl] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    if (apiUrl.trim() === '' || !apiUrl.includes('https://')) {
      Alert.alert('Lỗi', 'Vui lòng dán link API (mockapi.io) hợp lệ.');
      return;
    }

    setIsLoading(true);

    try {
      const localExpenses = getAllExpenses();

      console.log('Bắt đầu xóa data cũ trên API...');
      const getResponse = await axios.get(apiUrl);
      const apiExpenses = getResponse.data;
      const deletePromises = apiExpenses.map((expense: any) =>
        axios.delete(`${apiUrl}/${expense.id}`)
      );
      await Promise.all(deletePromises);
      console.log(`Đã xóa ${apiExpenses.length} khoản cũ trên API.`);
      if (localExpenses.length === 0) {
        Alert.alert('Thông báo', 'Đã xóa data API. Không có data local để đẩy lên.');
        setIsLoading(false);
        return;
      }
      const postPromises = localExpenses.map((expense) => {
        const payload = {
          title: expense.title,
          amount: expense.amount,
          type: expense.type,
          date: expense.date,
        };
        return axios.post(apiUrl, payload);
      });

      await Promise.all(postPromises);

      Alert.alert(
        'Thành công',
        `Đã xóa ${apiExpenses.length} khoản cũ và đồng bộ ${localExpenses.length} khoản mới lên API.`
      );
    } catch (error) {
      console.error('Lỗi đồng bộ:', error);
      Alert.alert(
        'Lỗi',
        'Đồng bộ thất bại. Vui lòng kiểm tra lại đường link API hoặc kết nối mạng.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.content}>
        <Text style={styles.label}>
          Dán link API (resource "expenses") của bạn từ mockapi.io: 
        </Text>
        <TextInput
          style={styles.input}
          placeholder="https://68e9ece8f1eeb3f856e56122.mockapi.io/expenses"
          value={apiUrl}
          onChangeText={setApiUrl}
          autoCapitalize="none"
        />
        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <Button title="XÓA và Đồng bộ Lên API" onPress={handleSync} color="#dc3545" />
        )}
         <Text style={styles.warning}>Lưu ý: Thao tác này sẽ XÓA SẠCH dữ liệu hiện có trên API trước khi tải dữ liệu mới lên.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  warning: {
      marginTop: 16,
      fontSize: 12,
      color: '#888',
      textAlign: 'center'
  }
});

export default SyncScreen;