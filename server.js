//server.js

const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const DB_CONFIG = require('./key');

const app = express();
const port = 3001;

const pool = mysql.createPool({
  ...DB_CONFIG,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

const buildPath = path.join(__dirname, 'chart/build');
app.use(express.static(buildPath));

// API 라우트를 먼저 정의합니다.
app.get('/car-data', async (req, res) => {
  try {
    const [rows, fields] = await promisePool.query("SELECT * FROM GM_Spark_data1");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error while fetching car data');
  }
});

// 다른 모든 GET 요청을 처리하는 라우트를 정의합니다.
// 이것은 API 라우트 뒤에 있어야 합니다.
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
