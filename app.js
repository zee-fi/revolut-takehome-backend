
require("dotenv").config();
require("./db");

const cors = require('cors');
const express = require("express");
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Revolut-Api-Version']
  }));
app.use(express.json()); 
app.options("*", cors());

require("./config")(app);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

require("./error-handling")(app);

module.exports = app;
