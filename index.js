const express = require("express");
const app = express();
const port = 8000;

const cors = require("cors");
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", async (req, res) => {
  res.json("Hello World!");
});

app.listen(port, () => {
  console.log("8000번에서 돌아감");
});
