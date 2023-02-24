const express = require("express");
const { getPDFURL, gefContactList, getAdPictures } = require("../Box/box");
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
    console.log("Sends");
    res.send({ name, fileUrl });
  } catch (err) {
    next(err);
  }
});

router.post("/image", async (req, res, next) => {
  try {
    console.log(req.body._parts);

    res.send();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
