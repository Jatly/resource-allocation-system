const express = require("express");
const rt = require("./routes/rt");
const app = express();

app.use(express.json());
app.use("/", rt);

module.exports = app;
