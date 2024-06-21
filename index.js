const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(cors());

app.post("/login", async (req, res) => {
  const { username, password, loginDate } = req.body;

  // 기존 사용자 확인 로직
  const user = await findUserByUsername(username);
  if (!user) {
    return res.json({ message: "nouser" });
  }

  const isPasswordCorrect = await checkPassword(user, password);
  if (!isPasswordCorrect) {
    return res.json({ message: "failed" });
  }

  // 로그인 날짜를 데이터베이스에 저장
  await saveLoginDate(user.id, loginDate);

  res.json({ id: user.id });
});

// 로그인 날짜를 저장하는 함수 예제
async function saveLoginDate(userId, loginDate) {
  // 실제 데이터베이스 저장 로직을 여기에 추가 (MongoDB)
  await db.query("UPDATE users SET last_login = $1 WHERE id = $2", [
    loginDate,
    userId,
  ]);
}

// 사용자 이름으로 사용자 찾기 함수 예제
async function findUserByUsername(username) {
  // 실제 사용자 찾기 로직을 여기에 추가
  return await db.query("SELECT * FROM users WHERE username = $1", [username]);
}

// 비밀번호 확인 함수 예제
async function checkPassword(user, password) {
  // 실제 비밀번호 확인 로직을 여기에 추가
  return user.password === password;
}
