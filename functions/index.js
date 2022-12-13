/**
 * ? 30/11/2022
 * ? Title -> 'Express'
 * ? Program -> 'ExpressJs'
 * ? Description -> 'Express JS'
 * ? Author -> 'Abu Sayed Polin'
 */

const express = require("express");
const serverless = require("serverless-http");
const {
  getURLS,
  getAuth,
  gefContactList,
  getFolderItems,
} = require("../Box-api/box");

const app = express();
const router = express.Router();

app.use(express.json());

router.post("/", (req, res) => {
  getURLS(req.body, (url) => {
    res.send(url);
    // URLS.push(url);
    // URLS.length === total_size && res.send(URLS);
  });
});

router.post("/ad", (req, res) => {
  getFolderItems((urls) => {
    res.send(urls);
  });
});

router.post("/login", (req, res) => {
  getAuth(req.body, (cred) => {
    cred
      ? gefContactList((cont) => {
          res.send({ cred: cred, cont: cont });
        })
      : res.send({ cred: cred, cont: false });
  });
});

app.use("/auth", router);

// app.listen(3000, () => {
//   console.log("listening on port 3000");
// });

app.use("/.netlify/functions/index", router);

module.exports.handler = serverless(app);
