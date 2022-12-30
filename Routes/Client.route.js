const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const db = require("../mySQL/db_init");

router.post("/login", async (req, res, next) => {
  const { id, pass } = req.body;
  try {
    const [result] = await db.query(`SELECT * FROM userAuth WHERE userid = ?`, [
      id,
    ]);
    if (result.length) {
      const { Password } = result[0];
      if (pass !== Password)
        throw createError.Unauthorized("Password incorrect");
      else {
        const [result] = await db.query(
          `SELECT * FROM usersInfo WHERE userid = ?`,
          [id]
        );
        res.send({ user: result[0] });
      }
    } else throw createError.BadRequest("User Not Found");
  } catch (err) {
    next(err);
  }
});

router.post("/isvalid", async (req, res, next) => {
  const { id, pass } = req.body;
  try {
    const [result] = await db.query(
      `SELECT Password FROM userAuth WHERE userid = ?`,
      [id]
    );
    const { Password } = result[0];
    if (pass !== Password) throw createError.Unauthorized("Password incorrect");
    else res.send({ isValid: true });
  } catch (err) {
    next(err);
  }
});

router.post("/changepassword", async (req, res, next) => {
  const { id, newPass } = req.body;
  try {
    await db
      .query(`UPDATE userAuth SET Password = ? WHERE userid = ?`, [newPass, id])
      .then(() => {
        res.send({ msg: "Password has Changed" });
      });
  } catch (err) {
    next(err);
  }
});

router.post("/contactlist", async (req, res, next) => {
  const { id, newPass } = req.body;
  try {
    await db
      .query(`UPDATE userAuth SET Password = ? WHERE userid = ?`, [newPass, id])
      .then(() => {
        res.send({ msg: "Password has Changed" });
      });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
