var express = require("express");
var router = express.Router();

const { token } = require("../resources/jwt_management");

/* GET users listing. */
router.get("/", token.verifyAccessToken, function (req, res, next) {
  res.send("유저가 감지되었습니다");
});

module.exports = router;
