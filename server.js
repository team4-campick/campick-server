const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const salePostRoutes = require("./routes/salePostRoutes.js");
const myPageRoute = require("./routes/myPageRoute");
require("dotenv").config();

const app = express();
const port = process.env.PORT_NUM;
const connectUri = process.env.DB_KEYS;
const clientPort = process.env.CLIENT_PORT_NUM;
app.use(cors({ credentials: true, origin: `http://localhost:${clientPort}` }));
app.use(express.json());
app.use("/", myPageRoute);
app.use("/api/sale-posts", salePostRoutes);

mongoose.connect(connectUri);

app.get("/", async (req, res) => res.json("Hello World!"));

app.listen(port, () => console.log(`${port}번에서 돌아감`));
