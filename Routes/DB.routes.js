const express = require("express");
const { getPDFURL, getContactList, getAdPictures } = require("../Box/box");
const router = express.Router();
const { getUserDetails } = require("../Box/box");
const { ObjectToArray } = require("../Healpers/functions");

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const admin = await getContactList();
    const images = await getAdPictures();
    res.send({ admin, images });
  } catch (err) {
    next(err);
  }
});

router.get("/myprofile/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await getUserDetails(id);
    const arr = ObjectToArray({ ["User ID"]: id, ...data });
    res.send({ data: arr });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/contacts/all", async (req, res, next) => {
  try {
    const data = await getContactList();
    res.send({ data });
  } catch (err) {
    console.log(err);
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
    console.log(err);
    next(err);
  }
});
module.exports = router;
