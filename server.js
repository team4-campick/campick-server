const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const salePostRoutes = require('./routes/salePostRoutes');
const myPageRoute = require('./routes/myPageRoute');
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
const connectUri = process.env.DB_KEYS;
const clientPort = process.env.CLIENT_PORT_NUM;
app.use(cors({ credentials: true, origin: `http://localhost:${clientPort}` }));
app.use(express.json());
app.use('/api/sale-posts', salePostRoutes);

app.use('/', myPageRoute);
mongoose.connect(connectUri);

app.get('/', async (req, res) => res.json('Hello World!'));

// 아래 코드는 controller 혹은 service 단에 들어가야합니다.
// if (username && password && nickname) {
//   res.json({ id: 1, message: '회원가입 성공' });
// } else {
//   res.status(400).json({ message: '회원가입 실패: 필수 항목을 입력하세요.' });
// }

// 라우터 설정
const registerRouter = require('./routes/register');
app.use('/register', registerRouter);

app.listen(port, () => console.log(`${port}번에서 돌아감`));
