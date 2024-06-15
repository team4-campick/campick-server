const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT_NUM;

app.use(cors({ credentials: true, origin: `http://localhost:${port}` }));
app.use(express.json());

app.get('/', async (req, res) => res.json('Hello World!'));

app.listen(port, () => console.log(`${port}번에서 돌아감`));
