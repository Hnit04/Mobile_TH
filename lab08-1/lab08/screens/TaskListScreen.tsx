"use client"

import { JSX, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  ListRenderItem,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

// ----------------------------------------------------------------------
// Định nghĩa Kiểu Dữ liệu (Typings)
// ----------------------------------------------------------------------

// 1. Định nghĩa kiểu cho đối tượng Task
interface Task {
  id: string
  title: string
  completed: boolean
}

// 2. Định nghĩa RootStackParamList (Sử dụng cấu trúc từ ManageTaskScreen.tsx)
export type RootStackParamList = {
  ManageTask: undefined
  TaskList: { userName: string } // Màn hình hiện tại nhận userName
  AddEditTask: {
    mode: "add" | "edit"
    task?: Task
    userName?: string
    onAddTask?: (title: string) => void
    onEditTask?: (id: string, newTitle: string) => void
  }
}

// 3. Định nghĩa kiểu props cho màn hình này
type TaskListScreenProps = NativeStackScreenProps<RootStackParamList, "TaskList">

// ----------------------------------------------------------------------
// Dữ liệu Mặc định
// ----------------------------------------------------------------------

const DEFAULT_TASKS: Task[] = [
  { id: "1", title: "To check email", completed: true },
  { id: "2", title: "UI task web page", completed: true },
  { id: "3", title: "Learn javascript basic", completed: true },
  { id: "4", title: "Learn HTML Advance", completed: true },
  { id: "5", title: "Medical App UI", completed: true },
  { id: "6", title: "Learn Java", completed: true },
]

// ----------------------------------------------------------------------
// Component TaskListScreen (Đã dùng TypeScript)
// ----------------------------------------------------------------------

export default function TaskListScreen({ navigation, route }: TaskListScreenProps): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS)
  const [searchQuery, setSearchQuery] = useState<string>("")
  
  // Lấy userName từ route params với fallback an toàn
  const userName = route.params?.userName || "Twinkle"

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddTask = (): void => {
    navigation.navigate("AddEditTask", {
      mode: "add",
      userName: userName,
      onAddTask: (jobTitle: string) => {
        // Tạo ID mới dựa trên thời gian để đảm bảo tính duy nhất hơn
        const newId = Date.now().toString();
        const newTask: Task = {
          id: newId,
          title: jobTitle,
          completed: false,
        }
        setTasks((prevTasks) => [...prevTasks, newTask])
      },
    })
  }

  const handleEditTask = (taskId: string): void => {
    const taskToEdit = tasks.find((t) => t.id === taskId)
    if (taskToEdit) {
      navigation.navigate("AddEditTask", {
        mode: "edit",
        task: taskToEdit,
        userName: userName,
        onEditTask: (id: string, newTitle: string) => {
          setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
          )
        },
      })
    }
  }

  // Hàm toggle completed state (bổ sung thêm logic này)
  const handleToggleCompleted = (taskId: string): void => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    )
  }

  const renderTaskItem: ListRenderItem<Task> = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskContent}>
        {/* Toggle Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => handleToggleCompleted(item.id)}
        >
          <MaterialCommunityIcons
            name={item.completed ? "check-circle" : "checkbox-blank-circle-outline"}
            size={24}
            color={item.completed ? "#4CAF50" : "#999"}
          />
        </TouchableOpacity>
        
        {/* Task Title */}
        <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}>
          {item.title}
        </Text>
      </View>
      
      {/* Edit Button */}
      <TouchableOpacity style={styles.editButton} onPress={() => handleEditTask(item.id)}>
        <MaterialCommunityIcons name="pencil" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button and Profile */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.profileSection}>
          <Image source={{ uri: "https://via.placeholder.com/50" }} style={styles.avatar} />
          <View style={styles.profileText}>
            <Text style={styles.greeting}>Hi {userName}</Text>
            {/* Sửa lỗi chính tả từ JS gốc: 'Have agrate day a head' -> 'Have a great day ahead' */}
            <Text style={styles.subtitle}>Have a great day ahead</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tasks List */}
      <FlatList<Task> // Gán kiểu Task cho FlatList
        data={filteredTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
        style={styles.tasksList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="emoticon-happy-outline" size={48} color="#999" />
            <Text style={styles.emptyText}>You have no tasks! Tap '+' to add one.</Text>
          </View>
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddTask} activeOpacity={0.8}>
        <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

// ----------------------------------------------------------------------
// Stylesheet
// ----------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  profileSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#E0E0E0",
  },
  profileText: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  subtitle: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: "#000",
  },
  tasksList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  taskContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxContainer: {
    marginRight: 12,
    padding: 4, // Tăng diện tích chạm (touch target)
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})
