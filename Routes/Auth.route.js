const express = require("express");
const createError = require("http-errors");
const { getAuthDetails, getUserDetails } = require("../Box/box");
const { verifyAccessToken, signAccessToken } = require("../JWT/jwt_auth");
const router = express.Router();

router.get("/", verifyAccessToken, async (req, res, next) => {
  const { aud } = req.payload;
  console.log(aud);
  const data = await getUserDetails(aud);
  console.log(data);
  res.send({ UserID: aud, Name: data.Name, Email: data.Email });
});

router.post("/login", async (req, res, next) => {
  const { id, pass } = req.body;
  getAuthDetails(id)
    .then(async ({ Credential, Detail }) => {
      if (Credential.Password === pass) {
        const accessToken = await signAccessToken(id);
        res.send({ accessToken, user: { UserID: id, Name: Detail.Name } });
      } else {
        throw new createError.BadRequest("Password not matched");
      }
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
