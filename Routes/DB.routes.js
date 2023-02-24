const express = require("express");
const {
  getPDFURL,
  gefContactList,
  getAdPictures,
  getUpdateStatus,
} = require("../Box/box");
const router = express.Router();

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const admin = await gefContactList();
    const images = await getAdPictures();
    res.send({ admin, images });
  } catch (err) {
    next(err);
  }
});

router.post("/getPayslipData/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { month, year, type } = req.body;
    const { name, fileUrl } = await getPDFURL(id, month, year, type);
    res.send({ name, fileUrl });
  } catch (err) {
    next(err);
  }
});

router.post("/appUpdate", async (req, res, next) => {
  try {
    const update = await getUpdateStatus();
    res.send(update);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
