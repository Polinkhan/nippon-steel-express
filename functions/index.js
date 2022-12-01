/**
 * ? 30/11/2022
 * ? Title -> 'Express'
 * ? Program -> 'ExpressJs'
 * ? Description -> 'Learing Express JS'
 * ? Author -> 'Abu Sayed Polin'
 */

const express = require("express");
const serverless = require("serverless-http");
const getURLS = require("../Box-api/box");
const getAuth = require("../Box-api/box");

const app = express();
const router = express.Router();

app.use(express.json());

router.get("/", (req, res) => {
  const URLS = [];
  console.log(req.body);
  getURLS(req.body, (url, total_size) => {
    URLS.push(url);
    URLS.length === total_size && res.send(URLS);
  });
});

router.get("/login", (req, res) => {
  getAuth(req.body, (flag) => {
    res.send(flag);
  });
});

app.use("/.netlify/functions/index", router);

module.exports.handler = serverless(app);
