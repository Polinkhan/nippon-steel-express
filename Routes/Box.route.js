const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const { getFolderItems, getURLS } = require("../Box_SDK/box");

router.post("/ad", async (req, res, next) => {
  try {
    getFolderItems((urls) => {
      res.send(urls);
    });
  } catch (err) {
    next(err);
  }
});

router.post("/getFileLink", async (req, res, next) => {
  try {
    getURLS(req.body, (result) => {
      if (result === false)
        return next(createError.BadRequest("File does not exist"));
      res.send({ url: result });
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
