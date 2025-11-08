// src/db/db.ts
import * as SQLite from 'expo-sqlite';

// Câu 1c: Mở kết nối SQLite
const db = SQLite.openDatabaseSync('todos.db');

// (Xóa 'export' ở dòng này)
const initDatabase = () => {
  try {
    // Câu 2a: Tạo bảng todos nếu chưa có
    db.execSync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done INTEGER DEFAULT 0,
        created_at INTEGER
      );
    `);
    console.log('Database and table initialized successfully.');

    // Câu 2b: (Tùy chọn) Seed 1-2 bản ghi mẫu nếu bảng trống
    const firstRun = db.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM todos'
    );

    if (firstRun?.count === 0) {
      console.log('Seeding database with initial data...');
      const now = Date.now();
      db.runSync(
        'INSERT INTO todos (title, created_at) VALUES (?, ?)',
        ['Học Lập trình thiết bị di động', now]
      );
      db.runSync(
        'INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)',
        ['Hoàn thành bài tập', 1, now - 3600000]
      );
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

// Sửa dòng export ở cuối file:
// Export cả 'db' và 'initDatabase' cùng lúc
export { db, initDatabase };