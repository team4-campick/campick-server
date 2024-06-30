const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");

const salePostRoutes = require("./routes/salePostRoutes");
const myPageRoute = require("./routes/myPageRoute");
const authRoutes = require("./routes/authRoutes");

const db = require("./db/connectDB");

const app = express();

const port = process.env.PORT_NUM;
const clientPort = process.env.CLIENT_PORT_NUM;

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors({ credentials: true, origin: `http://localhost:${clientPort}` }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/sale-posts", salePostRoutes);
app.use("/", myPageRoute);
app.use("/", authRoutes);

db.connectDB();

app.get("/", async (req, res) => res.json("Hello World!"));

app.listen(port, () => console.log(`${port}번에서 돌아감`));
