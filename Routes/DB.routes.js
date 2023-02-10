const express = require("express");
const createError = require("http-errors");
const { getPDFURL } = require("../Box/box");
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
