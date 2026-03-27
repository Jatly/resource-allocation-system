const express = require("express");
const rt = require("./routes/rt");
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(cors())
app.use("/", rt);

module.exports = app;
