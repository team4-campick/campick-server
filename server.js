const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");
const path = require("path");
const imageRoutes = require("./routes/imageRoutes");

const salePostRoutes = require("./routes/salePostRoutes");
const myPageRoute = require("./routes/myPageRoutes");
const authRoutes = require("./routes/authRoutes");
const blogPostRoutes = require("./routes/blogPostRoutes");

const db = require("./db/connectDB");

const app = express();
require("dotenv").config();

const port = process.env.PORT_NUM || 8000;
const clientPort = process.env.CLIENT_PORT_NUM || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors({ credentials: true, origin: `http://localhost:${clientPort}` }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  "/api/images",
  express.static(path.join(__dirname, "../client/src/image/EventImage"))
);

app.use("/api", imageRoutes);
app.use("/api/sale-posts", salePostRoutes);
app.use("/api/blog-posts", blogPostRoutes);
app.use("/", myPageRoute);
app.use("/", authRoutes);

db.connectDB();

app.get("/", async (req, res) => res.json("Hello World!"));

app.listen(port, () => console.log(`${port}번에서 돌아감`));
