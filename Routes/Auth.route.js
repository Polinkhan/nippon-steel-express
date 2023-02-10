const express = require("express");
const createError = require("http-errors");
const { getAuthDetails } = require("../Box/box");
const { verifyAccessToken, signAccessToken } = require("../JWT/jwt_auth");
const router = express.Router();
const db = require("../mySQL/db_init");

router.get("/", verifyAccessToken, async (req, res, next) => {
  const { aud } = req.payload;
  const user = await getAuthDetails(aud);
  res.send({ user: { UserID: aud, ...user } });
});

router.post("/login", async (req, res, next) => {
  const { id, pass } = req.body;
  getAuthDetails(id, pass)
    .then(async (user) => {
      if (user.Pass === pass) {
        const accessToken = await signAccessToken(id);
        res.send({ accessToken, user: { UserID: id, ...user } });
      } else {
        throw new createError.BadRequest("Password not matched");
      }
    })
    .catch((err) => {
      next(err);
    });
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
