// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View, StyleSheet } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import ExpenseDetailScreen from './src/screens/ExpenseDetailScreen';
import TrashScreen from './src/screens/TrashScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import SyncScreen from './src/screens/SyncScreen';

import { RootStackParamList } from './src/types/navigation';
import { initDatabase } from './src/db/database';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    
    try {
      initDatabase();
      setDbInitialized(true);
      console.log('Database ready!');
    } catch (err) {
      console.error('Database initialization failed: ', err);
    }
  }, []);

  if (!dbInitialized) {
   
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <Text>Loading Database...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f8f8f8',
            },
            headerTintColor: '#333',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ title: 'EXPENSE TRACKER' }} 
          />
          <Stack.Screen
            name="ExpenseDetailScreen"
            component={ExpenseDetailScreen}
            options={{ title: 'Chi tiết' }}
          />
          <Stack.Screen
            name="TrashScreen"
            component={TrashScreen}
            options={{ title: 'Thùng rác' }}
          />
          <Stack.Screen
            name="StatisticsScreen"
            component={StatisticsScreen}
            options={{ title: 'Thống kê' }}
          />
          <Stack.Screen
            name="SyncScreen"
            component={SyncScreen}
            options={{ title: 'Đồng bộ' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});