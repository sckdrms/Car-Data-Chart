//server.js

const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const DB_CONFIG = require('./key');

const app = express();
const port = 3001;
app.use(bodyParser.json());
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
    const [rows, fields] = await promisePool.query("SELECT * FROM `junshqpf1@naver.com`");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error while fetching car data');
  }
});

app.post('/api/signup', async (req, res) => {
  const { email, password, name, phone, sex, birth, vehicleNum } = req.body;
  try {
    const [userByEmail] = await promisePool.query('SELECT * FROM user WHERE user_ID = ?', [email]);
    if (userByEmail.length > 0) {
      return res.status(409).json({ message: '이미 가입된 ID 입니다.' });
    }

    const [userByPhone] = await promisePool.query('SELECT * FROM user WHERE user_Phone_Num = ?', [phone]);
    if (userByPhone.length > 0) {
      return res.status(409).json({ message: '이미 가입된 번호 입니다.' });
    }

    const [userByVehicleNum] = await promisePool.query('SELECT * FROM user WHERE user_Vehicle_Num = ?', [vehicleNum]);
    if (userByVehicleNum.length > 0) {
      return res.status(409).json({ message: '이미 사용중인 차량번호 입니다..' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await promisePool.query('INSERT INTO user (user_ID, user_PW, user_Name, user_Phone_Num, user_Sex, user_birth, user_Vehicle_Num) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [email, hashedPassword, name, phone, sex, birth, vehicleNum]);
    res.status(201).json({ message: '회원가입이 완료되었습니다!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '회원가입에 실패하였습니다.' });
  }
});




// Node.js Express 서버 예시
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await promisePool.query('SELECT * FROM user WHERE user_ID = ?', [email]);
    if (users.length === 0) {
      res.status(404).send('User not found');
    } else {
      const user = users[0];
      const isValid = await bcrypt.compare(password, user.user_PW);
      if (isValid) {
        res.status(201).json({ message: '로그인 완료', username: user.user_ID }); // 사용자 ID 포함하여 응답
      } else {
        res.status(401).json({ message: '로그인에 실패하였습니다.' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in');
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
