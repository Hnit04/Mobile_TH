// src/screens/SyncScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator, // Để hiển thị loading
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios'; // Import axios
import { getAllExpenses } from '../db/database'; 

const SyncScreen = () => {
  // State lưu link API (Câu 9b)
  const [apiUrl, setApiUrl] = useState('');
  // State cho trạng thái loading
  const [isLoading, setIsLoading] = useState(false);

  // Câu 9a: Hàm xử lý khi nhấn nút "Đồng bộ"
  const handleSync = async () => {
    // 1. Kiểm tra link
    if (apiUrl.trim() === '' || !apiUrl.includes('https://')) {
      Alert.alert('Lỗi', 'Vui lòng dán link API (mockapi.io) hợp lệ.');
      return;
    }

    setIsLoading(true);

    try {
      // 2. Lấy tất cả expense đang hoạt động từ SQLite
      const localExpenses = getAllExpenses();

      // ======================================================
      // Câu 9a: Xóa toàn bộ data trong API
      // ======================================================
      console.log('Bắt đầu xóa data cũ trên API...');
      // 2.1. Lấy (GET) tất cả data cũ từ API
      const getResponse = await axios.get(apiUrl);
      const apiExpenses = getResponse.data;

      // 2.2. Tạo mảng các promise DELETE
      const deletePromises = apiExpenses.map((expense: any) =>
        axios.delete(`${apiUrl}/${expense.id}`)
      );
      // Chờ tất cả xóa xong
      await Promise.all(deletePromises);
      console.log(`Đã xóa ${apiExpenses.length} khoản cũ trên API.`);

      // ======================================================
      // Câu 9a: Copy toàn bộ thống kê (data mới) lên API
      // ======================================================
      if (localExpenses.length === 0) {
        Alert.alert('Thông báo', 'Đã xóa data API. Không có data local để đẩy lên.');
        setIsLoading(false);
        return;
      }

      console.log(`Bắt đầu đẩy ${localExpenses.length} khoản mới lên API...`);
      // 3. Tạo mảng các promise POST (đẩy data local lên)
      const postPromises = localExpenses.map((expense) => {
        // Chỉ gửi 4 trường như schema của mockapi
        const payload = {
          title: expense.title,
          amount: expense.amount,
          type: expense.type,
          date: expense.date,
        };
        return axios.post(apiUrl, payload);
      });

      // Chờ tất cả đẩy lên xong
      await Promise.all(postPromises);

      // 4. Thông báo thành công
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