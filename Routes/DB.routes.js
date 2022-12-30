const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const db = require("../mySQL/db_init");

router.post("/contactlist", async (req, res, next) => {
  try {
    const [result] = await db.query(`SELECT * FROM ContactList`);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.post("/queryParams", async (req, res, next) => {
  let monthList = [];
  let yearList = [];
  let typeList = [];
  try {
    const [month] = await db.query(`SELECT Month FROM monthList`);
    const [year] = await db.query(`SELECT Year FROM yearList`);
    const [type] = await db.query(`SELECT Type FROM typeList`);
    month.forEach((list) => {
      monthList.push(list.Month);
    });
    year.forEach((list) => {
      yearList.push(list.Year);
    });
    type.forEach((list) => {
      typeList.push(list.Type);
    });

    res.send({ month: monthList, year: yearList, type: typeList });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
