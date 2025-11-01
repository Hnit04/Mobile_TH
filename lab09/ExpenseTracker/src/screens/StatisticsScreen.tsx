// src/screens/StatisticsScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { StackedBarChart } from 'react-native-chart-kit'; 
import { getMonthlyStats, MonthlyStat } from '../db/database';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0, 
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
  },
};

const StatisticsScreen = () => {
  const [stats, setStats] = useState<MonthlyStat[]>([]);

  const loadStats = useCallback(() => {
    console.log('Loading stats...');
    const data = getMonthlyStats();
    setStats(data);
  }, []);

  useFocusEffect(loadStats);

  const chartData = {
    labels: stats.map(s => s.month.substring(5)).reverse(), 
    legend: ['Tổng Thu', 'Tổng Chi'], 
    data: stats.map(s => [s.totalThu, s.totalChi]).reverse(), 
    barColors: ['#28a745', '#dc3545'],
  };

  const totalIncome = stats.reduce((sum, s) => sum + s.totalThu, 0);
  const totalExpense = stats.reduce((sum, s) => sum + s.totalChi, 0);
  const balance = totalIncome - totalExpense;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView>
        {stats.length > 0 ? (
          <>
            <Text style={styles.header}>Thống kê Thu/Chi theo tháng</Text>
            
            <StackedBarChart
              data={chartData}
              width={screenWidth - 32}
              height={250}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix=" ₫"
              fromZero={true}
              hideLegend={true} 
            />

            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColorBox, { backgroundColor: '#28a745' }]} />
                    <Text style={styles.legendText}>Tổng Thu</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColorBox, { backgroundColor: '#dc3545' }]} />
                    <Text style={styles.legendText}>Tổng Chi</Text>
                </View>
            </View>


            <Text style={styles.header}>Tổng quan</Text>
            <View style={styles.summaryContainer}>

              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Tổng Thu</Text>
                <Text style={[styles.summaryValue, styles.income]}>
                  {totalIncome.toLocaleString('vi-VN')} ₫
                </Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Tổng Chi</Text>
                <Text style={[styles.summaryValue, styles.expense]}>
                  {totalExpense.toLocaleString('vi-VN')} ₫
                </Text>
              </View>
              <View style={[styles.summaryBox, styles.balanceBox]}>
                <Text style={styles.summaryLabel}>Số dư</Text>
                <Text style={[styles.summaryValue, balance >= 0 ? styles.income : styles.expense]}>
                  {balance.toLocaleString('vi-VN')} ₫
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có dữ liệu để thống kê.</Text>
            <Text style={styles.emptyText}>Hãy thêm vài khoản thu/chi.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ... (styles giữ nguyên)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  legendContainer: { 
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: -5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColorBox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: '#555',
  },
  summaryContainer: {
    marginHorizontal: 16,
  },
  summaryBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  balanceBox: {
     backgroundColor: '#f8f9fa',
     borderWidth: 1,
     borderColor: '#ddd'
  },
  summaryLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  income: {
    color: '#28a745',
  },
  expense: {
    color: '#dc3545',
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

export default StatisticsScreen;