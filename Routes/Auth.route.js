const express = require("express");
const createError = require("http-errors");
const { getAuthDetails } = require("../Box/box");
const { verifyAccessToken, signAccessToken } = require("../JWT/jwt_auth");
const router = express.Router();

router.get("/", verifyAccessToken, async (req, res, next) => {
  const { aud } = req.payload;

  getAuthDetails(aud)
    .then(({ Detail }) => res.send({ user: { UserID: aud, ...Detail } }))
    .catch((e) => next(createError.BadRequest(e)));
});

router.post("/login", async (req, res, next) => {
  const { id, pass } = req.body;
  getAuthDetails(id, pass)
    .then(async ({ Credential, Detail }) => {
      if (Credential.Password === pass) {
        const accessToken = await signAccessToken(id);
        res.send({ accessToken, user: { UserID: id, ...Detail } });
      } else {
        throw new createError.BadRequest("Password not matched");
      }
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
