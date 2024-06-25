const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const salePostRoutes = require("./routes/salePostRoutes");
const myPageRoute = require("./routes/myPageRoute");
const authRoutes = require("./routes/authRoutes");

// register test area
const testRegisterRoute = require("./routes/testRegisterRoute");

const db = require('./db/connectDB');
require('dotenv').config();

const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
require('dotenv').config();

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT_NUM;

const clientPort = process.env.CLIENT_PORT_NUM;
app.use(cors({ credentials: true, origin: `http://localhost:${clientPort}` }));
app.use(express.json());
app.use("/api/sale-posts", salePostRoutes);

// register test area
app.use("/", testRegisterRoute);

app.use("/", myPageRoute);

db.connectDB();

app.get("/", async (req, res) => res.json("Hello World!"));

// 아래 코드는 controller 혹은 service 단에 들어가야합니다.
// if (username && password && nickname) {
//   res.json({ id: 1, message: '회원가입 성공' });
// } else {
//   res.status(400).json({ message: '회원가입 실패: 필수 항목을 입력하세요.' });
// }

// 라우터 설정
const registerRouter = require("./routes/register");
app.use("/register", registerRouter);
app.use("/", authRoutes);
app.use("/auth", authRoutes);

// 미들웨어 설정용
app.use(bodyParser.json());

app.listen(port, () => console.log(`${port}번에서 돌아감`));
