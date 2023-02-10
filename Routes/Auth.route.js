const express = require("express");
const createError = require("http-errors");
const { getAuthDetails } = require("../Box/box");
const { verifyAccessToken, signAccessToken } = require("../JWT/jwt_auth");
const router = express.Router();
const db = require("../mySQL/db_init");

router.get("/", verifyAccessToken, async (req, res, next) => {
  const { aud } = req.payload;
  getAuthDetails(aud);
  const infoQuery = "SELECT * FROM usersInfo WHERE userid = ?";

  try {
    const [result] = await db.query(infoQuery, [aud]);
    res.send({ user: result[0] });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const { id, pass } = req.body;

  const infoQuery = "SELECT * FROM usersInfo WHERE userid = ?";
  const authQuery = "SELECT * FROM userAuth WHERE userid = ? and password = ?";
  const maintenanceQuery = "SELECT * FROM `AppSettings` WHERE 1";
  try {
    const [result_0] = await db.query(maintenanceQuery);
    const { MaintenanceMode } = result_0[0];
    if (MaintenanceMode === "True")
      next(createError.BadRequest("Server In Under Maintenance !!"));

    const [result_1] = await db.query(authQuery, [id, pass]);
    if (result_1.length) {
      const accessToken = await signAccessToken(id);
      const [result_2] = await db.query(infoQuery, [id]);
      res.send({ user: result_2[0], accessToken });
    } else throw createError.BadRequest("Invalid UserID/Password");
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/password/:type", async (req, res, next) => {
  const { type } = req.params;
  const { UserID, pass } = req.body;
  if (type === "verify") {
    try {
      const query = "SELECT * FROM userAuth WHERE userid = ? and password = ?";
      const [result] = await db.query(query, [UserID, pass]);
      if (result.length) res.send({});
      else throw createError.Unauthorized("Password incorrect");
    } catch (err) {
      next(err);
    }
  }

  if (type === "change") {
    try {
      const query = "UPDATE userAuth SET Password = ? WHERE userid = ?";
      await db.query(query, [pass, UserID]);
      res.send({ message: "Password has Changed" });
    } catch (err) {
      next(err);
    }
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
