//server.js

const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const DB_CONFIG = require('./key'); // key.js 파일에서 설정 불러오기

// Express 애플리케이션 생성
const app = express();
const port = 3001; // 웹 서버 포트

// MySQL 데이터베이스 연결 설정
const pool = mysql.createPool({
  ...DB_CONFIG, // 스프레드 문법을 사용하여 DB_CONFIG 객체의 속성을 여기에 펼칩니다.
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 프로미스 방식으로 사용하기 위한 wrapper 생성
const promisePool = pool.promise();

// build 폴더를 정적 파일로 제공하는 설정
const buildPath = path.join(__dirname, 'chart/build');
app.use(express.static(buildPath));

// 루트 경로에 대한 GET 요청 처리
app.get('/', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html')); // build 폴더 안의 index.html 파일을 응답으로 보냅니다.
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


app.get('/car-data', async (req, res) => {
  try {
    const [rows, fields] = await promisePool.query("SELECT * FROM GM_Spark_data1"); // car_table_name은 실제 테이블 이름으로 변경해야 합니다.
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error while fetching car data');
  }
});