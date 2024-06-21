const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const myPageRoute = require("./routes/myPageRoute");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT_NUM;
const connectUri = process.env.DB_KEYS;
const clientPort = process.env.CLIENT_PORT_NUM;
app.use(cors({ credentials: true, origin: `http://localhost:${clientPort}` }));
app.use(express.json());
app.use("/", myPageRoute);
app.use("/api/sale-posts", salePostRoutes);

app.use("/", myPageRoute);
mongoose.connect(connectUri);

app.get("/", async (req, res) => res.json("Hello World!"));

if (username && password && nickname) {
  res.json({ id: 1, message: "회원가입 성공" });
} else {
  res.status(400).json({ message: "회원가입 실패: 필수 항목을 입력하세요." });
}

// 라우터 설정
const registerRouter = require("./routes/register");
app.use("/register", registerRouter);

app.listen(port, () => console.log(`${port}번에서 돌아감`));
