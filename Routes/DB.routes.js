const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const db = require("../mySQL/db_init");

router.get("/:id", async (req, res, next) => {
  let Date = [];
  let type = [];
  const { id } = req.params;
  const dataQuery = "SELECT Term FROM Payslip_Table WHERE ID = ?";
  try {
    const [Date_res] = await db.query(dataQuery, [id]);
    const [type_res] = await db.query(`SELECT Type FROM typeList`);
    const [contact_res] = await db.query(`SELECT * FROM ContactList`);

    Date_res.forEach((list) => {
      Date.push(list.Term);
    });
    type_res.forEach((list) => {
      type.push(list.Type);
    });
    res.send({ Date, type, contact_res });
  } catch (err) {
    next(err);
  }
});

router.get("/getPayslipData/:id/:date", async (req, res, next) => {
  try {
    const { id, date } = req.params;
    console.log(id, date);
    const [result] = await db.query(
      `SELECT * FROM Payslip_Table WHERE ID = ? and Term = ?`,
      [id, date]
    );
    res.send(result[0]);
  } catch (err) {
    console.log(err);
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
