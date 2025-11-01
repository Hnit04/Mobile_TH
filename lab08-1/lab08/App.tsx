import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React, { JSX } from 'react'
import {
  // Đã xóa các import không cần thiết cho tệp App.tsx (chỉ là tệp điều hướng)
  StyleSheet,
  View,
} from 'react-native'

// Import các Components/Screens
import ManageTaskScreen from "./screens/ManageTaskScreen"
import TaskListScreen from "./screens/TaskListScreen"
import AddEditTaskScreen from './screens/AddEditTaskScreen'

// --- Khai báo kiểu dữ liệu cho Task (Đồng bộ hóa với TaskListScreen.tsx) ---
interface Task {
  id: string
  title: string
  completed: boolean
}

// --- Khai báo kiểu dữ liệu cho Navigation Stack ---
// Cập nhật để phản ánh các tham số thực tế mà các màn hình cần.
export type RootStackParamList = {
  ManageTask: undefined // Màn hình đầu tiên không cần params
  TaskList: { userName: string } // Nhận userName từ ManageTaskScreen
  AddEditTask: { 
    mode: "add" | "edit"; // Chế độ thêm hoặc sửa
    task?: Task; // Task object nếu edit
    userName?: string; // Tên người dùng
    onAddTask?: (title: string) => void; // Callback khi thêm
    onEditTask?: (id: string, newTitle: string) => void; // Callback khi sửa
  };
};

// 2. Tạo Stack Navigator với kiểu dữ liệu đã định nghĩa
const Stack = createNativeStackNavigator<RootStackParamList>()

// --- Component Chính (App.tsx) ---
export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ManageTask"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="ManageTask" component={ManageTaskScreen} />
        <Stack.Screen name="TaskList" component={TaskListScreen} />
        {/* Đảm bảo AddEditTaskScreen đã được export default */}
        <Stack.Screen name="AddEditTask" component={AddEditTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// --- Placeholder cho Card và Stylesheet đã bị loại bỏ vì không cần thiết trong tệp điều hướng ---
// Các kiểu này nên nằm trong các tệp màn hình tương ứng.
// Tuy nhiên, nếu bạn muốn giữ lại Stylesheet để tránh lỗi biên dịch, 
// tôi sẽ giữ lại nó với nội dung rỗng.

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
