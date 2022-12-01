/**
 * ? 30/11/2022
 * ? Title -> 'Express'
 * ? Program -> 'ExpressJs'
 * ? Description -> 'Learing Express JS'
 * ? Author -> 'Abu Sayed Polin'
 */

const express = require("express");
const getURLS = require("./Box-api/box");

const app = express();

app.use(express.json());

app.all("/", (req, res) => {
  const URLS = [];
  console.log(req.body);
  getURLS(req.body, (url, total_size) => {
    URLS.push(url);
    URLS.length === total_size && res.send(URLS);
  });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
