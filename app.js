//Dependendies
const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
var cors = require("cors");
require("dotenv").config();

//Scafolding
const AuthRoute = require("./Routes/Auth.route");
const DBRoute = require("./Routes/DB.routes");

// const { verifyAccessToken } = require("./helpers/jwt_helper");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
  res.send("api is working");
});

app.use("/auth", AuthRoute);
app.use("/db", DBRoute);

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      status: error.status || 500,
      message: error.message,
    },
  });
});

// app.listen();
app.listen(3000, () => {
  console.log("listening on port 3000");
});
